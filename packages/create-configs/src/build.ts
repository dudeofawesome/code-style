import { create_ts_config } from './language-configuration.js';
import { create_editor_config, create_prettier_config } from './formatting.js';
import {
  create_eslint_config,
  create_stylelint_config,
} from './lint-configuration.js';
import {
  install_dependencies,
  uninstall_duplicate_dependencies,
} from './dependencies.js';
import { create_vscode_config } from './editor.js';
import { create_gitignore } from './git.js';
import {
  ProjectType,
  Language,
  Technology,
  Builder,
  Runtime,
} from './types.js';
import { includes_js } from './utils.js';
import { add_npm_scripts } from './scripts.js';

export interface BuildOptions {
  project_type: ProjectType;
  languages: Language[];
  runtime?: Runtime;
  builder: Builder;
  input_dir?: string;
  output_dir?: string;
  technologies: Technology[];
  lenient: boolean;
  overwrite: boolean;
}
export async function build({
  project_type,
  languages,
  runtime,
  builder,
  input_dir = 'src/',
  output_dir = 'dist/',
  technologies = [],
  lenient = false,
  overwrite = false,
}: BuildOptions) {
  await uninstall_duplicate_dependencies({ runtime });
  await Promise.all([
    create_editor_config(overwrite),
    create_prettier_config(overwrite),
    includes_js(languages)
      ? [
          await install_dependencies({
            project_type,
            languages,
            technologies,
            runtime,
            builder,
          }),
        ]
      : null,
  ]);

  await Promise.all(
    [
      technologies.includes('vs-code')
        ? create_vscode_config(project_type, languages, technologies, overwrite)
        : null,

      create_gitignore({ languages, technologies, project_type, output_dir }),

      languages.includes('css') || languages.includes('scss')
        ? await create_stylelint_config({ languages, lenient, overwrite })
        : null,

      languages.includes('ts') || languages.includes('js')
        ? await create_ts_config({
            project_type,
            technologies,
            input_dir,
            output_dir,
            overwrite,
            lenient,
          })
        : null,

      includes_js(languages)
        ? [
            await create_eslint_config({
              project_type,
              languages,
              technologies,
              lenient,
              overwrite,
            }),
            add_npm_scripts({
              languages,
              technologies,
              runtime,
              builder,
              overwrite,
            }),
          ]
        : null,
    ]
      .filter(Boolean)
      .flat(),
  );
}