import { describe, it } from 'node:test';
import { ESLint } from 'eslint';
import { testRuleFail, noLintMessage } from '../../utils/testing/eslint';

const linter = new ESLint({ cwd: __dirname });

describe('eslint-config-node', () => {
  describe('passes', () => {
    it(`should pass radix`, async () =>
      linter.lintText(`parseInt('10');\n`).then(noLintMessage));
  });
  describe('fails', () => {
    it(`should fail no-console`, () =>
      testRuleFail(linter, `console.log('foo');\n`, 'no-console'));

    it(`should fail eqeqeq`, () =>
      testRuleFail(linter, `if (Number == true) Number();\n`, 'eqeqeq'));
  });
});
