# Agriksense web (Next.js port)

Next.js 16 (App Router, TypeScript) + Tailwind v4 rewrite of the EJS front end in
`server/views/`. It is a **parallel port**: the Fastify app keeps serving the legacy pages, and
this app is not wired into the build or the static deploy yet. `server/`, `css/`, `js/` and
`dist/` are the reference implementation — read them, do not edit them.

## Routes

| Route | Legacy template |
| --- | --- |
| `/` | `index.ejs` |
| `/login`, `/signup` | `login.ejs`, `signup.ejs` |
| `/dashboard`, `/farmers`, `/farms`, `/drone`, `/iot`, `/advisory`, `/agriscore`, `/analytics` | admin shell pages |
| `/farmer-dashboard`, `/dco-dashboard`, `/org-dashboard` | role shell pages |

## Run

```bash
npm --prefix web install
npm --prefix web run dev        # http://localhost:3000
```

`/api/*` and `/health` are rewritten to the Fastify server, so start that too
(`npm run dev` at the repo root, port 5000). Override the target with `API_ORIGIN`, e.g.
`API_ORIGIN=http://localhost:5000 npm --prefix web run dev`.

Sign-in state lives in `localStorage` (`agriksense_token`, `agriksense_user`), exactly like the
legacy scripts, so the two apps can run side by side against the same API.

## Check

From this folder:

```bash
npx tsc --noEmit && npx eslint . && npm run build
```

`node_modules/.bin/eslint` is expected to report three `no-location-assign-relative-destination`
warnings: auth redirects are full-page navigations on purpose.

## More

- [`PORTING.md`](./PORTING.md) — porting conventions, the legacy-vs-port deviation list, and the
  gotchas that must not be undone.
- Design tokens, `@utility` blocks and the restored UA styles live in
  [`src/app/globals.css`](./src/app/globals.css); shared UI lives in
  [`src/components/ui.tsx`](./src/components/ui.tsx).
