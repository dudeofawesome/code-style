import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
  rules: {
    // Allow console logging in tests
    'no-console': 'off',

    // Allow test to import unpublished files.
    'n/no-unpublished-import': 'off',

    // Allow test files to be any length.
    'max-lines': 'off',

    /**
     * Don't require dot notation in tests.
     * This can be useful for accessing Typescript `private` properties & methods.
     */
    'dot-notation': 'off',
    '@typescript-eslint/dot-notation': 'off',

    // Allow `any` in tests.
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',

    // Allow non-null assertions in tests.
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',

    // Simplify testing methods.
    '@typescript-eslint/unbound-method': 'off',

    // Allow tests to throw literals.
    '@typescript-eslint/no-throw-literal': 'off',
  },
};

export = config;
