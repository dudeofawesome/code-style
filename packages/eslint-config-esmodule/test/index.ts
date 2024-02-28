import { describe, it } from 'node:test';
import { initESLint } from '@code-style/utils/testing/eslint';
import {
  testNoFail,
  testRuleFail,
} from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';

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
        files: [{ code: `const foo = require('foo');\n` }],
      }));
  });
});
