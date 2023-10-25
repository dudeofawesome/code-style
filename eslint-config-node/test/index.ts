import { describe, it } from 'node:test';
import {
  initESLint,
  testNoFail,
  testRuleFail,
} from '@code-style/utils/testing/eslint';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';

const linter = initESLint({
  extends: ['@dudeofawesome', '@dudeofawesome/node'],
});

describe('eslint-config-node', () => {
  defaultTestSet(linter);

  describe('passes', () => {
    it(`should pass radix`, async () =>
      testNoFail({ linter, files: [{ code: `parseInt('10');\n` }] }));
  });

  describe('fails', () => {
    it(`should fail no-console`, () =>
      testRuleFail({
        linter,
        ruleId: 'no-console',
        files: [{ code: `console.log('foo');\n` }],
      }));
  });
});
