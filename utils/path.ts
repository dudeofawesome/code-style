import { realpath, stat } from 'node:fs/promises';
import { cwd } from 'node:process';
import { dirname, join } from 'node:path';

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

export function path_exists(path: string): Promise<boolean> {
  return stat(path).then(
    () => true,
    () => false,
  );
}
