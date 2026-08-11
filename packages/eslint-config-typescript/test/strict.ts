import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { codeBlock } from 'common-tags';
import type { Linter } from 'eslint';
import { initESLint } from '@code-style/utils/testing/eslint';
import {
  testNoFail,
  testRuleFail,
} from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';
import base from '@code-style/eslint-config';
import esmodule from '@code-style/eslint-config-esmodule';
import typescript from '@code-style/eslint-config-typescript';

const linter = initESLint([...base, ...esmodule, ...typescript], {
  cwd: join(dirname(fileURLToPath(import.meta.url)), 'fixture'),
});

void describe('lint rules strict', async () => {
  // flat config normalizes rule severities to numbers
  const calculated = (await linter.calculateConfigForFile(
    'src/index.ts',
  )) as Pick<Linter.Config, 'languageOptions' | 'plugins' | 'settings'> & {
    rules?: Record<string, unknown[]>;
  };

  void it(`should have rules from eslint-config-typescript`, () => {
    deepStrictEqual(
      (calculated.rules?.['@typescript-eslint/no-namespace'] ?? [])[0],
      2,
    );
  });
  void it(`should have rules from eslint-config-esmodule`, () => {
    deepStrictEqual((calculated.rules?.['import/no-commonjs'] ?? [])[0], 2);
  });
  void it(`should have rules from eslint-config`, () => {
    deepStrictEqual((calculated.rules?.['no-constructor-return'] ?? [])[0], 2);
  });
});

void describe('eslint-config-typescript strict', () => {
  defaultTestSet(linter);

  void describe('passes', () => {
    void it(`should parse typescript`, () =>
      testNoFail({
        linter,
        files: [
          {
            code: `((a: string): string[] => a.split(''))()`,
            ts: true,
          },
        ],
      }));

    void it(`should not give eslint error on use before define`, () =>
      testNoFail({
        linter,
        files: [
          {
            code: codeBlock`
              foo();
              function foo(): void {}
            `,
            ts: true,
          },
        ],
      }));

    void it(`should import`, () =>
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
                "includes": ["./"]
              }
            `,
            path: 'tsconfig.json',
          },
        ],
      }));
  });

  void describe('fails', () => {
    void it(`should fail radix`, () =>
      testRuleFail({
        linter,
        ruleId: 'radix',
        files: [{ code: `parseInt('10');`, ts: true }],
      }));

    void it(`should fail @typescript-eslint/strict-boolean-expressions string`, () =>
      testRuleFail({
        linter,
        ruleId: '@typescript-eslint/strict-boolean-expressions',
        files: [
          {
            code: codeBlock`
              let foo = 'foo';
              if (foo === 'foo') foo = 'bar';
              if (foo) Number();
            `,
            ts: true,
          },
        ],
      }));

    void it(`should fail @typescript-eslint/strict-boolean-expressions unknown`, () =>
      testRuleFail({
        linter,
        ruleId: '@typescript-eslint/strict-boolean-expressions',
        files: [
          {
            code: codeBlock`
              let foo: unknown = 'foo';
              if (foo === 'foo') foo = 'bar';
              if (foo) Number();
            `,
            ts: true,
          },
        ],
      }));
  });
});
