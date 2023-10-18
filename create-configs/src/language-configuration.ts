import { stripIndent } from 'common-tags';
import { create_file, verify_missing } from './utils.js';
import { ProjectType, Technology } from './types.js';

/** @private */
export function _generate_ts_config(
  project_type: ProjectType,
  technologies: Technology[],
  input_dir: string,
  output_dir: string,
): string {
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
      config.extends.push('@dudeofawesome/typescript-configs/browser.json');
      if (technologies.includes('react')) {
        config.extends.push('@dudeofawesome/typescript-configs/react.json');
      }
      break;
    case 'backend':
    case 'cli':
      config.extends.push('@dudeofawesome/typescript-configs/node.json');
      break;
  }

  if (technologies.includes('nestjs')) {
    config.extends.splice(
      config.extends.indexOf('@dudeofawesome/typescript-configs/node.json'),
    );
    config.extends.push('@dudeofawesome/typescript-configs/nest.json');
  }

  // TODO(2): add support for library.json tsconfig

  return stripIndent`
    // In order to update the this config, update @dudeofawesome/typescript-configs
    ${JSON.stringify(config, null, 2)}
  `;
}

export async function create_ts_config(
  project_type: ProjectType,
  technologies: Technology[],
  input_dir: string,
  output_dir: string,
  overwrite: boolean = true,
) {
  // TODO(2): create a separate tsconfig for tests
  // if (technologies.includes('jest')) {
  //   config.extends.push('@dudeofawesome/typescript-configs/jest.json');
  // }

  const path = 'tsconfig.json';
  if (await verify_missing(path, overwrite)) {
    await create_file(
      path,
      _generate_ts_config(project_type, technologies, input_dir, output_dir),
    );
  }
}

/** @private */
export function _generate_js_config(
  project_type: ProjectType,
  technologies: Technology[],
  input_dir: string,
  output_dir: string,
): string {
  const config = {
    extends: [] as string[],
    compilerOptions: {
      baseUrl: input_dir,
      outDir: output_dir,
    },
    include: [input_dir],
    exclude: [output_dir],
  };

  switch (project_type) {
    case 'web-app':
      config.extends.push('@dudeofawesome/javascript-configs/browser.json');
      if (technologies.includes('react')) {
        config.extends.push('@dudeofawesome/javascript-configs/react.json');
      }
      break;
    case 'backend':
    case 'cli':
      config.extends.push('@dudeofawesome/javascript-configs/base.json');
      break;
  }

  return stripIndent`
    // In order to update the this config, update @dudeofawesome/javascript-configs
    ${JSON.stringify(config, null, 2)}
  `;
}

export async function create_js_config(
  project_type: ProjectType,
  technologies: Technology[],
  input_dir: string,
  output_dir: string,
  overwrite: boolean = true,
) {
  // TODO(2): create a separate jsconfig for tests
  // if (technologies.includes('jest')) {
  //   config.extends.push('@dudeofawesome/javascript-configs/jest.json');
  // }

  const path = 'jsconfig.json';
  if (await verify_missing(path, overwrite)) {
    await create_file(
      path,
      _generate_js_config(project_type, technologies, input_dir, output_dir),
    );
  }
}
