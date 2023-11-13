import { Rule } from 'eslint';
import { Program } from 'estree';

export function disable_barreling(context: Rule.RuleContext) {
  return {
    Program: (node: Program) => {
      if (
        node.body.find((node) => node.type !== 'ExportAllDeclaration') == null
      ) {
        context.report({
          node,
          message: `Barrel files are not allowed.`,
        });
      }
    },
  };
}
