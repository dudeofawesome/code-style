import { ESLint } from 'eslint';

export const recommended: ESLint.ConfigData = {
  plugins: ['@dudeofawesome/nest'],
  rules: {
    '@dudeofawesome/nest/no-barreling': 'error',
  },
};
