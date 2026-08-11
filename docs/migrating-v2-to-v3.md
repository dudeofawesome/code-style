# Migrating from @code-style 2.x to 3.x

3.x is the ESLint 10 / flat config release. It replaces every `.eslintrc.*`
file with a single `eslint.config.mjs` and drops support for ESLint 8/9.

## Who this affects

Anyone depending on `@code-style/*` at `^2.0.0-N` — those repos use the
eslintrc-format configs on ESLint 8. Nothing forces you to move: the 2.x line
keeps working (frozen, no further releases), and `^2.0.0-35`-style ranges will
never resolve to 3.x.

## Requirements

- **Node `^20.19.0 || ^22.13.0 || >=24.0.0`** (ESLint 10's floor)
- **ESLint 10** — installed as a direct devDependency now

## The easy path: re-run the scaffolder

```sh
npx @code-style/create-configs@next
```

With `overwrite: true` it deletes your `.eslintrc.yaml` (and `.eslintignore`)
and writes `eslint.config.mjs`.

> **Warning:** any repo-local rule overrides living in your `.eslintrc.yaml`
> are deleted with it. Copy them out first, then port them into
> `eslint.config.mjs` as a trailing config object:
>
> ```js
> export default defineConfig(base, node, typescript, {
>   rules: { 'some-rule': 'off' },
> });
> ```

## Manual migration

1. Replace your `.eslintrc.yaml` with an `eslint.config.mjs` composing the
   same layers, in the same order:

    ```js
    import { defineConfig } from 'eslint/config';

    import base from '@code-style/eslint-config';
    import node from '@code-style/eslint-config-node';
    import typescript from '@code-style/eslint-config-typescript';
    import esmodule from '@code-style/eslint-config-esmodule';

    export default defineConfig(base, node, typescript, esmodule);
    ```

    Lenient variants are separate subpath imports layered after their base:
    `import node_lenient from '@code-style/eslint-config-node/lenient'`.

2. Delete `.eslintignore` if you have one (unsupported in flat config); move
   its patterns into your config:
   `defineConfig(globalIgnores(['generated/']), base, …)`.

3. Package changes:

    ```sh
    npm rm @rushstack/eslint-patch @types/eslint eslint-plugin-import \
      @typescript-eslint/eslint-plugin @typescript-eslint/parser
    npm i -D eslint @code-style/eslint-config@next # …and your other layers
    ```

4. Drop `--ext` from lint scripts — `eslint . --cache` is all you need (the
   configs' `files` globs cover `.ts`/`.tsx`/`.json` etc.).

5. Update engines/CI to the Node floor above.

## Rule & behavior changes to expect

Rule *content* was preserved, but the forced plugin major bumps change some
behavior:

- **ESLint 10 `eslint:recommended` additions**: `no-useless-assignment`,
  `no-unassigned-vars`, `preserve-caught-error`, `no-empty-static-block`,
  `no-unused-private-class-members`, core `no-loss-of-precision`.
- **typescript-eslint 8** (strict/stylistic-type-checked additions & renames):
  `ban-types` split into `no-empty-object-type` / `no-unsafe-function-type` /
  `no-wrapper-object-types`; `no-throw-literal` → `only-throw-error`;
  `no-var-requires` → `no-require-imports`; new `no-deprecated`,
  `no-misused-spread`, `no-unnecessary-type-parameters`,
  `no-unnecessary-type-conversion`, `related-getter-setter-pairs`, and more.
  `switch-exhaustiveness-check` is pinned to the v7 semantics (a `default`
  clause satisfies it).
- **eslint-plugin-import → import-x**: same `import/*` rule IDs (we register
  the plugin under the `import` namespace), slightly different resolver;
  TypeScript resolution now goes through `eslint-import-resolver-typescript`.
- **eslint-plugin-n 18**: `no-unpublished-bin` left the recommended set; the
  engine-version checks now follow your `engines.node`.
- **react/jsx-a11y/next**: recommended sets grew with their majors;
  react-hooks stays pinned to `rules-of-hooks` + `exhaustive-deps`.

## Troubleshooting

- **VS Code shows eslintrc errors**: update the ESLint extension
  (`dbaeumer.vscode-eslint` ≥3.0.10 auto-detects flat configs).
- **`Parsing error: "parserOptions.project" has been provided…`** on a config
  or script file: that file isn't covered by your `tsconfig.json`. Config
  files (`eslint.config.*`) are already exempted; for others, add them to a
  tsconfig or lint them without type information.
- **Monorepos**: ESLint 10 looks for the nearest `eslint.config.*` starting
  from each linted file's directory — nested configs now work naturally, and
  a nested config *fully replaces* the root one for its subtree.
- **`-react` / `-nextjs` on npm install**: `eslint-plugin-react` and
  `eslint-plugin-jsx-a11y` haven't added ESLint 10 to their peer ranges yet.
  Until they do, add to your `package.json`:

    ```json
    "overrides": {
      "eslint-plugin-react": { "eslint": "$eslint" },
      "eslint-plugin-jsx-a11y": { "eslint": "$eslint" }
    }
    ```
