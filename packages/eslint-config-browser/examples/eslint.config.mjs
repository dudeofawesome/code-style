import { defineConfig } from 'eslint/config';

import { config as base } from '@code-style/eslint-config';
import { config as browser } from '@code-style/eslint-config-browser';

export default defineConfig(base, browser);
