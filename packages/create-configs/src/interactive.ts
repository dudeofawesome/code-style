import { checkbox, select, input, confirm } from '@inquirer/prompts';
import {
  ProjectType,
  Language,
  Technology,
  Builder,
  Runtime,
  CodeStyleSetupOptions,
} from '@dudeofawesome/code-style/config-types';

import { build } from './build.js';
import { includes_js } from './utils.js';
import { save_rc } from './rc-file.js';

export async function interactive_setup(
  defaults: Partial<CodeStyleSetupOptions> = {},
) {
  const project_type = await select<ProjectType>({
    message: 'Project type',
    choices: [
      { name: 'Web App', value: 'web-app' },
      { name: 'Backend', value: 'backend' },
      { name: 'CLI tool', value: 'cli' },
    ],
    default: defaults.project_type,
  });

  const languages = await checkbox<Language>({
    message: `Languages (Only select languages you will write source-code in.)\n    `,
    instructions: `(Press <space> to select and <enter> to proceed)`,
    choices: [
      {
        name: 'javascript',
        value: 'js',
        checked: defaults.languages?.includes('js'),
      },
      {
        name: 'typescript',
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
  });

  const runtime: Runtime | undefined = includes_js(languages)
    ? await select<Runtime>({
        message: 'Runtime',
        choices: [
          { name: 'nodejs', value: 'nodejs' },
          { name: 'bun', value: 'bun' },
        ],
        default: defaults.runtime,
      })
    : undefined;

  const builder: Builder = includes_js(languages)
    ? await select<Builder>({
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
      })
    : 'none';

  const technologies: Technology[] = await checkbox<Technology>({
    message: `Tools (Select any tools / frameworks you will be using for this project.)\n    `,
    instructions: `(Press <space> to select and <enter> to proceed)`,
    choices: [
      (() => {
        const disabled = !includes_js(languages) || project_type !== 'web-app';
        return {
          name: 'React',
          value: 'react',
          checked: defaults.technologies?.includes('react') && !disabled,
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
        const disabled = !includes_js(languages) || project_type !== 'backend';
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
            (defaults.technologies?.includes('vs-code') ?? true) && !disabled,
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
  });

  const library = await confirm({
    message: 'Is this a library that other projects will consume?',
    default: defaults.library ?? false,
  });

  const lenient = !(await confirm({
    message: 'Use strict configs & rulesets?',
    default: !(defaults.lenient ?? false),
  }));

  const overwrite = await confirm({
    message: 'Overwrite existing config files?',
    default: defaults.overwrite ?? true,
  });

  let input_dir: string | undefined;
  let output_dir: string | undefined;
  if (builder !== 'none') {
    input_dir = await input({
      message: 'Input directory',
      default: defaults.input_dir ?? 'src/',
    });
    output_dir = await input({
      message: 'Output directory',
      default: defaults.output_dir ?? 'dist/',
    });
  }

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
