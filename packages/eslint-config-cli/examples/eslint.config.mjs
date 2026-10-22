import { defineConfig } from 'eslint/config';

import { config as base } from '@code-style/eslint-config';
import { config as cli } from '@code-style/eslint-config-cli';

export default defineConfig(base, cli);
