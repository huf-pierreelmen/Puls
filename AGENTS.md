# Working on Puls

Read PROJECT.md and the installed design system guidance before implementation.
Follow node_modules/@hufvudstaden/design-system/guidance/CONSUMING.md.
Use public design system exports for UI primitives. Keep application logic and layout here.
Run npm run check after code changes. Verify interactive changes in a browser.
Never place Supabase secret/service_role keys in browser code or VITE_* variables.

<!-- hufvudstaden-guidance:start -->
Shared company guidance, version 0.16.0. Updated centrally; do not edit this block.
Keep application-specific details outside this block. The shared rules here supersede older copied shared rules; explicit project exceptions still apply.


## Shared design-system guidance

Installed guidance version: 0.16.0. Mode: package. Active brand: hufvudstaden.

Read the application's own PROJECT.md first. Keep its business requirements and active brand authoritative.
Then read:
- node_modules/@hufvudstaden/design-system/guidance/CONSUMING.md
- node_modules/@hufvudstaden/design-system/template-docs/docs/DEVELOPMENT.md
- node_modules/@hufvudstaden/design-system/template-docs/docs/ARCHITECTURE.md
- node_modules/@hufvudstaden/design-system/template-docs/docs/UX-UI.md
- node_modules/@hufvudstaden/design-system/template-docs/brand/hufvudstaden/DESIGN-GUIDELINES.md

Prefer @hufvudstaden/design-system primitives; do not recreate them or hardcode brand colors.
The central PROJECT.md and AGENTS.md are source templates, not this application's project identity. Central asset references describe separately managed brand material; fonts and images are not installed by this command.

# Agentinstruktioner

Den här filen gäller oavsett verktyg. Cursor, Codex och Lovable läser den direkt. Claude Code och GitHub Copilot kommer hit via sina pekare.

Innan implementation ska du läsa:

1. `PROJECT.md`
2. `docs/DEVELOPMENT.md`
3. `docs/ARCHITECTURE.md`
4. `docs/UX-UI.md`
5. relevant `brand/<brand>/DESIGN-GUIDELINES.md` om projektet använder ett brand

Det primära brandet och eventuell brandmapp anges i `PROJECT.md`.

## Grundregler

- Välj den enklaste lösningen som uppfyller behovet väl.
- När projektet har etablerade mönster, följ dem innan nya introduceras.
- Introducera inte nya frameworks, dependencies, abstraktioner eller arkitekturmönster utan tydligt behov.
- Säkerhet och testbarhet ska ingå från början.
- Secrets eller credentials får aldrig lagras i källkod.
- Ändra inte produktion, databas eller extern infrastruktur utan uttrycklig instruktion.
- En kodändring är inte klar innan relevanta automatiserade tester har körts och passerat.
- Ändringens storlek påverkar inte kravet på relevanta tester.
- Kör lint, type checking och build där det är relevant.
- Om något inte kan verifieras eller testas ska detta tydligt anges tillsammans med orsaken.
- Hitta aldrig på brandregler, färger, typsnitt, logotyper eller andra företagsspecifika krav.

Explicit dokumenterade avvikelser i `PROJECT.md` gäller före generella riktlinjer, så länge de inte strider mot obligatoriska säkerhets- eller kvalitetskrav.

<!-- hufvudstaden-guidance:end -->
