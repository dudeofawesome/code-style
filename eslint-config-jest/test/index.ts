import { describe, it } from 'node:test';
import { ESLint } from 'eslint';
import {
  testRuleFail,
  testNoFail,
  defaultTestSet,
} from '../../utils/testing/eslint';

const linter = new ESLint({ cwd: __dirname });

describe('eslint-config-jest', () => {
  defaultTestSet(linter);

  describe('passes', () => {
    it(`should have jest globals in test file`, () =>
      testNoFail({
        linter,
        files: [
          { code: `describe('test', () => {});\n`, path: 'test/thing.js' },
        ],
      }));
  });

  describe('fails', () => {
    it(`should not have jest globals in non-test file`, () =>
      testRuleFail({
        linter,
        code: `describe('test', () => {});\n`,
        ruleId: 'no-undef',
      }));
  });
});
