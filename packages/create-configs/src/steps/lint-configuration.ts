import { stringify } from 'yaml';
import type { ESLint } from 'eslint';
import type { Config } from 'stylelint';
import { stripIndent } from 'common-tags';

import { create_file, prettify, verify_missing } from '../utils.js';
import { SetupOptions, Language } from '../types.js';

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
>): string {
  const config: ESLint.ConfigData & { extends: string[] } = {
    root: true,
    extends: ['@dudeofawesome/eslint-config'],
    parserOptions: {
      ecmaVersion: 2022,
    },
  };

  switch (project_type) {
    case 'web-app':
      if (technologies.includes('react')) {
        config.extends.push('@dudeofawesome/eslint-config-react');
      } else {
        config.extends.push('@dudeofawesome/eslint-config-browser');
      }
      break;
    case 'backend':
      if (technologies.includes('nestjs')) {
        config.extends.push('@dudeofawesome/eslint-config-nest');
      } else {
        config.extends.push('@dudeofawesome/eslint-config-node');
      }
      break;
    case 'cli':
      config.extends.push('@dudeofawesome/eslint-config-cli');
      break;
  }

  if (languages.includes('ts') && !technologies.includes('nestjs')) {
    config.extends.push('@dudeofawesome/eslint-config-typescript');
  }
  if (technologies.includes('jest')) {
    config.extends.push('@dudeofawesome/eslint-config-jest');
  }

  if (lenient) {
    for (const extended of config.extends) {
      if (
        [
          '@dudeofawesome/eslint-config',
          '@dudeofawesome/eslint-config-cli',
          '@dudeofawesome/eslint-config-jest',
          '@dudeofawesome/eslint-config-node',
          '@dudeofawesome/eslint-config-typescript',
        ].includes(extended)
      ) {
        config.extends.push(`${extended}/lenient.yaml`);
      }
    }
  }

  return stripIndent`
    # In order to update the this config, update:
${_generate_dependency_list(config)
  .map((p) => `#   ${p}`)
  .join('\n')}
${stringify(config)}
  `;
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
>) {
  const preferred = '.eslintrc.yaml';
  if (
    await verify_missing({
      path: [preferred, /^\.?eslint(rc|\.config)\.([mc]?js|ya?ml|json)$/u],
      remove: overwrite,
    })
  ) {
    return create_file(
      preferred,
      await prettify(
        preferred,
        _generate_eslint_config({
          project_type,
          languages,
          technologies,
          lenient,
        }),
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

export async function create_stylelint_config({
  languages,
  lenient,
  overwrite = true,
}: Pick<SetupOptions, 'languages' | 'lenient' | 'overwrite'>) {
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
    return create_file(
      preferred,
      await prettify(preferred, _generate_stylelint_config(languages)),
    );
  }
}
