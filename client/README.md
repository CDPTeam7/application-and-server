# Ecoce Frontend 

A sample PWA web app frontend created for a facial recognition preprocessing model.

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