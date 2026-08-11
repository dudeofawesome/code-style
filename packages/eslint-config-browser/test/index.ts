import { describe, it } from 'node:test';
import { initESLint } from '@code-style/utils/testing/eslint';
import { testRuleFail } from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';
import base from '@code-style/eslint-config';
import browser from '@code-style/eslint-config-browser';

const linter = initESLint([...base, ...browser]);

void describe('eslint-config-browser', () => {
  defaultTestSet(linter);

  void describe('passes', () => {});

  void describe('fails', () => {
    void it(`should fail no-console`, () =>
      testRuleFail({
        linter,
        ruleId: 'no-console',
        files: [{ code: `console.log('foo');\n` }],
      }));

    void it(`should fail radix`, () =>
      testRuleFail({
        linter,
        ruleId: 'radix',
        files: [{ code: `parseInt('10');\n` }],
      }));
  });
});
