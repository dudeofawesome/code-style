/**
 * Ambient type stubs for plugins that don't ship their own type
 * declarations.
 */

declare module '@next/eslint-plugin-next' {
  import type { ESLint, Linter } from 'eslint';

  const plugin: ESLint.Plugin & {
    configs: { recommended: Linter.Config };
  };
  // eslint-disable-next-line import/no-default-export
  export default plugin;
}
