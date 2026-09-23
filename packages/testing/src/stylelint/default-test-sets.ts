import { describe, it } from '@jest/globals';
import type { Config } from 'stylelint';
import { codeBlock } from 'common-tags';
import { expectNoFail, expectRuleFail } from './index.js';

export function defaultTestSet(config: Config): void {
  describe('[standard tests] passes', () => {
    it('should lint css', () =>
      expectNoFail({
        config,
        files: [
          {
            code: codeBlock`
              html {
                color: 'red';
              }
            ` + '\n',
          },
        ],
      }));
  });

  describe('[standard tests] fails', () => {
    it('should fail to length-zero-no-unit', () =>
      expectRuleFail({
        config,
        ruleId: 'length-zero-no-unit',
        files: [
          {
            code: codeBlock`
              html {
                width: 0px;
              }
            `,
          },
        ],
      }));
  });
}
