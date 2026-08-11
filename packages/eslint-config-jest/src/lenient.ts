import type { Linter } from 'eslint';

import { test_file_patterns } from './utils.js';

const config: Linter.Config[] = [
  {
    name: '@code-style/eslint-config-jest/lenient',
    files: test_file_patterns,
    rules: {
      /** Allow boolean comparisons instead of the equivalent Jest method. */
      'jest/prefer-comparison-matcher': 'off',
      'jest/prefer-equality-matcher': 'off',

      /** Allow `expect(await foo())`. */
      'jest/prefer-expect-resolves': 'off',
    },
  },
];

export default config;
