import Package from '@npmcli/package-json';

import { CodeStyleSetupOptions as SetupOptions } from '@code-style/code-style/config-types';
import {
  Dependencies,
  includes_js,
  prettify,
  verify_missing_script,
  version as v,
} from '../utils.js';

const concurrently_opts = '--raw --group';

export type AddNPMScriptsOptions = Pick<
  SetupOptions,
  | 'languages'
  | 'technologies'
  | 'builder'
  | 'runtime'
  | 'overwrite'
  | 'library'
  | 'output_dir'
>;

export async function add_npm_scripts(
  options: AddNPMScriptsOptions,
): Promise<Dependencies | undefined> {
  const out: { scripts: Record<string, string>; dependencies: Dependencies }[] =
    [
      _generate_build_script(options),
      _generate_lint_script(options),
      _generate_test_script(options),
      _generate_check_script(options),
    ];
  const scripts = out.reduce<Record<string, string>>(
    (all_scripts, curr) => ({ ...all_scripts, ...curr.scripts }),
    {},
  );
  const dependencies = out.reduce<Dependencies>(
    (deps, curr) => deps.add(curr.dependencies),
    new Dependencies(),
  );

  await verify_missing_script({
    json_paths: Object.keys(scripts).map((script) => `scripts.${script}`),
    overwrite: options.overwrite,
  });
  await write_scripts(scripts);
  await prettify('package.json');

  return dependencies;
}

type BuildScripts = { build?: string; prepublishOnly?: string };
// TODO(2): add npm script for build, prepublishOnly
export function _generate_build_script({
  languages,
  technologies,
  builder,
  library,
  overwrite = false,
}: AddNPMScriptsOptions): {
  scripts: BuildScripts;
  dependencies: Dependencies;
} {
  const deps = new Dependencies();

  const scripts: BuildScripts = {};

  if (technologies.includes('nestjs')) {
    scripts.build = 'nest build';
  } else if (technologies.includes('nextjs')) {
    if (languages.includes('scss')) deps.d.depend('sass-embedded');
    scripts.build = `${deps.p.depend('next')} build`;
  } else {
    // const build_step: Set<Exclude<Builder, 'bun' | 'none'> | 'scss'> =
    //   new Set();
    // switch (builder) {
    //   case 'babel':
    //   case 'esbuild':
    //   case 'swc':
    //   case 'tsc':
    //     build_step.add(builder);
    //     break;
    //   default:
    // }
    // if (languages.includes('scss')) {
    //   deps.d.depend('sass-embedded');
    //   build_step.add('scss');
    // }
    // if (languages.includes('ts')) {
    //   deps.d.depend('typescript');
    // }
    // if (build_step.has('esbuild')) {
    //   if (languages.includes('scss')) {
    //     //
    //   } else {
    //     //
    //   }
    // }
    // const script = '';
    // await write_scripts({ build: script });
  }

  if (library) scripts.prepublishOnly = `npm run build`;

  return { scripts, dependencies: deps };
}

type LintScripts = Record<`lint:${string}`, string>;

