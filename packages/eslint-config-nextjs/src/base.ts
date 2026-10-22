import type { Linter } from 'eslint';
import nextPlugin from '@next/eslint-plugin-next';

export const config: Linter.Config[] = [
  // eslint-disable-next-line import/no-named-as-default-member -- CJS, so `configs` has no ESM named export
  nextPlugin.configs.recommended,

  {
    name: '@code-style/eslint-config-nextjs/base',
    rules: {
      /** NextJS requires page components to be default exports. */
      'import/no-default-export': 'off',
    },
  },
];
