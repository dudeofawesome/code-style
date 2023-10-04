import { log, error } from 'node:console';
import { stat, symlink, writeFile } from 'node:fs/promises';
import { exec } from 'node:child_process';
import Yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { Options } from 'yargs';
import { checkbox, select, input } from '@inquirer/prompts';
import chalk from 'chalk';
import { stringify } from 'yaml';

type ProjectType = 'web-app' | 'backend' | 'cli';
type Language = 'js' | 'rb' | 'py';
type Technology = 'ts' | 'react' | 'nestjs' | 'jest';
type Builder = 'tsc' | 'esbuild' | 'swc' | 'babel' | 'none';

export async function install_dependencies(
  project_type: ProjectType,
  technologies: Technology[],
) {
  const prod_packages: string[] = [];
  const dev_packages: string[] = [
    '@dudeofawesome/code-style',
    '@dudeofawesome/eslint-config',
  ];

  switch (project_type) {
    case 'web-app':
      if (technologies.includes('react')) {
        dev_packages.push('@dudeofawesome/eslint-config-react');
      } else {
        dev_packages.push('@dudeofawesome/eslint-config-browser');
      }
      break;
    case 'backend':
      if (technologies.includes('ts')) dev_packages.push('@types/node');
      dev_packages.push('@dudeofawesome/eslint-config-node');
      break;
    case 'cli':
      if (technologies.includes('ts')) dev_packages.push('@types/node');
      dev_packages.push('@dudeofawesome/eslint-config-cli');
      break;
  }

  for (const tech of technologies) {
    switch (tech) {
      case 'ts':
        dev_packages.push(
          'typescript',
          '@dudeofawesome/eslint-config-typescript',
          '@dudeofawesome/typescript-configs',
        );
        break;
      case 'jest':
        dev_packages.push(
          'jest',
          '@types/jest',
          '@dudeofawesome/eslint-config-jest',
        );
        break;
      case 'react':
        prod_packages.push('react');
        if (technologies.includes('ts')) {
          dev_packages.push('@types/react');
        }
        break;
      default:
    }
  }

  log(
    `Installing ${(prod_packages.length > 0 ? prod_packages : ['nothing']).join(
      ', ',
    )} & ${dev_packages.join(', ')}`,
  );

  if (prod_packages.length > 0) {
    await new Promise<void>((resolve, reject) =>
      exec(
        `npm install --save-prod ${prod_packages.join(' ')}`,
        (err, stderr, stdout): void => {
          if (err != null) return reject(err);
          if (stderr !== '') return reject(stderr);
          log(stdout);
          error(stderr);
          return resolve();
        },
      ),
    );
  }
  if (dev_packages.length > 0) {
    await new Promise<void>((resolve, reject) =>
      exec(
        `npm install --save-dev ${dev_packages.join(' ')}`,
        (err, stderr, stdout) => {
          if (err != null) return reject(err);
          if (stderr !== '') return reject(stderr);
          log(stdout);
          error(stderr);
          return resolve();
        },
      ),
    );
  }
}

export async function create_file(
  path: string,
  content: string,
  overwrite = false,
): Promise<void> {
  if (
    (await stat(path).catch(() => ({ isFile: () => false }))).isFile() &&
    !overwrite
  ) {
    return;
  }

  await writeFile(path, content, { mode: 0b110110100 });
}

export async function create_ts_config(
  project_type: ProjectType,
  technologies: Technology[],
  input_dir: string,
  output_dir: string,
) {
  const config = {
    extends: [] as string[],
    compilerOptions: {
      baseUrl: input_dir,
      outDir: output_dir,
    },
    include: [input_dir],
    exclude: [output_dir],
  };

  switch (project_type) {
    case 'web-app':
      config.extends.push('@dudeofawesome/typescript-configs/browser.json');
      if (technologies.includes('react')) {
        config.extends.push('@dudeofawesome/typescript-configs/react.json');
      }
      break;
    case 'backend':
    case 'cli':
      config.extends.push('@dudeofawesome/typescript-configs/node.json');
      break;
  }

  // TODO: add support for library.json

  // TODO: create a separate tsconfig for tests
  // if (technologies.includes('jest')) {
  //   config.extends.push('@dudeofawesome/typescript-configs/jest.json');
  // }

  await create_file('tsconfig.json', JSON.stringify(config, null, 2));
}

export async function create_eslint_config(
  project_type: ProjectType,
  technologies: Technology[],
) {
  const config = {
    root: true,
    extends: ['@dudeofawesome'],
    parserOptions: 2022,
  };

  switch (project_type) {
    case 'web-app':
      if (technologies.includes('react')) {
        config.extends.push('@dudeofawesome/react');
      } else {
        config.extends.push('@dudeofawesome/browser');
      }
      break;
    case 'backend':
      config.extends.push('@dudeofawesome/node');
      break;
    case 'cli':
      config.extends.push('@dudeofawesome/cli');
      break;
  }

  if (technologies.includes('ts')) {
    config.extends.push('@dudeofawesome/typescript');
  }
  if (technologies.includes('jest')) {
    config.extends.push('@dudeofawesome/jest');
  }

  await create_file('.eslintrc.yaml', stringify(config));
}

