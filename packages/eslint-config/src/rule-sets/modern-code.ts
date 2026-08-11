import type { Linter } from 'eslint';

const config: Linter.Config[] = [
  {
    name: '@code-style/eslint-config/rule-sets/modern-code',
    rules: {
      // Prefer template literals instead of string concatenation.
      'prefer-template': 'error',

      // Disallow using `.apply()`.
      'prefer-spread': 'error',

      // Prefer a rest parameter instead of `arguments`.
      'prefer-rest-params': 'error',

      // Prefer using arrow functions as callbacks.
      'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],

      // Prefer `const` for vars that are never modified.
      'prefer-const': 'error',
    },
  },
];

export default config;
