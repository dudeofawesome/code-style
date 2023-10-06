import { strictEqual } from 'node:assert';
import { ESLint } from 'eslint';

export function filePath(typescript: boolean = false): string {
  return `index.${typescript ? 'ts' : 'js'}`;
}

export function noLintMessage(lint_results: ESLint.LintResult[]) {
  strictEqual(
    lint_results[0]?.errorCount,
    0,
    `Expected there to be no lint errors, but found:\n${lint_results[0]?.messages
      .map((m) => `  ${m.ruleId}: ${m.message}`)
      .join('\n')}`,
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
    `Expected there to be one lint message, but there were ${lint_results[0]
      ?.messages.length}:\n${lint_results[0]?.messages
      .map((m) => `  "${m.message}"`)
      .join('\n')}`,
  );
}

interface TestRuleFailOpts {
  linter: ESLint;
  ruleId: string;
  files: {
    code: string;
    typescript?: boolean;
    path?: string;
  }[];
}
export async function testRuleFail({
  linter,
  ruleId,
  files,
}: TestRuleFailOpts) {
  const _files = files.map((file) => ({
    ...file,
    typescript: file.typescript ?? false,
    path: file.path ?? filePath(file.typescript),
  }));

  if (_files.length === 1 && _files[0] != null) {
    const res = await linter.lintText(_files[0].code, {
      filePath: _files[0].path,
    });
    singleLintMessage(res);
    strictEqual(res[0]?.source, _files[0].code);
    strictEqual(res[0]?.messages[0]?.ruleId, ruleId);
  } else {
    // TODO: support multiple files using in-memory fs
    throw new Error(`Linting multiple files is not supported at this time`);
  }
}

interface TestNoFailOpts {
  linter: ESLint;
  files: {
    code: string;
    typescript?: boolean;
    path?: string;
  }[];
}
export async function testNoFail({ linter, files }: TestNoFailOpts) {
  const _files = files.map((file) => ({
    ...file,
    typescript: file.typescript ?? false,
    path: file.path ?? filePath(file.typescript),
  }));

  if (_files.length === 1 && _files[0] != null) {
    const res = await linter.lintText(_files[0].code, {
      filePath: _files[0].path,
    });
    noLintMessage(res);
  } else {
    // TODO: support multiple files using in-memory fs
    throw new Error(`Linting multiple files is not supported at this time`);
  }
}
