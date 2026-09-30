# Puls

Primary brand: Hufvudstaden. Brand guidance: brand/hufvudstaden/DESIGN-GUIDELINES.md.
React 18, TypeScript, Vite and Tailwind 3 application; Supabase is the backend provider.
Puls is an internal Swedish resource-planning tool for project managers. It replaces
Excel planning with projects, people, date-range allocations and controlled master data.

The design system is installed as an ordinary package from a tracked vendor tarball.
No npm link, workspace, source aliases or runtime sibling checkout dependency.
Run npm run design-system:registry -- <version> after a release is published.

Supabase persistence uses normalized tables and an atomic save_project RPC.
Versioned schema, fictional seed data and explicitly opt-in test permissions live
in supabase/. No remote database has been provisioned by this implementation.
Missing environment values select a clearly labeled browser-local demo. Configured
Supabase query failures never fall back to demo data. See docs/PULS.md for setup.
Microsoft SSO and real Dalux synchronization are deferred. The test permission
script allows unauthenticated access to fictional data only, never real business data.
Allocations use inclusive date ranges. Utilization is calendar-day weighted and
also reports peak concurrent utilization to expose short overloads.

Application Tailwind has preflight disabled because the design system owns base styles.
Cormorant Garamond is loaded from the design system font CSS export, with its OFL-1.1 license bundled in the package. Body text uses Arial. The official black Hufvudstaden logo is imported from the package; its original vector paths and proportions are preserved. Follow the supplied brand manual for usage.

<!-- hufvudstaden-guidance:start -->
Shared company guidance, version 0.17.1. Updated centrally; do not edit this block.
Keep application-specific details outside this block. The shared rules here supersede older copied shared rules; explicit project exceptions still apply.


# Projekt

## Identitet

Projektnamn:

Beskrivning:

## Organisation

Primärt brand:

Ange exakt ett av följande värden:

- `NK`
- `NK Retail`
- `Hufvudstaden`
- `Bibliotekstan`
- `Cecil`
- `Brand neutral`

Mappningen är:

| Värde | Brandmapp |
|---|---|
| `NK` | `brand/nk/` |
| `NK Retail` | `brand/nk-retail/` |
| `Hufvudstaden` | `brand/hufvudstaden/` |
| `Bibliotekstan` | `brand/bibliotekstan/` |
| `Cecil` | `brand/cecil/` |
| `Brand neutral` | Ingen brandmapp |

Om projektet är `Brand neutral` ska endast `docs/UX-UI.md` följas för visuell design. Hitta inte på bolagsfärger, typsnitt, logotyper eller annan visuell identitet.

## Teknik

Detta är utgångsläget för nya webbapplikationer. Ändra fältet om projektet väljer något annat, och dokumentera avvikelsen under Projektspecifika krav och avvikelser.

Frontend: Vite, React 18, Tailwind

Backend: Node

Databas: PostgreSQL via Supabase, eller SQL. Välj ett i projektet.

Hosting: On-prem, om inget annat motiverar något annat.

Autentisering: Entra SSO, eller autentisering som ligger separat. Välj ett i projektet.

Externa integrationer:

## Miljöer

Development:

Stage/Test:

Production:

## Projektspecifika krav och avvikelser

Dokumentera endast krav eller medvetna avvikelser som är specifika för projektet.

Explicit angivna avvikelser här gäller före motsvarande generella riktlinjer.

Gemensamma regler ska inte kopieras hit.

<!-- hufvudstaden-guidance:end -->
