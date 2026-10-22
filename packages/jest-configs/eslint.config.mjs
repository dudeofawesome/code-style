import { defineConfig } from 'eslint/config';

import { config as base } from '@code-style/eslint-config';
import { config as node } from '@code-style/eslint-config-node';
import { config as typescript } from '@code-style/eslint-config-typescript';
import { config as esmodule } from '@code-style/eslint-config-esmodule';

export default defineConfig(base, node, typescript, esmodule);
