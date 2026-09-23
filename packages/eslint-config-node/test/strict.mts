import { describe, it } from '@jest/globals';
import { initESLint } from '@code-style/testing/eslint/index';
import { expectRuleFail, expectNoFail } from '@code-style/testing/eslint/tests';
import { defaultTestSet } from '@code-style/testing/eslint/default-test-sets';

const linter = initESLint({
  extends: ['@code-style/eslint-config', '@code-style/eslint-config-node'],
});

describe('eslint-config-node strict', () => {
  defaultTestSet(linter);

  describe('passes', () => {
    it(`should pass radix`, () =>
      expectNoFail({ linter, files: [{ code: `parseInt('10');\n` }] }));
  });

  describe('fails', () => {
    it(`should fail no-console`, () =>
      expectRuleFail({
        linter,
        ruleId: 'no-console',
        files: [{ code: `console.log('foo');\n` }],
      }));

    it(`should fail n/no-sync`, () =>
      expectRuleFail({
        linter,
        ruleId: 'n/no-sync',
        files: [
          {
            code: `const { readFileSync } = require('fs');\n\nreadFileSync('test');\n`,
          },
        ],
      }));
  });
});
