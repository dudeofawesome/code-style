import { defineConfig } from 'eslint/config';

import { config as base } from '@code-style/eslint-config';
import { config as node } from '@code-style/eslint-config-node';
import { config as jest } from '@code-style/eslint-config-jest';

export default defineConfig(base, node, jest);
