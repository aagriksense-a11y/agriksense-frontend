# Porting notes (EJS → Next.js + Tailwind)

`web/` is the Next.js 16 (App Router, TypeScript) + Tailwind v4 port of the EJS views in
`server/views/`. The Fastify API in `server/` is unchanged and is proxied to
`http://localhost:5000` by `next.config.ts` (`API_ORIGIN`), so pages keep calling
`/api/...` exactly like the legacy `<script>` blocks did.

## Page → source map

| Route | Legacy source |
| --- | --- |
| `/` | `server/views/index.ejs` + `css/style.css` |
| `/login`, `/signup` | `login.ejs`, `signup.ejs`, `css/auth.css`, `js/auth.js` |
| `/dashboard`, `/farmers`, `/farms`, `/drone`, `/iot`, `/advisory`, `/agriscore`, `/analytics` | matching `.ejs` + `css/dashboard.css` (admin shell) |
| `/farmer-dashboard`, `/dco-dashboard`, `/org-dashboard` | matching `.ejs` + `css/dashboard.css` (role shell) |

## Conventions

- **Tailwind only.** No new `.css` files and no `styled` blocks. Element styling goes in
  `className`; anything that genuinely cannot be expressed as a single utility (multi-layer
  gradients, conic gauges, legacy breakpoints) already lives in `src/app/globals.css` as an
  `@utility`. Add a new `@utility` there rather than repeating a 300-character class string.
- **Pixel fidelity is the target.** Read the legacy CSS rule for every element you port and
  translate its values exactly: `font-size`, `letter-spacing`, `padding`, colours. Where the
  legacy value is not in the token scale, use an arbitrary value (`text-[13px]`, `bg-[#eaf5c9]`).
- **Breakpoints are legacy ones, not Tailwind defaults.** Dashboards: `max-1100px`,
  `max-900px`, `max-560px`. Landing/auth: `max-1000px`, `max-680px`, `max-520px`,
  `max-420px`. These are `@custom-variant` definitions in `src/app/globals.css`, not
  `max-[560px]`: Tailwind v4 compiles the bracket form to `(width < 560px)` while the legacy
  sheets use inclusive `max-width`, so the two would disagree on the breakpoint pixel itself.
  Keep the declarations in the file in descending order — declaration order is the cascade
  order, and the legacy sheets stack their `@media` blocks narrowest-last too.
- **Fonts.** Landing/auth use `font-sans`; the dashboard shell uses `font-dm` (already applied
  by `DashboardShell`). Mono labels use `font-mono` only where legacy spelled the full stack
  (`ui-monospace, SFMono-Regular, Menlo, monospace`, e.g. `.mono`); the landing shorthand
  `font: 10px ui-monospace` resolves to a different, narrower face in Chromium, so those sites
  use `font-ui-mono` instead. Check the legacy declaration before picking one.
- **Inherited UA styles are part of the design.** `src/app/globals.css` restores what Preflight
  would otherwise change (`small{font-size:smaller}`, heading/paragraph margins, `line-height:
  normal`), and some legacy rules lean on what the browser gives them — auth's `.btn-submit`
  never sets padding, so its computed `1px 6px` is reproduced with `px-[6px] py-px`. Dashboard
  pages do *not* need that: `css/dashboard.css` opens with `*{margin:0;padding:0}`, mirrored by
  the `.app-shell` rule in the base layer.
- **Use the shared pieces** before writing new ones: `src/components/ui.tsx` (`Card`,
  `CardHead`, `KpiCard`, `Tag`, `Pill`, `LivePill`, `Button`, `IconButton`, `Badge`, `Dot`,
  `Select`, `TableWrap`/`Th`/`Td`/`ClickableRow`, `List`, `MiniLine`, `ProgressBar`, `Drawer`,
  `Modal`, `FormField`/`inputClass`/`FormError`, `InitialTile`, `cx`),
  `src/components/icons.tsx`, `src/components/dashboard/shell.tsx`.
- **Data.** Call the API from client components with `api<T>()` from `src/lib/api.ts`; format
  with `money`/`num`/`mask`/`tagKind` from `src/lib/format.ts`. Port the legacy inline
  `<script>` fetch + render logic 1:1, including query params, endpoints and the loading/empty
  states it produced. Keep payload types local to the page that owns them.
- **Auth/session** comes from `useSession()` (`src/lib/use-session.ts`); `DashboardShell`
  already enforces the login redirect and the role → dashboard guard.

## Verify

```bash
cd web && npx tsc --noEmit && npx eslint . && npm run build
```

Then compare against the legacy render: `python3 -m http.server 8080 -d dist` serves the
pre-rendered EJS output at `http://localhost:8080/<page>.html`.

The port was signed off by snapshotting computed styles and element boxes on both origins at
`1280`, `1000`, `560`, `531` and `500` px wide and diffing them per element. With the
exceptions listed below, every element on all 14 routes matches exactly (same box, same
computed style) at all five widths, and page scroll heights match to the pixel.

## Deviations from legacy (all deliberate)

| Where | Legacy | Port |
| --- | --- | --- |
| `/dco-dashboard`, fare-rate label | renders the leaked template literal `Available fare rate (${"…"}` | reads `Available fare rate (your state)` |
| `/login`, `/signup` nav at ≤1000px | `☰` inherits `.nav-cta` white on the white bar, so the control is invisible | `text-ink`, i.e. visible |
| `/` hero description | `<div class="hero-desc">` | `<p>`; same box, better semantics. Landing scroll height differs by 1 px at every width, from sub-pixel rounding on assets the probe does not compare |
| `/iot` moisture chart | `<span style="height:…">` inside `.bar-track` never gets the `.bar` class, so the bars are invisible | reproduced as-is; fix it in both or neither |
| Sidebar "Member" nav item | never becomes active in any legacy state | reproduced |
| Drawer / modal | stay mounted off-screen when closed | same, with `inert` instead of `aria-hidden` so the hidden copy is not focusable |
| `<b>X</b><small>Y</small>` table cells | no whitespace between the inline elements, so they run together ("IrrigationWeekly") | reproduced; adding `{" "}` shifts auto-layout column widths by ~4 px |
| `.auth-visual p`, global `.dot` | author rules out-specify the component class next to them (`trust-text`, `.pill .dot`) | reproduced by matching the resulting computed values |

## Things not to undo

- `globals.css` pins `@import "tailwindcss" source(none)` + `@source ".."`. Auto-detection
  scrapes markdown and other repo files, which leaks example class names into the build.
- `IconButton` and the ID-box button must not get `shrink-0`: legacy's `.icon-btn` is
  shrinkable, and that is what keeps the topbar from squeezing the platform-ID chip into a
  three-line wrap on narrow phones.
- Session reads stay in a post-mount effect (`useSession`) because `requireSession()` also
  redirects; it cannot be a render-phase or store-snapshot read.
- Login/logout/role-guard redirects use full `window.location` navigations (3 eslint
  warnings), matching legacy's behaviour of dropping all client state.
