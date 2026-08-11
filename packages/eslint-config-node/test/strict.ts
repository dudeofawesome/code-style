import { describe, it } from 'node:test';
import { initESLint } from '@code-style/utils/testing/eslint';
import {
  testRuleFail,
  testNoFail,
} from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';
import base from '@code-style/eslint-config';
import node from '@code-style/eslint-config-node';

const linter = initESLint([...base, ...node]);

void describe('eslint-config-node strict', () => {
  defaultTestSet(linter);

  void describe('passes', () => {
    void it(`should pass radix`, () =>
      testNoFail({ linter, files: [{ code: `parseInt('10');\n` }] }));
  });

  void describe('fails', () => {
    void it(`should fail no-console`, () =>
      testRuleFail({
        linter,
        ruleId: 'no-console',
        files: [{ code: `console.log('foo');\n` }],
      }));

    void it(`should fail n/no-sync`, () =>
      testRuleFail({
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
