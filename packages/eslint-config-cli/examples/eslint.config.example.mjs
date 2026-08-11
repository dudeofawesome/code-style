import { defineConfig } from 'eslint/config';

import base from '@code-style/eslint-config';
import node from '@code-style/eslint-config-node';
import cli from '@code-style/eslint-config-cli';

export default defineConfig(base, node, cli);
