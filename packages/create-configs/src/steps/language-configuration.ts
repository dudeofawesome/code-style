import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { stripIndent } from 'common-tags';
import {
  ExcludeDefinition,
  IncludeDefinition,
  TSConfig as TSConfigFull,
} from '@json-types/tsconfig';
import { CodeStyleSetupOptions as SetupOptions } from '@code-style/code-style/config-types';

import { create_file, prettify, verify_missing } from '../utils.js';

export type TSConfig = Omit<TSConfigFull, 'extends'> & {
  extends: string[];
} & IncludeDefinition &
  ExcludeDefinition;

const exec = promisify(execCallback);

/** @private */
export function _generate_base_ts_config({
  project_type,
  technologies,
  library,
  input_dir,
  output_dir,
  lenient,
}: Omit<CreateTSConfigOptions, 'overwrite'>): string {
  const config: TSConfig = {
    extends: [],
    compilerOptions: {
      baseUrl: input_dir,
      outDir: output_dir,
    },
    include: ['./'],
    exclude: [output_dir],
  };

  switch (project_type) {
    case 'web-app':
      config.extends.push('@code-style/typescript-configs/roles/browser');
      if (technologies.includes('nextjs')) {
        config.extends.push('@code-style/typescript-configs/layers/nextjs');
      } else if (technologies.includes('react')) {
        config.extends.push('@code-style/typescript-configs/layers/react');
      }
      break;
    case 'backend':
    case 'cli':
      if (technologies.includes('nestjs')) {
        config.extends.push('@code-style/typescript-configs/roles/nest');
      } else {
        config.extends.push('@code-style/typescript-configs/roles/node');
      }
      break;
  }

  if (technologies.includes('esm')) {
    config.extends.push('@code-style/typescript-configs/layers/esmodule');
  }

  if (library) {
    config.extends.push('@code-style/typescript-configs/layers/library');
  }

  // TODO(2): add support for library.json tsconfig

  if (lenient) {
    config.extends.push('@code-style/typescript-configs/layers/lenient');
  }

  return stripIndent`
    // In order to update the this config, update @code-style/typescript-configs
    ${JSON.stringify(config, null, 2)}
  `;
}

/** @private */
export function _generate_build_ts_config({
  input_dir,
}: Pick<CreateTSConfigOptions, 'input_dir'>): string {
  const config: TSConfig = {
    extends: ['./tsconfig.json'],
    compilerOptions: {
      baseUrl: './',
    },
    include: [input_dir],
    exclude: ['**/*.spec.ts'],
  };

  return stripIndent`
    // In order to update the this config, update @code-style/typescript-configs
    ${JSON.stringify(config, null, 2)}
  `;
}

export type CreateTSConfigOptions = Required<
  Pick<
    SetupOptions,
    | 'project_type'
    | 'technologies'
    | 'library'
    | 'input_dir'
    | 'output_dir'
    | 'overwrite'
    | 'lenient'
  >
>;
export async function create_ts_config({
  project_type,
  technologies,
  library,
  input_dir,
  output_dir,
  overwrite = true,
  lenient,
}: CreateTSConfigOptions) {
  const base = 'tsconfig.json';
  const build = 'tsconfig.build.json';
  if (
    await verify_missing({
      path: [/tsconfig(\..+)?\.json/u],
      remove: overwrite,
    })
  ) {
    await Promise.all([
      create_file(
        base,
        await prettify(
          base,
          _generate_base_ts_config({
            project_type,
            technologies,
            library,
            input_dir,
            output_dir,
            lenient,
          }),
        ),
      ),
      create_file(
        build,
        await prettify(
          build,
          _generate_build_ts_config({
            input_dir,
          }),
        ),
      ),
    ]);
  }
}

export async function set_package_type({
  technologies,
  library,
  overwrite = true,
}: Pick<SetupOptions, 'technologies' | 'library' | 'overwrite'>) {
  if (overwrite || (await exec(`npm pkg get type`)).stdout === '{}') {
    const type: 'commonjs' | 'module' =
      technologies.includes('esm') &&
      !library &&
      !technologies.includes('nestjs')
        ? 'module'
        : 'commonjs';
    await exec(`npm pkg set type='${type}'`);
  } else {
    throw new Error(`package.json already has a type specified.`);
  }
}

/** @private */
export function _generate_jest_config({
  technologies,
}: Omit<CreateJestConfigOptions, 'overwrite'>): string {
  return stripIndent`
    import { config } from '@code-style/jest-configs/ts-${technologies.includes('esm') ? 'esm' : 'cjs'}';

    // eslint-disable-next-line import/no-default-export
    export default config;
  `;
}

export type CreateJestConfigOptions = Pick<
  SetupOptions,
  'languages' | 'technologies' | 'overwrite'
>;
export async function create_jest_config({
  languages,
  technologies,
  overwrite,
}: CreateJestConfigOptions) {
  if (languages.includes('ts')) {
    const path = 'jest.config.mjs';
    if (
      await verify_missing({
        path: [path, /^jest\.config\.(js|ts|mjs|cjs|json)$/u],
        remove: overwrite,
      })
    ) {
      await create_file(
        path,
        await prettify(
          path,
          _generate_jest_config({
            languages,
            technologies,
          }),
        ),
      );
    }
  }
}
