import type { Linter } from 'eslint';

export const config: Linter.Config[] = [
  {
    name: '@code-style/eslint-config/overrides/testing',
    rules: {
      // Allow console logging in tests
      'no-console': 'off',

      // Allow test files to be any length.
      'max-lines': 'off',

      /**
       * Don't require dot notation in tests.
       * This can be useful for accessing Typescript `private` properties & methods.
       */
      'dot-notation': 'off',
    },
  },
];
