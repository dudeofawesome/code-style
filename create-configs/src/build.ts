import {
  create_js_config,
  create_ts_config,
} from './language-configuration.js';
import { create_editor_config, create_prettier_config } from './formatting.js';
import { create_eslint_config } from './lint-configuration.js';
import { install_dependencies } from './dependencies.js';
import { create_vscode_config } from './editor.js';
import {
  ProjectType,
  Language,
  Technology,
  Builder,
  Runtime,
} from './types.js';

export interface BuildOptions {
  project_type: ProjectType;
  languages: Language[];
  runtime?: Runtime;
  builder: Builder;
  input_dir?: string;
  output_dir?: string;
  technologies?: Technology[];
}
export async function build({
  project_type,
  languages,
  runtime,
  builder,
  input_dir = 'src/',
  output_dir = 'dist/',
  technologies = [],
}: BuildOptions) {
  await create_editor_config();
  await create_prettier_config();
  await create_vscode_config(project_type, languages, technologies);

  if (languages.includes('ts') || languages.includes('js')) {
    await create_ts_config(project_type, technologies, input_dir, output_dir);
    await create_eslint_config(project_type, languages, technologies);
    await install_dependencies({
      project_type,
      languages,
      technologies,
      builder,
    });
  }
}
