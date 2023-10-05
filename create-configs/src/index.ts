import { log, error } from 'node:console';
import { stat, symlink, writeFile } from 'node:fs/promises';
import { exec } from 'node:child_process';
import Yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { Options } from 'yargs';
import { checkbox, select, input } from '@inquirer/prompts';
import { stringify } from 'yaml';

type ProjectType = 'web-app' | 'backend' | 'cli';
type Language = 'ts' | 'js' | 'rb' | 'py' | 'css' | 'scss';
type Technology = 'react' | 'nestjs' | 'jest' | 'vs-code';
type Builder = 'tsc' | 'esbuild' | 'swc' | 'bun' | 'babel' | 'none';
type Runtime = 'nodejs' | 'bun';

// TODO(0): add support for VSCode settings & extensions
// TODO: add support for ruby
// TODO(0): add support for css
// TODO(1): refactor this project into at least separate files

export async function install_dependencies(
  project_type: ProjectType,
  languages: Language[],
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
      if (languages.includes('ts')) dev_packages.push('@types/node');
      dev_packages.push('@dudeofawesome/eslint-config-node');
      break;
    case 'cli':
      if (languages.includes('ts')) dev_packages.push('@types/node');
      dev_packages.push('@dudeofawesome/eslint-config-cli');
      break;
  }

  for (const language of languages) {
    switch (language) {
      case 'ts':
        dev_packages.push(
          'typescript',
          '@dudeofawesome/eslint-config-typescript',
          '@dudeofawesome/typescript-configs',
        );
        break;
      default:
    }
  }

  for (const tech of technologies) {
    switch (tech) {
      case 'jest':
        dev_packages.push(
          'jest',
          '@types/jest',
          '@dudeofawesome/eslint-config-jest',
        );
        break;
      case 'react':
        prod_packages.push('react');
        if (languages.includes('ts')) {
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

  // TODO(2): add support for library.json

  // TODO(2): create a separate tsconfig for tests
  // if (technologies.includes('jest')) {
  //   config.extends.push('@dudeofawesome/typescript-configs/jest.json');
  // }

  await create_file('tsconfig.json', JSON.stringify(config, null, 2));
}

export async function create_eslint_config(
  project_type: ProjectType,
  languages: Language[],
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

  if (languages.includes('ts')) {
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
  languages: Language[];
  runtime?: Runtime;
  builder: Builder;
  input_dir?: string;
  output_dir?: string;
  technologies?: Technology[];
}
async function build({
  project_type,
  languages,
  runtime,
  builder,
  input_dir = 'src/',
  output_dir = 'dist/',
  technologies = [],
}: BuildOptions) {
  await create_editor_config();
      await create_prettier_config();

  if (languages.includes('ts') || languages.includes('js')) {
    await create_ts_config(project_type, technologies, input_dir, output_dir);
    await create_eslint_config(project_type, languages, technologies);
    await install_dependencies(project_type, languages, technologies);
  }
}

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
            choices: ['ts', 'js', 'rb', 'py', 'css', 'scss'],
            array: true,
            default: ['ts'],
          })
          .option<string, { choices: Runtime[] } & Options>('runtime', {
            alias: 'r',
            describe: 'Pick a runtime',
            choices: ['nodejs', 'bun'],
            default: 'nodejs',
          })
          .option<string, { choices: Builder[] } & Options>('builder', {
            alias: 'b',
            describe: 'Pick a builder',
            choices: ['tsc', 'esbuild', 'swc', 'babel', 'bun', 'none'],
            default: 'esbuild',
          })
          .option('input_dir', {
            alias: 'i',
            describe: 'Pick an input directory',
            default: 'src/',
          })
          .option('output_dir', {
            alias: 'o',
            describe: 'Pick an output directory',
            default: 'dist/',
          })
          .option<string, { choices: Technology[] } & Options>('technologies', {
            alias: 'c',
            describe: 'Choose some technologies you will use',
            choices: ['react', 'nestjs', 'jest', 'vs-code'],
            array: true,
            default: ['jest', 'vs-code'],
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
      },
      (argv) => {
        return;
      },
    ).argv;
}
