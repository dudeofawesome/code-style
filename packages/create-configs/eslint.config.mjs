// In order to update the config, update:
//   @code-style/eslint-config
//   @code-style/eslint-config-node
//   @code-style/eslint-config-cli
//   @code-style/eslint-config-typescript
//   @code-style/eslint-config-jest
//   @code-style/eslint-config-esmodule
import { defineConfig, globalIgnores } from 'eslint/config';

import { config as base } from '@code-style/eslint-config';
import { config as node } from '@code-style/eslint-config-node';
import { config as cli } from '@code-style/eslint-config-cli';
import { config as typescript } from '@code-style/eslint-config-typescript';
import { config as jest } from '@code-style/eslint-config-jest';
import { config as esmodule } from '@code-style/eslint-config-esmodule';

export default defineConfig(
  globalIgnores(['bin/']),
  base,
  node,
  cli,
  typescript,
  jest,
  esmodule,
);
