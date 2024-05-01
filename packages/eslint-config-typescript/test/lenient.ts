import { describe, it } from 'node:test';
import { join } from 'node:path';
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
        files: [{ code: `Number(a);\nconst a = 10;\n`, ts: true }],
      }),
    );

    void it(
      `should import`,
      testNoFail({
        linter,
        files: [
          { code: `import { a } from './utils';\n\na();\n`, ts: true },
          {
            code: `export function a () {
  return 1;
}\n`,
            path: 'utils.ts',
          },
        ],
      }),
    );

    void it(
      `should pass @typescript-eslint/strict-boolean-expressions object`,
      testNoFail({
        linter,
        files: [
          {
            code: `const foo: object | null = Math.random() === 0 ? {} : null;\nif (foo) Number();\n`,
            ts: true,
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
  });
});
