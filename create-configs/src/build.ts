import {
  create_js_config,
  create_ts_config,
} from './language-configuration.js';
import { create_editor_config, create_prettier_config } from './formatting.js';
import {
  create_eslint_config,
  create_stylelint_config,
} from './lint-configuration.js';
import { install_dependencies } from './dependencies.js';
import { create_vscode_config } from './editor.js';
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
  technologies?: Technology[];
}
export async function build(
  {
    project_type,
    languages,
    runtime,
    builder,
    input_dir = 'src/',
    output_dir = 'dist/',
    technologies = [],
  }: BuildOptions,
  overwrite: boolean = false,
) {
  await Promise.all([
    create_editor_config(overwrite),
    create_prettier_config(overwrite),
  ]);

  await Promise.all(
    [
      create_vscode_config(project_type, languages, technologies, overwrite),

      languages.includes('css') || languages.includes('scss')
        ? await create_stylelint_config(languages, overwrite)
        : null,

      languages.includes('ts')
        ? await create_ts_config(
            project_type,
            technologies,
            input_dir,
            output_dir,
            overwrite,
          )
        : null,

      languages.includes('js') && !languages.includes('ts')
        ? await create_js_config(
            project_type,
            technologies,
            input_dir,
            output_dir,
            overwrite,
          )
        : null,

      includes_js(languages)
        ? [
            await create_eslint_config(
              project_type,
              languages,
              technologies,
              overwrite,
            ),
            await install_dependencies({
              project_type,
              languages,
              technologies,
              runtime,
              builder,
            })
              /**
               * Make sure that we're not trying to modify package.json at the
               * same time as NPM.
               */
              .then(async () =>
                add_npm_scripts({
                  languages,
                  technologies,
                  runtime,
                  builder,
                  overwrite,
                }),
              ),
          ]
        : null,
    ]
      .filter(Boolean)
      .flat(),
  );
}
