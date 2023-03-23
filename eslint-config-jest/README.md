# @dudeofawesome/eslint-config-jest

My Jest eslint config

## Usage

1. Install this config plugin as a dev dependency.

    ```sh
    npm i -D @dudeofawesome/eslint-config-jest
    ```

1. Add the plugin to your `eslintrc`.

    You'll also want to have another eslint config for your environment. In this example, we'll use [my node one](../eslint-config-node/README.md) (which you'll need to install separately).

    ```yaml
    extends:
        - '@dudeofawesome'
        - '@dudeofawesome/jest'
    ```
