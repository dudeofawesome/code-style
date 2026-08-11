import type { Linter } from 'eslint';

/**
 * `@code-style/eslint-config-cli` has no lenient relaxations today; this
 * export exists so consumers (and the create-configs scaffolder) can layer
 * `cli/lenient` uniformly with the other packages.
 */
const config: Linter.Config[] = [];

export default config;
