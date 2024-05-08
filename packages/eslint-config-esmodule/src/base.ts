import '@rushstack/eslint-patch/modern-module-resolution';
import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
  plugins: ['eslint-plugin-import'],

  parserOptions: {
    sourceType: 'module',
  },

  rules: {
    /** Disallow commonjs modules. */
    'import/no-commonjs': 'error',

    // TODO: this could turn off other `no-restricted-syntax1 rules unintentionally
    /** Turn off the `import` ban from `@code-style/eslint-config/rule-sets/imports.yaml` */
    'no-restricted-syntax': 'off',
  },
};

export = config;
