import { describe, it } from 'node:test';
import { initESLint } from '@code-style/utils/testing/eslint';
import {
  testRuleFail,
  testNoFail,
} from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';

const linter = initESLint({
  extends: [
    '@code-style/eslint-config',
    '@code-style/eslint-config-node',
    '@code-style/eslint-config-node/lenient',
  ],
});

void describe('eslint-config-node lenient', () => {
  defaultTestSet(linter);

  void describe('passes', () => {
    void it(`should pass n/no-sync`, () =>
      testNoFail({
        linter,
        files: [{ code: `const { readFileSync } = require('fs');` }],
      }));
  });

  void describe('fails', () => {
    void it(`should fail no-console`, () =>
      testRuleFail({
        linter,
        ruleId: 'no-console',
        files: [{ code: `console.log('foo');\n` }],
      }));
  });
});
