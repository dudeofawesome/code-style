import { stringify } from 'yaml';
import type { ESLint } from 'eslint';
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
} from '../utils.js';

/** @private */
export function _transform_eslint_package_name(extend: string): string {
  if (extend.includes('eslint-config')) return extend;

  if (extend.startsWith('@')) {
    return extend
      .replace(/^(@[^/]+)\/(\S+)$/iu, '$1/eslint-config-$2')
      .replace(/^(@[^/]+)$/iu, '$1/eslint-config');
  } else {
    return extend.replace(/^([^@/]+)$/iu, 'eslint-config-$1');
  }
}

/** @private */
export function _generate_dependency_list(config: ESLint.ConfigData): string[] {
  if (Array.isArray(config.extends)) {
    return config.extends.map(_transform_eslint_package_name);
  } else if (typeof config.extends === 'string') {
    return [_transform_eslint_package_name(config.extends)];
  } else {
    return [];
  }
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
  const config: ESLint.ConfigData & { extends: string[] } = {
    root: true,
    extends: [deps.d.depend('@code-style/eslint-config', { v: 'latest' })],
    parserOptions: {
      ecmaVersion: 2022,
    },
  };
  if (lenient)
    config.extends.push(
      `${deps.d.depend('@code-style/eslint-config', { v: 'latest' })}/lenient`,
    );

  switch (project_type) {
    case 'web-app':
      config.extends.push(
        deps.d.depend('@code-style/eslint-config-browser', { v: 'latest' }),
      );

      if (technologies.includes('react') || technologies.includes('nextjs')) {
        deps.p.add(['react', 'react-dom']);
        config.extends.push(
          deps.d.depend('@code-style/eslint-config-react', { v: 'latest' }),
        );
      }
      if (technologies.includes('nextjs')) {
        deps.p.add(['react', 'react-dom']);
        config.extends.push(
          deps.d.depend('@code-style/eslint-config-nextjs', { v: 'latest' }),
        );
      }
      break;
    case 'backend':
      config.extends.push(
        deps.d.depend('@code-style/eslint-config-node', { v: 'latest' }),
      );
      if (lenient)
        config.extends.push(
          `${deps.d.depend('@code-style/eslint-config-node', { v: 'latest' })}/lenient`,
        );

      if (technologies.includes('nestjs')) {
        config.extends.push(
          deps.d.depend('@code-style/eslint-config-nest', { v: 'latest' }),
        );
      }
      break;
    case 'cli':
      config.extends.push(
        deps.d.depend('@code-style/eslint-config-node', { v: 'latest' }),
      );
      if (lenient)
        config.extends.push(
          `${deps.d.depend('@code-style/eslint-config-node', { v: 'latest' })}/lenient`,
        );

      config.extends.push(
        deps.d.depend('@code-style/eslint-config-cli', { v: 'latest' }),
      );
      if (lenient)
        config.extends.push(
          `${deps.d.depend('@code-style/eslint-config-cli', { v: 'latest' })}/lenient`,
        );
      break;
  }

  if (languages.includes('ts')) {
    config.extends.push(
      deps.d.depend('@code-style/eslint-config-typescript', { v: 'latest' }),
    );
    if (lenient)
      config.extends.push(
        `${deps.d.depend('@code-style/eslint-config-typescript', { v: 'latest' })}/lenient`,
      );
  }

  if (technologies.includes('jest')) {
    config.extends.push(
      deps.d.depend('@code-style/eslint-config-jest', { v: 'latest' }),
    );
    if (lenient)
      config.extends.push(
        `${deps.d.depend('@code-style/eslint-config-jest', { v: 'latest' })}/lenient`,
      );
  }

  if (technologies.includes('esm'))
    config.extends.push(
      deps.d.depend('@code-style/eslint-config-esmodule', { v: 'latest' }),
    );

  return {
    content: [
      `# In order to update the this config, update:`,
      _generate_dependency_list(config)
        .map((p) => `#   ${p}`)
        .join('\n'),
      stringify(config),
    ].join('\n'),
    dependencies: deps,
  };
}

export async function create_eslint_config({
  project_type,
  languages,
  technologies,
  lenient,
  overwrite = true,
}: Pick<
  SetupOptions,
  'project_type' | 'languages' | 'technologies' | 'lenient' | 'overwrite'
>): Promise<ConfigFile['dependencies'] | undefined> {
  const preferred = '.eslintrc.yaml';
  if (
    await verify_missing({
      path: [preferred, /^\.?eslint(rc|\.config)\.([mc]?js|ya?ml|json)$/u],
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
    extends: [deps.d.depend('@code-style/stylelint-config', { v: 'latest' })],
  };

  if (languages.includes('scss')) {
    config.extends.push(
      deps.d.depend('@code-style/stylelint-config-scss', { v: 'latest' }),
    );
  }

  return {
    content: [
      `# In order to update the this config, update ${config.extends.join(', ')}`,
      stringify(config),
    ].join('\n'),
    dependencies: deps,
  };
}

export async function create_stylelint_config({
  languages,
  lenient,
  overwrite = true,
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
