import type { Linter } from 'eslint';

const config: Linter.Config[] = [
  {
    name: '@code-style/eslint-config-esmodule/base',
    languageOptions: {
      sourceType: 'module',
    },
    rules: {
      /** Disallow commonjs modules. */
      'import/no-commonjs': 'error',

      // TODO: this could turn off other `no-restricted-syntax` rules unintentionally
      /** Turn off the `import` ban from `@code-style/eslint-config/rule-sets/imports`. */
      'no-restricted-syntax': 'off',
    },
  },
];

export default config;
