/**
 * Ambient type stubs for plugins that don't ship their own type
 * declarations.
 */

declare module '@next/eslint-plugin-next' {
  import type { ESLint, Linter } from 'eslint';

  const plugin: ESLint.Plugin & {
    configs: {
      recommended: Linter.Config;
      'core-web-vitals': Linter.Config;
      'recommended-legacy': Linter.LegacyConfig;
      'core-web-vitals-legacy': Linter.LegacyConfig;
    };
  };
  export default plugin;
}
