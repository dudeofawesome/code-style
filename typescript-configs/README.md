# @dudeofawesome/typescript-configs

My set of tsc config files

## Usage

1. Install this config plugin as a dev dependency.

    ```sh
    npm i -D @dudeofawesome/eslint-config-typescript
    ```

1. Pick the appropriate config to base yours on.
1. Create your `tsconfig.json`.

    ```json
    {
        "extends": "./node.json"
    }
    ```

1. Set your `include` and `exclude` paths.

    Here's an example of something that might work for you:

    ```json
    {
        ...
        "include": ["src/"],
        "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
    }
    ```
