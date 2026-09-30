# Puls

Primary brand: Hufvudstaden (initial starter choice).
React 18, TypeScript, Vite and Tailwind 3 application; Supabase is the backend provider.
Product domain, data model and internal/external audience are not yet defined.

The design system is installed as an ordinary package from a tracked vendor tarball.
No npm link, workspace, source aliases or runtime sibling checkout dependency.
Run npm run design-system:registry -- <version> after a release is published.

Supabase setup currently provides a browser client only. No database tables,
authentication flow, migrations or remote resources have been created.
Missing environment values do not block local UI development.

Application Tailwind has preflight disabled because the design system owns base styles.
Fonts/logos are not bundled; approved Cormorant Garamond files must be supplied by the
application owner before brand-complete release. Current headings use the theme's
technical serif fallback; body text uses Arial. No invented logo is used.

<!-- hufvudstaden-guidance:start -->
Shared company guidance, version 0.16.0. Updated centrally; do not edit this block.
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
