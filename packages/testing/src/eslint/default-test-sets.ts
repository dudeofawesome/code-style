import { describe, it } from '@jest/globals';
import type { ESLint } from 'eslint';
import { codeBlock } from 'common-tags';

import { expectNoFail, expectRuleFail } from './tests.js';

export function defaultTestSet(linter: ESLint) {
  describe('[standard tests] passes', () => {
    it(`should parse javascript`, () =>
      expectNoFail({
        linter,
        files: [
          {
            code: codeBlock`
              (
                /** @param {string} a */
                (a) => a.split('')
              )('test');
            `,
          },
        ],
      }));

    it(`should allow nested ternaries`, () =>
      expectNoFail({
        linter,
        files: [
          {
            code: `(() => (Number === true ? 'a' : Boolean === true ? 'b' : 'c'))();\n`,
          },
        ],
      }));
  });
  describe('[standard tests] fails', () => {
    it(`should fail eqeqeq`, () =>
      expectRuleFail({
        linter,
        ruleId: 'eqeqeq',
        files: [{ code: `if (Number == true) Number();\n` }],
      }));

    it(`should warn on prettier`, () =>
      expectRuleFail({
        linter,
        ruleId: 'prettier/prettier',
        files: [{ code: `Number( '5')` }],
      }));
  });
}
