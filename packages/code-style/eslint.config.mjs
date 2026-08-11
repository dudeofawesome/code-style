import { defineConfig, globalIgnores } from 'eslint/config';

import base from '@code-style/eslint-config';
import node from '@code-style/eslint-config-node';
import esmodule from '@code-style/eslint-config-esmodule';
import typescript from '@code-style/eslint-config-typescript';

export default defineConfig(
  globalIgnores(['prettierrc.*', 'config-types.*']),
  base,
  node,
  esmodule,
  typescript,
  {
    rules: {
      'import/no-default-export': 'off',
      'n/no-sync': 'off',
    },
  },
);
