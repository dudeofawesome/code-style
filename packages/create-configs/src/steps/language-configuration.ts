import { stripIndent } from 'common-tags';
import {
  ExcludeDefinition,
  IncludeDefinition,
  TSConfig as TSConfigFull,
} from '@json-types/tsconfig';
import { CodeStyleSetupOptions as SetupOptions } from '@code-style/code-style/config-types';

import {
  ConfigFile,
  Dependencies,
  create_file,
  prettify,
  verify_missing,
  exec,
  version as v,
} from '../utils.js';

export type TSConfig = Omit<TSConfigFull, 'extends'> & {
  extends: string[];
} & IncludeDefinition &
  ExcludeDefinition;

/** @private */
export function _generate_base_ts_config({
  project_type,
  technologies,
  library,
  input_dir,
  output_dir,
  lenient,
}: Omit<CreateTSConfigOptions, 'overwrite'>): ConfigFile {
  const deps = new Dependencies();
  const config: TSConfig = {
    extends: [],
    compilerOptions: {
      baseUrl: input_dir,
      outDir: output_dir,
    },
    include: ['./'],
    exclude: [output_dir, 'coverage/'],
  };

  switch (project_type) {
    case 'web-app':
      config.extends.push(
        `${deps.d.depend('@code-style/typescript-configs', { v })}/roles/browser`,
      );
      if (technologies.includes('nextjs')) {
        deps.d.add(['@types/react', '@types/react-dom']);
        config.extends.push(
          `${deps.d.depend('@code-style/typescript-configs', { v })}/layers/nextjs`,
        );
      } else if (technologies.includes('react')) {
        deps.d.add(['@types/react', '@types/react-dom']);
        config.extends.push(
          `${deps.d.depend('@code-style/typescript-configs', { v })}/layers/react`,
        );
      }
      break;
    case 'backend':
    case 'cli':
      if (technologies.includes('nestjs')) {
        config.extends.push(
          `${deps.d.depend('@code-style/typescript-configs', { v })}/roles/nest`,
        );
      } else {
        deps.d.depend('@types/node');
        config.extends.push(
          `${deps.d.depend('@code-style/typescript-configs', { v })}/roles/node`,
        );
      }
      break;
  }

  if (technologies.includes('esm')) {
    config.extends.push(
      `${deps.d.depend('@code-style/typescript-configs', { v })}/layers/esmodule`,
    );
  }

  if (library) {
    config.extends.push(
      `${deps.d.depend('@code-style/typescript-configs', { v })}/layers/library`,
    );
  }

  // TODO(2): add support for library.json tsconfig

  if (lenient) {
    config.extends.push(
      `${deps.d.depend('@code-style/typescript-configs', { v })}/layers/lenient`,
    );
  }

  return {
    content: stripIndent`
    // In order to update the this config, update @code-style/typescript-configs
    ${JSON.stringify(config, null, 2)}
  `,
    dependencies: deps,
  };
}

/** @private */
export function _generate_build_ts_config({
  input_dir,
}: Pick<CreateTSConfigOptions, 'input_dir'>): ConfigFile {
  const deps = new Dependencies();
  const config: TSConfig = {
    extends: ['./tsconfig.json'],
    compilerOptions: {
      baseUrl: './',
    },
    include: [input_dir],
    exclude: ['**/*.spec.ts', '**/*.test.ts'],
  };

  return {
    content: stripIndent`
    ${JSON.stringify(config, null, 2)}
  `,
    dependencies: deps,
  };
}

export type CreateTSConfigOptions = Required<
  Pick<
    SetupOptions,
    | 'project_type'
    | 'technologies'
    | 'library'
    | 'input_dir'
    | 'output_dir'
    | 'overwrite'
    | 'lenient'
  >
>;
export async function create_ts_config({
  project_type,
  technologies,
  library,
  input_dir,
  output_dir,
  overwrite = true,
  lenient,
}: CreateTSConfigOptions): Promise<Dependencies | undefined> {
  const base = 'tsconfig.json';
  const build = 'tsconfig.build.json';
  if (
    await verify_missing({
      path: [/tsconfig(\..+)?\.json/u],
      remove: overwrite,
    })
  ) {
    const base_config = _generate_base_ts_config({
      project_type,
      technologies,
      library,
      input_dir,
      output_dir,
      lenient,
    });
    const build_config = _generate_build_ts_config({
      input_dir,
    });

    await Promise.all([
      create_file(base, await prettify(base, base_config.content)),
      create_file(build, await prettify(build, build_config.content)),
    ]);

    return new Dependencies([
      base_config.dependencies,
      build_config.dependencies,
      new Dependencies([], ['typescript']),
    ]);
  }
}

export async function set_package_type({
  technologies,
  library,
  overwrite = true,
}: Pick<SetupOptions, 'technologies' | 'library' | 'overwrite'>) {
  if (overwrite || (await exec(`npm pkg get type`)).stdout === '{}') {
    const type: 'commonjs' | 'module' =
      technologies.includes('esm') &&
      !library &&
      !technologies.includes('nestjs')
        ? 'module'
        : 'commonjs';
    await exec(`npm pkg set type='${type}'`);
  } else {
    throw new Error(`package.json already has a type specified.`);
  }
}

/** @private */
export function _generate_jest_config({
  languages,
  builder,
  technologies,
}: Omit<CreateJestConfigOptions, 'overwrite'>): ConfigFile {
  const deps = new Dependencies();
  const config: string = ((ts: boolean, esm: boolean) => {
    if (ts) {
      const map: Record<typeof builder, string> = {
        esbuild: 'esbuild',
        swc: 'swc',
        tsc: 'tsc',
        babel: 'tsc',
        bun: 'tsc',
        none: 'tsc',
      };
      return `ts/${map[builder]}/${esm ? 'esm' : 'cjs'}`;
    } else return 'js';
  })(languages.includes('ts'), technologies.includes('esm'));
  return {
    content: stripIndent`
      import { config } from '${deps.d.depend('@code-style/jest-configs', { v })}/${config}';

      export default config;
    `,
    dependencies: deps,
  };
}

export type CreateJestConfigOptions = Pick<
  SetupOptions,
  'languages' | 'builder' | 'technologies' | 'overwrite'
>;
export async function create_jest_config({
  languages,
  technologies,
  builder,
  overwrite,
}: CreateJestConfigOptions): Promise<Dependencies> {
  const deps = new Dependencies();
  const path = 'jest.config.mjs';
  if (
    await verify_missing({
      path: [path, /^jest\.config\.(js|ts|mjs|cjs|json)$/u],
      remove: overwrite,
    })
  ) {
    const config = _generate_jest_config({
      languages,
      technologies,
      builder,
    });

    await create_file(path, await prettify(path, config.content));
    deps.add(config.dependencies);
  }

  return deps;
}
