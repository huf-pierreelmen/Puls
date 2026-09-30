

<!-- hufvudstaden-guidance:start -->
Shared company guidance, version 0.17.1. Updated centrally; do not edit this block.
Keep application-specific details outside this block. The shared rules here supersede older copied shared rules; explicit project exceptions still apply.


# Hufvudstaden – brandresurser

Den här katalogen innehåller officiellt designmaterial för Hufvudstaden.

När designmanual, typsnitt, logotyp eller andra visuella resurser förändras ska informationen här ses över.

## DESIGN-GUIDELINES.md

Detta är den maskinläsbara sammanfattningen av de brandregler som utvecklare och AI-agenter ska följa.

Den innehåller regler som är relevanta vid digital utveckling, exempelvis färger, typografi, layout, komponentprinciper, logotypanvändning, bildmanér och tonalitet.

När den officiella designmanualen ändras ska även denna fil granskas och vid behov uppdateras.

## manuals/

Här lagras officiella designmanualer och brand guidelines i originalformat.

Exempel: `Brand-Guidelines.pdf`, `Digital-Design-Manual.pdf`, `Tone-of-Voice.pdf`.

PDF-filerna är källmaterial och referens.

När en ny officiell version ersätter en äldre ska den nya läggas här och `DESIGN-GUIDELINES.md` granskas.

Gamla manualer ska antingen tas bort eller tydligt versionsmärkas så att det inte råder tvekan om vilken som gäller.

## fonts/

Här lagras officiella typsnitt som får användas i digitala lösningar.

Exempel: `.woff2`, `.woff`, `.ttf`, `.otf`.

Typsnitt får endast checkas in om licensen tillåter lagring och distribution via Git på det sätt repositoryt används.

Lägg inte in fontfiler om licensen är oklar.

## assets/

Här lagras officiella grafiska resurser som kan användas av applikationen.

Exempel: logotyper, ikoner, illustrationer, grafiska symboler och godkända bilder.

Skapa vid behov undermappar:

```text
assets/
├── logos/
├── icons/
├── illustrations/
└── images/
```

Använd officiella originalfiler.

SVG bör normalt användas för logotyper och ikoner när officiell SVG finns.

## När ska vad uppdateras?

Ny designmanual: uppdatera `manuals/` och granska `DESIGN-GUIDELINES.md`.

Nytt eller ändrat typsnitt: uppdatera `fonts/` och typografireglerna i `DESIGN-GUIDELINES.md`.

Ny eller ändrad logotyp eller ikon: uppdatera `assets/` och `DESIGN-GUIDELINES.md` om användningsreglerna ändrats.

Ändrade färger, layoutregler, tonalitet eller komponentprinciper: uppdatera `DESIGN-GUIDELINES.md` och lägg in en ny officiell manual i `manuals/` om en sådan finns.

<!-- hufvudstaden-guidance:end -->
