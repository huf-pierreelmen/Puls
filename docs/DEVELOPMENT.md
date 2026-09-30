

<!-- hufvudstaden-guidance:start -->
Shared company guidance, version 0.16.0. Updated centrally; do not edit this block.
Keep application-specific details outside this block. The shared rules here supersede older copied shared rules; explicit project exceptions still apply.


# Utveckling

Detta dokument beskriver gemensamma krav för utveckling och kodkvalitet.

## Kodkvalitet

Kod ska vara enkel att förstå, testa och förändra.

- Använd tydliga och konsekventa namn.
- Håll funktioner, komponenter och moduler fokuserade på tydliga ansvar.
- Undvik duplicering när en gemensam lösning faktiskt förenklar koden.
- Föredra tydlig kod framför onödiga abstraktioner.
- Följ språkets och projektets etablerade konventioner.
- Använd strikt typning där tekniken stödjer det.
- Kommentarer ska främst förklara varför något görs när detta inte framgår av koden.

När projektet har etablerade mönster ska dessa normalt följas innan nya introduceras.

## Testning

Automatiserade tester är en obligatorisk del av utvecklingen.

Ny eller förändrad affärslogik ska ha relevanta unit tests.

Buggrättningar ska när det är praktiskt möjligt innehålla ett regressionstest som verifierar felet.

Ändringens storlek påverkar inte kravet på relevanta tester. Även små kodändringar ska testas i den omfattning som är relevant för ändringen.

Efter en kodändring ska agenten eller utvecklaren:

1. köra relevanta automatiserade tester,
2. köra lint och type checking där det finns,
3. verifiera build när ändringen kan påverka den,
4. åtgärda fel innan arbetet betraktas som klart.

En ändring är inte färdig förrän relevanta tester passerar.

Om tester inte kan köras ska detta anges tillsammans med orsaken.

Tester ska verifiera beteende och viktiga edge cases utan onödig koppling till implementationens interna struktur.

När projektet har etablerade testkommandon ska de användas.

## Definition of Done

En kodändring är klar när:

- implementationen är färdig,
- relevanta tester finns och passerar,
- lint/type check/build passerar där det är tillämpligt,
- inga kända fel har ignorerats,
- eventuell påverkan på databas, integrationer, konfiguration eller deployment har identifierats.

## Dependencies

Lägg inte till nya dependencies utan tydligt behov.

Föredra etablerade och aktivt underhållna bibliotek, befintliga dependencies framför nya med samma funktion, och standardfunktionalitet när den löser behovet enkelt.

## Konfiguration och secrets

- Secrets får aldrig checkas in i Git.
- Miljöspecifik konfiguration ska hållas utanför källkoden.
- `.env.example` eller motsvarande ska dokumentera nödvändiga variabler utan riktiga credentials.
- Utveckling ska som standard ske mot utvecklings- eller testmiljö, inte produktion.

## Git

Gör små och begripliga ändringar.

Commit-meddelanden ska tydligt beskriva ändringen.

Blanda inte orelaterade förändringar i samma commit eller pull request.

Följ projektets branching- och pull request-process där sådan finns.

## Deployment och infrastruktur

Produktionsdeployment, databasmigrationer, infrastructure changes eller andra potentiellt destruktiva åtgärder får inte utföras automatiskt om det inte uttryckligen ingår i uppgiften.

Om en förändring kräver deployment, databasmigration, ny eller ändrad environment variable, ändrad infrastruktur eller ändrad extern konfiguration ska detta tydligt anges.

Följande ska inte införas som absoluta regler: maximalt antal kodrader per funktion, obligatorisk coverage-procent, obligatorisk SOLID-implementation eller obligatoriska design patterns.

Fokusera på resultat, begriplighet, säkerhet och testbarhet.

<!-- hufvudstaden-guidance:end -->
