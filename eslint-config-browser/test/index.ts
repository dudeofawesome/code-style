import { describe, it } from 'node:test';
import { ESLint } from 'eslint';
import { testRuleFail, defaultTestSet } from '../../utils/testing/eslint';

const linter = new ESLint({ cwd: __dirname });

describe('eslint-config-browser', () => {
  defaultTestSet(linter);

  describe('passes', () => {});

  describe('fails', () => {
    it(`should fail no-console`, () =>
      testRuleFail({
        linter,
        code: `console.log('foo');\n`,
        ruleId: 'no-console',
      }));

    it(`should fail radix`, async () =>
      testRuleFail({ linter, code: `parseInt('10');\n`, ruleId: 'radix' }));
  });
});
