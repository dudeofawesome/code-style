#!/usr/bin/env bash
set -e

upgrade_packages() {
  input="$@"

  package_names=()
  package_versions=()

  regex='^(@?[a-z0-9\/\-]+)(@.+)?$'
  for package in $input; do
    package_name="$(echo "$package" | sed -r 's/'"$regex"'/\1/i')"
    package_version="$(echo "$package" | sed -r 's/'"$regex"'/\2/i')"

    package_names+=("$package_name")
    package_versions+=("$package_name${package_version:-@latest}")
  done

  echo "Upgrading to $package_versions"

  select_filter=".\"${package_names[0]}\" != null"
  for package_name in ${package_names[@]:1}; do
    select_filter="$select_filter and .\"$package_name\" != null"
  done

  all_packages="$(jq --raw-output \
    '[.workspaces[]]
      | map("\(.)/package.json")
      | .[]' \
    package.json)"

  relevant_workspaces="$(jq --raw-output \
    '.
      # join all dependency sets
      |   (.dependencies // {})
        * (.devDependencies // {})
        * (.peerDependencies // {})
        * (.optionalDependencies // {})
      # filter for packages with the specified packages
      | select('"$select_filter"')
      # get name of file
      | input_filename
      # get workspace name
      | split("/package.json")
      | .[0]
      # convert to npm workspace arg
      | "--workspace=\(.)"' \
    $all_packages)"

  echo "$relevant_workspaces"

  if [ -z "$relevant_workspaces" ]; then
    echo "No workspaces with specified packages found"
    exit 0
  fi

  npm install \
    ${package_versions[*]} \
    $relevant_workspaces
}

help () {
  echo -e ""
  echo -e "Usage:\t$(basename $0) [options] PACKAGE[@VERSION] [PACKAGE[@VERSION]...]"
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

  if [ -z "$1" ]; then
    echo "A package name is required"
    exit 1
  fi

  upgrade_packages "$@"
}

main "$@"
