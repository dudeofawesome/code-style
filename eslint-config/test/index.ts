import { describe, it } from 'node:test';
import { ESLint } from 'eslint';
import {
  defaultTestSet,
  filePath,
  testNoFail,
  testRuleFail,
} from '../../utils/testing/eslint';
import { equal, match, strictEqual } from 'node:assert';

const linter = new ESLint({ cwd: __dirname });

describe('eslint-config', () => {
  defaultTestSet(linter);

  describe('passes', () => {});

  describe('fails', () => {
    it(`should fail radix`, async () =>
      testRuleFail(linter, `parseInt('10');\n`, 'radix'));

    it(`should not parse typescript`, () =>
      linter
        .lintText(`((a: string): string[] => a.split(''))()\n`, {
          filePath: filePath(true),
        })
        .then((res) => {
          equal(res[0].messages[0].ruleId, null);
          match(res[0].messages[0].message, /^Parsing error: Unexpected token/);
        }));

    it(`should fail no-console`, async () => {
      const res = await linter.lintText(`console.log('foo');\n`);
      // this gets 2 errors due to `console` not being defined
      strictEqual(res[0].messages[0].ruleId, 'no-console');
    });

    it(`should only log single duplicate-import error`, async () =>
      linter
        .lintText(
          `import path from 'path';\nimport { join } from 'path';\n\njoin(path.cwd);\n`,
          {
            filePath: filePath(true),
          },
        )
        .then((res) => {
          // strictEqual(res[0]?.source, code);
          strictEqual(res[0]?.messages[0]?.ruleId, 'import/no-duplicates');
        }));
  });
});
