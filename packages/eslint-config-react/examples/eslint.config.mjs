import { defineConfig } from 'eslint/config';

import { config as base } from '@code-style/eslint-config';
import { config as react } from '@code-style/eslint-config-react';

export default defineConfig(base, react);