/** @private */
export function _generate_lint_script({
  languages,
  technologies,
  builder,
}: Omit<AddNPMScriptsOptions, 'overwrite' | 'runtime' | 'library'>): {
  scripts: {
    [key: `lint:${string}`]: string;
    lint: string;
  };
  dependencies: Dependencies;
} {
  const deps = new Dependencies();
  const linters: Set<'eslint' | 'stylelint' | 'tsc'> = new Set();
  if (includes_js(languages)) linters.add('eslint');
  if (languages.includes('ts') && builder !== 'tsc') linters.add('tsc');
  if (languages.includes('css') || languages.includes('scss')) {
    linters.add('stylelint');
  }

  const steps: LintScripts = Array.from(linters.values()).reduce<LintScripts>(
    (scripts, linter) => {
      switch (linter) {
        case 'eslint':
          return {
            ...scripts,
            'lint:js': `${deps.d.depend('@code-style/eslint-config', { cmd: 'eslint', v })} . --ext ${languages
              .filter((l) => ['js', 'ts'].includes(l))
              .reduce<string[]>(
                (extensions, ext) => [
                  ext,
                  ...(technologies.includes('react') ? [`${ext}x`] : []),
                  ...extensions,
                ],
                ['json'],
              )
              .join(',')} --cache`,
          };
        case 'stylelint':
          return {
            ...scripts,
            'lint:css': [
              deps.d.depend('@code-style/stylelint-config', {
                cmd: 'stylelint',
                v,
              }),
              `'**/*.{${languages
                .filter((l) => ['css', 'scss'].includes(l))
                .join(',')}}'`,
            ].join(' '),
          };
        case 'tsc':
          return {
            ...scripts,
            'lint:types': `${deps.d.depend('typescript', { cmd: 'tsc' })} --noEmit --pretty`,
          };
        default:
          throw new TypeError(`Unexpected linter type "${linter as string}"`);
      }
    },
    {},
  );

  return {
    scripts: {
      ...steps,
      lint: `${deps.d.depend('concurrently')} ${concurrently_opts} "npm:lint:*"`,
    },
    dependencies: deps,
  };
}

type TestScripts = { test: string; 'test:debug': string };

/** @private */
export function _generate_test_script({
  languages,
  technologies,
  builder,
  output_dir,
  runtime,
}: Omit<AddNPMScriptsOptions, 'overwrite'>): {
  scripts: TestScripts;
  dependencies: Dependencies;
} {
  const deps = new Dependencies();

  const scripts: TestScripts = ((): TestScripts => {
    if (technologies.includes('jest')) {
      return {
        test: `NODE_OPTIONS="--experimental-vm-modules $NODE_OPTIONS" npx ${deps.d.depend('jest')}`,
        'test:debug': `NODE_OPTIONS='--inspect-brk' npm run test -- --runInBand`,
      };
    } else if (runtime === 'nodejs') {
      // We must be using the node test runner then
      if (languages.includes('ts')) {
        return {
          test: [
            [
              `node $NODE_OPTS --require ${deps.d.depend('tsm')}`,
              `--test $(${deps.d.depend('glob')}`,
              ...['**/node_modules/**', `**/${output_dir}/**`].map(
                (ig) => `--ignore '${ig}'`,
              ),
              ...[
                // Based on the default test file patterns:
                //   https://nodejs.org/api/test.html#running-tests-from-the-command-line
                `'**/*[.-_]test.?(c|m)[jt]s'`,
                `'**/test?(-*).?(c|m)[jt]s'`,
                `'**/test/**/*.?(c|m)[jt]s'`,
              ],
            ].join(' '),
          ].join('; '),
          'test:debug': `NODE_OPTS='--inspect-brk' npm run test`,
        };
      } else {
        return {
          test: 'node $NODE_OPTS --test',
          'test:debug': `NODE_OPTS='--inspect-brk' npm run test`,
        };
      }
    } else {
      throw new Error(`Unsupported testing environment`);
    }
  })();

  return {
    scripts,
    dependencies: deps,
  };
}

export function _generate_check_script({
  runtime,
}: Pick<AddNPMScriptsOptions, 'runtime'>): {
  scripts: { check: string };
  dependencies: Dependencies;
} {
  const deps = new Dependencies();

  return {
    scripts: {
      check: `${deps.d.depend('concurrently')} ${concurrently_opts} "npm:test" "npm:lint"`,
    },
    dependencies: deps,
  };
}

async function write_scripts(scripts: Record<string, string>) {
  const pkg = await Package.load('./');
  pkg.update({
    scripts: {
      // Typescript gets upset if we don't have this empty object
      ...{},
      ...pkg.content.scripts,
      ...scripts,
    },
  });
  await pkg.save();
}
