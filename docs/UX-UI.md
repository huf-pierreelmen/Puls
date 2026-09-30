

<!-- hufvudstaden-guidance:start -->
Shared company guidance, version 0.17.1. Updated centrally; do not edit this block.
Keep application-specific details outside this block. The shared rules here supersede older copied shared rules; explicit project exceptions still apply.


# UX/UI

Detta dokument beskriver gemensamma principer för användargränssnitt.

Brand-specifika visuella regler finns under `brand/`.

## Användarupplevelse

- Utgå från användarens uppgift, inte systemets interna struktur.
- Prioritera enkelhet och tydlighet framför funktionstäthet.
- Viktiga funktioner ska vara lätta att hitta och förstå.
- Undvik onödiga steg, dialoger och bekräftelser.
- Ge tydlig feedback på användarens handlingar.
- Hantera loading, empty, success och error states.
- Felmeddelanden ska förklara vad som gick fel och vad användaren kan göra.

## Konsekvens

- Återanvänd etablerade komponenter och mönster.
- Samma funktion ska normalt fungera och se likadan ut i hela applikationen.
- Skapa inte nya visuella variationer utan tydlig anledning.

## Responsiv design

Gränssnitt ska fungera på relevanta skärmstorlekar.

Webbapplikationer ska normalt vara responsiva om projektkraven inte säger något annat.

## Tillgänglighet

Tillgänglighet ska vara en del av implementationen från början.

Använd bland annat semantisk HTML, tydliga labels, tangentbordsnavigation, tillräckliga kontraster, synliga focus states samt tillgängliga formulär och felmeddelanden.

WCAG ska användas som vägledning där det är relevant. En obligatorisk WCAG-nivå ska inte skrivas in här innan organisationen har beslutat om en sådan.

## Visuell identitet

Primärt brand anges i `PROJECT.md`.

Mappningen är:

- `NK` → `brand/nk/`
- `NK Retail` → `brand/nk-retail/`
- `Hufvudstaden` → `brand/hufvudstaden/`
- `Bibliotekstan` → `brand/bibliotekstan/`
- `Cecil` → `brand/cecil/`
- `Brand neutral` → ingen brandmapp

Vid valt brand ska motsvarande `DESIGN-GUIDELINES.md` läsas innan användargränssnitt skapas eller ändras.

Brand-specifika visuella regler gäller före generella visuella rekommendationer i detta dokument. Övriga UX-principer gäller fortfarande.

Om projektet är brandneutralt ska endast dessa gemensamma UX/UI-principer användas.

Hitta aldrig på företagsspecifika färger, typsnitt, logotyper, bildmanér eller grafiska element.

<!-- hufvudstaden-guidance:end -->
