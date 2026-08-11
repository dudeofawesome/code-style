import type { Linter } from 'eslint';

const config: Linter.Config[] = [
  {
    name: '@code-style/eslint-config/rule-sets/readability',
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
  },
];

export default config;
