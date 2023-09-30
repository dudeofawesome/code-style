import { describe, it } from 'node:test';
import { ESLint } from 'eslint';
import {
  testRuleFail,
  testNoFail,
  defaultTestSet,
} from '../../utils/testing/eslint';

const linter = new ESLint({ cwd: __dirname });

describe('eslint-config-react', () => {
  defaultTestSet(linter);

  describe('passes', () => {
    it(`should pass radix`, async () =>
      testNoFail({
        linter,
        code: `parseInt('10');\n`,
        file_path: 'index.jsx',
      }));
  });

  describe('fails', () => {
    it(`should fail radix`, async () =>
      testRuleFail({
        linter,
        code: `parseInt('10');\n`,
        ruleId: 'radix',
        file_path: 'index.jsx',
      }));

    it(`should fail no-console`, () =>
      testRuleFail({
        linter,
        code: `console.log('foo');\n`,
        ruleId: 'no-console',
        file_path: 'index.jsx',
      }));
  });
});
