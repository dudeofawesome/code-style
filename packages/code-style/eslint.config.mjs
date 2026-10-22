import { defineConfig, globalIgnores } from 'eslint/config';

import { config as base } from '@code-style/eslint-config';
import { config as node } from '@code-style/eslint-config-node';
import { config as esmodule } from '@code-style/eslint-config-esmodule';
import { config as typescript } from '@code-style/eslint-config-typescript';

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
