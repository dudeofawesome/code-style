import { describe, it } from 'node:test';
import { Config } from 'stylelint';
import { testNoFail, testRuleFail } from '.';

export function defaultTestSet(config: Config) {
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
    return;
  });
}
