import type { Linter } from 'eslint';

const config: Linter.Config[] = [
  {
    name: '@code-style/eslint-config/rule-sets/security',
    rules: {
      // Disallow `eval`.
      'no-eval': 'error',
      'no-implied-eval': 'error',
    },
  },
];

export default config;
