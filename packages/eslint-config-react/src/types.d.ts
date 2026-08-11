/**
 * Ambient type stubs for plugins that don't ship their own type
 * declarations.
 */

declare module 'eslint-plugin-jsx-a11y' {
  import type { ESLint, Linter } from 'eslint';

  const plugin: ESLint.Plugin & {
    flatConfigs: { recommended: Linter.Config; strict: Linter.Config };
  };
  export default plugin;
}
