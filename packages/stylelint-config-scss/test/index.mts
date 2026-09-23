import { describe, it } from '@jest/globals';
import { expectNoFail } from '@code-style/testing/stylelint/index';
import { defaultTestSet } from '@code-style/testing/stylelint/default-test-sets';

describe('styleint-config-scss', () => {
  const config = {
    extends: [
      '@code-style/stylelint-config',
      '@code-style/stylelint-config-scss',
    ],
  };

  defaultTestSet(config);

  describe('passes', () => {
    it('should lint scss', () =>
      expectNoFail({
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

  describe('fails', () => {});
});
