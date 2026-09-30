

<!-- hufvudstaden-guidance:start -->
Shared company guidance, version 0.16.0. Updated centrally; do not edit this block.
Keep application-specific details outside this block. The shared rules here supersede older copied shared rules; explicit project exceptions still apply.


# Arkitektur

Detta dokument beskriver gemensamma arkitekturprinciper.

Målet är lösningar som är enkla att förstå, testa, förändra och förvalta över tid.

## Principer

- Välj den enklaste arkitektur som löser behovet väl.
- Separera affärslogik från UI, datalagring och externa tjänster där det skapar tydliga ansvar.
- Skapa tydliga gränser mellan moduler och ansvarsområden.
- Undvik onödig koppling mellan komponenter och externa system.
- Föredra standardlösningar och etablerade mönster framför egen speciallogik.
- Introducera inte nya ramverk, abstraktioner eller arkitekturmönster utan tydligt behov.
- Lösningen ska vara testbar och möjlig att förändra utan omfattande sidoeffekter.

Kräv inte Hexagonal Architecture, Clean Architecture, microservices eller något annat specifikt arkitekturmönster. Arkitekturen ska anpassas efter lösningens faktiska behov.

## Externa system

Integrationer mot API:er, databaser och andra externa tjänster ska hållas separerade från affärslogik när det förbättrar testbarhet och förvaltning.

Använd adapters eller motsvarande abstraktion när det ger ett konkret värde.

Hantera relevanta fel, timeouts, validering och retries kontrollerat.

## Data

- Det ska vara tydligt vilket system som äger respektive data.
- Undvik onödig duplicering.
- Viktiga datamodeller och dataflöden ska vara begripliga.
- Databasförändringar ska hanteras genom versionsstyrda migrationer där det är tillämpligt.

## Säkerhet

Säkerhet ska vara en del av arkitekturen från början.

- Använd etablerad autentisering och auktorisering.
- Tillämpa principen om minsta möjliga behörighet.
- Secrets och credentials får aldrig lagras i källkod.
- Validera data vid systemgränser.
- Känslig information ska hanteras enligt organisationens säkerhetskrav.

Om lösningen kan hantera personuppgifter:

- samla inte in mer persondata än lösningen behöver,
- undvik att logga personuppgifter,
- begränsa åtkomst till de användare och system som behöver den,
- dokumentera var personuppgifter lagras när det är relevant.

Dessa principer ersätter inte en juridisk bedömning eller verifiering av full GDPR-efterlevnad.

## Arkitekturbeslut

Viktiga arkitekturbeslut ska dokumenteras kortfattat tillsammans med motiv och konsekvenser.

För större beslut kan Architecture Decision Records, ADR, användas i `docs/adr/`.

Arkitekturdokumentation ska uppdateras när lösningen förändras väsentligt.

<!-- hufvudstaden-guidance:end -->
