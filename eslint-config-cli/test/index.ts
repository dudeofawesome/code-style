import { describe, it } from 'node:test';
import { initESLint, testNoFail } from '@code-style/utils/testing/eslint';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';

const linter = initESLint({
  extends: ['@dudeofawesome', '@dudeofawesome/cli'],
});

void describe('eslint-config-cli base', () => {
  defaultTestSet(linter);

  void describe('passes', () => {
    void it(`should pass radix`, async () =>
      testNoFail({ linter, files: [{ code: `parseInt('10');\n` }] }));

    void it(`should pass no-console`, () =>
      testNoFail({ linter, files: [{ code: `console.log('foo');\n` }] }));
  });

  void describe('fails', () => {});
});
