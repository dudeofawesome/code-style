import { readFile } from 'node:fs/promises';
import { convertIgnorePatternToMinimatch } from '@eslint/config-helpers';
import chalk from 'chalk';
import type { Linter } from 'eslint';
import { parse, stringify } from 'yaml';
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

/** Config carried over from an existing eslintrc config. */
interface LegacyConfig {
  ignores: string[];
  configs: Linter.Config[];
}

/** @private */
export function _generate_eslint_config(
  {
    project_type,
    languages,
    technologies,
    lenient,
  }: Pick<
    SetupOptions,
    'project_type' | 'languages' | 'technologies' | 'lenient'
  >,
  legacy: LegacyConfig = { ignores: [], configs: [] },
): ConfigFile {
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

  // the config packages only peer-depend on eslint
  deps.d.depend('eslint');

  const source_packages = [...new Set(entries.map((entry) => entry.pkg))];

  const content = [
    `// In order to update the config, update:`,
    source_packages.map((pkg) => `//   ${pkg}`).join('\n'),
    legacy.ignores.length > 0
      ? `import { defineConfig, globalIgnores } from 'eslint/config';`
      : `import { defineConfig } from 'eslint/config';`,
    '',
    entries
      .map(
        (entry) =>
          `import { config as ${entry.alias} } from '${entry.pkg}${
            entry.subpath == null ? '' : `/${entry.subpath}`
          }';`,
      )
      .join('\n'),
    '',
    `export default defineConfig(${[
      ...(legacy.ignores.length > 0
        ? [`globalIgnores(${JSON.stringify(legacy.ignores)})`]
        : []),
      ...entries.map((entry) => entry.alias),
      ...legacy.configs.map((config) => JSON.stringify(config)),
    ].join(', ')});`,
  ].join('\n');

  return { content, dependencies: deps };
}

/** Top-level eslintrc keys whose values the generated config replaces. */
const replaced_eslintrc_keys = new Set(['root', 'extends', 'parserOptions']);

/** Converts an eslintrc `files` pattern (matched against basenames when it has no `/`). */
function convert_eslintrc_glob(pattern: string): string {
  return pattern.includes('/')
    ? pattern.replace(/^\.?\//u, '')
    : `**/${pattern}`;
}

/**
 * Converts the rules & ignores a project added to its eslintrc config into
 * flat config, so they survive replacing it.
 * @private
 */
export function _convert_legacy_eslint_config(
  eslintrc: Linter.LegacyConfig,
  eslintignore = '',
): LegacyConfig & { unmigrated: string[] } {
  const unmigrated = Object.keys(eslintrc).filter(
    (key) =>
      !replaced_eslintrc_keys.has(key) &&
      !['rules', 'ignorePatterns', 'overrides'].includes(key),
  );

  const ignores = [
    ...[eslintrc.ignorePatterns ?? []].flat(),
    ...eslintignore
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '' && !line.startsWith('#')),
  ].map((pattern) => convertIgnorePatternToMinimatch(pattern));

  const configs: Linter.Config[] = [];
  if (eslintrc.rules != null && Object.keys(eslintrc.rules).length > 0) {
    configs.push({ rules: eslintrc.rules });
  }
  for (const override of eslintrc.overrides ?? []) {
    const { files, excludedFiles, rules, ...rest } = override;
    unmigrated.push(...Object.keys(rest).map((key) => `overrides[].${key}`));
    if (rules == null) continue;
    configs.push({
      files: [files].flat().map(convert_eslintrc_glob),
      ...(excludedFiles != null
        ? { ignores: [excludedFiles].flat().map(convert_eslintrc_glob) }
        : {}),
      rules,
    });
  }

  return { ignores, configs, unmigrated };
}

async function read_legacy_eslint_config(): Promise<LegacyConfig> {
  const eslintrc = await Promise.any(
    ['.eslintrc', '.eslintrc.yaml', '.eslintrc.yml', '.eslintrc.json'].map(
      async (path) =>
        parse(await readFile(path, 'utf-8')) as Linter.LegacyConfig,
    ),
  ).catch(() => ({}));
  const eslintignore = await readFile('.eslintignore', 'utf-8').catch(() => '');

  const { unmigrated, ...legacy } = _convert_legacy_eslint_config(
    eslintrc,
    eslintignore,
  );
  if (unmigrated.length > 0) {
    console.warn(
      chalk.yellow(
        `Couldn't migrate these eslintrc settings, so add them to eslint.config.mjs by hand: ${unmigrated.join(', ')}`,
      ),
    );
  }
  return legacy;
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
  // read before the old config gets removed
  const legacy = await read_legacy_eslint_config();
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
    const config = _generate_eslint_config(
      { project_type, languages, technologies, lenient },
      legacy,
    );

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
