import { describe, it } from 'node:test';
import { ESLint } from 'eslint';
import {
  defaultTestSet,
  filePath,
  testNoFail,
  testRuleFail,
} from '../../utils/testing/eslint';
import { equal, strictEqual } from 'node:assert';

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
          strictEqual(
            res[0].messages[0].message,
            'Parsing error: Unexpected token, expected "," (1:3)',
          );
        }));

    it(`should fail no-console`, async () => {
      const res = await linter.lintText(`console.log('foo');\n`);
      // this gets 2 errors due to `console` not being defined
      strictEqual(res[0].messages[0].ruleId, 'no-console');
    });

    // TODO: test for shopify rule

    // TODO: test for prettier rule
  });
});
