# IUNU Code Style Guide

A bunch of configuration files for code style standards. Intended to be shared across all IUNU's repos.

### Usage

#### Add config files

```sh
npm i --save-dev @iunu/code-style
npx add-code-style
```

#### Consider adding some editor settings

- VS Code
    ```json
    {
        "typescript.tsdk": "./node_modules/typescript/lib",

        "editor.formatOnSave": true,
        "editor.formatOnType": true,
        "editor.formatOnPaste": true,
        "typescript.format.enable": false,
        "javascript.format.enable": false,
        "editor.defaultFormatter": "esbenp.prettier-vscode",

        "[ruby]": {
            "editor.defaultFormatter": "esbenp.prettier-vscode"
        }
    }
    ```
