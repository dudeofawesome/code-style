import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { access, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { format, resolveConfig, resolveConfigFile, Options } from 'prettier';
import { Language } from './types.js';

const exec = promisify(execCallback);

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

/**
 * @param path The path to check.
 * @returns Whether or not the file exists.
 */
export function file_exists(path: string): Promise<boolean> {
  return access(path)
    .then(() => true)
    .catch(() => false);
}

export type VerifyMissingOptions = {
  /** The path of the file to possibly delete. */
  path: string;
  /** Whether or not to delete the file should it exist. */
  remove?: boolean;
  /** Whether or not the promise should reject upon finding an existing file. */
  reject?: boolean;
};
/**
 * @param path The path of the file to possibly delete.
 * @param remove Whether or not to delete the file should it exist.
 * @returns Whether or not the file is missing.
 */
export async function verify_missing(
  path: string,
  remove: boolean,
  reject: boolean = false,
): Promise<boolean> {
  if (await file_exists(path)) {
    if (remove) {
      await rm(path);
      return true;
    } else {
      const message = `File "${path}" already exists.`;
      if (reject) {
        throw new Error(message);
      } else {
        console.info(message);
        return false;
      }
    }
  } else {
    return true;
  }
}

export type VerifyMissingScriptOptions = Omit<
  VerifyMissingOptions,
  'path' | 'remove'
> & {
  /** The path of the file to possibly delete. */
  path?: string;
  /** The path to key in the JSON file. */
  json_path: string;
  /** Whether or not to allow overwriting the key. */
  overwrite: boolean;
};
/**
 * @returns Whether or not the script is missing.
 */
export async function verify_missing_script({
  path,
  json_path,
  overwrite = false,
  reject = false,
}: VerifyMissingScriptOptions): Promise<boolean> {
  if ((await exec(`npm pkg get '${json_path}'`)).stdout !== '{}') {
    if (overwrite) {
      return true;
    } else {
      const message = `Path "${json_path}" already exists.`;
      if (reject) {
        throw new Error(message);
      } else {
        console.info(message);
        return false;
      }
    }
  } else {
    return true;
  }
}

export async function prettify(
  path: string,
  content?: string,
): Promise<string> {
  const config: Options = await resolveConfigFile(path).then((config_path) =>
    config_path != null
      ? resolveConfig(config_path).then((cfg) => cfg ?? ({} as Options))
      : ({} as Options),
  );

  if (content != null) {
    return await format(content, config);
  } else {
    const source = (await readFile(path)).toString();
    const formatted = await format(source, config);
    await writeFile(path, formatted);
    return formatted;
  }
}

export function includes_js(languages: Language[]): boolean {
  return languages.includes('js') || languages.includes('ts');
}
