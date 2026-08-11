#!/usr/bin/env bash
# End-to-end smoke test: publish every workspace to a throwaway local
# registry, scaffold a sample project with create-configs, and prove the
# generated flat config actually lints.
set -euo pipefail

root=$(cd "$(dirname "$0")/.." && pwd)
work=$(mktemp -d)
verdaccio_pid=''
cleanup() {
  [[ -n $verdaccio_pid ]] && kill "$verdaccio_pid" 2>/dev/null || true
  rm -rf "$work"
}
trap cleanup EXIT

echo '=== build + pack workspaces ==='
cd "$root"
npm run build
mkdir -p "$work/tarballs"
npm pack --workspaces --pack-destination "$work/tarballs" > /dev/null

echo '=== start local registry ==='
cat > "$work/verdaccio.yaml" <<EOF
storage: $work/storage
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
packages:
  '@code-style/*':
    access: \$all
    publish: \$all
  '**':
    access: \$all
    proxy: npmjs
log: { type: stdout, level: warn }
EOF
npx --yes verdaccio@6 --config "$work/verdaccio.yaml" --listen 4873 &
verdaccio_pid=$!
for _ in $(seq 1 60); do
  curl -fsS http://localhost:4873/-/ping > /dev/null 2>&1 && break
  sleep 1
done
curl -fsS http://localhost:4873/-/ping > /dev/null

export NPM_CONFIG_USERCONFIG="$work/.npmrc"
{
  echo 'registry=http://localhost:4873/'
  echo '//localhost:4873/:_authToken=e2e-smoke-test'
} > "$NPM_CONFIG_USERCONFIG"

echo '=== publish workspaces to local registry ==='
for tarball in "$work"/tarballs/*.tgz; do
  # the private utils workspace gets packed but can't be published
  [[ $tarball == *code-style-utils-* ]] && continue
  # --tag is required for prerelease versions (the tag itself is irrelevant
  # here); provenance only works in CI, so force it off
  npm publish "$tarball" --registry http://localhost:4873 --tag e2e \
    --provenance=false > /dev/null
done

echo '=== scaffold sample project ==='
proj="$work/sample"
mkdir -p "$proj/src"
cd "$proj"
npm init -y > /dev/null
cat > .codestyleinitrc.yaml <<EOF
version: e2e
project_type: backend
languages:
  - ts
runtime: nodejs
builder: esbuild
input_dir: src/
output_dir: dist/
technologies:
  - esm
library: false
lenient: false
overwrite: true
EOF
printf 'var answer = 42;\nexport const result = answer;\n' > src/index.ts
node "$root/packages/create-configs/bin/create-configs.js" --yes

echo '=== assertions ==='
test -f eslint.config.mjs || { echo 'FAIL: eslint.config.mjs not written'; exit 1; }
test ! -e .eslintrc.yaml || { echo 'FAIL: legacy .eslintrc.yaml still present'; exit 1; }

npx eslint --print-config src/index.ts > /dev/null \
  || { echo 'FAIL: --print-config errored'; exit 1; }

if npx eslint src/index.ts > "$work/lint-out.txt" 2>&1; then
  echo 'FAIL: expected lint errors on the seeded violation'; cat "$work/lint-out.txt"; exit 1
fi
grep -q 'no-var' "$work/lint-out.txt" \
  || { echo 'FAIL: expected a no-var finding'; cat "$work/lint-out.txt"; exit 1; }

printf 'const answer = 42;\nexport const result = answer;\n' > src/index.ts
npx eslint src/index.ts || { echo 'FAIL: clean file should lint clean'; exit 1; }

node -e '
const pkg = require("./package.json");
if (pkg.devDependencies?.eslint == null) { console.error("FAIL: eslint missing from devDependencies"); process.exit(1); }
if (pkg.scripts["lint:js"] !== "eslint . --cache") { console.error(`FAIL: unexpected lint:js: ${pkg.scripts["lint:js"]}`); process.exit(1); }
'

echo 'e2e OK'
