# Puls

React 18 + TypeScript + Vite + Tailwind 3, using the Hufvudstaden design system and a Supabase browser client.

## Start developing

Use Node 22 and npm 10. From this folder:

```powershell
npm ci
npm run dev
```

Open the local URL printed by Vite (normally http://127.0.0.1:5173).
Without backend configuration, Puls opens with fictional, browser-local demo data.
For Supabase persistence, follow [Puls setup and architecture](docs/PULS.md), including
the migration, seed and test-only access script. Merely adding the URL is not enough.
Run `npm run check` for lint, type checking, build, calculation and SQL transaction tests.
Run `npm run test:browser` for interactive Chromium checks (install with
`npx playwright install chromium` once if needed).

## Local design system now

The dependency is an ordinary npm package installed from `vendor/*.tgz`.
Commit `vendor/`, `package.json` and `package-lock.json`: a fresh checkout can then
run `npm ci` without the sibling design-system repository or a private registry.
Do not commit `node_modules/`.

After changing the sibling library, stop Vite and run:

```powershell
npm run design-system:local
npm run dev
```

This builds and packs `../hufvudstaden-design-system`, copies a content-named archive
into `vendor/`, installs it and refreshes central guidance. If the source is elsewhere:

```powershell
npm run design-system:local -- C:\path\to\hufvudstaden-design-system
```

There is no automatic live update of library source. Existing archives are kept;
you may remove unused archives after verifying that neither package manifest nor lockfile references them.

## Registry later

Once the package has been published and your npm access is configured:

```powershell
npm run design-system:registry -- 0.16.0
```

Replace `0.16.0` with the actual published version. This changes the dependency to
a pinned registry version, updates the lockfile and synchronizes guidance.
No application imports, CSS, or build configuration change. Commit both manifests.
You can then remove unreferenced vendor archives. For another private registry,
configure the `@hufvudstaden` scope using its registry URL and authenticate via npm;
never commit an access token. Publishing the library is a separate task.

`npm run update:design-system` refreshes whichever source is currently selected:
local tarball or the registry's latest release. `design-system:local` switches back.

## Supabase

1. Create or choose a development Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from its Connect dialog.
4. Apply the schema, seed and test permissions described in [docs/PULS.md](docs/PULS.md).
5. Restart Vite.

Use the exported `supabase` client in `src/lib/supabase.ts` for application queries
and authentication. It is `null` when configuration is missing or invalid; handle
that case before querying. This application accepts `sb_publishable_` keys.
All `VITE_*` values enter the browser bundle. Never use a secret or service_role key.
Enable Row Level Security and write appropriate policies before exposing any tables.

Versioned migrations live in `supabase/migrations/`; SSO is deferred. A hosted test
project is the simplest start; a local Supabase stack requires the Supabase CLI and Docker.

Reference: [Supabase React quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs).

## Styling and guidance

`src/main.tsx` imports package styles, Hufvudstaden theme styles, bundled Cormorant Garamond font CSS, then app CSS.
`index.html` sets `data-brand="hufvudstaden"` before rendering, including for portals.
Tailwind 3 supplies app layout utilities with preflight disabled to preserve the
library's base styles. Use library components for primitives and tokens for color.
See the [Tailwind 3 Vite guide](https://v3.tailwindcss.com/docs/guides/vite).

To change brands, change the theme import, HTML data-brand, guidance command and
PROJECT.md together. Read the chosen brand's installed guidance first. Cormorant Garamond fonts and their OFL-1.1 license come from the package; no font copying or CDN is needed. The official black Hufvudstaden logo is imported from the package with its source provenance and brand usage terms.

`npm run sync:guidance` refreshes managed documentation from the installed package.
Local instructions outside managed blocks are preserved.
