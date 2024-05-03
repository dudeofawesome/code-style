import { mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import { ok, strictEqual, deepStrictEqual } from 'node:assert';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { ESLint } from 'eslint';

import { FilePathResult, FilePathOpts, filePath } from '.';
import { find_node_modules_path } from '../../path';

export function noLintMessage(lint_results: ESLint.LintResult[]) {
  strictEqual(
    lint_results[0]?.errorCount,
    0,
    `Expected there to be no lint errors, but found:\n${stringifyLintResults(lint_results)}`,
  );
}

export function singleLintMessage(lint_results: ESLint.LintResult[]) {
  strictEqual(
    lint_results.length,
    1,
    `Expected there to be only one lint result.`,
  );
  strictEqual(
    lint_results[0]?.messages.length,
    1,
    `Expected there to be one lint message, but there were ${
      lint_results[0]?.messages.length
    }:\n${stringifyLintResults(lint_results)}`,
  );
}

export function specificLintMessage(
  lint_results: ESLint.LintResult[],
  ruleId: string | string[],
) {
  const expected_rules = Array.isArray(ruleId) ? ruleId : [ruleId];

  const failed_rules = lint_results
    .map((lint_result) => lint_result.messages.map((m) => m.ruleId))
    .flat();
  ok(failed_rules.length > 0, `No lint failures detected.`);
  deepStrictEqual(
    failed_rules,
    new Array(failed_rules.length).fill(expected_rules[0]),
    `Expected there to be the following lint errors: ${expected_rules.join(', ')}, but found:\n${stringifyLintResults(lint_results)}`,
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

function map_files(files: TestNoFailOpts['files']) {
  return files.map((file) => ({
    code: file.code.endsWith('\n') ? file.code : `${file.code}\n`,
    path: file.path ?? filePath(file),
    lint: file.lint ?? true,
  }));
}

interface TestRuleFailOpts extends TestNoFailOpts {
  ruleId: string;
}
export async function testRuleFail({
  linter,
  ruleId,
  files,
}: TestRuleFailOpts): Promise<void> {
  const _files = map_files(files);

  if (_files.length === 1 && _files[0] != null) {
    const res = await linter.lintText(_files[0].code, {
      filePath: _files[0].path,
    });
    specificLintMessage(res, ruleId);
  } else {
    const { tmp_dir, cleanup } = await setup_tmp_dir(_files);

    try {
      specificLintMessage(
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

interface TestNoFailOpts {
  linter: ESLint;
  files: ({
    code: string;
    path?: FilePathResult;
    lint?: boolean;
  } & FilePathOpts)[];
}
export async function testNoFail({
  linter,
  files,
}: TestNoFailOpts): Promise<void> {
  const _files = map_files(files);

  if (_files.length === 1 && _files[0] != null) {
    const res = await linter.lintText(_files[0].code, {
      filePath: _files[0].path,
    });
    noLintMessage(res);
  } else {
    const { tmp_dir, cleanup } = await setup_tmp_dir(_files);

    try {
      noLintMessage(
        await linter.lintFiles(
          _files.filter((f) => f.lint).map((f) => join(tmp_dir, f.path)),
        ),
      );
    } finally {
      await cleanup();
    }
  }
}

export async function setup_tmp_dir(
  files: {
    code: string;
    path: string;
  }[],
): Promise<{
  tmp_dir: string;
  created_files: string[];
  cleanup: () => Promise<void>;
}> {
  const tmp_dir = join(tmpdir(), 'code-style-testing', randomUUID());
  const created_files: string[] = await Promise.all(
    files
      .map((f) => ({
        ...f,
        path: join(tmp_dir, f.path),
      }))
      .map((f) =>
        mkdir(dirname(f.path), { recursive: true })
          .catch(() => {
            return;
          })
          .then<string>(async () => {
            await writeFile(f.path, f.code);
            return f.path;
          }),
      ),
  );

  await symlink(await find_node_modules_path(), join(tmp_dir, 'node_modules'));

  return {
    tmp_dir,
    created_files,
    cleanup: () => rm(tmp_dir, { force: true, recursive: true }),
  };
}
