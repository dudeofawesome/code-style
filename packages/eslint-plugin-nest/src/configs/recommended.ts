import { ESLint } from 'eslint';

export const recommended: ESLint.ConfigData = {
  plugins: ['@dudeofawesome/nest'],
  rules: {
    /**
     * Disallow barrel files since they can lead to a number of hard to debug
     * issues
     */
    '@dudeofawesome/nest/no-barreling': 'error',
  },
};