import type { ESLint, Rule } from 'eslint';

/**
 * Several React-ecosystem plugins still call rule-context methods that
 * ESLint 10 removed (`context.getFilename()` and friends). Shim them onto
 * the context via the prototype chain until upstream ships ESLint
 * 10-compatible releases.
 * TODO: drop once eslint-plugin-react / eslint-plugin-jsx-a11y support
 * ESLint 10 natively (their peer ranges still cap at ESLint 9).
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

export function patch_plugin_for_eslint_10<P extends ESLint.Plugin>(
  plugin: P,
): P {
  return {
    ...plugin,
    rules: Object.fromEntries(
      Object.entries(plugin.rules ?? {}).map(([id, rule]) => [
        id,
        shim_removed_context_methods(rule as Rule.RuleModule),
      ]),
    ),
  };
}
