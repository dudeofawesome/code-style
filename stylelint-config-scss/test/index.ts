import { describe, it } from 'node:test';
import { testNoFail } from '../../utils/testing/stylelint/stylelint';

void describe('styleint-config-scss', () => {
  void describe('passes', () => {
    void it('should lint scss', () =>
      testNoFail({
        config: { extends: '@dudeofawesome/stylelint-config-scss' },
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
