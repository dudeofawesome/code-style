import { stringify } from 'yaml';
import type { ESLint } from 'eslint';
import type { Config } from 'stylelint';
import { stripIndent } from 'common-tags';

import { create_file, prettify, verify_missing } from './utils.js';
import { ProjectType, Language, Technology } from './types.js';

/** @private */
export function _transform_eslint_package_name(extend: string): string {
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
export function _generate_eslint_config(
  project_type: ProjectType,
  languages: Language[],
  technologies: Technology[],
): string {
  const config: ESLint.ConfigData & { extends: string[] } = {
    root: true,
    extends: ['@dudeofawesome'],
    parserOptions: {
      ecmaVersion: 2022,
    },
  };

  switch (project_type) {
    case 'web-app':
      if (technologies.includes('react')) {
        config.extends.push('@dudeofawesome/react');
      } else {
        config.extends.push('@dudeofawesome/browser');
      }
      break;
    case 'backend':
      config.extends.push('@dudeofawesome/node');
      break;
    case 'cli':
      config.extends.push('@dudeofawesome/cli');
      break;
  }

  if (languages.includes('ts')) {
    config.extends.push('@dudeofawesome/typescript');
  }
  if (technologies.includes('jest')) {
    config.extends.push('@dudeofawesome/jest');
  }

  return stripIndent`
    # In order to update the this config, update:
    ${_generate_dependency_list(config)
      .map((p) => `#   ${p}`)
      .join('\n')}
    ${stringify(config)}
  `;
}

export async function create_eslint_config(
  project_type: ProjectType,
  languages: Language[],
  technologies: Technology[],
  overwrite: boolean = true,
) {
  const path = '.eslintrc.yaml';
  if (await verify_missing({ path, remove: overwrite })) {
    return create_file(
      path,
      await prettify(
        path,
        _generate_eslint_config(project_type, languages, technologies),
      ),
    );
  }
}

/** @private */
export function _generate_stylelint_config(languages: Language[]): string {
  const config: Config = { extends: ['@dudeofawesome/stylelint-config'] };

  if (languages.includes('scss')) {
    config.extends = ['@dudeofawesome/stylelint-config-scss'];
  }

  return stripIndent`
    # In order to update the this config, update ${
      Array.isArray(config.extends) ? config.extends.join(', ') : config.extends
    }
    ${stringify(config)}
  `;
}

export async function create_stylelint_config(
  languages: Language[],
  overwrite: boolean = true,
) {
  const path = '.stylelintrc.yaml';
  if (await verify_missing({ path, remove: overwrite })) {
    return create_file(
      path,
      await prettify(path, _generate_stylelint_config(languages)),
    );
  }
}
