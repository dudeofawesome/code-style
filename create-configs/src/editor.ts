import { mkdir } from 'node:fs/promises';
import { stripIndent } from 'common-tags';
import { create_file, prettify, verify_missing } from './utils.js';
import { ProjectType, Language, Technology } from './types.js';

export async function create_vscode_config(
  project_type: ProjectType,
  languages: Language[],
  technologies: Technology[],
  overwrite: boolean = false,
) {
  await mkdir('.vscode/').catch(() => {});

  await Promise.all([
    Promise.resolve('.vscode/settings.json')
      .then((path) => verify_missing(path, overwrite, true).then(() => path))
      .then(async (path) =>
        create_file(
          path,
          await prettify(
            path,
            JSON.stringify({
              ...{
                'editor.formatOnSave': true,
                'editor.formatOnType': true,
                'editor.formatOnPaste': true,
                'editor.defaultFormatter': 'esbenp.prettier-vscode',
              },

              ...(languages.includes('js') || languages.includes('ts')
                ? {
                    'typescript.format.enable': false,
                    'javascript.format.enable': false,

                    'typescript.tsdk': './node_modules/typescript/lib',
                  }
                : {}),
              ...(languages.includes('rb')
                ? {
                    '[ruby]': {
                      'editor.defaultFormatter': 'esbenp.prettier-vscode',
                    },
                  }
                : {}),
            }),
          ),
        ),
      ),

    Promise.resolve('.vscode/extensions.json')
      .then((path) => verify_missing(path, overwrite, true).then(() => path))
      .then(async (path) =>
        create_file(
          path,
          await prettify(
            path,
            stripIndent`
              // A list of recommended extensions for this workspace.
              ${JSON.stringify({
              recommendations: [
                ...['editorconfig.editorconfig', 'esbenp.prettier-vscode'],

                ...(languages.includes('js') || languages.includes('ts')
                  ? ['dbaeumer.vscode-eslint']
                  : []),
                ...(languages.includes('rb')
                  ? ['Shopify.ruby-lsp', 'castwide.solargraph']
                  : []),
                ...(languages.includes('py')
                  ? [
                      'ms-python.black-formatter',
                      'ms-python.python',
                      'ms-python.vscode-pylance',
                    ]
                  : []),
                ...(languages.includes('css') || languages.includes('scss')
                  ? ['stylelint.vscode-stylelint']
                  : []),

                  ...(technologies.includes('jest')
                    ? ['Orta.vscode-jest']
                    : []),
              ],
              })}
            `,
          ),
        ),
      ),

    Promise.resolve('.vscode/launch.json')
      .then((path) => verify_missing(path, overwrite, true).then(() => path))
      .then(async (path) =>
        create_file(
          path,
          await prettify(
            path,
            stripIndent`
              // https://code.visualstudio.com/Docs/editor/debugging#_launch-configurations
              ${JSON.stringify({
              configurations: [
                ...((languages.includes('js') || languages.includes('ts')) &&
                ['backend', 'cli'].includes(project_type)
                  ? [
                      {
                        type: 'node',
                        request: 'attach',
                        name: 'Attach',
                        skipFiles: ['<node_internals>/**'],
                        restart: true,
                        continueOnAttach: true,
                      },
                    ]
                  : []),
              ],
              })}
            `,
          ),
        ),
      ),
  ]);
}
