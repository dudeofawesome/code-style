import { defineConfig } from 'eslint/config';

import base from '@code-style/eslint-config';
import browser from '@code-style/eslint-config-browser';
import esmodule from '@code-style/eslint-config-esmodule';
import react from '@code-style/eslint-config-react';
import nextjs from '@code-style/eslint-config-nextjs';

export default defineConfig(base, browser, esmodule, react, nextjs);
