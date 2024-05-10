import { CodeStyleSetupOptions as SetupOptions } from '@code-style/code-style/config-types';
import {
  create_jest_config,
  create_ts_config,
  set_package_type,
} from './steps/language-configuration.js';
import {
  create_editor_config,
  create_prettier_config,
} from './steps/formatting.js';
import {
  create_eslint_config,
  create_stylelint_config,
} from './steps/lint-configuration.js';
import {
  install_dependencies,
  uninstall_duplicate_dependencies,
} from './steps/dependencies.js';
import { create_vscode_config } from './steps/editor.js';
import { create_gitignore } from './steps/git.js';
import { Dependencies, includes_js } from './utils.js';
import { add_npm_scripts } from './steps/scripts.js';

export async function build({
  project_type,
  languages,
  runtime,
  builder,
  input_dir = 'src',
  output_dir = 'dist',
  technologies = [],
  library = false,
  lenient = false,
  overwrite = false,
}: SetupOptions) {
  const options: Required<SetupOptions> = {
    project_type,
    languages,
    runtime,
    builder,
    input_dir,
    output_dir,
    technologies,
    library,
    lenient,
    overwrite,
  };

  const deps = new Dependencies();

  await uninstall_duplicate_dependencies(options);

  await Promise.all([
    create_editor_config(overwrite).then(merge_deps(deps)),
    create_prettier_config(overwrite).then(merge_deps(deps)),
  ]);

  await Promise.all(
    [
      technologies.includes('vs-code')
        ? create_vscode_config(options).then(merge_deps(deps))
        : null,

      create_gitignore(options),

      languages.includes('css') || languages.includes('scss')
        ? create_stylelint_config(options).then(merge_deps(deps))
        : null,

      includes_js(languages)
        ? [
            set_package_type(options),
            create_ts_config(options).then(merge_deps(deps)),
            create_eslint_config(options).then(merge_deps(deps)),
            add_npm_scripts(options).then(merge_deps(deps)),
          ]
        : null,

      includes_js(languages) && technologies.includes('jest')
        ? create_jest_config(options).then(merge_deps(deps))
        : null,
    ]
      .filter(Boolean)
      .flat(),
  );

  await install_dependencies({ dependencies: deps, runtime });
}

function merge_deps(
  parent: Dependencies,
): (child: Dependencies | undefined) => Dependencies {
  return (child) => {
    if (child != null) {
      parent.add(child);
    }

    return parent;
  };
}
