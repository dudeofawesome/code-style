import type { Config } from 'jest';
import type { Config as ConfigNS } from '@jest/types';

type Reporter = string | ConfigNS.ReporterConfig;

const reporters: Record<'default' | 'summary' | 'github' | 'gitlab', Reporter> =
  {
    default: 'default',
    summary: 'summary',
    github: ['github-actions', { silent: false }],
    gitlab: 'jest-junit',
  };

const reporter_sets: Record<'default' | 'github' | 'gitlab', Reporter[]> = {
  default: [reporters.default],
  github: [reporters.github, reporters.summary],
  gitlab: [reporters.default, reporters.gitlab],
};

const reporter: Reporter[] = ((): Reporter[] => {
  /* eslint-disable n/no-process-env */
  if (process.env.GITHUB_ACTIONS === 'true') return reporter_sets.github;
  else if (process.env.GITLAB_CI === 'true') return reporter_sets.gitlab;
  else return reporter_sets.default;
  /* eslint-enable n/no-process-env */
})();

export const config: Config = {
  reporters: reporter,
};
