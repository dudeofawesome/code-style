import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from '@jest/globals';
import { initESLint } from '@code-style/testing/eslint/index';
import { expectNoFail, expectRuleFail } from '@code-style/testing/eslint/tests';
import { defaultTestSet } from '@code-style/testing/eslint/default-test-sets';
import { codeBlock } from 'common-tags';

const __dirname = dirname(fileURLToPath(import.meta.url));

const linter = initESLint(
  {
    extends: [
      '@code-style/eslint-config',
      '@code-style/eslint-config/lenient',
      '@code-style/eslint-config-esmodule',
      '@code-style/eslint-config-typescript',
      '@code-style/eslint-config-typescript/lenient',
    ],
    parserOptions: {
      ecmaVersion: 2022,
    },
  },
  { cwd: join(__dirname, 'fixture') },
);

describe('eslint-config-typescript lenient', () => {
  defaultTestSet(linter);

  describe('passes', () => {
    it(`should parse typescript`, () =>
      expectNoFail({
        linter,
        files: [
          {
            code: `((a: string): string[] => a.split(''))()`,
            ts: true,
          },
        ],
      }));

    it(`should not give eslint error on use before define`, () =>
      expectNoFail({
        linter,
        files: [
          {
            code: codeBlock`
              Number(a);
              const a = 10;
            `,
            ts: true,
          },
        ],
      }));

    it(`should import`, () =>
      expectNoFail({
        linter,
        files: [
          {
            code: codeBlock`
              import { a } from './utils';

              a();
            `,
            ts: true,
          },
          {
            code: codeBlock`
              export function a () {
                return 1;
              }
            `,
            path: 'utils.ts',
          },
          {
            code: codeBlock`
              {
                "extends": "@code-style/typescript-configs/roles/node",
                "compilerOptions": { "outDir": "dist/" },
                "includes": ["./"]
              }
            `,
            path: 'tsconfig.json',
          },
        ],
      }));

    it(`should pass @typescript-eslint/strict-boolean-expressions object`, () =>
      expectNoFail({
        linter,
        files: [
          {
            code: codeBlock`
              const foo: object | null = Math.random() === 0 ? {} : null;
              if (foo) Number();
            `,
            ts: true,
          },
        ],
      }));
  });

  describe('fails', () => {
    it(`should fail radix`, () =>
      expectRuleFail({
        linter,
        ruleId: 'radix',
        files: [{ code: `parseInt('10');`, ts: true }],
      }));

    it(`should fail @typescript-eslint/strict-boolean-expressions string`, () =>
      expectRuleFail({
        linter,
        ruleId: '@typescript-eslint/strict-boolean-expressions',
        files: [
          {
            code: codeBlock`
              let foo = 'foo';
              foo = 'bar';
              if (foo) Number();
            `,
            ts: true,
          },
        ],
      }));
  });
});
