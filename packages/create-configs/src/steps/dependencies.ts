import { log } from 'node:console';
import { promisify } from 'node:util';
import { exec as execCallback } from 'node:child_process';

import {
  ProjectType,
  Language,
  Technology,
  Builder,
  Runtime,
  CodeStyleSetupOptions as SetupOptions,
} from '@dudeofawesome/code-style/config-types';

const exec = promisify(execCallback);

export async function uninstall_duplicate_dependencies({
  runtime,
}: Pick<SetupOptions, 'runtime'>): Promise<void> {
  const packages = [
    'prettier',
    'prettier-plugin-packagejson',
    'eslint',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    'eslint-plugin-promise',
    'eslint-plugin-import',
    'eslint-plugin-json-files',
    'eslint-plugin-i',
    'eslint-plugin-jest',
    'eslint-plugin-n',
    'eslint-plugin-node',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'tslib',
    'typescript',
  ];

  const uninstall_cmd = ((): string => {
    switch (runtime) {
      case 'bun':
        return 'bun uninstall';
      case 'nodejs':
      default:
        return 'npm uninstall';
    }
  })();

  await exec(`${uninstall_cmd} ${packages.join(' ')}`);
}

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
    '@dudeofawesome/eslint-npm-hoist-packages',
  ];

  switch (project_type) {
    case 'web-app':
      if (technologies.includes('nextjs')) {
        dev_packages.push(
          '@dudeofawesome/eslint-config-nextjs',
          '@dudeofawesome/eslint-npm-hoist-packages-nextjs',
        );
      } else if (technologies.includes('react')) {
        dev_packages.push(
          '@dudeofawesome/eslint-config-react',
          '@dudeofawesome/eslint-npm-hoist-packages-react',
        );
      } else {
        dev_packages.push('@dudeofawesome/eslint-config-browser');
      }
      break;
    case 'backend':
      if (languages.includes('ts')) dev_packages.push('@types/node');
      dev_packages.push(
        '@dudeofawesome/eslint-config-node',
        '@dudeofawesome/eslint-npm-hoist-packages-node',
      );
      break;
    case 'cli':
      if (languages.includes('ts')) dev_packages.push('@types/node');
      dev_packages.push('@dudeofawesome/eslint-config-cli');
      break;
  }

  if (languages.includes('js') || languages.includes('ts')) {
    dev_packages.push('@dudeofawesome/typescript-configs');
  }

  for (const language of languages) {
    switch (language) {
      case 'ts':
        dev_packages.push(
          'typescript',
          '@dudeofawesome/eslint-config-typescript',
          '@dudeofawesome/eslint-npm-hoist-packages-typescript',
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
          'sass-embedded',
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
          '@dudeofawesome/eslint-npm-hoist-packages-jest',
        );
        break;
      case 'react':
      case 'nextjs':
        prod_packages.push('react', 'react-dom');
        if (languages.includes('ts')) {
          dev_packages.push('@types/react');
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (tech === 'nextjs') {
          prod_packages.push('next');
        }
        break;
      case 'esm':
        dev_packages.push(
          '@dudeofawesome/eslint-config-esmodule',
          '@dudeofawesome/eslint-npm-hoist-packages-esmodule',
        );
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
    `Installing ${(prod_packages.length > 0
      ? prod_packages
      : ['no prod packages']
    ).join(', ')} & ${dev_packages.join(', ')}`,
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
