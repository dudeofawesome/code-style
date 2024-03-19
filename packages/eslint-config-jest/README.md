# @code-style/eslint-config-jest

My Jest eslint config

**The easiest way to get started with this project is to use our [setup script](https://www.npmjs.com/package/@code-style/create-configs).**

## Usage

1. Install this config plugin as a dev dependency.

    ```sh
    npm i -D @code-style/eslint-config-jest
    ```

1. Add the plugin to your `eslintrc`.

    You'll also want to have another eslint config for your environment. In this example, we'll use [my node one](../eslint-config-node/README.md) (which you'll need to install separately).

    ```yaml
    extends:
        - '@code-style'
        - '@code-style/jest'
    ```
