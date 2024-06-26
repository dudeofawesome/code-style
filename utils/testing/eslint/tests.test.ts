import { describe, it } from 'node:test';
import { rejects } from 'node:assert';
import { codeBlock } from 'common-tags';
import { initESLint } from '@code-style/utils/testing/eslint';

import { testRuleFail } from './tests';

const linter = initESLint({
  extends: ['@code-style/eslint-config', '@code-style/eslint-config-node'],
});

void describe('tests', () => {
  void describe('testRuleFail', () => {
    void describe('single file', (ctx) => {
      void it(`should pass when single rule fails`, () =>
        testRuleFail({
          linter,
          ruleId: 'no-console',
          files: [{ code: `console.log('');\n` }],
        }));

      void it(`should pass when single rule fails multiple times`, () =>
        testRuleFail({
          linter,
          ruleId: 'prettier/prettier',
          files: [
            {
              code: `const { readFile } = require('fs/promises')\n\nreadFile('')\n`,
            },
          ],
        }));

      void it(`should fail when no rule fails`, async () => {
        await rejects(
          testRuleFail({
            linter,
            ruleId: 'no-console',
            files: [{ code: `` }],
          }),
        );
      });

      void it(`should fail when wrong rule fails`, async () => {
        await rejects(
          testRuleFail({
            linter,
            ruleId: 'prettier/prettier',
            files: [{ code: `console.log('');\n` }],
          }),
        );
      });

      void it(`should fail when additional rule fails`, async () => {
        await rejects(
          testRuleFail({
            linter,
            ruleId: 'no-console',
            files: [{ code: `console.log('')` }],
          }),
        );
      });
    });

    void describe('multi-file', (ctx) => {
      void it(`should pass when single rule fails`, () =>
        testRuleFail({
          linter,
          ruleId: 'no-console',
          files: [
            { code: `console.log('');`, path: 'index.js' },
            { code: `module.exports.foo = 'foo';`, path: 'lib.js' },
            {
              code: codeBlock`
                import config from '@code-style/code-style/prettierrc';
                export default config;
              `,
              path: '.prettierrc.mjs',
              lint: false,
            },
          ],
        }));
    });
  });
});
