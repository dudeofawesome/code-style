# Customizing the ESLint configs

Add your own changes after the `@code-style` configs in your `eslint.config.mjs`. Later configs win.

```js
import { defineConfig, globalIgnores } from 'eslint/config';

import { config as base } from '@code-style/eslint-config';
import { config as node } from '@code-style/eslint-config-node';
import {
  config as typescript,
  files as typescript_files,
} from '@code-style/eslint-config-typescript';

export default defineConfig(
  globalIgnores(['generated/']),
  base,
  node,
  typescript,
  {
    rules: {
      'max-lines': ['error', { max: 500 }],
    },
  },
  {
    files: typescript_files,
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
);
```

- **Scope changes to `@typescript-eslint/*` and `jest/*` rules with the config's `files`.** `@code-style/eslint-config-typescript` and `@code-style/eslint-config-jest` only load their plugins for the files they lint, so changing one of their rules for every file fails with `Could not find plugin`. Both packages export their `files`. Turning a rule `'off'` works without them.
- **Setting only a severity keeps the rule's options, but setting options replaces all of them.** `'max-lines': 'warn'` keeps `max: 2000`, while `['error', { max: 500 }]` also drops `skipBlankLines` and `skipComments`, so restate any options you want to keep.
- **Order matters.** Put each `/lenient` config right after the config it relaxes, and `@code-style/eslint-config-esmodule` after `@code-style/eslint-config-node`. [create-configs](../packages/create-configs/README.md) writes them in the right order.
- **To find where a rule's setting comes from**, run `npx eslint --inspect-config`. Each config is named after its package (eg: `@code-style/eslint-config/rule-sets/footguns`).
