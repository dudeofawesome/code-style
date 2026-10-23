import { defineConfig } from 'eslint/config';

import { config as base } from '@code-style/eslint-config';
import { config as nest } from '@code-style/eslint-config-nest';

export default defineConfig(base, nest);
