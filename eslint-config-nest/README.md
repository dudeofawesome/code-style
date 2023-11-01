# @dudeofawesome/eslint-config-nest

My NestJS eslint config

## Usage

1. Install this config plugin as a dev dependency.

    ```sh
    npm i -D @dudeofawesome/eslint-config-nest
    ```

1. Add the plugin to your `eslintrc`.

    ```yaml
    extends:
        - '@dudeofawesome'
        - '@dudeofawesome/nest'
    ```

1. You might also want to specify an `ecmaVersion`.

    ```yaml
    parserOptions:
        ecmaVersion: 2022
    ```
