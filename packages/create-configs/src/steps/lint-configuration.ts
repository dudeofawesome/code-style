import { stringify } from 'yaml';
import type { ESLint } from 'eslint';
import type { Config } from 'stylelint';
import { stripIndent } from 'common-tags';
import {
  CodeStyleSetupOptions as SetupOptions,
  Language,
} from '@code-style/code-style/config-types';

import { create_file, prettify, verify_missing } from '../utils.js';

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
    extends: ['@code-style/eslint-config'],
    parserOptions: {
      ecmaVersion: 2022,
    },
  };
  if (lenient) config.extends.push('@code-style/eslint-config/lenient');

  switch (project_type) {
    case 'web-app':
      config.extends.push('@code-style/eslint-config-browser');

      if (technologies.includes('react') || technologies.includes('nextjs'))
        config.extends.push('@code-style/eslint-config-react');
      if (technologies.includes('nextjs'))
        config.extends.push('@code-style/eslint-config-nextjs');
      break;
    case 'backend':
      config.extends.push('@code-style/eslint-config-node');
      if (lenient)
        config.extends.push('@code-style/eslint-config-node/lenient');

      if (technologies.includes('nestjs')) {
        config.extends.push('@code-style/eslint-config-nest');
      }
      break;
    case 'cli':
      config.extends.push('@code-style/eslint-config-node');
      if (lenient)
        config.extends.push('@code-style/eslint-config-node/lenient');

      config.extends.push('@code-style/eslint-config-cli');
      if (lenient) config.extends.push('@code-style/eslint-config-cli/lenient');
      break;
  }

  if (languages.includes('ts')) {
    config.extends.push('@code-style/eslint-config-typescript');
    if (lenient)
      config.extends.push('@code-style/eslint-config-typescript/lenient');
  }

  if (technologies.includes('jest')) {
    config.extends.push('@code-style/eslint-config-jest');
    if (lenient) config.extends.push('@code-style/eslint-config-jest/lenient');
  }

  if (technologies.includes('esm'))
    config.extends.push('@code-style/eslint-config-esmodule');

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
  const config: Config & { extends: string[] } = {
    extends: ['@code-style/stylelint-config'],
  };

  if (languages.includes('scss')) {
    config.extends.push('@code-style/stylelint-config-scss');
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
