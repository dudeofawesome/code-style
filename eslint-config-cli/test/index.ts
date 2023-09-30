import { describe, it } from 'node:test';
import { ESLint } from 'eslint';
import {
  testRuleFail,
  testNoFail,
  defaultTestSet,
} from '../../utils/testing/eslint';

const linter = new ESLint({ cwd: __dirname });

describe('eslint-config-cli', () => {
  defaultTestSet(linter);

  describe('passes', () => {
    it(`should pass radix`, async () =>
      testNoFail({ linter, code: `parseInt('10');\n` }));

    it(`should pass no-console`, () =>
      testNoFail({ linter, code: `console.log('foo');\n` }));
  });

  describe('fails', () => {});
});
