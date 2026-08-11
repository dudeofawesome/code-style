import { defineConfig } from 'eslint/config';

import base from '@code-style/eslint-config';
import node from '@code-style/eslint-config-node';
import esmodule from '@code-style/eslint-config-esmodule';
import typescript from '@code-style/eslint-config-typescript';
import testing from '@code-style/eslint-config/overrides/testing';

export default defineConfig(
  base,
  node,
  esmodule,
  typescript,
  // apply the shared testing relaxations to this workspace's wider test-file layout
  testing.map((config) => ({
    ...config,
    files: [
      '**/test/**',
      '**/testing/**',
      '**/__test__/**',
      '**/*.test.*',
      '**/*.spec.*',
      '**/*.unit.*',
      '**/*.e2e.*',
    ],
  })),
);
