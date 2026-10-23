import { defineConfig } from 'eslint/config';

import { config as base } from '@code-style/eslint-config';
import { config as typescript } from '@code-style/eslint-config-typescript';

export default defineConfig(base, typescript);
