import { describe, it } from 'node:test';
import { initESLint } from '@code-style/utils/testing/eslint';
import {
  testRuleFail,
  testNoFail,
} from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';

const linter = initESLint({
  extends: ['@code-style', '@code-style/jest'],
});

void describe('eslint-config-jest', () => {
  defaultTestSet(linter);

  void describe('passes', () => {
    void it(
      `should have jest globals in test file`,
      testNoFail({
        linter,
        files: [
          {
            code: `describe('test', () => {});\n`,
            test: true,
          },
        ],
      }),
    );
  });

  void describe('fails', () => {
    void it(
      `should not have jest globals in non-test file`,
      testRuleFail({
        linter,
        ruleId: 'no-undef',
        files: [{ code: `describe('test', () => {});\n` }],
      }),
    );
  });
});
