import { defineConfig, globalIgnores } from 'eslint/config';

import base from '@code-style/eslint-config';
import esmodule from '@code-style/eslint-config-esmodule';
import node from '@code-style/eslint-config-node';
import jest from '@code-style/eslint-config-jest';
import typescript from '@code-style/eslint-config-typescript';

export default defineConfig(
  globalIgnores(['jest.config.mjs']),
  base,
  esmodule,
  node,
  jest,
  typescript,
  {
    // the plugin module is its own default export (flat-config convention)
    files: ['src/index.ts'],
    rules: { 'import/no-default-export': 'off' },
  },
);
