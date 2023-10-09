import { describe, it } from 'node:test';
import { ESLint } from 'eslint';
import { testRuleFail } from '../../utils/testing/eslint';
import { eslintDefaultTestSet } from '../../utils/testing/eslint/default-test-sets';

const linter = new ESLint({ cwd: __dirname });

describe('eslint-config-browser', () => {
  eslintDefaultTestSet(linter);

  describe('passes', () => {});

  describe('fails', () => {
    it(`should fail no-console`, () =>
      testRuleFail({
        linter,
        ruleId: 'no-console',
        files: [{ code: `console.log('foo');\n` }],
      }));

    it(`should fail radix`, async () =>
      testRuleFail({
        linter,
        ruleId: 'radix',
        files: [{ code: `parseInt('10');\n` }],
      }));
  });
});
