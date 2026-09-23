import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from '@jest/globals';
import { codeBlock } from 'common-tags';
import { initESLint } from '@code-style/testing/eslint/index';
import { expectRuleFail, expectNoFail } from '@code-style/testing/eslint/tests';
import { defaultTestSet } from '@code-style/testing/eslint/default-test-sets';

const __dirname = dirname(fileURLToPath(import.meta.url));

const linter = initESLint(
  {
    extends: [
      '@code-style/eslint-config',
      '@code-style/eslint-config-esmodule',
      '@code-style/eslint-config-node',
      '@code-style/eslint-config-typescript',
      '@code-style/eslint-config-nest',
    ],
  },
  { cwd: join(__dirname, 'fixture') },
);

describe('eslint-config-nest strict', () => {
  defaultTestSet(linter);

  describe('passes', () => {
    it(`should pass radix`, () =>
      expectNoFail({
        linter,
        files: [{ code: `parseInt('10');\n`, ts: true }],
      }));
  });

  describe('fails', () => {
    it(`should fail no-console`, () =>
      expectRuleFail({
        linter,
        ruleId: 'no-console',
        files: [{ code: `console.log('foo');\n`, ts: true }],
      }));

    it(`should fail no-restricted-imports`, () =>
      expectRuleFail({
        linter,
        ruleId: 'no-restricted-imports',
        files: [
          {
            code: codeBlock`
              import { isAxiosError } from '@nestjs/terminus/dist/utils';

              (isAxiosError as (a: unknown) => void)({});
            `,
            ts: true,
          },
        ],
      }));
  });
});
