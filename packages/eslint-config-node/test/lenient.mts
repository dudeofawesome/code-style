import { describe, it } from '@jest/globals';
import { initESLint } from '@code-style/testing/eslint/index';
import { expectRuleFail, expectNoFail } from '@code-style/testing/eslint/tests';
import { defaultTestSet } from '@code-style/testing/eslint/default-test-sets';

const linter = initESLint({
  extends: [
    '@code-style/eslint-config',
    '@code-style/eslint-config-node',
    '@code-style/eslint-config-node/lenient',
  ],
});

describe('eslint-config-node lenient', () => {
  defaultTestSet(linter);

  describe('passes', () => {
    it(`should pass n/no-sync`, () =>
      expectNoFail({
        linter,
        files: [{ code: `const { readFileSync } = require('fs');` }],
      }));
  });

  describe('fails', () => {
    it(`should fail no-console`, () =>
      expectRuleFail({
        linter,
        ruleId: 'no-console',
        files: [{ code: `console.log('foo');\n` }],
      }));
  });
});
