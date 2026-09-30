# Puls MVP

Puls supports monthly resource planning, project contribution drill-down, a resource
timeline, individual workload charts, guided project creation/editing, project
archiving/restoration, resources and administration of controlled values.
All product UI is Swedish. Hufvudstaden primitives and theme remain authoritative.

## Start with a Supabase test project

1. Run `supabase/migrations/202609300001_puls.sql` in the test project's SQL editor.
2. Run `supabase/seed.sql` to insert fictional data. It preserves existing IDs on rerun.
3. For this unauthenticated MVP, explicitly run `supabase/development-access.sql`
   **only in a dedicated test project containing fictional data**. It grants public
   test access. The base migration grants no browser access; future SSO/role policies
   must replace the test policies before any real business or personal data is used.
4. Fill the existing, Git-ignored `.env.local`:

   ```dotenv
   VITE_SUPABASE_URL=https://YOUR-TEST-PROJECT.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

5. Restart `npm run dev`. The header changes from Demoläge to Supabase. Create or edit
   a project and refresh to verify persistence in your connected test environment.

No secret/service_role keys belong in browser configuration. No remote migration,
SSO, Dalux call, deployment, timer or background synchronization is performed by the app.

## Demo and fixtures

With empty configuration, demo data is stored in localStorage under `puls-demo-v1`.
This is explicitly labeled and is not Supabase persistence. Demo edits are not
automatically imported when connecting Supabase. Remove that localStorage entry to
reset the demo. Database or permission errors with a configured client are shown
with a retry action; they do not switch to demo mode.

Fixtures contain 12 internal people, 3 consultants, 4 AO, 8 FO, 24 properties and
24 projects, with allocation periods from September 2026 to March 2027, overloads
and unused capacity. Names/project data are fictional examples, not live records.
`npm run seed:generate` regenerates SQL from the same service-layer fixtures.

## Data and calculations

- `projects` owns project metadata, one current comment and update timestamps.
  A future project-comment history table can reference the stable project ID.
- `project_people` supports multiple resources/roles; `allocations` references
  assignments and uses inclusive start/end dates with 0–200% allocation.
- Classifications have active flags; project levels use a join table. Deactivation
  preserves references. Archiving excludes projects from utilization, while keeping
  their assignments and periods for restoration.
- AO/FO/property relationships use foreign keys, including consistent AO/FO pairs.
- `save_project` saves metadata, assignments, periods and levels atomically under
  invoker permissions and RLS. An updated_at token rejects stale project edits.
  Database checks reject invalid dates, percentages and broken relations.
- Monthly and arbitrary-range averages use calendar days, including weekends.
  Example: 40% for 15 of 30 days contributes 20%. Concurrent periods sum, including
  overlaps on the same project. Overloads are never clamped. Peak simultaneous
  allocation is shown as well, since averages can hide short conflicts.
- Planning filters limit the projects included in the displayed totals. The UI
  explicitly explains this; filtered totals are not a person's organization-wide total.

## Boundaries

`src/domain` contains reusable types, calculations and validation. `src/services`
contains Supabase persistence, demo fixtures and the `MasterDataProvider` interface.
UI components consume loaded normalized data; they do not import fixture arrays.
The future Dalux adapter belongs server-side, normalizes data, and persists it to
Supabase. React continues using the master-data provider. The manual sync button
currently reads available master data as an explicit test; it neither contacts
Dalux nor pretends to have completed a real synchronization.

UI is divided among planning, projects, project editing, resource and administration
features. Hash navigation supports browser history without introducing a router.
Recharts is the existing workload chart dependency; timeline layout belongs to Puls.
The public DatePicker and Combobox exports are used for dates and long selectors.
An app CSS z-index adjustment puts package 0.17.x popovers above dialogs.

## Verification

`npm run check` runs ESLint, TypeScript, Vite and Node tests. Database tests execute
the actual migration and seed in PGlite (PostgreSQL in WASM), including invoker
permissions, atomic rollback, edit concurrency and relational constraints. PGlite
and Playwright are development-only dependencies and are not shipped in the app.

`npm run test:browser` runs actual Chromium interactions: filters, drill-down,
timeline/workload, creation, reload, editing, archive, administration and manual
mock sync. A dedicated Vite mode uses empty backend configuration and fresh browser
storage. Browser snapshots and traces are written to ignored `test-results/`.

Local SQL tests do not verify your hosted Supabase project's PostgREST configuration
or network permissions; the final connection/refresh check requires its real URL,
publishable key and applied SQL scripts.
