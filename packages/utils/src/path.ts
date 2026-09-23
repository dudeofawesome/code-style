import {
  mkdir,
  realpath,
  stat,
  writeFile,
  symlink,
  rm,
} from 'node:fs/promises';
import { cwd } from 'node:process';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';

export async function find_node_modules_path(
  start: string = cwd(),
): Promise<string> {
  const node_modules = 'node_modules';
  const needle = '.package-lock.json';

  let base = await realpath(start);

  // eslint-disable-next-line no-await-in-loop
  while (!(await path_exists(join(base, node_modules, needle)))) {
    const parent = dirname(base);

    if (base === parent) throw new Error();
    else base = parent;
  }

  return join(base, node_modules);
}

/**
 * @param path The path to check.
 * @returns Whether or not the file exists.
 */
export function path_exists(path: string): Promise<boolean> {
  return stat(path).then(
    () => true,
    () => false,
  );
}

export async function create_tmp_dir(): Promise<string> {
  const tmp_dir = join(tmpdir(), 'code-style', randomUUID());

  return mkdir(tmp_dir, { recursive: true }).then((path) => {
    if (path == null) throw new Error(`Failed to create ${path}`);
    else return path;
  });
}

export async function setup_tmp_dir(
  files: {
    code: string;
    path: string;
  }[],
  symlink_node_modules: boolean = true,
): Promise<{
  tmp_dir: string;
  created_files: string[];
  cleanup: () => Promise<void>;
}> {
  const tmp_dir = await create_tmp_dir();
  const created_files: string[] = await Promise.all(
    files
      .map((f) => ({
        ...f,
        path: join(tmp_dir, f.path),
      }))
      .map((f) =>
        mkdir(dirname(f.path), { recursive: true })
          .catch(() => {
            return;
          })
          .then<string>(async () => {
            await writeFile(f.path, f.code);
            return f.path;
          }),
      ),
  );

  if (symlink_node_modules) {
    await symlink(
      await find_node_modules_path(),
      join(tmp_dir, 'node_modules'),
    );
  }

  return {
    tmp_dir,
    created_files,
    cleanup: async () => {
      await rm(tmp_dir, { force: true, recursive: true });
    },
  };
}
