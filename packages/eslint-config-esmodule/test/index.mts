import { describe, it } from '@jest/globals';
import { codeBlock } from 'common-tags';
import { initESLint } from '@code-style/testing/eslint/index';
import { expectNoFail, expectRuleFail } from '@code-style/testing/eslint/tests';
import { defaultTestSet } from '@code-style/testing/eslint/default-test-sets';

const linter = initESLint({
  extends: ['@code-style', '@code-style/esmodule'],
});

describe('eslint-config-esmodule base', () => {
  defaultTestSet(linter);

  describe('passes', () => {
    it(`should pass esmodule import`, () =>
      expectNoFail({
        linter,
        files: [
          {
            code: codeBlock`
              import { foo } from 'console';

              foo();
            `,
          },
        ],
      }));
  });

  describe('fails', () => {
    it(`should fail commonjs`, () =>
      expectRuleFail({
        linter,
        ruleId: 'import/no-commonjs',
        files: [
          {
            code: codeBlock`
              const foo = require('foo');

              foo();
            `,
          },
        ],
      }));

    it(`should only log single duplicate-import error`, async () => {
      await expectRuleFail({
        linter,
        ruleId: 'import/no-duplicates',
        files: [
          {
            code: codeBlock`
              import path from 'path';
              import { join } from 'path';

              join(path.cwd);
            `,
          },
        ],
      });
    });
  });
});
