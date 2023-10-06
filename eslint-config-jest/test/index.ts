import { describe, it } from 'node:test';
import { ESLint } from 'eslint';
import { testNoFail, testRuleFail } from '../../utils/testing/eslint';
import { eslintDefaultTestSet } from '../../utils/testing/default-test-sets';

const linter = new ESLint({ cwd: __dirname });

describe('eslint-config-jest', () => {
  eslintDefaultTestSet(linter);

  describe('passes', () => {
    it(`should have jest globals in test file`, () =>
      testNoFail({
        linter,
        files: [
          { code: `describe('test', () => {});\n`, path: 'test/sample.js' },
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
