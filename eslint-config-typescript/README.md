# @dudeofawesome/eslint-config-typescript

My Typescript eslint config

## Usage

1. Install this config plugin as a dev dependency.

    ```sh
    npm i -D @dudeofawesome/eslint-config-typescript
    ```

1. Add the plugin to your `eslintrc`.

    You'll also want to have another eslint config for your environment. In this example, we'll use [my node one](../eslint-config-node/README.md) (which you'll need to install separately).

    ```yaml
    extends:
        - '@dudeofawesome'
        - '@dudeofawesome/node'
        - '@dudeofawesome/typescript'
    ```

1. You might want to add some `ignorePatterns` to not lint your transpiled JS.

    ```yaml
    ignorePatterns:
        - '/out'
    ```
