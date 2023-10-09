import { checkbox, select, input } from '@inquirer/prompts';

import { build } from './build.js';
import {
  ProjectType,
  Language,
  Technology,
  Builder,
  Runtime,
} from './types.js';

export async function interactive_setup() {
  const project_type = await select<ProjectType>({
    message: 'project type',
    choices: [
      { name: 'Web App', value: 'web-app' },
      { name: 'Backend', value: 'backend' },
      { name: 'CLI tool', value: 'cli' },
    ],
  });

  const languages = await checkbox<Language>({
    message: 'language',
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

  let runtime: Runtime | undefined;
  let builder: Builder = 'none';
  const technologies: Technology[] = [];

  if (languages.includes('js') || languages.includes('ts')) {
    technologies.push(
      ...(await checkbox<Technology>({
        message: 'tools',
        choices: [
          {
            name: 'React',
            value: 'react',
            disabled: project_type !== 'web-app',
          },
          {
            name: 'NestJS',
            value: 'nestjs',
            disabled: project_type !== 'backend',
          },
          { name: 'Jest', value: 'jest', checked: true },
          {
            name: 'Visual Studio Code',
            value: 'vs-code',
            checked: true,
          },
        ],
      })),
    );

    runtime = await select<Runtime>({
      message: 'runtime',
      choices: [
        { name: 'nodejs', value: 'nodejs' },
        { name: 'bun', value: 'bun' },
      ],
    });

    builder = await select<Builder>({
      message: 'builder',
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
    });
  }

  let input_dir: string | undefined;
  let output_dir: string | undefined;
  if (builder !== 'none') {
    input_dir = await input({
      message: 'input directory',
      default: 'src/',
    });
    output_dir = await input({
      message: 'output directory',
      default: 'dist/',
    });
  }

  await build({
    project_type,
    languages,
    runtime,
    builder,
    input_dir,
    output_dir,
    technologies,
  });

  process.exit(0);
}
