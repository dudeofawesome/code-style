import { defineConfig } from 'eslint/config';

import { config as base } from '@code-style/eslint-config';
import { config as nextjs } from '@code-style/eslint-config-nextjs';

export default defineConfig(base, nextjs);
