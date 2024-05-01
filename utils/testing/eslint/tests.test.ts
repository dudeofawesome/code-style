import { describe, it } from 'node:test';
import { rejects } from 'node:assert';
import { initESLint } from '@code-style/utils/testing/eslint';

import { testRuleFail } from './tests';

const linter = initESLint({
  extends: ['@code-style/eslint-config', '@code-style/eslint-config-node'],
});

void describe('tests', () => {
  void describe('testRuleFail', () => {
    void it(
      `should pass when single rule fails`,
      testRuleFail({
        linter,
        ruleId: 'no-console',
        files: [{ code: `console.log('');\n` }],
      }),
    );

    void it(
      `should pass when single rule fails multiple times`,
      testRuleFail({
        linter,
        ruleId: 'prettier/prettier',
        files: [
          {
            code: `const { readFile } = require('fs/promises')\n\nreadFile('')\n`,
          },
        ],
      }),
    );

    void it(`should fail when no rule fails`, async (ctx, a) => {
      await rejects(
        Promise.resolve(
          testRuleFail({
            linter,
            ruleId: 'no-console',
            files: [{ code: `` }],
          })(ctx, a),
        ),
      );
    });

    void it(`should fail when wrong rule fails`, async (ctx, a) => {
      await rejects(
        Promise.resolve(
          testRuleFail({
            linter,
            ruleId: 'prettier/prettier',
            files: [{ code: `console.log('');\n` }],
          })(ctx, a),
        ),
      );
    });

    void it(`should fail when additional rule fails`, async (ctx, a) => {
      await rejects(
        Promise.resolve(
          testRuleFail({
            linter,
            ruleId: 'no-console',
            files: [{ code: `console.log('')` }],
          })(ctx, a),
        ),
      );
    });
  });
});
