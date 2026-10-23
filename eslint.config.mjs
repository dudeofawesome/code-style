import { defineConfig, globalIgnores } from 'eslint/config';

import { config as base } from '@code-style/eslint-config';
import { config as node } from '@code-style/eslint-config-node';
import { config as cli } from '@code-style/eslint-config-cli';
import { config as jest } from '@code-style/eslint-config-jest';
import { config as typescript } from '@code-style/eslint-config-typescript';
import { config as esmodule } from '@code-style/eslint-config-esmodule';

export default defineConfig(
  globalIgnores([
    '.prettierrc.mjs',
    '**/test/*/**',
    // these packages lint themselves with their own eslint.config.mjs
    'packages/code-style/',
    'packages/create-configs/',
    'packages/eslint-config/',
    'packages/eslint-config-typescript/',
    'packages/eslint-plugin-nest/',
    'packages/jest-configs/',
    'utils/',
  ]),
  base,
  node,
  cli,
  jest,
  typescript,
  esmodule,
);
