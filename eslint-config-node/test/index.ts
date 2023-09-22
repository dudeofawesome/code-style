import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';
import { ESLint } from 'eslint';

const linter = new ESLint({
  overrideConfigFile: `${__dirname}/.eslintrc.yaml`,
});

describe('eslint-config-node', () => {
  describe('passes', () => {
    it(`should pass radix`, async () =>
      linter.lintText(`parseInt('10');\n`).then(noLintMessage));
  });
  describe('fails', () => {
    it(`should fail no-console`, () =>
      testRuleFail(linter, `console.log('foo');\n`, 'no-console'));

    it(`should fail eqeqeq`, () =>
      testRuleFail(linter, `if (Number == true) Number();\n`, 'eqeqeq'));
  });
});

async function testRuleFail(linter: ESLint, code: string, ruleId: string) {
  const res = await linter.lintText(code);
  singleLintMessage(res);
  strictEqual(res[0].source, code);
  strictEqual(res[0].messages[0].ruleId, ruleId);
}

function noLintMessage(lint_results: ESLint.LintResult[]) {
  strictEqual(lint_results.length, 1, `Expected there to be no lint results.`);
  strictEqual(
    lint_results[0].errorCount,
    0,
    `Expected there to be no lint results.`,
  );
}

function singleLintMessage(lint_results: ESLint.LintResult[]) {
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
    }: ${lint_results[0].messages.map((m) => m.message)}`,
  );
}
