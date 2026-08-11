import { defineConfig } from 'eslint/config';

import base from '@code-style/eslint-config';
import esmodule from '@code-style/eslint-config-esmodule';

export default defineConfig(base, esmodule);
