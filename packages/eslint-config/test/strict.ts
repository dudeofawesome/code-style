import { describe, it } from 'node:test';
import { equal, match, strictEqual } from 'node:assert';
import { filePath, initESLint } from '@code-style/utils/testing/eslint';
import {
  testNoFail,
  testRuleFail,
} from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';

const linter = initESLint({ extends: ['@code-style/eslint-config'] });

void describe('eslint-config strict', () => {
  defaultTestSet(linter);

  void describe('passes', () => {
    void it(`should pass commonjs import`, () =>
      testNoFail({
        linter,
        files: [{ code: `const foo = require('foo');\n\nfoo();\n` }],
      }));

    void it(`should pass commonjs export`, () =>
      testNoFail({
        linter,
        files: [{ code: `module.exports = { foo: 'foo' };\n` }],
      }));

    void it(`should pass json-files rules`, () =>
      testNoFail({
        linter,
        files: [
          {
            path: 'package.json',
            code: `{
  "name": "foo",
  "version": "0.0.1",
  "description": "Foo bar baz",
  "dependencies": {
    "tsm": "^2.3.0"
  },
  "engines": {
    "node": "^20"
  }
}
`,
          },
        ],
      }));
  });

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

    void it(`should fail es module import`, () =>
      testRuleFail({
        linter,
        ruleId: 'no-restricted-syntax',
        files: [{ code: `import { foo } from 'console';\n\nfoo();\n` }],
      }));

    void it(`should fail es module export`, () =>
      testRuleFail({
        linter,
        ruleId: 'no-restricted-syntax',
        files: [{ code: `export const foo = 'foo';\n` }],
      }));

    void it(`should fail json-files/require-engines`, () =>
      testRuleFail({
        linter,
        ruleId: 'json-files/require-engines',
        files: [
          {
            path: 'package.json',
            code: `{
  "name": "foo",
  "version": "0.0.1",
  "description": "Foo bar baz",
  "dependencies": {
    "tsm": "^2.3.0"
  }
}
`,
          },
        ],
      }));

    void it(`should fail json-files/require-engines`, () =>
      testRuleFail({
        linter,
        ruleId: 'json-files/sort-package-json',
        files: [
          {
            path: 'package.json',
            code: `{
  "name": "foo",
  "description": "Foo bar baz",
  "version": "0.0.1",
  "dependencies": {
    "tsm": "^2.3.0"
  },
  "engines": {
    "node": "^20"
  }
}
`,
          },
        ],
      }));
  });
});
