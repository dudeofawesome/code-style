import { deepStrictEqual } from 'node:assert';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, beforeAll } from '@jest/globals';
import { codeBlock } from 'common-tags';
import type { ESLint } from 'eslint';
import { initESLint } from '@code-style/testing/eslint/index';
import { expectNoFail, expectRuleFail } from '@code-style/testing/eslint/tests';
import { defaultTestSet } from '@code-style/testing/eslint/default-test-sets';

const __dirname = dirname(fileURLToPath(import.meta.url));

const linter = initESLint(
  {
    extends: [
      '@code-style/eslint-config',
      '@code-style/eslint-config-esmodule',
      '@code-style/eslint-config-typescript',
    ],
  },
  { cwd: join(__dirname, 'fixture') },
);

describe('lint rules strict', () => {
  let calculated: Pick<
    ESLint.ConfigData,
    | 'env'
    | 'globals'
    | 'ignorePatterns'
    | 'noInlineConfig'
    | 'parser'
    | 'parserOptions'
    | 'plugins'
    | 'reportUnusedDisableDirectives'
    | 'rules'
    | 'settings'
  >;
  beforeAll(async () => {
    calculated = (await linter.calculateConfigForFile(
      'src/index.ts',
    )) as typeof calculated;
  });

  it(`should have rules from eslint-config-typescript`, () => {
    deepStrictEqual(calculated.rules?.['@typescript-eslint/no-namespace'], [
      'error',
    ]);
  });
  it(`should have rules from eslint-config-esmodule`, () => {
    deepStrictEqual(calculated.rules?.['import/no-commonjs'], ['error']);
  });
  it(`should have rules from eslint-config`, () => {
    deepStrictEqual(calculated.rules?.['no-constructor-return'], ['error']);
  });
});

describe('eslint-config-typescript strict', () => {
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

    it(`should fail @typescript-eslint/strict-boolean-expressions unknown`, () =>
      expectRuleFail({
        linter,
        ruleId: '@typescript-eslint/strict-boolean-expressions',
        files: [
          {
            code: codeBlock`
              let foo: unknown = 'foo';
              foo = 'bar';
              if (foo) Number();
            `,
            ts: true,
          },
        ],
      }));
  });
});
