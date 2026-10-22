# Migrating from v2 to v3

v3 replaces the `.eslintrc` configs with [flat configs](https://eslint.org/docs/latest/use/configure/configuration-files) for **ESLint 10**, which requires Node `^20.19.0 || ^22.13.0 || >=24`.

The easiest way to migrate is to re-run [create-configs](../packages/create-configs/README.md) with `overwrite` enabled. It replaces your `.eslintrc.yaml` with an `eslint.config.mjs`, so copy any rules you've added to your `.eslintrc.yaml` into the new config afterwards.

To migrate by hand:

1. Replace your `.eslintrc.yaml` with an `eslint.config.mjs` that layers the same configs in the same order.

    ```js
    import { defineConfig } from 'eslint/config';

    import { config as base } from '@code-style/eslint-config';
    import { config as node } from '@code-style/eslint-config-node';
    import { config as node_lenient } from '@code-style/eslint-config-node/lenient';

    export default defineConfig(base, node, node_lenient);
    ```

1. Move any `.eslintignore` patterns into `globalIgnores([...])` from `eslint/config`.
1. Install `eslint` as a dev dependency, and remove `@rushstack/eslint-patch`, `@types/eslint`, `eslint-plugin-import`, `@typescript-eslint/eslint-plugin`, and `@typescript-eslint/parser`.
1. Remove `--ext` from your `eslint` scripts.

`eslint-plugin-react` and `eslint-plugin-jsx-a11y` don't yet declare ESLint 10 support, so if you use `@code-style/eslint-config-react`, add the following to your `package.json`:

```json
"overrides": {
  "eslint-plugin-react": { "eslint": "$eslint" },
  "eslint-plugin-jsx-a11y": { "eslint": "$eslint" }
}
```
