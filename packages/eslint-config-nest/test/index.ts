import { describe, it } from 'node:test';
import { join } from 'node:path';
import { initESLint } from '@code-style/utils/testing/eslint';
import {
  testRuleFail,
  testNoFail,
} from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';

const linter = initESLint(
  { extends: ['@dudeofawesome', '@dudeofawesome/nest'] },
  { cwd: join(__dirname, 'fixture') },
);

void describe('eslint-config-nest', () => {
  defaultTestSet(linter);

  void describe('passes', () => {
    void it(`should pass radix`, async () =>
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
