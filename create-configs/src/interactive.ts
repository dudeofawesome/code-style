import { checkbox, select, input } from '@inquirer/prompts';

import { build } from './build.js';
import {
  ProjectType,
  Language,
  Technology,
  Builder,
  Runtime,
} from './types.js';
import { includes_js } from './utils.js';

export async function interactive_setup(overwrite: boolean = false) {
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
    ],
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

  await build(
    {
      project_type,
      languages,
      runtime,
      builder,
      input_dir,
      output_dir,
      technologies,
    },
    overwrite,
  );

  process.exit(0);
}
