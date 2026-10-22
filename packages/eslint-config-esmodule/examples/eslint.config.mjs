import { defineConfig } from 'eslint/config';

import { config as base } from '@code-style/eslint-config';
import { config as esmodule } from '@code-style/eslint-config-esmodule';

export default defineConfig(base, esmodule);
