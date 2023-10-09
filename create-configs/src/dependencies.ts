import { log, error } from 'node:console';
import { exec } from 'node:child_process';

import {
  ProjectType,
  Language,
  Technology,
} from './types.js';

export type InstallDependenciesOptions = {
  project_type: ProjectType;
  languages: Language[];
  technologies: Technology[];
};
export async function install_dependencies({
  project_type,
  languages,
  technologies,
  builder,
  runtime,
}: InstallDependenciesOptions) {
  const prod_packages: string[] = [];
  const dev_packages: string[] = [
    '@dudeofawesome/code-style',
    '@dudeofawesome/eslint-config',
  ];

  switch (project_type) {
    case 'web-app':
      if (technologies.includes('react')) {
        dev_packages.push('@dudeofawesome/eslint-config-react');
      } else {
        dev_packages.push('@dudeofawesome/eslint-config-browser');
      }
      break;
    case 'backend':
      if (languages.includes('ts')) dev_packages.push('@types/node');
      dev_packages.push('@dudeofawesome/eslint-config-node');
      break;
    case 'cli':
      if (languages.includes('ts')) dev_packages.push('@types/node');
      dev_packages.push('@dudeofawesome/eslint-config-cli');
      break;
  }

  for (const language of languages) {
    switch (language) {
      case 'ts':
        dev_packages.push(
          'typescript',
          '@dudeofawesome/eslint-config-typescript',
          '@dudeofawesome/typescript-configs',
        );
        break;
      default:
    }
  }

  for (const tech of technologies) {
    switch (tech) {
      case 'jest':
        dev_packages.push(
          'jest',
          '@types/jest',
          '@dudeofawesome/eslint-config-jest',
        );
        break;
      case 'react':
        prod_packages.push('react');
        if (languages.includes('ts')) {
          dev_packages.push('@types/react');
        }
        break;
      default:
    }
  }

  log(
    `Installing ${(prod_packages.length > 0 ? prod_packages : ['nothing']).join(
      ', ',
    )} & ${dev_packages.join(', ')}`,
  );

  if (prod_packages.length > 0) {
    await new Promise<void>((resolve, reject) =>
      exec(
        `npm install --save-prod ${prod_packages.join(' ')}`,
        (err, stderr, stdout): void => {
          if (err != null) return reject(err);
          if (stderr !== '') return reject(stderr);
          log(stdout);
          error(stderr);
          return resolve();
        },
      ),
    );
  }
  if (dev_packages.length > 0) {
    await new Promise<void>((resolve, reject) =>
      exec(
        `npm install --save-dev ${dev_packages.join(' ')}`,
        (err, stderr, stdout) => {
          if (err != null) return reject(err);
          if (stderr !== '') return reject(stderr);
          log(stdout);
          error(stderr);
          return resolve();
        },
      ),
    );
  }
}
