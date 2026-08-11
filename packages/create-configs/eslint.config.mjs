// In order to update the config, update:
//   @code-style/eslint-config
//   @code-style/eslint-config-node
//   @code-style/eslint-config-cli
//   @code-style/eslint-config-typescript
//   @code-style/eslint-config-jest
//   @code-style/eslint-config-esmodule
import { defineConfig, globalIgnores } from 'eslint/config';

import base from '@code-style/eslint-config';
import node from '@code-style/eslint-config-node';
import cli from '@code-style/eslint-config-cli';
import typescript from '@code-style/eslint-config-typescript';
import jest from '@code-style/eslint-config-jest';
import esmodule from '@code-style/eslint-config-esmodule';

export default defineConfig(
  globalIgnores(['bin/']),
  base,
  node,
  cli,
  typescript,
  jest,
  esmodule,
);
