import { describe, it } from 'node:test';
import { ESLint } from 'eslint';
import { testRuleFail } from '../../utils/testing/eslint';

const linter = new ESLint({ cwd: __dirname });

describe('eslint-config-node', () => {
  describe('passes', () => {});
  describe('fails', () => {
    it(`should fail eqeqeq`, () =>
      testRuleFail(linter, `if (Number == true) Number();\n`, 'eqeqeq'));

    it(`should fail radix`, async () =>
      testRuleFail(linter, `parseInt('10');\n`, 'radix'));
  });
});
