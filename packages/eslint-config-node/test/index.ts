import { describe, it } from 'node:test';
import { initESLint } from '@code-style/utils/testing/eslint';
import {
  testRuleFail,
  testNoFail,
} from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';

const linter = initESLint({
  extends: ['@dudeofawesome', '@dudeofawesome/node'],
});

void describe('eslint-config-node', () => {
  defaultTestSet(linter);

  void describe('passes', () => {
    void it(`should pass radix`, async () =>
      testNoFail({ linter, files: [{ code: `parseInt('10');\n` }] }));
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
