#!/usr/bin/env bash
set -e

npm run build --workspace packages/code-style
scripts/concurrently-ws.ts build \
  --skip \
    packages/code-style

echo 'All builds succeeded.'
