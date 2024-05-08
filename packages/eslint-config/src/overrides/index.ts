import type { ESLint } from 'eslint';

const config: ESLint.ConfigData = {
  overrides: [
    {
      files: ['*.json'],
      extends: './json.js',
    },
    {
      files: [
        '**/test/**',
        '**/__test__/**',
        '*.test.*',
        '*.spec.*',
        '*.unit.*',
        '*.e2e.*',
      ],
      extends: './testing.js',
    },
  ],
};

export = config;
