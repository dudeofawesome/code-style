import { defineConfig } from 'eslint/config';

import base from '@code-style/eslint-config';
import browser from '@code-style/eslint-config-browser';

export default defineConfig(base, browser);
