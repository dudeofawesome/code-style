import { join } from 'node:path';
import type { ESLint } from 'eslint';
import { setup_tmp_dir } from '@code-style/utils/path';

import { FilePathResult, FilePathOpts, filePath } from './index.js';

export function expectNoLintMessage(lint_results: ESLint.LintResult[]) {
  expect(
    lint_results[0]?.errorCount,
    `Expected there to be no lint errors, but found:\n${stringifyLintResults(lint_results)}`,
  ).toBe(0);
}

export function expectSingleLintMessage(lint_results: ESLint.LintResult[]) {
  expect(
    lint_results.length,
    `Expected there to be only one lint result.`,
  ).toBe(1);
  expect(
    lint_results[0]?.messages.length,
    `Expected there to be one lint message, but there were ${
      lint_results[0]?.messages.length
    }:\n${stringifyLintResults(lint_results)}`,
  ).toBe(1);
}

export function expectSpecificLintMessage(
  lint_results: ESLint.LintResult[],
  ruleId: string | string[],
) {
  const expected_rules = Array.isArray(ruleId) ? ruleId : [ruleId];

  const failed_rules = lint_results
    .map((lint_result) => lint_result.messages.map((m) => m.ruleId))
    .flat();
  expect(failed_rules.length, `No lint failures detected.`).toBeGreaterThan(0);
  expect(
    failed_rules,
    `Expected there to be the following lint errors: ${expected_rules.join(', ')}, but found:\n${stringifyLintResults(lint_results)}`,
  ).toIncludeSameMembers(
    expected_rules.length === 1
      ? new Array(failed_rules.length).fill(expected_rules[0])
      : expected_rules,
  );
}

export function stringifyLintResults(
  lint_results: ESLint.LintResult[],
): string {
  return lint_results
    .map((res) => res.messages.map((m) => `  ${m.ruleId}: ${m.message}`))
    .flat()
    .join('\n');
}

function map_files(files: ExpectNoFailOpts['files']) {
  return files.map((file) => ({
    code: file.code.endsWith('\n') ? file.code : `${file.code}\n`,
    path: file.path ?? filePath(file),
    lint: file.lint ?? true,
  }));
}

interface ExpectRuleFailOpts extends ExpectNoFailOpts {
  ruleId: string | string[];
}
export async function expectRuleFail({
  linter,
  ruleId,
  files,
}: ExpectRuleFailOpts): Promise<void> {
  const _files = map_files(files);

  if (_files.length === 1 && _files[0] != null) {
    const res = await linter.lintText(_files[0].code, {
      filePath: _files[0].path,
    });
    expectSpecificLintMessage(res, ruleId);
  } else {
    const { tmp_dir, cleanup } = await setup_tmp_dir(_files);

    try {
      expectSpecificLintMessage(
        await linter.lintFiles(
          _files.filter((f) => f.lint).map((f) => join(tmp_dir, f.path)),
        ),
        ruleId,
      );
    } finally {
      await cleanup();
    }
  }
}

interface ExpectNoFailOpts {
  linter: ESLint;
  files: ({
    code: string;
    path?: FilePathResult;
    lint?: boolean;
  } & FilePathOpts)[];
}
export async function expectNoFail({
  linter,
  files,
}: ExpectNoFailOpts): Promise<void> {
  const _files = map_files(files);

  if (_files.length === 1 && _files[0] != null) {
    const res = await linter.lintText(_files[0].code, {
      filePath: _files[0].path,
    });
    expectNoLintMessage(res);
  } else {
    const { tmp_dir, cleanup } = await setup_tmp_dir(_files);

    try {
      expectNoLintMessage(
        await linter.lintFiles(
          _files.filter((f) => f.lint).map((f) => join(tmp_dir, f.path)),
        ),
      );
    } finally {
      await cleanup();
    }
  }
}
