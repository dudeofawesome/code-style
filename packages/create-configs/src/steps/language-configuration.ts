import { stripIndent } from 'common-tags';
import { CodeStyleSetupOptions as SetupOptions } from '@dudeofawesome/code-style/config-types';

import { create_file, prettify, verify_missing } from '../utils.js';

/** @private */
export function _generate_ts_config({
  project_type,
  technologies,
  library,
  input_dir,
  output_dir,
  lenient,
}: Omit<CreateTSConfigOptions, 'overwrite'>): string {
  const config = {
    extends: [] as string[],
    compilerOptions: {
      baseUrl: './',
      outDir: output_dir,
    },
    include: [input_dir],
    exclude: [output_dir],
  };

  switch (project_type) {
    case 'web-app':
      config.extends.push(
        '@dudeofawesome/typescript-configs/roles/browser.json',
      );
      if (technologies.includes('react')) {
        config.extends.push(
          '@dudeofawesome/typescript-configs/layers/react.json',
        );
      }
      break;
    case 'backend':
    case 'cli':
      if (technologies.includes('nestjs')) {
        config.extends.push(
          '@dudeofawesome/typescript-configs/roles/nest.json',
        );
      } else {
        config.extends.push(
          '@dudeofawesome/typescript-configs/roles/node.json',
        );
      }
      break;
  }

  if (technologies.includes('esm')) {
    config.extends.push(
      '@dudeofawesome/typescript-configs/layers/esmodule.json',
    );
  }

  if (library) {
    config.extends.push(
      '@dudeofawesome/typescript-configs/layers/library.json',
    );
  }

  // TODO(2): add support for library.json tsconfig

  if (lenient) {
    config.extends.push(
      '@dudeofawesome/typescript-configs/layers/lenient.json',
    );
  }

  return stripIndent`
    // In order to update the this config, update @dudeofawesome/typescript-configs
    ${JSON.stringify(config, null, 2)}
  `;
}

export type CreateTSConfigOptions = Pick<
  SetupOptions,
  | 'project_type'
  | 'technologies'
  | 'library'
  | 'input_dir'
  | 'output_dir'
  | 'overwrite'
  | 'lenient'
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
  // TODO(2): create a separate tsconfig for tests
  // if (technologies.includes('jest')) {
  //   config.extends.push('@dudeofawesome/typescript-configs/layers/jest.json');
  // }

  const path = 'tsconfig.json';
  if (await verify_missing({ path, remove: overwrite })) {
    await create_file(
      path,
      await prettify(
        path,
        _generate_ts_config({
          project_type,
          technologies,
          library,
          input_dir,
          output_dir,
          lenient,
        }),
      ),
    );
  }
}
