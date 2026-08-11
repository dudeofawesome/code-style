import { defineConfig } from 'eslint/config';

import base from '@code-style/eslint-config';
import typescript from '@code-style/eslint-config-typescript';

export default defineConfig(base, typescript);
