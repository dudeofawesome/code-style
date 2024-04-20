import { checkbox, select, input, confirm } from '@inquirer/prompts';
import {
  ProjectType,
  Language,
  Technology,
  Builder,
  Runtime,
  CodeStyleSetupOptions,
} from '@code-style/code-style/config-types';
import { Promisable } from 'type-fest';

import { build } from './build.js';
import { includes_js } from './utils.js';
import { save_rc } from './rc-file.js';

export async function interactive_setup(
  defaults: Partial<CodeStyleSetupOptions> = {},
  use_defaults: boolean = false,
) {
  const project_type = await question_default(
    () =>
      select<ProjectType>({
        message: 'Project type',
        choices: [
          { name: 'Web App', value: 'web-app' },
          { name: 'Backend', value: 'backend' },
          { name: 'CLI tool', value: 'cli' },
        ],
        default: defaults.project_type,
      }),
    defaults.project_type,
    use_defaults,
  );

  const languages = await question_default(
    () =>
      checkbox<Language>({
        message: `Languages (Only select languages you will write source-code in.)\n    `,
        instructions: `(Press <space> to select and <enter> to proceed)`,
        choices: [
          {
            name: 'Javascript',
            value: 'js',
            checked: defaults.languages?.includes('js'),
          },
          {
            name: 'Typescript',
            value: 'ts',
            checked: defaults.languages?.includes('ts') ?? true,
          },
          (() => {
            const disabled = !['web-app'].includes(project_type);
            return {
              name: 'CSS',
              value: 'css',
              checked: defaults.languages?.includes('css') && !disabled,
              disabled,
            };
          })(),
          (() => {
            const disabled = !['web-app'].includes(project_type);
            return {
              name: 'SASS',
              value: 'scss',
              checked: defaults.languages?.includes('scss') && !disabled,
              disabled,
            };
          })(),
          (() => {
            const disabled = !['backend', 'cli'].includes(project_type);
            return {
              name: 'ruby',
              value: 'rb',
              checked: defaults.languages?.includes('rb') && !disabled,
              disabled,
            };
          })(),
          {
            name: 'python',
            value: 'py',
            checked: defaults.languages?.includes('py'),
            disabled: '(not yet supported)',
          },
        ],
      }),
    defaults.languages,
    use_defaults,
  );

  const technologies: Technology[] = await question_default(
    () =>
      checkbox<Technology>({
        message: `Tools (Select any tools / frameworks you will be using for this project.)\n    `,
        instructions: `(Press <space> to select and <enter> to proceed)`,
        choices: [
          (() => {
            const disabled =
              !includes_js(languages) || project_type !== 'web-app';
            return {
              name: 'React',
              value: 'react',
              checked: defaults.technologies?.includes('react') && !disabled,
              disabled,
            };
          })(),
          (() => {
            const disabled =
              !includes_js(languages) || project_type !== 'web-app';
            return {
              name: 'Next.JS',
              value: 'nextjs',
              checked: defaults.technologies?.includes('nextjs') && !disabled,
              disabled,
            };
          })(),
          (() => {
            const disabled =
              `The configurator doesn't yet have support for React Native, but you can still configure it manually` as
                | string
                | boolean;
            return {
              name: 'React Native',
              value: 'react-native',
              checked:
                defaults.technologies?.includes('react-native') &&
                !(disabled !== false),
              disabled,
            };
          })(),
          (() => {
            const disabled =
              !includes_js(languages) || project_type !== 'backend';
            return {
              name: 'NestJS',
              value: 'nestjs',
              checked: defaults.technologies?.includes('nestjs') && !disabled,
              disabled,
            };
          })(),
          (() => {
            const disabled = !includes_js(languages);
            return {
              name: 'Jest',
              value: 'jest',
              checked:
                (defaults.technologies?.includes('jest') ??
                  includes_js(languages)) &&
                !disabled,
              disabled,
            };
          })(),
          (() => {
            const disabled = false;
            return {
              name: 'Visual Studio Code',
              value: 'vs-code',
              checked:
                (defaults.technologies?.includes('vs-code') ?? true) &&
                !disabled,
              disabled,
            };
          })(),
          (() => {
            const disabled = !includes_js(languages);
            return {
              name: 'ES Modules',
              value: 'esm',
              checked:
                (defaults.technologies?.includes('esm') ?? true) && !disabled,
              disabled,
            };
          })(),
        ],
      }),
    defaults.technologies,
    use_defaults,
  );

  const runtime: Runtime | undefined = includes_js(languages)
    ? await question_default(
        () =>
          select<Runtime>({
            message: 'Runtime',
            choices: [
              { name: 'nodejs', value: 'nodejs' },
              { name: 'bun', value: 'bun' },
            ],
            default: defaults.runtime,
          }),
        defaults.runtime,
        use_defaults,
      )
    : undefined;

  const builder: Builder = includes_js(languages)
    ? await question_default(
        () =>
          select<Builder>({
            message: 'Builder',
            choices: [
              {
                name: 'esbuild',
                value: 'esbuild',
                disabled: runtime !== 'nodejs',
              },
              {
                name: 'tsc',
                value: 'tsc',
                disabled: !languages.includes('ts') || runtime !== 'nodejs',
              },
              { name: 'SWC', value: 'swc', disabled: runtime !== 'nodejs' },
              {
                name: 'Babel',
                value: 'babel',
                disabled: languages.includes('ts') || runtime !== 'nodejs',
              },
              {
                name: 'Bun',
                value: 'bun',
                disabled: !languages.includes('ts') || runtime !== 'bun',
              },
              {
                name: 'none',
                value: 'none',
                disabled: languages.includes('ts') || runtime === 'bun',
              },
            ],
            default: defaults.builder,
          }),
        defaults.builder,
        use_defaults,
      )
    : 'none';

  const library = await question_default(
    () =>
      confirm({
        message: 'Is this a library that other projects will consume?',
        default: defaults.library ?? false,
      }),
    defaults.library,
    use_defaults,
  );

  const lenient = !(await question_default(
    () =>
      confirm({
        message: 'Use strict configs & rulesets?',
        default: !(defaults.lenient ?? false),
      }),
    !defaults.lenient,
    use_defaults,
  ));

  let input_dir: string | undefined;
  let output_dir: string | undefined;
  if (builder !== 'none') {
    input_dir = await question_default(
      () =>
        input({
          message: 'Input directory',
          default: defaults.input_dir ?? 'src/',
        }),
      defaults.input_dir,
      use_defaults,
    );
    output_dir = await question_default(
      () =>
        input({
          message: 'Output directory',
          default: defaults.output_dir ?? 'dist/',
        }),
      defaults.output_dir,
      use_defaults,
    );
  }

  const overwrite = await question_default(
    () =>
      confirm({
        message: 'Overwrite existing config files?',
        default: defaults.overwrite ?? true,
      }),
    defaults.overwrite,
    use_defaults,
  );

  const config: CodeStyleSetupOptions = {
    project_type,
    languages,
    runtime,
    builder,
    input_dir,
    output_dir,
    technologies,
    library,
    lenient,
    overwrite,
  };

  if (
    !use_defaults &&
    !(await confirm({
      message: 'Do all your choices look good?',
      default: true,
    }))
  ) {
    console.info('Restarting config selection…');
    await interactive_setup(config);
    return;
  }

  await save_rc(config);

  await build(config);
}

export async function question_default<T>(
  question: () => Promisable<T>,
  default_answer?: T,
  use_default: boolean = false,
): Promise<T> {
  return use_default ? default_answer ?? question() : question();
}
