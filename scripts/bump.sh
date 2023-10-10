#!/usr/bin/env bash
set -e

DRYRUN=""

bump() {
  $DRYRUN npm version --no-git-tag-version "$1"

  version="$(jq --raw-output '.version' package.json)"

  $DRYRUN npm version "$version" --ws

  $DRYRUN git add package*.json **/package*.json
  $DRYRUN git commit --message "🚀🔖 release v$version"
  $DRYRUN git tag "v$version"
}

help () {
  echo -e ""
  echo -e "Usage:\t$(basename $0) [options] <newversion>|major|minor|patch|premajor|preminor|prepatch|prerelease"
  echo -e ""
  echo -e "Options:"
  echo -e "   -d, --dry-run        Don't commit anything"
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
  while getopts 'h-:' opt; do
    case "$opt" in
      d) DRYRUN="echo";;
      h) help; exit 0;;
      -)
        case "${OPTARG}" in
          dry-run) DRYRUN="echo";;
          help) help; exit 0;;
          *) option_error "$OPTARG";;
        esac
        ;;
      *) option_error "$OPTARG";;
    esac
  done
  shift $((OPTIND-1))

  bump "$@"
}

main "$@"
