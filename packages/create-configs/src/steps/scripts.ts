import Package from '@npmcli/package-json';

import {
  CodeStyleSetupOptions as SetupOptions,
  Builder,
} from '@code-style/code-style/config-types';
import { Dependencies, includes_js, verify_missing_script } from '../utils.js';

const concurrently_opts = '--raw --group';

export type AddNPMScriptsOptions = Pick<
  SetupOptions,
  'languages' | 'technologies' | 'builder' | 'runtime' | 'overwrite'
>;

export async function add_npm_scripts(
  options: AddNPMScriptsOptions,
): Promise<Dependencies | undefined> {
  // These can't be run simultaneously because they all modify package.json
  return new Dependencies([
    // TODO(2): add npm script for build, prepublishOnly
    (await set_build_script(options)) ?? new Dependencies(),
    (await set_lint_script(options)) ?? new Dependencies(),
    (await set_test_script(options)) ?? new Dependencies(),
    (await set_check_script(options)) ?? new Dependencies(),
  ]);
  // TODO: format package.json
}

export async function set_build_script({
  languages,
  technologies,
  builder,
  overwrite = false,
}: AddNPMScriptsOptions): Promise<Dependencies | undefined> {
  if (await verify_missing_script({ json_path: 'scripts.build', overwrite })) {
    const deps = new Dependencies();

    if (technologies.includes('nestjs')) {
      await write_scripts({ build: 'nest build' });
    } else if (technologies.includes('nextjs')) {
      if (languages.includes('scss')) deps.d.depend('sass-embedded');
      await write_scripts({ build: `${deps.p.depend('next')} build` });
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

    return deps;
  }
}

type LintScripts = Record<`lint:${string}`, string>;

/** @private */
export function _generate_lint_script({
  languages,
  technologies,
  builder,
}: Omit<AddNPMScriptsOptions, 'overwrite' | 'runtime'>): {
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
            'lint:js': `${deps.d.depend('@code-style/eslint-config', 'eslint')} . --ext ${languages
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
              deps.d.depend('@code-style/stylelint-config', 'stylelint'),
              `'**/*.{${languages
                .filter((l) => ['css', 'scss'].includes(l))
                .join(',')}}'`,
            ].join(' '),
          };
        case 'tsc':
          return {
            ...scripts,
            'lint:types': `${deps.d.depend('typescript', 'tsc')} --noEmit --pretty`,
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

export async function set_lint_script(
  options: AddNPMScriptsOptions,
): Promise<Dependencies | undefined> {
  if (
    await verify_missing_script({
      json_path: 'scripts.lint',
      overwrite: options.overwrite,
    })
  ) {
    const config = _generate_lint_script(options);
    await write_scripts(config.scripts);
    return config.dependencies;
  }
}

export async function set_test_script(
  options: AddNPMScriptsOptions,
): Promise<Dependencies | undefined> {
  if (
    await verify_missing_script({
      json_path: 'scripts.test',
      overwrite: options.overwrite,
    })
  ) {
    const deps = new Dependencies();

    const script: string = (({ runtime, technologies, languages }): string => {
      if (technologies.includes('jest')) return deps.d.depend('jest');
      else if (runtime === 'nodejs') {
        // We must be using the node test runner then
        if (languages.includes('ts')) {
          return [
            [
              `node $NODE_OPTS --require ${deps.d.depend('tsm')}`,
              `--test $(${deps.d.depend('glob')}`,
              ...['**/node_modules/**', '**/dist/**'].map(
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
          ].join('; ');
        } else {
          return 'node $NODE_OPTS --test';
        }
      } else {
        throw new Error(`Unsupported testing environment`);
      }
    })(options);

    await write_scripts({ test: script });

    return deps;
  }
}

export async function set_check_script({
  runtime,
  overwrite = false,
}: Pick<AddNPMScriptsOptions, 'runtime' | 'overwrite'>): Promise<
  Dependencies | undefined
> {
  if (
    await verify_missing_script({
      json_path: 'scripts.check',
      overwrite: overwrite,
    })
  ) {
    const deps = new Dependencies();

    await write_scripts({
      check: `${deps.d.depend('concurrently')} ${concurrently_opts} "npm:test" "npm:lint"`,
    });

    return deps;
  }
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
