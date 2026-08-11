import type { Linter } from 'eslint';

const config: Linter.Config[] = [
  {
    name: '@code-style/eslint-config/rule-sets/footguns',
    rules: {
      // TODO(0): look into where parseInt isn't base 10
      // Require `parseInt` to have a radix specified since some browsers don't default to base 10.
      radix: 'error',

      // Require the use of `===` since `==` has some weird behavior.
      eqeqeq: ['error', 'smart'],

      // Prefer binary, octal, and hexadecimal literals instead of `parseInt('F', 16)`.
      'prefer-numeric-literals': 'error',

      // Ensure that functional array methods are chainable.
      'array-callback-return': 'error',

      // Disallow returning in a constructor.
      'no-constructor-return': 'error',

      // Disallow array constructors with multiple params.
      'no-array-constructor': 'error',

      // Disallow `arguments.caller`.
      'no-caller': 'error',

      // Disallow monkeypatching.
      'no-extend-native': 'error',

      // TODO(2): are we sure we really want this? it's not _really_ necessary
      // Disallow sequences.
      'no-sequences': ['error', { allowInParentheses: false }],

      // Disallow the `void` keyword.
      'no-void': ['error', { allowAsStatement: true }],

      // Disallow bitwise operators, which are usually typos for boolean operators
      'no-bitwise': 'error',

      // Ensure regexp uses certain flags.
      'require-unicode-regexp': 'error',

      // Prevent unintentional numeric literal values (eg: `071 === 51`).
      'no-octal': 'error',

      // Prevent labels from sharing their name with variable.
      'no-label-var': 'error',

      // Disallow allow empty blocks.
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
];

export default config;
