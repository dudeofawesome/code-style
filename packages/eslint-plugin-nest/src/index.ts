import { createRequire } from 'node:module';
import type { ESLint, Linter } from 'eslint';

import { rules } from './rules/index.js';

const { name, version } = createRequire(import.meta.url)('../package.json') as {
  name: string;
  version: string;
};

const plugin = {
  meta: { name, version },
  rules,
  configs: {} as { recommended: Linter.Config },
} satisfies ESLint.Plugin;

plugin.configs.recommended = {
  plugins: { '@code-style/nest': plugin },
  rules: {
    /**
     * Disallow barrel files since they can lead to a number of hard to debug
     * issues
     */
    '@code-style/nest/no-barreling': 'error',
  },
};

// eslint-disable-next-line import/no-default-export
export default plugin;
