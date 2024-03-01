import Yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { Options } from 'yargs';
import {
  ProjectType,
  Language,
  Technology,
  Builder,
  Runtime,
  CodeStyleSetupOptions as SetupOptions,
} from '@dudeofawesome/code-style/config-types';

import { build } from './build.js';
import { interactive_setup } from './interactive.js';
import { load_rc } from './rc-file.js';

// TODO(4): add support for ruby
// TODO(1): add deeper support for build systems
// TODO(2): add deeper support for runtimes

export async function main() {
  const options = await Yargs(hideBin(process.argv))
    .scriptName('create-configs')
    .option('overwrite', {
      alias: 'o',
      description: 'Allows overwriting files.',
      type: 'boolean',
      default: false,
    })
    .command(
      'create',
      'Create your new project with CLI arguments.',
      (yargs) => {
        // TODO(0): bring yargs up to date with prompt
        yargs
          .option<string, { choices: ProjectType[] } & Options>(
            'project_type',
            {
              alias: 't',
              description: 'Pick a project type',
              choices: ['web-app', 'backend', 'cli'],
            },
          )
          .option<string, { choices: Language[] } & Options>('language', {
            alias: 'l',
            description: 'Pick a language',
            choices: ['ts', 'js', 'rb', 'py', 'css', 'scss'],
            array: true,
            default: ['ts'],
          })
          .option<string, { choices: Runtime[] } & Options>('runtime', {
            alias: 'r',
            description: 'Pick a runtime',
            choices: ['nodejs', 'bun'],
            default: 'nodejs',
          })
          .option<string, { choices: Builder[] } & Options>('builder', {
            alias: 'b',
            description: 'Pick a builder',
            choices: ['tsc', 'esbuild', 'swc', 'babel', 'bun', 'none'],
            default: 'esbuild',
          })
          .option('input_dir', {
            alias: 'i',
            description: 'Pick an input directory',
            default: 'src/',
          })
          .option('output_dir', {
            alias: 'o',
            description: 'Pick an output directory',
            default: 'dist/',
          })
          .option<string, { choices: Technology[] } & Options>('technologies', {
            alias: 'c',
            description: 'Choose some technologies you will use',
            choices: ['react', 'nestjs', 'jest', 'vs-code'],
            array: true,
            default: ['jest', 'vs-code'],
          });
      },
      async (argv) => {
        await build({
          ...(argv as unknown as SetupOptions),
          overwrite: options.overwrite,
        });
        process.exit(0);
      },
    )
    .command(
      'prompt',
      'Walk through a set of prompts to configure your new project',
      async (yargs) => {
        await start_interactive_setup();
      },
      (argv) => {
        return;
      },
    )
    .parserConfiguration({
      'strip-aliased': true,
      'strip-dashed': true,
    }).argv;

  if (options._.length === 0) await start_interactive_setup();
}

async function start_interactive_setup() {
  const config = await load_rc();

  return interactive_setup(config);
}
