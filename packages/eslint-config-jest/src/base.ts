import type { Linter } from 'eslint';
import jestPlugin from 'eslint-plugin-jest';

import { test_file_patterns } from './utils.js';

const config: Linter.Config[] = [
  {
    ...jestPlugin.configs['flat/recommended'],
    name: '@code-style/eslint-config-jest/recommended',
    files: test_file_patterns,
  },
  {
    name: '@code-style/eslint-config-jest/base',
    files: test_file_patterns,
    settings: {
      jest: {
        version: 'detect',
      },
    },
    rules: {
      /** Disallow `return` statements in tests. */
      'jest/no-test-return-statement': 'error',

      /**
       * Prefer Jest comparators instead of boolean comparisons.
       * This leads to better test failure messages.
       */
      'jest/prefer-comparison-matcher': 'error',
      'jest/prefer-equality-matcher': 'error',

      /**
       * Prefer Jest's `expect(foo()).resolve` instead of `expect(await foo())`.
       * This leads to better test failure messages.
       */
      'jest/prefer-expect-resolves': 'error',

      /** Require Jest hooks to be inside a `describe`. */
      'jest/require-top-level-describe': 'error',

      /** Require blocks to have valid titles. */
      'jest/valid-title': ['error', { ignoreTypeOfDescribeName: true }],
    },
  },
];

export default config;
