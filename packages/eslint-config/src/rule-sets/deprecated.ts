import type { Linter } from 'eslint';

const config: Linter.Config[] = [
  {
    name: '@code-style/eslint-config/rule-sets/deprecated',
    rules: {
      // `__iterator__` is deprecated.
      'no-iterator': 'error',

      // `__proto__` is deprecated.
      'no-proto': 'error',

      // Disallows allow `var`, preferring `let` or `const` instead.
      'no-var': 'error',
    },
  },
];

export default config;
