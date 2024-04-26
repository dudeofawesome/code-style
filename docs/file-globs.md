# `shopt` workarounds

## Options

1. `glob` CLI or `find` / `fd`

    Use `glob`'s CLI to generate our lists of files in a sub-shell (eg: `node --test $(glob '**/*.spec.ts')`).

1. script files

    Break out NPM scripts into script files located within each repo, likely in a `/scripts` dir.

1. scripts package

    Extract all of the NPM scripts `code-style` adds into a package and call them from NPM.

1. `script-shell` shopt

    Make NPM launch bash with the `shopts` already set.
    Bash supports the `-O` option to specify `shopts` at launch, but NPM doesn't parse the string set in `script-shell`, it merely executes it as a command, so that doesn't actually work.
    There are ways to work around this, such as creating an NPM package with a binary that does this.

## Pros & Cons

| method               | pro                                | con                                              |
| -------------------- | ---------------------------------- | ------------------------------------------------ |
| `glob` CLI           | simple~ish                         | another package to maintain                      |
|                      | supports all shells                | command would look a little weird                |
| script files         | simple implementation              | clutters repo                                    |
|                      | better readability in script       | harder to tell what's going on in `package.json` |
|                      | can drop `.npmrc`'s `script-shell` |                                                  |
| scripts package      | single source of truth for scripts | individual repos can't tweak commands            |
| `script-shell` shopt | readable `package.json`            | unsure of feasibility                            |
|                      | could be relatively clean          |                                                  |
