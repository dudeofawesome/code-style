#!/usr/bin/env bash
set -e

npm version --no-git-tag-version "$1"

version="$(jq --raw-output '.version' package.json)"

npm version "$version" --ws

git add package*.json **/package*.json
git commit --message "🚀🔖 release v$version"
git tag "v$version"
