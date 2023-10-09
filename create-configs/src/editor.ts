import { mkdir } from 'node:fs/promises';
import { create_file } from './utils.js';
import { ProjectType, Language, Technology } from './types.js';

export async function create_vscode_config(
  project_type: ProjectType,
  languages: Language[],
  technologies: Technology[],
) {
  await mkdir('.vscode/');

  await Promise.all([
    create_file(
      '.vscode/settings.json',
      JSON.stringify(
        {
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
        },
        null,
        2,
      ),
    ),

    create_file(
      '.vscode/extensions.json',
      JSON.stringify(
        [
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

          ...(technologies.includes('jest') ? ['Orta.vscode-jest'] : []),
        ],
        null,
        2,
      ),
    ),

    create_file(
      '.vscode/launch.json',
      JSON.stringify(
        {
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
        },
        null,
        2,
      ),
    ),
  ]);
}
