import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';
import {
  access,
  readlink,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { format, Options } from 'prettier';
import default_config from '@code-style/code-style/prettierrc';
import { Language } from '@code-style/code-style/config-types';
import assert from 'node:assert';

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

  await writeFile(path, ensure_trailing_newline(content), {
    // rw- rw- r--
    mode: 0b110110100,
  });
}

export function ensure_trailing_newline(content: string): string {
  return content.at(-1) === '\n' ? content : `${content}\n`;
}

/**
 * @param path The path to check.
 * @returns Whether or not the file exists.
 */
export function file_exists(path: string | RegExp): Promise<string[] | false> {
  if (typeof path === 'string') {
    return access(path)
      .then(() => [path])
      .catch(() =>
        // `access` doesn't work well for symlinks, so we need to handle them.
        readlink(path)
          .then(() => [path])
          .catch(() => false),
      );
  } else {
    return readdir('.').then((entries) => {
      const matches = entries.filter((entry) => entry.match(path));
      return matches.length > 0 ? matches : false;
    });
  }
}

export type VerifyMissingOptions = {
  /** The path of the file to possibly delete. */
  path: string | RegExp | (string | RegExp)[];
  /** Whether or not to delete the file should it exist. */
  remove?: boolean;
  /** Whether or not the promise should reject upon finding an existing file. */
  reject?: boolean;
};
/**
 * @returns Whether or not the file is missing.
 */
export async function verify_missing({
  path,
  remove = false,
  reject = false,
}: VerifyMissingOptions): Promise<boolean> {
  const paths = Array.isArray(path) ? path : [path];
  return Promise.all(
    paths.map(async (path) => {
      const existing_files = await file_exists(path);
      if (existing_files !== false) {
        if (remove) {
          await Promise.all(
            existing_files.map((existing_file) => rm(existing_file)),
          );
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
    }),
  )
    .then(() => true)
    .catch(() => false);
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
  if ((await exec(`npm pkg get '${json_path}'`)).stdout.trim() !== '{}') {
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
  const config: Options = {
    filepath: path,
    ...(default_config as Options),
  };

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

export interface ConfigFile {
  content: string;
  dependencies: Dependencies;
}

export class DependencySet extends Set<string> {
  depend(dependency: string, command: string = dependency): string {
    assert(
      dependency.match(/^(?:[a-z0-9-_.]+|@[a-z0-9-_.]+\/[a-z0-9-_.]+)$/u) !=
        null,
      `Must be a valid package name.`,
    );
    this.add(dependency);
    return command;
  }

  add(dependencies: string | DependencySet | Set<string> | string[]): this {
    if (dependencies instanceof Set || Array.isArray(dependencies)) {
      for (const dependency of dependencies) super.add(dependency);
      return this;
    } else {
      return super.add(dependencies);
    }
  }
}

export class Dependencies {
  public readonly production = new DependencySet();
  public readonly development = new DependencySet();

  constructor();
  constructor(deps: Dependencies[]);
  constructor(prod: string[] | Set<string>, dev: string[] | Set<string>);
  constructor(
    a: string[] | Set<string> | Dependencies[] = [],
    b: string[] | Set<string> | undefined = Array.isArray(a) &&
    a[0] instanceof Dependencies
      ? undefined
      : [],
  ) {
    if (is_dependencies_array(a)) {
      for (const dep of a) {
        this.production.add(dep.production);
        this.development.add(dep.development);
      }
    } else {
      this.production.add(a);
      this.development.add(b ?? []);
    }
  }

  get p() {
    return this.production;
  }
  get d() {
    return this.development;
  }

  add(deps: Dependencies): this {
    this.production.add(deps.production);
    this.development.add(deps.development);
    return this;
  }
}

export function is_dependencies_array(arr: unknown): arr is Dependencies[] {
  return Array.isArray(arr) && arr[0] instanceof Dependencies;
}
