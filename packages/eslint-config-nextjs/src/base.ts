import type { Linter } from 'eslint';
import nextPlugin from '@next/eslint-plugin-next';

const config: Linter.Config[] = [
  // eslint-disable-next-line import/no-named-as-default-member -- the plugin is CJS; `configs` is only reachable through the default export
  nextPlugin.configs.recommended,

  {
    name: '@code-style/eslint-config-nextjs/base',
    rules: {
      /** NextJS requires page components to be default exports. */
      'import/no-default-export': 'off',
    },
  },
];

export default config;
