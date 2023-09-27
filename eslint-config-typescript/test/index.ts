import { describe, it } from 'node:test';
import { ESLint } from 'eslint';
import {
  defaultTestSet,
  testNoFail,
  testRuleFail,
} from '../../utils/testing/eslint';

// const linter = new ESLint({ cwd: __dirname });
const linter = new ESLint({
  cwd: __dirname,
  overrideConfigFile: '.eslintrc.yaml',
});

describe('eslint-config-typescript', () => {
  defaultTestSet(linter);

  describe('passes', () => {
    it(`should parse typescript`, () =>
      testNoFail(linter, `((a: string): string[] => a.split(''))()\n`, true));

    it(`should not give eslint error on use before define`, () =>
      testNoFail(linter, `Number(a);\nconst a = 10;\n`, true));
  });

  describe('fails', () => {
    it(`should fail radix`, async () =>
      testRuleFail(linter, `parseInt('10');\n`, 'radix', true));

    // TODO: test for shopify rule

    // TODO: test for prettier rule
  });
});
