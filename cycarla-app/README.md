# Cycarla App

`cycarla-app` is a desktop GUI program written with Next.js and packaged with Tauri.

# Development Prerequisites

+ (Only on Linux), install [some packages](https://v2.tauri.app/start/prerequisites/#linux)
+ Install [Rust](https://www.rust-lang.org/tools/install)
+ Install [Deno](https://docs.deno.com/runtime/#install-deno)

# Develop

Navigate to `cycarla-app` directory and run `deno install`:
```
cd cycarla-app
```
```
deno install
```
Then, run app in development mode: 
```
deno task tauri dev
```

Navigate to http://localhost:1420 to see the app in a browser.

# Bundle & Distribute

The version number has to be manually updated in three places:
+ `src-tauri/tauri.conf.json`
+ `src-tauri/Cargo.toml`
+ `package.json`

1. Git commit and push to main.
1. Use Github.com to create a new release tag.
1. Follow below directions to create distributable binaries/installers. The builds can be performed only by the same platform as the target.

## Linux (Ubuntu)
```
npm run tauri build -- --bundles appimage
```

Upload resulting `.AppImage` package to Github releases.

## Windows

```
npm run tauri build
```

Upload resulting `.msi` installer file to Github releases.