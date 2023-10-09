import { stringify } from 'yaml';

import { create_file } from './utils.js';
import { ProjectType, Language, Technology } from './types.js';

export async function create_eslint_config(
  project_type: ProjectType,
  languages: Language[],
  technologies: Technology[],
) {
  const config = {
    root: true,
    extends: ['@dudeofawesome'],
    parserOptions: 2022,
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

  await create_file('.eslintrc.yaml', stringify(config));
}
