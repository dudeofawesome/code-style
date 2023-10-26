import { ESLint, Linter } from 'eslint';

export function initESLint(
  config: Linter.Config<Linter.RulesRecord, Linter.RulesRecord>,
  options: ESLint.Options = {},
): ESLint {
  return new ESLint({
    useEslintrc: false,
    overrideConfig: { root: true, ...config },
    ...options,
  });
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
