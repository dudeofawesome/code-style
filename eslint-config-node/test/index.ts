import { describe, it } from 'node:test';
import { ESLint } from 'eslint';
import {
  testRuleFail,
  testNoFail,
  defaultTestSet,
} from '../../utils/testing/eslint';

const linter = new ESLint({ cwd: __dirname });

describe('eslint-config-node', () => {
  defaultTestSet(linter);

  describe('passes', () => {
    it(`should pass radix`, async () =>
      testNoFail(linter, `parseInt('10');\n`));
  });

  describe('fails', () => {
    it(`should fail no-console`, () =>
      testRuleFail(linter, `console.log('foo');\n`, 'no-console'));
  });
});
