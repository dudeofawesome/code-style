import { describe, it } from 'node:test';
import { ESLint } from 'eslint';
import { testNoFail, testRuleFail } from '@code-style/utils/testing/eslint';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';

const linter = new ESLint({ cwd: __dirname });

describe('eslint-config-jest', () => {
  defaultTestSet(linter);

  describe('passes', () => {
    it(`should have jest globals in test file`, () =>
      testNoFail({
        linter,
        files: [
          {
            code: `describe('test', () => {});\n`,
            test: true,
          },
        ],
      }));
  });

  describe('fails', () => {
    it(`should not have jest globals in non-test file`, () =>
      testRuleFail({
        linter,
        ruleId: 'no-undef',
        files: [{ code: `describe('test', () => {});\n` }],
      }));
  });
});
