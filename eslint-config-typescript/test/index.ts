import { describe, it } from 'node:test';
import { ESLint } from 'eslint';
import { testNoFail, testRuleFail } from '../../utils/testing/eslint';
import { eslintDefaultTestSet } from '../../utils/testing/default-test-sets';

const linter = new ESLint({ cwd: __dirname });

void describe('eslint-config-typescript', () => {
  eslintDefaultTestSet(linter);

  void describe('passes', () => {
    void it(`should parse typescript`, () =>
      testNoFail({
        linter,
        files: [
          {
            code: `((a: string): string[] => a.split(''))()\n`,
            typescript: true,
          },
        ],
      }));

    void it(`should not give eslint error on use before define`, () =>
      testNoFail({
        linter,
        files: [{ code: `Number(a);\nconst a = 10;\n`, typescript: true }],
      }));
  });

  void describe('fails', () => {
    void it(`should fail radix`, async () =>
      testRuleFail({
        linter,
        code: `parseInt('10');\n`,
        ruleId: 'radix',
        typescript: true,
      }));

    void it(`should fail @typescript-eslint/strict-boolean-expressions`, async () =>
      testRuleFail({
        linter,
        code: `let foo: unknown = 'foo';\nfoo = 'bar';\nif (foo) Number();\n`,
        ruleId: '@typescript-eslint/strict-boolean-expressions',
        typescript: true,
      }));
  });
});
