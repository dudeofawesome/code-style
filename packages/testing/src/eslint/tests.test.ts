import { describe, it } from '@jest/globals';
import { codeBlock } from 'common-tags';

import { initESLint } from './index.js';
import { expectRuleFail } from './tests.js';

const linter = initESLint({
  extends: ['@code-style/eslint-config', '@code-style/eslint-config-node'],
});

describe('tests', () => {
  describe('testRuleFail', () => {
    describe('single file', () => {
      it(`should pass when single rule fails`, () =>
        expectRuleFail({
          linter,
          ruleId: 'no-console',
          files: [{ code: `console.log('');\n` }],
        }));

      it(`should pass when single rule fails multiple times`, () =>
        expectRuleFail({
          linter,
          ruleId: 'prettier/prettier',
          files: [
            {
              code: `const { readFile } = require('fs/promises')\n\nreadFile('')\n`,
            },
          ],
        }));

      it(`should fail when no rule fails`, async () => {
        await expect(
          expectRuleFail({
            linter,
            ruleId: 'no-console',
            files: [{ code: `` }],
          }),
        ).rejects.toThrow();
      });

      it(`should fail when wrong rule fails`, async () => {
        await expect(
          expectRuleFail({
            linter,
            ruleId: 'prettier/prettier',
            files: [{ code: `console.log('');\n` }],
          }),
        ).rejects.toThrow();
      });

      it(`should fail when additional rule fails`, async () => {
        await expect(
          expectRuleFail({
            linter,
            ruleId: 'no-console',
            files: [{ code: `console.log('')` }],
          }),
        ).rejects.toThrow();
      });
    });

    describe('multi-file', () => {
      it(`should pass when single rule fails`, () =>
        expectRuleFail({
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
