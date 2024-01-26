# Development
In development, this Next.js frontend is git cloned, then `npm run dev`.

# Deployment
For deployment, users just need `npm` and `npx` to download it and run it:

```
npm i cycarla-frontend
```
```
npx cycarla-frontend
```

This is made possible through defining an executable script in `package.json`
```
  "bin": {
    "cycarla-frontend": "./run.sh"
  }
```
where `run.sh` is just the same `next dev ...` command as called by `npm run dev`.

## Publishing

```
npm login
npm publish
```