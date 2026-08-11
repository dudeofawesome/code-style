import { describe, it } from 'node:test';
import { initESLint } from '@code-style/utils/testing/eslint';
import { testNoFail } from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';
import base from '@code-style/eslint-config';
import node from '@code-style/eslint-config-node';
import cli from '@code-style/eslint-config-cli';

const linter = initESLint([...base, ...node, ...cli]);

void describe('eslint-config-cli base', () => {
  defaultTestSet(linter);

  void describe('passes', () => {
    void it(`should pass radix`, () =>
      testNoFail({ linter, files: [{ code: `parseInt('10');\n` }] }));

    void it(`should pass no-console`, () =>
      testNoFail({ linter, files: [{ code: `console.log('foo');\n` }] }));
  });

  void describe('fails', () => {});
});
