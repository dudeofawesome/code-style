import type { Linter } from 'eslint';
import nextPlugin from '@next/eslint-plugin-next';

const config: Linter.Config[] = [
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
