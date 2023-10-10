import { describe, it } from 'node:test';
import { join } from 'node:path';
import { ESLint } from 'eslint';
import { testNoFail, testRuleFail } from '@code-style/utils/testing/eslint';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';

const linter = new ESLint({ cwd: join(__dirname, 'fixture') });

void describe('eslint-config-typescript', () => {
  defaultTestSet(linter);

  void describe('passes', () => {
    void it(`should parse typescript`, () =>
      testNoFail({
        linter,
        files: [
          {
            code: `((a: string): string[] => a.split(''))()\n`,
            ts: true,
          },
        ],
      }));

    void it(`should not give eslint error on use before define`, () =>
      testNoFail({
        linter,
        files: [{ code: `Number(a);\nconst a = 10;\n`, ts: true }],
      }));

    void it(`should import`, () =>
      testNoFail({
        linter,
        files: [
          { code: `import { a } from './utils';\n\na();\n`, ts: true },
          {
            code: `export function a () {
  return 1;
}\n`,
            path: 'utils.ts',
          },
        ],
      }));
  });

  void describe('fails', () => {
    void it(`should fail radix`, async () =>
      testRuleFail({
        linter,
        ruleId: 'radix',
        files: [{ code: `parseInt('10');\n`, ts: true }],
      }));

    void it(`should fail @typescript-eslint/strict-boolean-expressions`, async () =>
      testRuleFail({
        linter,
        ruleId: '@typescript-eslint/strict-boolean-expressions',
        files: [
          {
            code: `let foo: unknown = 'foo';\nfoo = 'bar';\nif (foo) Number();\n`,
            ts: true,
          },
        ],
      }));
  });
});
