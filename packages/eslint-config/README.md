# @code-style/eslint-config

A set of ESLint rules customized for code corectness.

**The easiest way to get started with this project is to use our [setup script](https://www.npmjs.com/package/@code-style/create-configs).**

You're probably looking to use this with one of our other configs:

-   [`@code-style/node`](../eslint-config-node/README.md)
-   [`@code-style/cli`](../eslint-config-cli/README.md)
-   [`@code-style/typescript`](../eslint-config-typescript/README.md)
-   [`@code-style/jest`](../eslint-config-jest/README.md)
-   [`@code-style/browser`](../eslint-config-browser/README.md)
-   [`@code-style/react`](../eslint-config-react/README.md)

However, if you're trying to build a new config for a new environment (maybe some new frontend framework or something), you'll want to use this config as a layer in your project.

-   TODO(1): Evaluate the following plugins:

    -   [ ] https://github.com/Rel1cx/eslint-react

-   TODO(0): Fix intermittent `tsc` errors related to invalid types from `@types/glob` / `minimatch`.

    Some temporary workarounds to this issue follow:

    1. npm trickery

        1. Regenerate your package lock

            `$ rm -rf package-lock.json node_modules; npm i`

        1. Add the following overrides to your `package.json`

            ```json
            "overrides": {
                "minimatch": "^9",
                "@types/glob": "^8"
            }
            ```

        1. Update your lock file

            `$ npm i`

        1. Remove the overrides we added earlier
        1. Update your lock file again

            `$ npm i`

        1. Observe that `node_modules/@types/glob` and `node_modules/minimatch` have been removed from your package lock.

    1. Typescript type hack
        1. Add an empty `types` array to your `tsconfig`
