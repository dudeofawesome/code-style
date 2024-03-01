import { access, readFile, writeFile } from 'node:fs/promises';
import { parse, stringify } from 'yaml';
import type { CodeStyleSetupOptions } from '@dudeofawesome/code-style/config-types';

export const default_config_path = '.codestyleinitrc.yaml';

export interface LoadRCOptions {
  config_path?: string;
  throw_no_config?: boolean;
}
export async function load_rc({
  config_path = default_config_path,
  throw_no_config = false,
}: LoadRCOptions = {}): Promise<Partial<CodeStyleSetupOptions>> {
  const found = await access(config_path)
    .then(() => true)
    .catch(() => false);
  if (found) {
    return readFile(config_path)
      .then((buf) => buf.toString())
      .then<Partial<CodeStyleSetupOptions>>(
        (str) => parse(str) as Partial<CodeStyleSetupOptions>,
      )
      .catch((err) => {
        if (throw_no_config) throw err;
        else return {};
      });
  } else if (throw_no_config) {
    throw new Error();
  } else {
    return {};
  }
}

export interface SaveRCOptions {
  config_path?: string;
}
export async function save_rc(
  config: Partial<CodeStyleSetupOptions>,
  { config_path = default_config_path }: SaveRCOptions = {},
): Promise<void> {
  // TODO: switch to https://github.com/dudeofawesome/code-style/releases/download/vX.Y.Z/codestylerc.schema.json`;
  const header = `# yaml-language-server: $schema=https://github.com/dudeofawesome/code-style/releases/latest/download/codestylerc.schema.json`;
  const contents = `${header}\n\n${stringify(config)}`;

  await writeFile(config_path, contents);
}
