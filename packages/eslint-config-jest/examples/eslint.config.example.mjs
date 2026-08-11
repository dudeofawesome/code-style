import { defineConfig } from 'eslint/config';

import base from '@code-style/eslint-config';
import jest from '@code-style/eslint-config-jest';

export default defineConfig(base, jest);
