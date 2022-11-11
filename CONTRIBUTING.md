## environment

I use **[nvm](https://github.com/nvm-sh/nvm)** to manage my node versions.

```bash
brew install nvm
```

## development setup

- create a fork of the repo, clone it, and install the dependencies

```bash
cd git-devbox
nvm install
npm install
```

- setup git hooks

```bash
npx husky install
```

- build it in watch mode

```bash
npm run build -- --watch
```

- you can now use the cli

```bash
./git-dev <command_name> [command_args] [command_options]
```
