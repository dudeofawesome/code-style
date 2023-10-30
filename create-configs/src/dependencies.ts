import { log } from 'node:console';
import { promisify } from 'node:util';
import { exec as execCallback } from 'node:child_process';

import {
  ProjectType,
  Language,
  Technology,
  Builder,
  Runtime,
} from './types.js';

const exec = promisify(execCallback);

export type InstallDependenciesOptions = {
  project_type: ProjectType;
  languages: Language[];
  technologies: Technology[];
  builder: Builder;
  runtime?: Runtime;
};
export async function install_dependencies({
  project_type,
  languages,
  technologies,
  builder,
  runtime,
}: InstallDependenciesOptions) {
  const prod_packages: (string | undefined)[] = [];
  const dev_packages: (string | undefined)[] = [
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
      case 'css':
        if (!languages.includes('scss')) {
          dev_packages.push('stylelint', '@dudeofawesome/stylelint-config');
        }
        break;
      case 'scss':
        dev_packages.push(
          'stylelint',
          'scss-embedded',
          '@dudeofawesome/stylelint-config-scss',
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

  switch (builder) {
    case 'babel':
      dev_packages.push('babel');
      break;
    case 'esbuild':
      dev_packages.push('esbuild');
      break;
    case 'swc':
      dev_packages.push('@swc/cli', '@swc/core');
      break;
    case 'tsc': // we already added typescript
    case 'bun': // bun is not installed via npm
    case 'none': // this one is pretty obvious
    default:
  }

  log(
    `Installing ${(prod_packages.length > 0 ? prod_packages : ['nothing']).join(
      ', ',
    )} & ${dev_packages.join(', ')}`,
  );

  const install_cmd = ((): string => {
    switch (runtime) {
      case 'bun':
        return 'bun install';
      case 'nodejs':
      default:
        return 'npm install';
    }
  })();
  const install_cmd_prod = ((): string => {
    switch (runtime) {
      case 'bun':
        return `${install_cmd} --production`;
      case 'nodejs':
      default:
        return `${install_cmd} --save-prod`;
    }
  })();
  const install_cmd_dev = ((): string => {
    switch (runtime) {
      case 'bun':
        return `${install_cmd} --development`;
      case 'nodejs':
      default:
        return `${install_cmd} --save-dev`;
    }
  })();

  if (prod_packages.length > 0) {
    await exec(
      `${install_cmd_prod} ${prod_packages
        .map((p) => `${p}@latest`)
        .join(' ')}`,
    );
  }
  if (dev_packages.length > 0) {
    await exec(
      `${install_cmd_dev} ${dev_packages.map((p) => `${p}@latest`).join(' ')}`,
    );
  }
}
