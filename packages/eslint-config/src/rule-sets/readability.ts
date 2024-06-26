import '@rushstack/eslint-patch/modern-module-resolution';
import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
  rules: {
    // Prefer `else if` instead of a lonely `if` inside of an `else`.
    'no-lonely-if': 'error',

    // Require dot notation when possible.
    'dot-notation': 'error',

    // TODO: what should our max be? should we even have one?
    // Disallow excessively large files which would be better to be broken up.
    'max-lines': [
      'error',
      {
        max: 2000,
        skipBlankLines: true,
        skipComments: true,
      },
    ],

    // Disallow reassigning method params, treating them as `const`.
    'no-param-reassign': 'warn',

    'no-unused-vars': [
      'warn',
      {
        args: 'none',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    {
      files: '*.json',
      plugins: ['eslint-plugin-json-files'],
      rules: {
        /**
         * Require keys in package.json to be sorted, improving readability &
         * consistency across projects.
         */
        'json-files/sort-package-json': 'warn',
      },
    },
  ],
};

export = config;
