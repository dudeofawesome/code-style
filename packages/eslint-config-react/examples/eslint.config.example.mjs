import { defineConfig } from 'eslint/config';

import base from '@code-style/eslint-config';
import browser from '@code-style/eslint-config-browser';
import react from '@code-style/eslint-config-react';

export default defineConfig(base, browser, react);
