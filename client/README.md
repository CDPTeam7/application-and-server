# Ecoce Frontend 

A sample PWA web app frontend created for a facial recognition preprocessing model.

## Installation

We use [`pnpm`](https://pnpm.io/ko/) for the package manager.

To install dependencies, add `pnpm` to your `npm` package first.
`pnpm` is not much different from `npm` commands.

```bash
npm install -g pnpm

cd client # unless you are not in /client directory.
pnpm install # install dependencies
```

## Run development server

Additional poetry scripts are not made yet.

It will be implemented via `build-and-run` method. For now, you should run `vite dev server` for developing `React` app. Run this commands below.

you also should run `flask` backbone if you want to try `api` features.

```bash
cd client
pnpm dev
```

## Build

Build command are also provided. All of build result are saved in `dist/` folder.

To build, run below. There also should not be any warnings in `React` app.

```bash
pnpm build
```