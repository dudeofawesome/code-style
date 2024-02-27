import { describe, it } from 'node:test';
import { testNoFail } from '@code-style/utils/testing/stylelint';
import { defaultTestSet } from '@code-style/utils/testing/stylelint/default-test-sets';

void describe('styleint-config-scss', () => {
  const config = { extends: '@dudeofawesome/stylelint-config-scss' };

  defaultTestSet(config);

  void describe('passes', () => {
    void it('should lint scss', () =>
      testNoFail({
        config,
        files: [
          {
            code: `$myvar: 'red';

html {
  a {
    color: $myvar;
  }
}
`,
          },
        ],
      }));
  });

  void describe('fails', () => {
    return;
  });
});
