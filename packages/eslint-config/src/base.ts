import '@rushstack/eslint-patch/modern-module-resolution';
import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:eslint-plugin-promise/recommended',
    'plugin:eslint-plugin-import/recommended',
    'plugin:@eslint-community/eslint-plugin-eslint-comments/recommended',

    './rule-sets/bugs.js',
    './rule-sets/deprecated.js',
    './rule-sets/footguns.js',
    './rule-sets/imports.js',
    './rule-sets/miscellaneous.js',
    './rule-sets/modern-code.js',
    './rule-sets/promises.js',
    './rule-sets/readability.js',
    './rule-sets/security.js',

    './overrides/index.js',
  ],
  parserOptions: {
    ecmaVersion: 2022,
  },
  env: {
    commonjs: true,
  },
  ignorePatterns: ['**/dist/**', '**/out/**', '**/coverage/**', '!.*'],
};

export = config;
