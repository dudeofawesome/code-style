import { describe, it } from 'node:test';
import { ESLint } from 'eslint';
import { testNoFail } from '../../utils/testing/eslint';
import { defaultTestSet } from '../../utils/testing/eslint/default-test-sets';

const linter = new ESLint({ cwd: __dirname });

describe('eslint-config-cli', () => {
  defaultTestSet(linter);

  describe('passes', () => {
    it(`should pass radix`, async () =>
      testNoFail({ linter, files: [{ code: `parseInt('10');\n` }] }));

    it(`should pass no-console`, () =>
      testNoFail({ linter, files: [{ code: `console.log('foo');\n` }] }));
  });

  describe('fails', () => {});
});
