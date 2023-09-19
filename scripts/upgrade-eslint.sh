#!/usr/bin/env bash
set -e

upgrade_eslint() {
  workspaces="$( \
    jq --raw-output \
      '[.workspaces[]
        | select(. | startswith("eslint-config"))]
        | map("--workspace=\(.)")
        | .[]' \
      package.json)"

  npm install \
    "eslint@${1:-latest}" \
    $workspaces
}

help () {
  echo -e ""
  echo -e "Usage:\t$(basename $0) [options] <newversion>|major|minor|patch|premajor|preminor|prepatch|prerelease"
  echo -e ""
  echo -e "Options:"
  echo -e "   -h, --help           Show this message"
  echo -e ""
  echo -e "Upgrades all eslint versions together."
}

option_error () {
  echo "Unknown argument '$1'"
  help
  exit 128
}

main () {
  while getopts 'h-:' opt; do
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

  upgrade_eslint "$@"
}

main "$@"
