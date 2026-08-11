# ESLint flat config migration — status

**Done.** As of v3, every `@code-style/eslint-config*` package is a native
[flat config](https://eslint.org/docs/latest/use/configure/configuration-files)
targeting **ESLint 10**. The eslintrc format is not supported by ESLint 10 (or
by these packages) anymore.

| Release line | Config format | ESLint | Status |
| --- | --- | --- | --- |
| 2.x (`2.0.0-N`) | `.eslintrc.*` | ^8.49 | frozen — no further releases planned |
| 3.x | flat (`eslint.config.mjs`) | ^10 | active |

Consumers migrating from 2.x: see [migrating-v2-to-v3.md](./migrating-v2-to-v3.md).

## Historical blockers (all since resolved upstream)

- [x] eslint-plugin-import — replaced with `eslint-plugin-import-x`
      (registered under the `import` namespace, so rule IDs are unchanged)
- [x] eslint-plugin-json-files — works as a rule bag + explicit processor
      (with a small ESLint 10 context shim; see
      `packages/eslint-config/src/overrides/json.ts`)
- [x] eslint-plugin-prettier
- [x] eslint-plugin-promise — v7
- [x] eslint-plugin-jest — v29
- [x] eslint-plugin-n — v18
- [x] eslint-plugin-jsx-a11y — flat configs shipped in 6.10 (ESLint 10
      support still pending upstream; we shim the removed context methods)
- [x] eslint-plugin-react — flat configs shipped in 7.35+ (ESLint 10 support
      still pending upstream; we shim the removed context methods)
- [x] eslint-plugin-react-hooks — v7 (we pin the classic rule pair; adopting
      the React Compiler rules is a deliberate future change)
- [x] @typescript-eslint/\* — v8 via the `typescript-eslint` meta-package
- [x] @eslint-community/eslint-plugin-eslint-comments — `/configs` subpath
