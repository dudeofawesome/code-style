#!/usr/bin/env bash
set -e

npm run build --workspace packages/code-style
npm run build --workspace packages/eslint-plugin-nest
scripts/concurrently-ws.ts build \
  --skip \
    packages/code-style,packages/eslint-plugin-nest

echo 'All builds succeeded.'
