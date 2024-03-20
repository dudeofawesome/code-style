# @code-style/typescript-configs

My set of tsc config files

**The easiest way to get started with this project is to use our [setup script](https://www.npmjs.com/package/@code-style/create-configs).**

## Usage

1. Install this config plugin as a dev dependency.

    ```sh
    npm i -D @code-style/typescript-configs
    ```

1. Pick an appropriate role config to base your on.

    For example, you could pick `@code-style/typescript-configs/roles/node.json`.

1. Pick any appropriate layer configs to add to your config.

    For example, you could pick `@code-style/typescript-configs/layers/esmodule.json`.

1. Create your `tsconfig.json`.

    ```json
    {
        "extends": [
            "@code-style/typescript-configs/roles/node.json",
            "@code-style/typescript-configs/layers/esmodule.json"
        ]
    }
    ```

1. Set your `baseUrl` and `outDir` paths.

    ```json
    {
        ...
        "compilerOptions": {
            "baseUrl": "src/",
            "outDir": "dist/"
        }
    }
    ```

1. Set your `include` and `exclude` paths.

    ```json
    {
        ...
        "include": ["src/"],
        "exclude": ["dist/"]
    }
    ```
