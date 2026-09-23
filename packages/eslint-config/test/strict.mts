import { describe, it, expect } from '@jest/globals';
import { codeBlock } from 'common-tags';
import { filePath, initESLint } from '@code-style/testing/eslint/index';
import { expectNoFail, expectRuleFail } from '@code-style/testing/eslint/tests';
import { defaultTestSet } from '@code-style/testing/eslint/default-test-sets';

const linter = initESLint({ extends: ['@code-style/eslint-config'] });

describe('eslint-config strict', () => {
  defaultTestSet(linter);

  describe('passes', () => {
    it(`should pass commonjs import`, () =>
      expectNoFail({
        linter,
        files: [{ code: `const foo = require('foo');\n\nfoo();\n` }],
      }));

    it(`should pass commonjs export`, () =>
      expectNoFail({
        linter,
        files: [{ code: `module.exports = { foo: 'foo' };\n` }],
      }));

    it(`should pass json-files rules`, () =>
      expectNoFail({
        linter,
        files: [
          {
            path: 'package.json',
            code: codeBlock`
              {
                "name": "foo",
                "version": "0.0.1",
                "description": "Foo bar baz",
                "dependencies": {
                  "tsx": "^4.9.4"
                },
                "engines": {
                  "node": "^20"
                }
              }
            `,
          },
        ],
      }));

    it(`should allow default export in jest config`, () =>
      Promise.allSettled([
        expectNoFail({
          linter,
          files: [
            {
              path: 'package.json',
              code: codeBlock`
                {
                  "type": "module",
                  "engines": { "node": "^18" }
                }
              `,
            },
            {
              path: 'jest.config.ts',
              code: codeBlock`
                const config = {};
                export default config;
              `,
            },
            {
              path: 'jest.config.js',
              code: codeBlock`
                const config = {};
                export default config;
              `,
            },
            {
              path: 'jest.config.mjs',
              code: codeBlock`
                const config = {};
                export default config;
              `,
            },
            {
              path: 'jest.config.mts',
              code: codeBlock`
                const config = {};
                export default config;
              `,
            },
          ],
        }),
      ]));
  });

  describe('fails', () => {
    it(`should fail radix`, () =>
      expectRuleFail({
        linter,
        ruleId: 'radix',
        files: [{ code: `parseInt('10');\n` }],
      }));

    it(`should not parse typescript`, async () => {
      await expect(
        linter.lintText(`((a: string): string[] => a.split(''))()\n`, {
          filePath: filePath({ ts: true }),
        }),
      ).resolves.toMatchObject([
        {
          messages: [
            {
              ruleId: null,
              message: expect.stringContaining(
                'Parsing error: Unexpected token',
              ),
            },
          ],
        },
      ]);
    });

    it(`should fail no-console`, async () => {
      // this gets 2 errors due to `console` not being defined
      await expectRuleFail({
        linter,
        ruleId: ['no-console', 'no-undef'],
        files: [{ code: `console.log('foo');\n` }],
      });
    });

    it(`should fail es module import`, () =>
      expectRuleFail({
        linter,
        ruleId: 'no-restricted-syntax',
        files: [{ code: `import { foo } from 'console';\n\nfoo();\n` }],
      }));

    it(`should fail es module export`, () =>
      expectRuleFail({
        linter,
        ruleId: 'no-restricted-syntax',
        files: [{ code: `export const foo = 'foo';\n` }],
      }));

    it(`should fail json-files/require-engines`, () =>
      expectRuleFail({
        linter,
        ruleId: 'json-files/require-engines',
        files: [
          {
            path: 'package.json',
            code: codeBlock`
              {
                "name": "foo",
                "version": "0.0.1",
                "description": "Foo bar baz",
                "dependencies": {
                  "tsx": "^4.9.4"
                }
              }
            `,
          },
        ],
      }));

    it(`should fail json-files/require-engines`, () =>
      expectRuleFail({
        linter,
        ruleId: 'json-files/sort-package-json',
        files: [
          {
            path: 'package.json',
            code: codeBlock`
              {
                "name": "foo",
                "description": "Foo bar baz",
                "version": "0.0.1",
                "dependencies": {
                  "tsx": "^4.9.4"
                },
                "engines": {
                  "node": "^20"
                }
              }
            `,
          },
        ],
      }));

    it(`should not allow default exports`, () =>
      expectRuleFail({
        linter,
        ruleId: ['no-restricted-syntax', 'import/no-default-export'],
        files: [
          {
            code: codeBlock`
              const foo = 'foo';
              export default foo;
            `,
          },
        ],
      }));
  });
});
