# Contributing

## Release lines & dist-tags

- **`main` carries the 3.x line** (ESLint 10, flat config). While 3.x is in
  prerelease (`3.0.0-N`), every workspace `package.json` must carry
  `"publishConfig": { "tag": "next" }` so prereleases don't capture the
  `latest` dist-tag — the publish action runs a bare `npm publish`.
  Remove that field in the commit that cuts the stable `3.0.0`.
- **The 2.x line is frozen** at `2.0.0-35` (eslintrc, ESLint 8). If a fix is
  ever needed there, branch `v2.x` from the `v2.0.0-35` tag.
- Verify after each publish: `npm view @code-style/eslint-config dist-tags`.

## Authoring a new release

1. Author your code changes.
1. Commit your changes.
1. Run [`scripts/bump.ts`](scripts/bump.ts) to bump all package versions.
   **Only run this on `main` when you intend to release** — CI publishes any
   pushed branch whose version is new (gated by the `production` environment
   approval).
1. Push your changes!

## Updating dependencies across workspaces / packages

1. Run [`scripts/upgrade-packages.sh --help`](scripts/upgrade-packages.sh) to see usage information about upgrading packages.
