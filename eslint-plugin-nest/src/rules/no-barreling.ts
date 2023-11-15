import { ESLintUtils } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/types';

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/dudeofawesome/code-style/blob/main/eslint-plugin-nest/README.md${name}`,
);

export const no_barreling = createRule({
  name: 'no-barreling',
  defaultOptions: [],
  meta: {
    type: 'problem',
    hasSuggestions: true,
    docs: {
      description: `Barrel files should not exist as the Nest depency injection system can get confused by them.`,
    },
    messages: {
      not_allowed: 'Barrel files are not allowed',
      delete_export: 'Delete this export declaration',
    },
    schema: [],
  },
  create(context) {
    return {
      Program: (node) => {
        if (
          node.body.find(
            (node) =>
              node.type === 'ExportAllDeclaration' &&
              node.exportKind !== 'type',
          ) != null
        ) {
          context.report({
            node,
            messageId: 'not_allowed',
            suggest: [
              {
                messageId: 'delete_export',
                fix(fixer) {
                  return fixer.remove(node);
                },
              },
            ],
          });
        }
      },
    };
  },
});
