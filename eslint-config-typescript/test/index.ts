import { describe, it } from 'node:test';
import { ESLint } from 'eslint';
import {
  defaultTestSet,
  testNoFail,
  testRuleFail,
} from '../../utils/testing/eslint';

const linter = new ESLint({ cwd: __dirname });

describe('eslint-config-typescript', () => {
  defaultTestSet(linter);

  describe('passes', () => {
    it(`should parse typescript`, () =>
      testNoFail({
        linter,
        code: `((a: string): string[] => a.split(''))()\n`,
        typescript: true,
      }));

    it(`should not give eslint error on use before define`, () =>
      testNoFail({
        linter,
        code: `Number(a);\nconst a = 10;\n`,
        typescript: true,
      }));
  });

  describe('fails', () => {
    it(`should fail radix`, async () =>
      testRuleFail({
        linter,
        code: `parseInt('10');\n`,
        ruleId: 'radix',
        typescript: true,
      }));

    it(`should fail @typescript-eslint/strict-boolean-expressions`, async () =>
      testRuleFail({
        linter,
        code: `let foo: unknown = 'foo';\nfoo = 'bar';\nif (foo) Number();\n`,
        ruleId: '@typescript-eslint/strict-boolean-expressions',
        typescript: true,
      }));
  });
});
