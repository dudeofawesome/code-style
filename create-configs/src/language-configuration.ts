import { create_file } from './utils.js';
import { ProjectType, Technology } from './types.js';

export async function create_ts_config(
  project_type: ProjectType,
  technologies: Technology[],
  input_dir: string,
  output_dir: string,
) {
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

  // TODO(2): create a separate tsconfig for tests
  // if (technologies.includes('jest')) {
  //   config.extends.push('@dudeofawesome/typescript-configs/jest.json');
  // }

  await create_file('tsconfig.json', JSON.stringify(config, null, 2));
}

export async function create_js_config(
  project_type: ProjectType,
  technologies: Technology[],
  input_dir: string,
  output_dir: string,
) {
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

  // TODO(2): create a separate tsconfig for tests
  // if (technologies.includes('jest')) {
  //   config.extends.push('@dudeofawesome/typescript-configs/jest.json');
  // }

  await create_file('jsconfig.json', JSON.stringify(config, null, 2));
}
