import { defineConfig } from 'eslint/config';

import { config as base } from '@code-style/eslint-config';
import { config as node } from '@code-style/eslint-config-node';
import { config as esmodule } from '@code-style/eslint-config-esmodule';
import { config as typescript } from '@code-style/eslint-config-typescript';
import { config as testing } from '@code-style/eslint-config/overrides/testing';

export default defineConfig(base, node, esmodule, typescript, {
  files: [
    '**/test/**',
    '**/testing/**',
    '**/__test__/**',
    '**/*.test.*',
    '**/*.spec.*',
    '**/*.unit.*',
    '**/*.e2e.*',
  ],
  extends: [testing],
});
