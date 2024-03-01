import { describe, it } from 'node:test';
import { filePath, initESLint } from '@code-style/utils/testing/eslint';
import {
  testNoFail,
  testRuleFail,
} from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';
import { strictEqual } from 'node:assert';

const linter = initESLint({
  extends: ['@dudeofawesome', '@dudeofawesome/esmodule'],
});

void describe('eslint-config-esmodule base', () => {
  defaultTestSet(linter);

  void describe('passes', () => {
    void it(`should pass esmodule import`, () =>
      testNoFail({
        linter,
        files: [{ code: `import { foo } from 'console';\n\nfoo();\n` }],
      }));
  });

  void describe('fails', () => {
    void it(`should fail commonjs`, () =>
      testRuleFail({
        linter,
        ruleId: 'import/no-commonjs',
        files: [{ code: `const foo = require('foo');\n\nfoo();\n` }],
      }));

    void it(`should only log single duplicate-import error`, async () =>
      linter
        .lintText(
          `import path from 'path';\nimport { join } from 'path';\n\njoin(path.cwd);\n`,
          { filePath: filePath({ ts: true }) },
        )
        .then((res) => {
          strictEqual(res[0]?.messages[0]?.ruleId, 'import/no-duplicates');
          return;
        }));
  });
});
