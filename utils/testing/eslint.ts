import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';
import { ESLint } from 'eslint';

export function filePath(typescript: boolean = false): string {
  return `index.${typescript ? 'ts' : 'js'}`;
}

export function defaultTestSet(linter: ESLint) {
  describe('[standard tests] passes', () => {
    it(`should parse javascript`, () =>
      testNoFail({
        linter,
        code: `
(
  /** @param {string} a */
  (a) => a.split('')
)('test');
`,
      }));

    it(`should allow nested ternaries`, () =>
      testNoFail({
        linter,
        code: `(() => (Number === true ? 'a' : Boolean === true ? 'b' : 'c'))();\n`,
        typescript: true,
      }));
  });
  describe('[standard tests] fails', () => {
    it(`should fail eqeqeq`, () =>
      testRuleFail({
        linter,
        code: `if (Number == true) Number();\n`,
        ruleId: 'eqeqeq',
      }));

    it(`should warn on prettier`, () =>
      testRuleFail({
        linter,
        code: `Number( '5')`,
        ruleId: 'prettier/prettier',
      }));

    // TODO: test for shopify rule
  });
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
  code: string;
  ruleId: string;
  typescript?: boolean;
  file_path?: string;
}
export async function testRuleFail({
  linter,
  code,
  ruleId,
  typescript = false,
  file_path = filePath(typescript),
}: TestRuleFailOpts) {
  const res = await linter.lintText(code, {
    filePath: file_path,
  });
  singleLintMessage(res);
  strictEqual(res[0]?.source, code);
  strictEqual(res[0]?.messages[0]?.ruleId, ruleId);
}

interface TestNoFailOpts {
  linter: ESLint;
  code: string;
  typescript?: boolean;
  file_path?: string;
}
export async function testNoFail({
  linter,
  code,
  typescript = false,
  file_path = filePath(typescript),
}: TestNoFailOpts) {
  const res = await linter.lintText(code, {
    filePath: file_path,
  });
  noLintMessage(res);
}
