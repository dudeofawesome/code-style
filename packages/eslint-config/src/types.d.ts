/**
 * Ambient type stubs for plugins that don't ship their own type
 * declarations.
 */

declare module 'eslint-plugin-promise' {
  import type { ESLint, Linter } from 'eslint';
  const plugin: ESLint.Plugin & {
    configs: { recommended: Linter.LegacyConfig; 'flat/recommended': Linter.Config };
  };
  export default plugin;
}

declare module '@eslint-community/eslint-plugin-eslint-comments/configs' {
  import type { Linter } from 'eslint';
  const configs: { recommended: Linter.Config };
  export default configs;
}

declare module 'eslint-plugin-json-files' {
  import type { ESLint, Linter } from 'eslint';
  const plugin: ESLint.Plugin & {
    processors: Record<'.json' | 'json', Linter.Processor>;
  };
  export default plugin;
}
