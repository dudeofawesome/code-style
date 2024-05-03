import { describe, it } from 'node:test';
import { join } from 'node:path';
import { initESLint } from '@code-style/utils/testing/eslint';
import {
  testNoFail,
  testRuleFail,
} from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';
import { codeBlock } from 'common-tags';

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
              Number(a);
              const a = 10;
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
              foo = 'bar';
              if (foo) Number();
            `,
            ts: true,
          },
        ],
      }));
  });
});
