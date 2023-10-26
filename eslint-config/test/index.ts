import { describe, it } from 'node:test';
import { equal, match, strictEqual } from 'node:assert';
import { filePath, initESLint } from '@code-style/utils/testing/eslint';
import { testRuleFail } from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';

const linter = initESLint({ extends: ['@dudeofawesome'] });

void describe('eslint-config', () => {
  defaultTestSet(linter);

  void describe('passes', () => {});

  void describe('fails', () => {
    void it(`should fail radix`, async () =>
      testRuleFail({
        linter,
        ruleId: 'radix',
        files: [{ code: `parseInt('10');\n` }],
      }));

    void it(`should not parse typescript`, () =>
      linter
        .lintText(`((a: string): string[] => a.split(''))()\n`, {
          filePath: filePath({ ts: true }),
        })
        .then((res) => {
          equal(res[0]?.messages[0]?.ruleId, null);
          match(
            res[0]?.messages[0]?.message ?? '',
            /^Parsing error: Unexpected token/u,
          );
          return;
        }));

    void it(`should fail no-console`, async () => {
      const res = await linter.lintText(`console.log('foo');\n`);
      // this gets 2 errors due to `console` not being defined
      strictEqual(res[0]?.messages[0]?.ruleId, 'no-console');
    });

    void it(`should only log single duplicate-import error`, async () =>
      linter
        .lintText(
          `import path from 'path';\nimport { join } from 'path';\n\njoin(path.cwd);\n`,
          {
            filePath: filePath({ ts: true }),
          },
        )
        .then((res) => {
          // strictEqual(res[0]?.source, code);
          strictEqual(res[0]?.messages[0]?.ruleId, 'import/no-duplicates');
          return;
        }));
  });
});
