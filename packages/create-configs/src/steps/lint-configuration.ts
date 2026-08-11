import { stringify } from 'yaml';
import type { Config } from 'stylelint';
import {
  CodeStyleSetupOptions as SetupOptions,
  Language,
} from '@code-style/code-style/config-types';

import {
  ConfigFile,
  Dependencies,
  create_file,
  prettify,
  verify_missing,
  version as v,
} from '../utils.js';

interface EslintConfigEntry {
  /** package the config array comes from */
  pkg: string;
  /** subpath within the package */
  subpath?: 'lenient';
  /** identifier the import is bound to */
  alias: string;
}

/** @private */
export function _generate_eslint_config({
  project_type,
  languages,
  technologies,
  lenient,
}: Pick<
  SetupOptions,
  'project_type' | 'languages' | 'technologies' | 'lenient'
>): ConfigFile {
  const deps = new Dependencies();
  const entries: EslintConfigEntry[] = [];

  function add(pkg: string, alias: string, subpath?: 'lenient'): void {
    deps.d.depend(pkg, { v });
    entries.push({
      pkg,
      subpath,
      alias: subpath == null ? alias : `${alias}_${subpath}`,
    });
  }

  add('@code-style/eslint-config', 'base');
  if (lenient) add('@code-style/eslint-config', 'base', 'lenient');

  switch (project_type) {
    case 'web-app':
      add('@code-style/eslint-config-browser', 'browser');

      if (technologies.includes('react') || technologies.includes('nextjs')) {
        deps.p.add(['react', 'react-dom']);
        add('@code-style/eslint-config-react', 'react');
      }
      if (technologies.includes('nextjs')) {
        deps.p.add(['react', 'react-dom']);
        add('@code-style/eslint-config-nextjs', 'nextjs');
      }
      break;
    case 'backend':
      add('@code-style/eslint-config-node', 'node');
      if (lenient) add('@code-style/eslint-config-node', 'node', 'lenient');

      if (technologies.includes('nestjs')) {
        add('@code-style/eslint-config-nest', 'nest');
      }
      break;
    case 'cli':
      add('@code-style/eslint-config-node', 'node');
      if (lenient) add('@code-style/eslint-config-node', 'node', 'lenient');

      add('@code-style/eslint-config-cli', 'cli');
      if (lenient) add('@code-style/eslint-config-cli', 'cli', 'lenient');
      break;
  }

  if (languages.includes('ts')) {
    add('@code-style/eslint-config-typescript', 'typescript');
    if (lenient)
      add('@code-style/eslint-config-typescript', 'typescript', 'lenient');
  }

  if (technologies.includes('jest')) {
    add('@code-style/eslint-config-jest', 'jest');
    if (lenient) add('@code-style/eslint-config-jest', 'jest', 'lenient');
  }

  if (technologies.includes('esm'))
    add('@code-style/eslint-config-esmodule', 'esmodule');

  /**
   * The generated config imports `eslint/config`, and the `eslint` binary no
   * longer arrives transitively (it's a peer of the config packages), so it
   * must be a direct devDependency.
   */
  deps.d.depend('eslint');

  const source_packages = [...new Set(entries.map((entry) => entry.pkg))];

  const content = [
    `// In order to update the config, update:`,
    source_packages.map((pkg) => `//   ${pkg}`).join('\n'),
    `import { defineConfig } from 'eslint/config';`,
    '',
    entries
      .map(
        (entry) =>
          `import ${entry.alias} from '${entry.pkg}${
            entry.subpath == null ? '' : `/${entry.subpath}`
          }';`,
      )
      .join('\n'),
    '',
    `export default defineConfig(${entries
      .map((entry) => entry.alias)
      .join(', ')});`,
  ].join('\n');

  return { content, dependencies: deps };
}

export async function create_eslint_config({
  project_type,
  languages,
  technologies,
  lenient,
  overwrite,
}: Pick<
  SetupOptions,
  'project_type' | 'languages' | 'technologies' | 'lenient' | 'overwrite'
>): Promise<ConfigFile['dependencies'] | undefined> {
  const preferred = 'eslint.config.mjs';
  if (
    await verify_missing({
      path: [
        preferred,
        // legacy eslintrc files (unsupported by ESLint 10) and `.eslintignore`
        /^\.eslintrc(\.([cm]?js|ya?ml|json))?$/u,
        '.eslintignore',
        // other flat config filenames
        /^eslint\.config\.([cm]?[jt]s)$/u,
      ],
      remove: overwrite,
    })
  ) {
    const config = _generate_eslint_config({
      project_type,
      languages,
      technologies,
      lenient,
    });

    await create_file(preferred, await prettify(preferred, config.content));

    return config.dependencies;
  }
}

/** @private */
export function _generate_stylelint_config(languages: Language[]): ConfigFile {
  const deps = new Dependencies();
  const config: Omit<Config, 'extends'> & { extends: string[] } = {
    extends: [deps.d.depend('@code-style/stylelint-config', { v })],
  };

  if (languages.includes('scss')) {
    config.extends.push(
      deps.d.depend('@code-style/stylelint-config-scss', { v }),
    );
  }

  return {
    content: [
      `# In order to update the config, update ${config.extends.join(', ')}`,
      stringify(config),
    ].join('\n'),
    dependencies: deps,
  };
}

export async function create_stylelint_config({
  languages,
  lenient,
  overwrite,
}: Pick<SetupOptions, 'languages' | 'lenient' | 'overwrite'>): Promise<
  ConfigFile['dependencies'] | undefined
> {
  const preferred = '.stylelintrc.yaml';
  if (
    await verify_missing({
      path: [
        preferred,
        /^\.?stylelint(\.config|rc)(\.([cm]?js|json|ya?ml))?$/u,
      ],
      remove: overwrite,
    })
  ) {
    const config = _generate_stylelint_config(languages);

    await create_file(preferred, await prettify(preferred, config.content));
    return config.dependencies;
  }
}
