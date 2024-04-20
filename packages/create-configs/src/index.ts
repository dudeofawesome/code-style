import Yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';

import { interactive_setup } from './interactive.js';
import { load_rc } from './rc-file.js';

// TODO(4): add support for ruby
// TODO(1): add deeper support for build systems
// TODO(2): add deeper support for runtimes

export async function main() {
  const options = await Yargs(hideBin(process.argv))
    .scriptName('create-configs')
    .option('yes', {
      alias: 'y',
      description: 'Automatically assume the default value for all prompts.',
      type: 'boolean',
      default: false,
    })
    .command(
      'prompt',
      'Walk through a set of prompts to configure your new project.',
      (argv) => undefined,
      async (options) =>
        await start_interactive_setup({ use_default: options.yes }),
    )
    .parserConfiguration({
      'strip-aliased': true,
      'strip-dashed': true,
    }).argv;

  if (options._.length === 0)
    await start_interactive_setup({ use_default: options.yes });
}

async function start_interactive_setup({
  use_default = false,
}: {
  use_default?: boolean;
} = {}) {
  const config = await load_rc({ throw_no_config: true })
    .then((config) => {
      console.log(
        chalk.bold.yellow`Using codestyleinitrc file to set defaults.\n`,
      );
      return config;
    })
    .catch(() => undefined);

  return interactive_setup(config, use_default);
}
