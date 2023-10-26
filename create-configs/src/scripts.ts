import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';

import { Builder, Language, Runtime, Technology } from './types.js';
import { includes_js, verify_missing_script } from './utils.js';

const exec = promisify(execCallback);

export type AddNPMScriptsOptions = {
  languages: Language[];
  technologies: Technology[];
  builder: Builder;
  runtime?: Runtime;
  overwrite?: boolean;
};
export async function add_npm_scripts(options: AddNPMScriptsOptions) {
  await exec(`npm install --save-dev concurrently`);

  // TODO(2): add npm script for build, prepublishOnly
  // await set_build_script(options);
  await set_lint_script(options);
  await set_test_script(options);
  await set_check_script(options);
}

export async function set_build_script({
  languages,
  technologies,
  builder,
  overwrite = false,
}: AddNPMScriptsOptions) {
  if (await verify_missing_script({ json_path: 'scripts.build', overwrite })) {
    if (technologies.includes('nestjs')) {
      await exec(`npm pkg set scripts.build='nest build'`);
    } else {
      const build_step: Set<Exclude<Builder, 'bun' | 'none'> | 'scss'> =
        new Set();
      switch (builder) {
        case 'babel':
        case 'esbuild':
        case 'swc':
        case 'tsc':
          build_step.add(builder);
          break;
        default:
      }
      if (languages.includes('scss')) {
        build_step.add('scss');
      }

      if (build_step.has('esbuild')) {
        if (languages.includes('scss')) {
          //
        } else {
          //
        }
      }
      const script = '';
      await exec(`npm pkg set scripts.build='${script}'`);
    }
  }
}

type LintScripts = Record<`lint:${string}`, string>;

/** @private */
export function _generate_lint_script({
  languages,
  builder,
}: Omit<AddNPMScriptsOptions, 'overwrite' | 'technologies' | 'runtime'>): {
  [key: `lint:${string}`]: string;
  lint: string;
} {
  const linters: Set<'eslint' | 'stylelint' | 'tsc'> = new Set();
  if (includes_js(languages)) linters.add('eslint');
  if (languages.includes('ts') && builder !== 'tsc') linters.add('tsc');
  if (languages.includes('css') || languages.includes('scss')) {
    linters.add('eslint');
  }

  const steps: LintScripts = Array.from(linters.values()).reduce<LintScripts>(
    (scripts, linter) => {
      switch (linter) {
        case 'eslint':
          return {
            ...scripts,
            'lint:js': `eslint . ${languages
              .filter((l) => ['js', 'ts'].includes(l))
              .map((l) => `--ext ${l}`)
              .join(' ')}`,
          };
        case 'stylelint':
          return {
            ...scripts,
            'lint:css': `stylelint **/*.{${languages
              .filter((l) => ['css' as Language, 'scss'].includes(l))
              .join(',')}}`,
          };
        case 'tsc':
          return { ...scripts, 'lint:types': 'tsc --noEmit' };
        default:
          throw new TypeError(`Unexpected linter type "${linter as string}"`);
      }
    },
    {},
  );

  return {
    ...steps,
    lint: `concurrently "npm:lint:*"`,
  };
}

export async function set_lint_script(options: AddNPMScriptsOptions) {
  if (
    await verify_missing_script({
      json_path: 'scripts.lint',
      overwrite: options.overwrite ?? false,
    })
  ) {
    const scripts = _generate_lint_script(options);
    const command: string = ((runtime): string => {
      switch (runtime) {
        case 'nodejs':
          return `npm pkg set ${Object.entries(scripts)
            .map(([name, script]) => `'scripts.${name}'='${script}'`)
            .join(' ')}`;
        default:
          throw new Error(`Unsupported runtime "${runtime}"`);
      }
    })(options.runtime);
    await exec(command);
  }
}

export async function set_test_script(options: AddNPMScriptsOptions) {
  if (
    await verify_missing_script({
      json_path: 'scripts.test',
      overwrite: options.overwrite ?? false,
    })
  ) {
    const command: string = ((runtime): string => {
      switch (runtime) {
        case 'nodejs':
          return `npm pkg set 'scripts.test'='jest'`;
        default:
          throw new Error(`Unsupported runtime "${runtime}"`);
      }
    })(options.runtime);
    await exec(command);
  }
}

export async function set_check_script({
  runtime,
  overwrite = false,
}: Pick<AddNPMScriptsOptions, 'runtime' | 'overwrite'>) {
  if (
    await verify_missing_script({
      json_path: 'scripts.check',
      overwrite: overwrite,
    })
  ) {
    const command: string = ((runtime): string => {
      switch (runtime) {
        case 'nodejs':
          return `npm pkg set 'scripts.check'='concurrently "npm:test" "npm:lint"'`;
        default:
          throw new Error(`Unsupported runtime "${runtime}"`);
      }
    })(runtime);
    await exec(command);
  }
}