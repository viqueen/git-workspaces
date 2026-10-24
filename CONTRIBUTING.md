## environment

I use **[mise](https://mise.jdx.dev/)** to manage the toolchain. The pinned
`node` and `pnpm` versions live in [`.mise.toml`](.mise.toml).

```bash
brew install mise
```

## development setup

- create a fork of the repo, clone it, and install the toolchain and dependencies

```bash
cd git-workspaces
mise install
pnpm install
```

- setup git hooks

```bash
git config core.hooksPath .husky
```

- build it in watch mode

```bash
pnpm build:watch
```

- you can now use the cli

```bash
./git-dev <command_name> [command_args] [command_options]
```
