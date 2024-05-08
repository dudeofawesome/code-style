import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
  rules: {
    // Disallow `eval`.
    'no-eval': 'error',
    'no-implied-eval': 'error',
  },
};

export = config;
