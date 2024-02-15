import { stripIndent } from 'common-tags';
import { create_file, prettify, verify_missing } from './utils.js';
import { BuildOptions } from './build.js';

/** @private */
export function _generate_ts_config({
  project_type,
  technologies,
  input_dir,
  output_dir,
  lenient,
}: Pick<
  BuildOptions,
  'project_type' | 'technologies' | 'input_dir' | 'output_dir' | 'lenient'
>): string {
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

export async function create_ts_config({
  project_type,
  technologies,
  input_dir,
  output_dir,
  overwrite = true,
  lenient,
}: Pick<
  BuildOptions,
  | 'project_type'
  | 'technologies'
  | 'input_dir'
  | 'output_dir'
  | 'overwrite'
  | 'lenient'
>) {
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
          input_dir,
          output_dir,
          lenient,
        }),
      ),
    );
  }
}
