import { describe, it } from 'node:test';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initESLint } from '@code-style/utils/testing/eslint';
import {
  testNoFail,
  testRuleFail,
} from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';
import { codeBlock } from 'common-tags';
import base from '@code-style/eslint-config';
import base_lenient from '@code-style/eslint-config/lenient';
import esmodule from '@code-style/eslint-config-esmodule';
import typescript from '@code-style/eslint-config-typescript';
import typescript_lenient from '@code-style/eslint-config-typescript/lenient';

const linter = initESLint(
  [...base, ...base_lenient, ...esmodule, ...typescript, ...typescript_lenient],
  { cwd: join(dirname(fileURLToPath(import.meta.url)), 'fixture') },
);

void describe('eslint-config-typescript lenient', () => {
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

    void it(`should pass @typescript-eslint/strict-boolean-expressions object`, () =>
      testNoFail({
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
  });
});
