import { ESLint } from 'eslint';

export const recommended: ESLint.ConfigData = {
  plugins: ['@code-style/eslint-plugin-nest'],
  rules: {
    /**
     * Disallow barrel files since they can lead to a number of hard to debug
     * issues
     */
    '@code-style/nest/no-barreling': 'error',
  },
};
