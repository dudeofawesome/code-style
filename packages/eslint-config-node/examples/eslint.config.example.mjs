import { defineConfig } from 'eslint/config';

import base from '@code-style/eslint-config';
import node from '@code-style/eslint-config-node';

export default defineConfig(base, node);
