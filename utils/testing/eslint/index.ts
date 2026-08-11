import { access } from 'node:fs/promises';
import { ESLint, Linter } from 'eslint';

const init_registry = new WeakMap<
  ESLint,
  { config: Linter.Config[]; options: ESLint.Options }
>();

export function initESLint(
  config: Linter.Config[],
  options: ESLint.Options = {},
): ESLint {
  const linter = new ESLint({
    // `true` = don't look for an eslint.config.* file; use `overrideConfig` alone
    overrideConfigFile: true,
    overrideConfig: config,
    ...options,
  });
  init_registry.set(linter, { config, options });
  return linter;
}

/**
 * Flat-config ESLint refuses to lint files outside its base path (the cwd),
 * so tests that write fixtures to a temp dir need a linter re-created with
 * that dir as its cwd.
 */
export function recreateWithCwd(linter: ESLint, cwd: string): ESLint {
  const init = init_registry.get(linter);
  if (init == null) return linter;
  return initESLint(init.config, { ...init.options, cwd });
}

export type FilePathResult = string;
export interface FilePathOpts {
  ts?: boolean;
  react?: boolean;
  test?: boolean;
}
export function filePath({
  ts = false,
  react = false,
  test = false,
}: FilePathOpts): FilePathResult {
  const ext = (ts ? 'ts' : 'js') + (react ? 'x' : '');
  return `${test ? 'test/' : ''}sample-${ext}.${ext}`;
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
