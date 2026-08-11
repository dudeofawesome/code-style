import { createRequire } from 'node:module';
import type { ESLint, Linter } from 'eslint';

import { rules } from './rules/index.js';

const { version } = createRequire(import.meta.url)('../package.json') as {
  version: string;
};

interface NestPluginConfigs {
  recommended: Linter.Config[];
  /** @deprecated use `recommended` — kept as an alias for one release. */
  recommended_flat: Linter.Config[];
}

/**
 * Filled in below — the configs must reference the plugin object, so they
 * can't be created until it exists.
 */
const plugin_configs: NonNullable<ESLint.Plugin['configs']> = {};

const plugin: ESLint.Plugin = {
  meta: { name: '@code-style/eslint-plugin-nest', version },
  rules,
  configs: plugin_configs,
};

const recommended: Linter.Config[] = [
  {
    name: '@code-style/eslint-plugin-nest/recommended',
    plugins: { '@code-style/nest': plugin },
    rules: {
      /**
       * Disallow barrel files since they can lead to a number of hard to debug
       * issues
       */
      '@code-style/nest/no-barreling': 'error',
    },
  },
];

Object.assign(plugin_configs, {
  recommended,
  recommended_flat: recommended,
});

export default plugin as ESLint.Plugin & { configs: NestPluginConfigs };
export { rules };
