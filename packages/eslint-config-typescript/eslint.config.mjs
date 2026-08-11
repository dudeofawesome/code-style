import { defineConfig } from 'eslint/config';

import base from '@code-style/eslint-config';
import node from '@code-style/eslint-config-node';
import esmodule from '@code-style/eslint-config-esmodule';
import typescript from '@code-style/eslint-config-typescript';

export default defineConfig(base, node, esmodule, typescript, {
  // flat config modules export their config arrays as default exports
  files: ['src/**'],
  rules: { 'import/no-default-export': 'off' },
});
