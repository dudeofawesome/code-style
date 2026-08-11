# @code-style/eslint-config-typescript

My Typescript eslint config

## Usage

**The easiest way to get started with this project is to use our [setup script](https://www.npmjs.com/package/@code-style/create-configs).**

1. Install this config plugin as a dev dependency.

    ```sh
    npm i -D @code-style/eslint-config-typescript
    ```

1. Add the config to your `eslint.config.mjs`.

    ```js
    import { defineConfig } from 'eslint/config';

    import base from '@code-style/eslint-config';
    import typescript from '@code-style/eslint-config-typescript';

    export default defineConfig(base, typescript);
    ```

    You'll also likely want to have some of my other ESLint configs for your environment.

1. You might want to add some `ignorePatterns` to not lint your transpiled JS.

    ```yaml
    ignorePatterns:
        - '/out'
    ```
