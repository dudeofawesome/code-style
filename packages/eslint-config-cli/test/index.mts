import { describe, it } from '@jest/globals';
import { initESLint } from '@code-style/testing/eslint/index';
import { expectNoFail } from '@code-style/testing/eslint/tests';
import { defaultTestSet } from '@code-style/testing/eslint/default-test-sets';

const linter = initESLint({
  extends: [
    '@code-style/eslint-config',
    '@code-style/eslint-config-node',
    '@code-style/eslint-config-cli',
  ],
});

describe('eslint-config-cli base', () => {
  defaultTestSet(linter);

  describe('passes', () => {
    it(`should pass radix`, () =>
      expectNoFail({ linter, files: [{ code: `parseInt('10');\n` }] }));

    it(`should pass no-console`, () =>
      expectNoFail({ linter, files: [{ code: `console.log('foo');\n` }] }));
  });

  describe('fails', () => {});
});
