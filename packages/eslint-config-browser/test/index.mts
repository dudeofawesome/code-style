import { describe, it } from '@jest/globals';
import { initESLint } from '@code-style/testing/eslint/index';
import { expectRuleFail } from '@code-style/testing/eslint/tests';
import { defaultTestSet } from '@code-style/testing/eslint/default-test-sets';

const linter = initESLint({
  extends: ['@code-style', '@code-style/browser'],
});

describe('eslint-config-browser', () => {
  defaultTestSet(linter);

  describe('passes', () => {});

  describe('fails', () => {
    it(`should fail no-console`, async () => {
      await expectRuleFail({
        linter,
        ruleId: 'no-console',
        files: [{ code: `console.log('foo');\n` }],
      });
    });

    it(`should fail radix`, async () => {
      await expectRuleFail({
        linter,
        ruleId: 'radix',
        files: [{ code: `parseInt('10');\n` }],
      });
    });
  });
});
