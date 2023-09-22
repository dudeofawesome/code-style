import { strictEqual } from 'node:assert';
import { ESLint } from 'eslint';

export async function testRuleFail(
  linter: ESLint,
  code: string,
  ruleId: string,
) {
  const res = await linter.lintText(code);
  singleLintMessage(res);
  strictEqual(res[0].source, code);
  strictEqual(res[0].messages[0].ruleId, ruleId);
}

export function noLintMessage(lint_results: ESLint.LintResult[]) {
  strictEqual(lint_results.length, 1, `Expected there to be no lint results.`);
  strictEqual(
    lint_results[0].errorCount,
    0,
    `Expected there to be no lint results.`,
  );
}

export function singleLintMessage(lint_results: ESLint.LintResult[]) {
  strictEqual(
    lint_results.length,
    1,
    `Expected there to be only one lint result.`,
  );
  strictEqual(
    lint_results[0].messages.length,
    1,
    `Expected there to be one lint message, but there were ${
      lint_results[0].messages.length
    }:\n${lint_results[0].messages.map((m) => `  "${m.message}"`).join('\n')}`,
  );
}
