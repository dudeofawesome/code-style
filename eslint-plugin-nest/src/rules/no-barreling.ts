import { Rule } from 'eslint';
import { Program } from 'estree';

export const no_barreling: Rule.RuleModule = {
  meta: {
    type: 'problem',
    hasSuggestions: true,
  },
  create(context) {
    return {
      Program: (node: Program) => {
        if (
          node.body.find(
            (node) =>
              node.type !== 'ExportAllDeclaration' &&
              'exportKind' in node &&
              node.exportKind !== 'type',
          ) == null
        ) {
          console.log(node);
          debugger;
          context.report({
            node,
            message: `Barrel files are not allowed`,
            suggest: [
              {
                desc: 'Delete this export declaration',
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
};
