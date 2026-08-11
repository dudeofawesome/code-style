import { describe, it } from 'node:test';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initESLint } from '@code-style/utils/testing/eslint';
import {
  testRuleFail,
  testNoFail,
} from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';
import base from '@code-style/eslint-config';
import esmodule from '@code-style/eslint-config-esmodule';
import node from '@code-style/eslint-config-node';
import typescript from '@code-style/eslint-config-typescript';
import nest from '@code-style/eslint-config-nest';

const linter = initESLint(
  [...base, ...esmodule, ...node, ...typescript, ...nest],
  { cwd: join(dirname(fileURLToPath(import.meta.url)), 'fixture') },
);

void describe('eslint-config-nest strict', () => {
  defaultTestSet(linter);

  void describe('passes', () => {
    void it(`should pass radix`, () =>
      testNoFail({ linter, files: [{ code: `parseInt('10');\n`, ts: true }] }));
  });

  void describe('fails', () => {
    void it(`should fail no-console`, () =>
      testRuleFail({
        linter,
        ruleId: 'no-console',
        files: [{ code: `console.log('foo');\n`, ts: true }],
      }));

    void it(`should fail no-restricted-imports`, () =>
      testRuleFail({
        linter,
        ruleId: 'no-restricted-imports',
        files: [
          {
            code: `import { isAxiosError } from '@nestjs/terminus/dist/utils';\n
(isAxiosError as (a: unknown) => void)({});\n`,
            ts: true,
          },
        ],
      }));
  });
});
