import { describe, it } from '@jest/globals';
import { initESLint } from '@code-style/testing/eslint/index';
import { expectRuleFail, expectNoFail } from '@code-style/testing/eslint/tests';
import { defaultTestSet } from '@code-style/testing/eslint/default-test-sets';

const linter = initESLint({
  extends: ['@code-style', '@code-style/jest'],
});

describe('eslint-config-jest', () => {
  defaultTestSet(linter);

  describe('passes', () => {
    it(`should have jest globals in test file`, () =>
      expectNoFail({
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
      expectRuleFail({
        linter,
        ruleId: 'no-undef',
        files: [{ code: `describe('test', () => {});\n` }],
      }));
  });
});
