// In order to update the config, update:
//   @code-style/eslint-config
//   @code-style/eslint-config-node
//   @code-style/eslint-config-cli
//   @code-style/eslint-config-typescript
//   @code-style/eslint-config-esmodule
import { defineConfig } from 'eslint/config';

import { config as node } from '@code-style/eslint-config-node';
import { config as cli } from '@code-style/eslint-config-cli';
import { config as typescript } from '@code-style/eslint-config-typescript';
import { config as esmodule } from '@code-style/eslint-config-esmodule';
import { config as base } from '@code-style/eslint-config';

export default defineConfig(base, node, cli, typescript, esmodule);
