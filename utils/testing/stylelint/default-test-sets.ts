import { describe, it } from 'node:test';
import { Config } from 'stylelint';
import { testNoFail, testRuleFail } from '.';

export function defaultTestSet(config: Config): void {
  void describe('[standard tests] passes', () => {
    void it('should lint css', () =>
      testNoFail({
        config,
        files: [
          {
            code: `html {
  color: 'red';
}
`,
          },
        ],
      }));
  });

  void describe('[standard tests] fails', () => {
    void it('should fail to length-zero-no-unit', () =>
      testRuleFail({
        config,
        ruleId: 'length-zero-no-unit',
        files: [
          {
            code: `html {
  width: 0px;
}
`,
          },
        ],
      }));
  });
}
