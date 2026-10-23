import type { Linter } from 'eslint';

import { config as json } from './json.js';
import { config as testing } from './testing.js';

export const config: Linter.Config[] = [
  ...json.map((c) => ({ ...c, files: ['**/*.json'] })),
  ...testing.map((c) => ({
    ...c,
    files: [
      '**/test/**',
      '**/__test__/**',
      '**/*.test.*',
      '**/*.spec.*',
      '**/*.unit.*',
      '**/*.e2e.*',
    ],
  })),
];
