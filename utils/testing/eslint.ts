import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';
import { ESLint } from 'eslint';

export function defaultTestSet(linter: ESLint) {
  describe('[standard tests] passes', () => {
    it(`should allow nested ternaries`, () =>
      testNoFail(
        linter,
        `(() => (Number === true ? 1 : Boolean === true ? 2 : 3))();\n`,
        true,
      ));
  });
  describe('[standard tests] fails', () => {
    it(`should fail eqeqeq`, () =>
      testRuleFail(linter, `if (Number == true) Number();\n`, 'eqeqeq'));

    it(`should warn on prettier`, () =>
      testRuleFail(linter, `Number( '5')`, 'prettier/prettier'));

    // TODO: test for shopify rule
  });
}

export function noLintMessage(lint_results: ESLint.LintResult[]) {
  strictEqual(
    lint_results[0].errorCount,
    0,
    `Expected there to be no lint errors, but found:\n${lint_results[0].messages
      .map((m) => `  "${m.ruleId}": ${m.message}`)
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
    lint_results[0].messages.length,
    1,
    `Expected there to be one lint message, but there were ${
      lint_results[0].messages.length
    }:\n${lint_results[0].messages.map((m) => `  "${m.message}"`).join('\n')}`,
  );
}

export async function testRuleFail(
  linter: ESLint,
  code: string,
  ruleId: string,
  typescript: boolean = false,
) {
  const res = await linter.lintText(code, {
    filePath: `index.${typescript ? 'ts' : 'js'}`,
  });
  singleLintMessage(res);
  strictEqual(res[0].source, code);
  strictEqual(res[0].messages[0].ruleId, ruleId);
}

export async function testNoFail(
  linter: ESLint,
  code: string,
  typescript: boolean = false,
) {
  const res = await linter.lintText(code, {
    filePath: `index.${typescript ? 'ts' : 'js'}`,
  });
  noLintMessage(res);
}
