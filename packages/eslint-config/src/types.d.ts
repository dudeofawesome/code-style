/**
 * Ambient type stubs for plugins that don't ship their own type
 * declarations.
 */

declare module 'eslint-plugin-promise' {
  import type { ESLint, Linter } from 'eslint';

  const plugin: ESLint.Plugin & {
    configs: { 'flat/recommended': Linter.Config };
  };
  // eslint-disable-next-line import/no-default-export
  export default plugin;
}

declare module '@eslint-community/eslint-plugin-eslint-comments/configs' {
  import type { Linter } from 'eslint';

  export const recommended: Linter.Config;
}

declare module 'eslint-plugin-json-files' {
  import type { ESLint, Linter } from 'eslint';

  const plugin: ESLint.Plugin & {
    processors: Record<'.json', Linter.Processor>;
  };
  // eslint-disable-next-line import/no-default-export
  export default plugin;
}
