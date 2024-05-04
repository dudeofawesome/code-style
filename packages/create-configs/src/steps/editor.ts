import { mkdir, readFile } from 'node:fs/promises';
import json5 from 'json5';
import { stripIndent } from 'common-tags';
import { CodeStyleSetupOptions } from '@code-style/code-style/config-types';

import { create_file, prettify, verify_missing } from '../utils.js';

export interface LaunchJson {
  configurations?: LaunchConfiguration[];
}

export interface LaunchConfiguration {
  type: string;
  request: string;
  name: string;
  skipFiles?: string[];
  restart?: boolean;
  continueOnAttach?: boolean;
}

export type CreateVSCodeConfigOptions = Pick<
  CodeStyleSetupOptions,
  'project_type' | 'languages' | 'technologies' | 'output_dir' | 'overwrite'
>;

export async function create_vscode_config({
  project_type,
  languages,
  technologies,
  output_dir,
  overwrite = false,
}: CreateVSCodeConfigOptions) {
  await mkdir('.vscode/').catch(() => {});

  await Promise.allSettled([
    Promise.resolve('.vscode/settings.json')
      .then((path) =>
        verify_missing({ path, remove: false, reject: true }).then(() => path),
      )
      .then(async (path) =>
        create_file(
          path,
          await prettify(
            path,
            JSON.stringify({
              // bring in existing settings
              ...(await readFile(path)
                .catch(() => '{}')
                .then((buf) => buf.toString())
                .then((str) => json5.parse<Record<string, unknown>>(str))
                .catch(() => ({}) as Record<string, unknown>)),

              ...{
                'editor.formatOnSave': true,
                'editor.formatOnType': true,
                'editor.formatOnPaste': true,
                'editor.defaultFormatter': 'esbenp.prettier-vscode',
                'eslint.validate': [
                  'typescript',
                  'javascript',
                  'typescriptreact',
                  'javascriptreact',
                  'json',
                  'jsonc',
                ],

                'files.exclude': {
                  ...(output_dir != null
                    ? { [`**/${output_dir.replace(/\/$/u, '')}/`]: true }
                    : {}),
                  '**/coverage/': true,
                },
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
          overwrite,
        ),
      ),

    Promise.resolve('.vscode/extensions.json')
      .then((path) =>
        verify_missing({ path, remove: overwrite, reject: true }).then(
          () => path,
        ),
      )
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
      .then((path) =>
        verify_missing({ path, remove: false, reject: true }).then(() => path),
      )
      .then(async (path) => {
        // bring in existing settings
        const existing = await readFile(path)
          .catch(() => '{}')
          .then((buf) => buf.toString())
          .then((str) => json5.parse<LaunchJson>(str))
          .catch(() => ({}) as LaunchJson);

        function is_attach(cfg: LaunchConfiguration): boolean {
          return cfg.name === 'Attach';
        }

        return create_file(
          path,
          await prettify(
            path,
            stripIndent`
              // https://code.visualstudio.com/Docs/editor/debugging#_launch-configurations
              ${JSON.stringify({
                ...existing,
                configurations: [
                  ...(existing.configurations ?? []),
                  ...((languages.includes('js') || languages.includes('ts')) &&
                  ['backend', 'cli'].includes(project_type) &&
                  !existing.configurations?.some(is_attach)
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
              } as LaunchJson)}
            `,
          ),
          overwrite,
        );
      }),
  ]);
}
