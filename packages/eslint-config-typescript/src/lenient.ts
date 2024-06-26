import '@rushstack/eslint-patch/modern-module-resolution';
import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
  overrides: [
    {
      files: ['*.?(m|c)@(t|j)s?(x)'],
      excludedFiles: '*.json',
      rules: {
        /** Allow some non-boolean type conditionals. */
        '@typescript-eslint/strict-boolean-expressions': [
          'error',
          {
            allowAny: true,
            allowString: false,
            allowNullableString: false,
            allowNumber: false,
            allowNullableNumber: false,
            allowNullableObject: true,
            allowNullableBoolean: true,
          },
        ],

        /** Don't ensure switches on union types handle all cases. */
        '@typescript-eslint/switch-exhaustiveness-check': 'off',

        /** Allow unused vars. */
        '@typescript-eslint/no-unused-vars': 'off',

        /** Allow `any`. */
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',

        /** Allow non-null assertions. */
        '@typescript-eslint/no-non-null-assertion': 'off',

        /** Allow for loops. */
        '@typescript-eslint/prefer-for-of': 'off',

        /** Allow floating promises. */
        '@typescript-eslint/no-floating-promises': 'off',
      },
    },
  ],
};

export = config;
