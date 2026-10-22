import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';
import { initESLint } from '@code-style/utils/testing/eslint';
import {
  testRuleFail,
  testNoFail,
} from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';
import { config as base } from '@code-style/eslint-config';
import { config as jest, files } from '@code-style/eslint-config-jest';

const linter = initESLint([...base, ...jest]);

void describe('eslint-config-jest', () => {
  defaultTestSet(linter);

  void it(`should apply rule changes scoped to its files`, async () => {
    const overlaid = initESLint([
      ...base,
      ...jest,
      { files, rules: { 'jest/no-disabled-tests': 'error' } },
    ]);
    const { rules } = (await overlaid.calculateConfigForFile(
      'src/index.test.js',
    )) as { rules?: Record<string, unknown[]> };
    strictEqual(rules?.['jest/no-disabled-tests']?.[0], 2);
    // and doesn't break linting other files
    await overlaid.calculateConfigForFile('src/index.js');
  });

  void describe('passes', () => {
    void it(`should have jest globals in test file`, () =>
      testNoFail({
        linter,
        files: [
          {
            code: `describe('test', () => {});\n`,
            test: true,
          },
        ],
      }));
  });

  void describe('fails', () => {
    void it(`should not have jest globals in non-test file`, () =>
      testRuleFail({
        linter,
        ruleId: 'no-undef',
        files: [{ code: `describe('test', () => {});\n` }],
      }));
  });
});