export async function create_prettier_config() {
  await create_file(
    '.prettierrc',
    '"@dudeofawesome/code-style/.prettierrc.js"\n',
  );
}

export async function create_editor_config() {
  if (
    !(
      await stat('.editorconfig').catch(() => ({ isFile: () => false }))
    ).isFile()
  ) {
    await symlink(
      'node_modules/@dudeofawesome/code-style/.editorconfig',
      '.editorconfig',
    );
  }
}

interface BuildOptions {
  project_type: ProjectType;
  language: Language;
  builder: Builder;
  input_dir?: string;
  output_dir?: string;
  technologies?: Technology[];
}
async function build({
  project_type,
  language,
  builder,
  input_dir = 'src/',
  output_dir = 'dist/',
  technologies = [],
}: BuildOptions) {
  await create_editor_config();

  switch (language) {
    case 'js':
      if (technologies.includes('ts')) {
        await create_ts_config(
          project_type,
          technologies,
          input_dir,
          output_dir,
        );
      }
      await create_eslint_config(project_type, technologies);
      await create_prettier_config();
      await install_dependencies(project_type, technologies);
      break;
    case 'rb':
      await create_prettier_config();
      break;
    default:
      error(chalk.red(`Unsupported language "${language}".`));
      process.exit(1);
  }
}

// questions to ask:
// project type (web, cli, etc)
// project languages (javascript, typescript, ruby?, css, scss)
// project technologies (react, nestjs, jest, etc)
// input files (src/)
// output files (dist/)
// builder (tsc, esbuild, swc, babel, none, etc)
export async function main() {
  await Yargs(hideBin(process.argv))
    .scriptName('create-configs')
    .command(
      'create',
      'Create your new project with CLI arguments.',
      (yargs) => {
        yargs
          .option<string, { choices: ProjectType[] } & Options>(
            'project_type',
            {
              alias: 't',
              describe: 'Pick a project type',
              choices: ['web-app', 'backend', 'cli'],
            },
          )
          .option<string, { choices: Language[] } & Options>('language', {
            alias: 'l',
            describe: 'Pick a language',
            choices: ['js', 'rb', 'py'],
          })
          .option<string, { choices: Builder[] } & Options>('builder', {
            alias: 'b',
            describe: 'Pick a builder',
            choices: ['tsc', 'esbuild', 'swc', 'babel', 'none'],
          })
          .option('input_dir', {
            alias: 'i',
            describe: 'Pick an input directory',
          })
          .option('output_dir', {
            alias: 'o',
            describe: 'Pick an output directory',
          })
          .option<string, { choices: Technology[] } & Options>('technologies', {
            alias: 'c',
            describe: 'Choose some technologies you will use',
            choices: ['ts', 'react', 'nestjs', 'jest'],
            array: true,
          });
      },
      async (argv) => {
        await build(argv as unknown as BuildOptions);
        process.exit(0);
      },
    )
    .command(
      'prompt',
      'Walk through a set of prompts to configure your new project',
      async (yargs) => {
        const project_type = await select<ProjectType>({
          message: 'project type',
          choices: [
            { name: 'Web App', value: 'web-app' },
            { name: 'Backend', value: 'backend' },
            { name: 'CLI tool', value: 'cli' },
          ],
        });
        log(project_type);

        const language = await select<Language>({
          message: 'language',
          choices: [
            { name: 'javascript/typescript', value: 'js' },
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
        log(language);

        const technologies: Technology[] = [];
        let builder: Builder | undefined;

        switch (language) {
          case 'js':
            technologies.push(
              ...(await checkbox<Technology>({
                message: 'language',
                choices: [
                  { name: 'Typescript', value: 'ts' },
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
                  { name: 'Jest', value: 'jest' },
                ],
              })),
            );

            builder = await select<Builder>({
              message: 'language',
              choices: [
                {
                  name: 'tsc',
                  value: 'tsc',
                  disabled: !technologies.includes('ts'),
                },
                { name: 'esbuild', value: 'esbuild' },
                { name: 'SWC', value: 'swc' },
                {
                  name: 'Babel',
                  value: 'babel',
                  disabled: technologies.includes('ts'),
                },
                {
                  name: 'none',
                  value: 'none',
                  disabled: technologies.includes('ts'),
                },
              ],
            });

            break;
          default:
            error(chalk.red(`Unsupported language "${language}".`));
            process.exit(1);
        }

        log(technologies);

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
          log(input_dir, output_dir);
        }

        await build({
          project_type,
          language,
          builder,
          input_dir,
          output_dir,
          technologies,
        });

        process.exit(0);
      },
      (argv) => {
        return;
      },
    ).argv;
}
