import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';
import { join } from 'node:path';
import { codeBlock } from 'proper-tags';
import type { ESLint } from 'eslint';
import { initESLint } from '@code-style/utils/testing/eslint';
import {
  testNoFail,
  testRuleFail,
} from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';

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

export interface A {}

void describe('lint rules strict', async () => {
  const calculated = (await linter.calculateConfigForFile(
    'src/index.ts',
  )) as Pick<
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

void describe('eslint-config-typescript strict', () => {
  defaultTestSet(linter);

  void describe('passes', () => {
    void it(
      `should parse typescript`,
      testNoFail({
        linter,
        files: [
          {
            code: `((a: string): string[] => a.split(''))()\n`,
            ts: true,
          },
        ],
      }),
    );

    void it(
      `should not give eslint error on use before define`,
      testNoFail({
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
      }),
    );

    void it(
      `should import`,
      testNoFail({
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
                "files": ["sample-ts.ts", "sample-js.js"]
              }
            `,
            path: 'tsconfig.json',
          },
        ],
      }),
    );
  });

  void describe('fails', () => {
    void it(
      `should fail radix`,
      testRuleFail({
        linter,
        ruleId: 'radix',
        files: [{ code: `parseInt('10');\n`, ts: true }],
      }),
    );

    void it(
      `should fail @typescript-eslint/strict-boolean-expressions string`,
      testRuleFail({
        linter,
        ruleId: '@typescript-eslint/strict-boolean-expressions',
        files: [
          {
            code: `let foo = 'foo';\nfoo = 'bar';\nif (foo) Number();\n`,
            ts: true,
          },
        ],
      }),
    );

    void it(
      `should fail @typescript-eslint/strict-boolean-expressions unknown`,
      testRuleFail({
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
      }),
    );
  });
});
