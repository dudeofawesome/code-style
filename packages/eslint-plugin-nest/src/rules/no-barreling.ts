import { ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/dudeofawesome/code-style/blob/main/eslint-plugin-nest/README.md${name}`,
);

export const no_barreling = createRule({
  name: 'no-barreling',
  meta: {
    type: 'problem',
    hasSuggestions: true,
    docs: {
      description: `Barrel files should not exist as the Nest depency injection system can get confused by them.`,
    },
    messages: {
      not_allowed: 'Barrel files are not allowed',
      delete_export: 'Delete the `export *` declarations',
    },
    schema: [],
    defaultOptions: [],
  },
  create(context) {
    return {
      Program: (program) => {
        const barrel_exports = program.body.filter(
          (node) =>
            node.type === 'ExportAllDeclaration' && node.exportKind !== 'type',
        );
        if (barrel_exports[0] != null) {
          context.report({
            node: barrel_exports[0],
            messageId: 'not_allowed',
            suggest: [
              {
                messageId: 'delete_export',
                fix: (fixer) =>
                  barrel_exports.map((node) => fixer.remove(node)),
              },
            ],
          });
        }
      },
    };
  },
});
