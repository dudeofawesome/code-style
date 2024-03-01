import { checkbox, select, input, confirm } from '@inquirer/prompts';

import { build } from './build.js';
import {
  ProjectType,
  Language,
  Technology,
  Builder,
  Runtime,
} from './types.js';
import { includes_js } from './utils.js';

export async function interactive_setup() {
  const project_type = await select<ProjectType>({
    message: 'Project type',
    choices: [
      { name: 'Web App', value: 'web-app' },
      { name: 'Backend', value: 'backend' },
      { name: 'CLI tool', value: 'cli' },
    ],
  });

  const languages = await checkbox<Language>({
    message: `Languages (Only select languages you will write source-code in.)\n    `,
    instructions: `(Press <space> to select and <enter> to proceed)`,
    choices: [
      { name: 'javascript', value: 'js' },
      { name: 'typescript', value: 'ts', checked: true },
      {
        name: 'ruby',
        value: 'rb',
        disabled: !['backend', 'cli'].includes(project_type),
      },
      {
        name: 'python',
        value: 'py',
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
      })
    : 'none';

  const technologies: Technology[] = await checkbox<Technology>({
    message: `Tools (Select any tools / frameworks you will be using for this project.)\n    `,
    instructions: `(Press <space> to select and <enter> to proceed)`,
    choices: [
      {
        name: 'React',
        value: 'react',
        disabled: !includes_js(languages) || project_type !== 'web-app',
      },
      {
        name: 'React Native',
        value: 'react-native',
        /**
         * The configurator doesn't yet have support for React Native, but you
         * can still configure it manually
         */
        disabled: true,
      },
      {
        name: 'NestJS',
        value: 'nestjs',
        disabled: !includes_js(languages) || project_type !== 'backend',
      },
      {
        name: 'Jest',
        value: 'jest',
        checked: includes_js(languages),
        disabled: !includes_js(languages),
      },
      {
        name: 'Visual Studio Code',
        value: 'vs-code',
        checked: true,
      },
      {
        name: 'ES Modules',
        value: 'esm',
        checked: true,
      },
    ],
  });

  const library = await confirm({
    message: 'Is this a library that other projects will consume?',
    default: false,
  });

  const lenient = !(await confirm({
    message: 'Use strict configs & rulesets?',
    default: true,
  }));

  const overwrite = await confirm({
    message: 'Overwrite existing config files?',
    default: true,
  });

  let input_dir: string | undefined;
  let output_dir: string | undefined;
  if (builder !== 'none') {
    input_dir = await input({
      message: 'Input directory',
      default: 'src/',
    });
    output_dir = await input({
      message: 'Output directory',
      default: 'dist/',
    });
  }

  if (
    !(await confirm({
      message: 'Do all your choices look good?',
      default: true,
    }))
  ) {
    throw new Error(`User cancelled file creation.`);
  }

  await build({
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
  });
}
