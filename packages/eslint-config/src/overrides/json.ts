import type { Linter, Rule } from 'eslint';
import jsonFiles from 'eslint-plugin-json-files';

/**
 * eslint-plugin-json-files@5 still calls rule-context methods that ESLint 10
 * removed (`context.getFilename()` and friends). Shim them onto the context
 * via the prototype chain until upstream ships an ESLint 10-compatible
 * release.
 * TODO: drop once eslint-plugin-json-files supports ESLint 10 natively.
 */
function shim_removed_context_methods(rule: Rule.RuleModule): Rule.RuleModule {
  return {
    ...rule,
    create: (context) =>
      rule.create(
        Object.create(context, {
          getFilename: { value: () => context.filename },
          getPhysicalFilename: { value: () => context.physicalFilename },
          getSourceCode: { value: () => context.sourceCode },
          getCwd: { value: () => context.cwd },
        }) as Rule.RuleContext,
      ),
  };
}

const patched_json_files: typeof jsonFiles = {
  ...jsonFiles,
  rules: Object.fromEntries(
    Object.entries(jsonFiles.rules ?? {}).map(([id, rule]) => [
      id,
      shim_removed_context_methods(rule),
    ]),
  ),
};

/**
 * ESLint 10's `--cache` requires processors to carry a `meta` object when
 * serializing the config; json-files@5's processor doesn't have one.
 */
const json_processor: Linter.Processor = {
  meta: { name: 'json-files/.json', version: '5' },
  ...jsonFiles.processors['.json'],
};

const config: Linter.Config[] = [
  {
    name: '@code-style/eslint-config/overrides/json',
    files: ['**/*.json'],
    plugins: { 'json-files': patched_json_files },
    processor: json_processor,
    rules: {
      // eslint-plugin-prettier breaks JSON linting (https://github.com/prettier/eslint-plugin-prettier/issues/570)
      'prettier/prettier': 'off',

      // Prevent having the same package in dependencies and devDependencies.
      'json-files/require-unique-dependency-names': 'error',

      // Require that specific ranges are specified in `package.json` `dependencies`.
      'json-files/restrict-ranges': [
        'error',
        {
          versionHint: 'caret',
          dependencyTypes: ['dependencies', 'devDependencies'],
        },
      ],

      // Require that `engines` are specified in `package.json`.
      'json-files/require-engines': 'error',

      /**
       * Require keys in package.json to be sorted, improving readability &
       * consistency across projects.
       */
      'json-files/sort-package-json': 'warn',
    },
  },
];

export default config;
