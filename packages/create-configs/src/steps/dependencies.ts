import { log } from 'node:console';

import { CodeStyleSetupOptions as SetupOptions } from '@code-style/code-style/config-types';
import { Dependencies, exec } from '../utils.js';

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

export type InstallDependenciesOptions = Pick<SetupOptions, 'runtime'> & {
  dependencies: Dependencies;
};
export async function install_dependencies({
  runtime,
  dependencies,
}: InstallDependenciesOptions) {
  // add hoist dependencies
  for (const dep of dependencies.development) {
    const hoist = NpmHoistHackMap.get(dep);
    if (hoist != null) dependencies.development.add(hoist);
  }

  log(
    `Installing ${(dependencies.production.size > 0
      ? Array.from(dependencies.production)
      : ['no prod packages']
    ).join(', ')} & ${Array.from(dependencies.development).join(', ')}`,
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

  if (dependencies.production.size > 0) {
    await exec(`${install_cmd_prod} ${Array.from(dependencies.p).join(' ')}`);
  }
  if (dependencies.development.size > 0) {
    await exec(`${install_cmd_dev} ${Array.from(dependencies.d).join(' ')}`);
  }
}

const NpmHoistHackMap: ReadonlyMap<string, string> = new Map<string, string>([
  ['@code-style/eslint-config', '@code-style/eslint-npm-hoist-packages'],
  [
    '@code-style/eslint-config-esmodule',
    '@code-style/eslint-npm-hoist-packages-esmodule',
  ],
  [
    '@code-style/eslint-config-jest',
    '@code-style/eslint-npm-hoist-packages-jest',
  ],
  [
    '@code-style/eslint-config-nextjs',
    '@code-style/eslint-npm-hoist-packages-nextjs',
  ],
  [
    '@code-style/eslint-config-node',
    '@code-style/eslint-npm-hoist-packages-node',
  ],
  [
    '@code-style/eslint-config-react',
    '@code-style/eslint-npm-hoist-packages-react',
  ],
  [
    '@code-style/eslint-config-typescript',
    '@code-style/eslint-npm-hoist-packages-typescript',
  ],
]);
