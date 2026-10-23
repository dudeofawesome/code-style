import { defineConfig, globalIgnores } from 'eslint/config';

import { config as base } from '@code-style/eslint-config';
import { config as esmodule } from '@code-style/eslint-config-esmodule';
import { config as node } from '@code-style/eslint-config-node';
import { config as jest } from '@code-style/eslint-config-jest';
import { config as typescript } from '@code-style/eslint-config-typescript';

export default defineConfig(
  globalIgnores(['jest.config.mjs']),
  base,
  esmodule,
  node,
  jest,
  typescript,
);
