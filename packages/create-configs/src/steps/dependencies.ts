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
} from '@code-style/code-style/config-types';

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
    'eslint-plugin-i',
    'eslint-plugin-import',
    'eslint-plugin-json-files',
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
    'ts-jest',
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
    '@code-style/code-style@latest',
    '@code-style/eslint-config@latest',
    '@code-style/eslint-npm-hoist-packages@latest',
  ];

  switch (project_type) {
    case 'web-app':
      if (technologies.includes('nextjs')) {
        dev_packages.push(
          '@code-style/eslint-config-nextjs@latest',
          '@code-style/eslint-npm-hoist-packages-nextjs@latest',
        );
      } else if (technologies.includes('react')) {
        dev_packages.push(
          '@code-style/eslint-config-react@latest',
          '@code-style/eslint-npm-hoist-packages-react@latest',
        );
      } else {
        dev_packages.push('@code-style/eslint-config-browser@latest');
      }
      break;
    case 'backend':
      if (languages.includes('ts')) dev_packages.push('@types/node');
      dev_packages.push(
        '@code-style/eslint-config-node@latest',
        '@code-style/eslint-npm-hoist-packages-node@latest',
      );
      break;
    case 'cli':
      if (languages.includes('ts')) dev_packages.push('@types/node');
      dev_packages.push('@code-style/eslint-config-cli@latest');
      break;
  }

  if (languages.includes('js') || languages.includes('ts')) {
    dev_packages.push('@code-style/typescript-configs@latest');
  }

  for (const language of languages) {
    switch (language) {
      case 'ts':
        dev_packages.push(
          'typescript',
          '@code-style/eslint-config-typescript@latest',
          '@code-style/eslint-npm-hoist-packages-typescript@latest',
        );
        break;
      case 'css':
        if (!languages.includes('scss')) {
          dev_packages.push('@code-style/stylelint-config@latest');
        }
        break;
      case 'scss':
        dev_packages.push(
          'sass-embedded',
          '@code-style/stylelint-config-scss@latest',
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
          '@code-style/eslint-config-jest@latest',
          '@code-style/eslint-npm-hoist-packages-jest@latest',
        );
        if (languages.includes('ts')) dev_packages.push('ts-jest@latest');
        break;
      case 'react':
      case 'nextjs':
        prod_packages.push('react', 'react-dom');
        if (languages.includes('ts')) {
          dev_packages.push('@types/react', '@types/react-dom');
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (tech === 'nextjs') {
          prod_packages.push('next');
        }
        break;
      case 'esm':
        dev_packages.push(
          '@code-style/eslint-config-esmodule@latest',
          '@code-style/eslint-npm-hoist-packages-esmodule@latest',
        );
        break;
      default:
    }
  }

  switch (builder) {
    case 'babel':
      dev_packages.push('babel@latest');
      break;
    case 'esbuild':
      dev_packages.push('esbuild@latest');
      break;
    case 'swc':
      dev_packages.push('@swc/cli@latest', '@swc/core@latest');
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
    await exec(`${install_cmd_prod} ${prod_packages.join(' ')}`);
  }
  if (dev_packages.length > 0) {
    await exec(`${install_cmd_dev} ${dev_packages.join(' ')}`);
  }
}
