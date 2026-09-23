import type { ESLint } from 'eslint';
import { test_file_patterns } from '@code-style/utils/constants';

const config: ESLint.ConfigData = {
  overrides: [
    {
      files: ['*.json'],
      extends: './json.js',
    },
    {
      files: test_file_patterns,
      extends: './testing.js',
    },
  ],
};

export = config;
