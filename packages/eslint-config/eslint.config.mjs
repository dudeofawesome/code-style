// In order to update the config, update:
//   @code-style/eslint-config
//   @code-style/eslint-config-node
//   @code-style/eslint-config-cli
//   @code-style/eslint-config-typescript
//   @code-style/eslint-config-esmodule
import { defineConfig } from 'eslint/config';

import base from '@code-style/eslint-config';
import node from '@code-style/eslint-config-node';
import cli from '@code-style/eslint-config-cli';
import typescript from '@code-style/eslint-config-typescript';
import esmodule from '@code-style/eslint-config-esmodule';

export default defineConfig(base, node, cli, typescript, esmodule, {
  // flat config modules export their config arrays as default exports
  files: ['src/**'],
  rules: { 'import/no-default-export': 'off' },
});
