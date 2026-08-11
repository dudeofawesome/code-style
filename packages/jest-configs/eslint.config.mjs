import { defineConfig } from 'eslint/config';

import base from '@code-style/eslint-config';
import node from '@code-style/eslint-config-node';
import typescript from '@code-style/eslint-config-typescript';
import esmodule from '@code-style/eslint-config-esmodule';

export default defineConfig(base, node, typescript, esmodule);
