import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
  rules: {
    // `__iterator__` is deprecated.
    'no-iterator': 'error',

    // `__proto__` is deprecated.
    'no-proto': 'error',

    // Disallows allow `var`, preferring `let` or `const` instead.
    'no-var': 'error',
  },
};

export = config;
