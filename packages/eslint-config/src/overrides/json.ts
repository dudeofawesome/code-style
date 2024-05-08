import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
  rules: {
    // eslint-plugin-prettier breaks JSON linting (https://github.com/prettier/eslint-plugin-prettier/issues/570)
    'prettier/prettier': 'off',
  },
};

export = config;
