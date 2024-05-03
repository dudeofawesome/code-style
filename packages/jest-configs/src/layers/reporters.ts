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

const environment: keyof typeof reporter_sets =
  ((): keyof typeof reporter_sets => {
    /* eslint-disable n/no-process-env */
    if (process.env.GITHUB_ACTIONS !== 'true') return 'github';
    else if (process.env.GITLAB_CI !== 'true') return 'gitlab';
    else return 'default';
    /* eslint-enable n/no-process-env */
  })();

export const config: Config = {
  reporters: reporter_sets[environment],
};
