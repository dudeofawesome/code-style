import { defineConfig, globalIgnores } from 'eslint/config';

import base from '@code-style/eslint-config';
import node from '@code-style/eslint-config-node';
import cli from '@code-style/eslint-config-cli';
import jest from '@code-style/eslint-config-jest';
import typescript from '@code-style/eslint-config-typescript';
import esmodule from '@code-style/eslint-config-esmodule';

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
  {
    // flat config modules export their config arrays as default exports
    files: ['packages/*/src/**'],
    rules: { 'import/no-default-export': 'off' },
  },
);
