import { describe, it } from 'node:test';
import { ESLint } from 'eslint';
import { testNoFail, testRuleFail } from './eslint';

export function eslintDefaultTestSet(linter: ESLint) {
  void describe('[standard tests] passes', () => {
    void it(`should parse javascript`, () =>
      testNoFail({
        linter,
        files: [
          {
            code: `(
  /** @param {string} a */
  (a) => a.split('')
)('test');
`,
          },
        ],
      }));

    void it(`should allow nested ternaries`, () =>
      testNoFail({
        linter,
        files: [
          {
            code: `(() => (Number === true ? 'a' : Boolean === true ? 'b' : 'c'))();\n`,
            typescript: true,
          },
        ],
      }));
  });
  void describe('[standard tests] fails', () => {
    void it(`should fail eqeqeq`, () =>
      testRuleFail({
        linter,
        code: `if (Number == true) Number();\n`,
        ruleId: 'eqeqeq',
      }));

    void it(`should warn on prettier`, () =>
      testRuleFail({
        linter,
        code: `Number( '5')`,
        ruleId: 'prettier/prettier',
      }));
  });
}
