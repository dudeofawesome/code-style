#!/usr/bin/env bash
set -e

bump() {
  npm version --no-git-tag-version "$1"

  version="$(jq --raw-output '.version' package.json)"

  npm version "$version" --ws

  git add package*.json **/package*.json
  git commit --message "🚀🔖 release v$version"
  git tag "v$version"
}

help () {
  echo -e ""
  echo -e "Usage:\t$(basename $0) [options] <newversion>|major|minor|patch|premajor|preminor|prepatch|prerelease"
  echo -e ""
  echo -e "Options:"
  echo -e "   -h, --help           Show this message"
  echo -e ""
  echo -e "Bumps all package versions in project to the specified version."
}

option_error () {
  echo "Unknown argument '$1'"
  help
  exit 128
}

main () {
  while getopts 'o:s:wlh-:' opt; do
    case "$opt" in
      h) help; exit 0;;
      -)
        case "${OPTARG}" in
          help) help; exit 0;;
          *) option_error "$OPTARG";;
        esac
        ;;
      *) option_error "$OPTARG";;
    esac
  done

  bump "$@"
}

main "$@"
