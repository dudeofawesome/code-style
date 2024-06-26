import '@rushstack/eslint-patch/modern-module-resolution';
import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
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
  overrides: [
    {
      files: '*.json',
      plugins: ['eslint-plugin-json-files'],
      rules: {
        // Prevent having the same package in dependencies and devDependencies.
        'json-files/require-unique-dependency-names': 'error',

        // Require that specific ranges are specified in `package.json` `dependencies`.
        'json-files/restrict-ranges': [
          'error',
          {
            versionHint: 'caret',
            dependencyTypes: ['dependencies', 'devDependencies'],
          },
        ],

        // Require that `engines` are specified in `package.json`.
        'json-files/require-engines': 'error',
      },
    },
  ],
};

export = config;
