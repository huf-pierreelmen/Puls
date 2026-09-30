

<!-- hufvudstaden-guidance:start -->
Shared company guidance, version 0.16.0. Updated centrally; do not edit this block.
Keep application-specific details outside this block. The shared rules here supersede older copied shared rules; explicit project exceptions still apply.


# Hufvudstaden – Design Guidelines

Dessa riktlinjer beskriver Hufvudstadens visuella regler för digitala produkter.

De kompletterar `docs/UX-UI.md`.

Källa är kommunikationsmanualen, version 2025-07-03:

`./manuals/HUF-manual_250703.pdf`

Manualen är yttersta källan. Om en regel inte framgår här ska manualen användas.

## Källmaterial

Designmanual: `./manuals/HUF-manual_250703.pdf`

Logotypfiler finns inte i `./assets/`. Återskapa inte logotypen med text, CSS eller egenritad grafik.

Typsnitt i `./fonts/`:

- Cormorant Garamond, för digitala rubriker
- Akzidenz-Grotesk Std, för print
- Electra LT Std, för print

Arial används digitalt enligt manualen men ligger inte som fil i katalogen.

Använd den här manualen när en nyare version inte har lagts in.

## Varumärkesuttryck

Hufvudstadens kommunikation ska upplevas som kunnig, trygg, varm, personlig, serviceinriktad, tydlig och kvalitativ.

Digitala produkter ska kombinera detta uttryck med enkla och användbara gränssnitt.

## Logotyp

Använd endast officiella logotypfiler från `./assets/`.

Skriv aldrig Hufvudstadens namn med ett typsnitt som ersättning för logotypfilen.

### Extern kommunikation

Svart är huvudlogotyp för extern kommunikation.

Använd normalt svart logotyp på ljus bakgrund, och vit logotyp på tillräckligt mörk bakgrund när det behövs.

Guld används endast i godkända särskilda sammanhang.

När logotypen används tillsammans med Hufvudstadens illustrationsmanér ska logotypen vara svart.

### Intern kommunikation

Mörkblå är primär färg för intern kommunikation.

Blå logotyp kan användas enligt officiella riktlinjer.

Vit logotyp kan användas på mörkblå bakgrund.

### Placering

Centrerad logotyp är primärt alternativ.

När centrerad placering inte fungerar kan logotypen placeras i hörn, primärt i övre hörn.

Respektera alltid logotypens officiella friyta.

Logotypen får inte förvrängas, recoloreras utanför godkända varianter, återskapas med text eller få andra element placerade inom friytan.

## Färg

### Primära digitala färger

```css
--huf-black: #000000;
--huf-dark-blue: #00386C;
--huf-gold: #C2974E;
--huf-cream: #F2F0EB;
```

Användning: svart primärt i extern kommunikation, mörkblå primärt i intern kommunikation, creme som godkänd bakgrund och guld sparsamt.

### Digital sekundärpalett

```css
--huf-gold-text: #8A6926;
--huf-beige: #EFE6D6;
--huf-sand: #F5F1E7;
--huf-light-blue: #DBE3EB;
--huf-powder-pink: #F8E0E2;
--huf-pastel-gold: #F9F4EF;
```

Sekundärfärger kan användas för bakgrunder, större ytor, tydliga innehållssektioner och ytor kring foto och illustration.

### Webbpalett

Den officiella webbpaletten innehåller:

```css
--huf-web-gold: #7C5E22;
--huf-web-beige: #F0E9DA;
--huf-web-light-beige: #F9F4EE;
--huf-web-light-blue: #DBE3EB;
--huf-web-light-pink: #F4E7E5;
```

För webb kan beige och ljusbeige användas för större bakgrunder och sektioner. Beige, ljusblå och ljusrosa kan användas kring bilder och illustrationer. Guld ska användas sparsamt, exempelvis för symboler eller kortare texter.

Använd inte hela färgpaletten samtidigt bara för att den finns.

Färg ska ha ett tydligt syfte.

Tillgänglig kontrast har företräde.

Om olika färgformat i manualen verkar motsäga varandra ska agenten använda uttryckligen angivet digitalt eller webb-HEX-värde, eller markera osäkerheten. Agenten får inte själv räkna fram eller gissa en brandfärg.

## Typografi

Hufvudstadens digitala typografi använder Cormorant Garamond och Arial.

### Cormorant Garamond

Använd primärt för digitala rubriker.

Normal behandling: Regular, centrerad eller medvetet asymmetrisk beroende på layout, främst för tydlig rubrikhierarki och mer redaktionella ytor.

### Arial

Använd för funktionell och löpande digital text, exempelvis brödtext, navigation, formulär, knappar, labels, tabeller, bildtexter och generell applikations-UI.

Om godkända fontfiler finns under `./fonts/` ska dessa användas enligt manualen.

Byt inte ut officiell typografi enbart av estetiska skäl.

## Texttonalitet

Text ska vara korrekt, saklig, enkel, kort och tydlig, mänsklig, vänlig, serviceinriktad, kunnig och lösningsorienterad.

Använd enkla ord och aktivt språk.

Undvik internt språk, oförklarade branschbegrepp, onödigt byråkratiskt språk, långa komplicerade meningar, överdrivet många värdeord och adjektiv, mästrande språk och onödigt hårda uppmaningar.

Prata om lösningar och användarens behov snarare än interna organisatoriska processer.

Tonaliteten får anpassas efter målgrupp, men tydlighet och förtroende ska bestå.

## Bilder

Bildspråket ska förmedla inspiration, värme, personlighet, kvalitet och premiumkänsla.

Fotografi ska normalt upplevas dokumentärt snarare än iscensatt.

Använd gärna varma toner från Hufvudstadens färgpalett.

Bilder ska redovisa och inspirera.

När interiörer visas ska de gärna signalera aktivitet, liv, användning och genuin karaktär kombinerad med modernitet.

Exteriörbilder ska ta tillvara fastighetens uttryck och karaktär.

Projektbilder bör fånga process, aktivitet och liv.

Porträtt ska vara personliga, varma och gärna fotograferade i relevant miljö.

Använd endast bilder med rätt användningsrättigheter och nödvändiga godkännanden.

Officiellt godkänt Hufvudstaden-material ska prioriteras.

AI-agenten får inte själv generera ett påstått Hufvudstaden-manér om detta inte uttryckligen är godkänt i projektet.

## Illustrationer

Använd officiella Hufvudstaden-illustrationer där de finns.

Godkända illustrationer placeras exempelvis under `./assets/illustrations/`.

Försök inte återskapa den officiella illustrationsstilen från minnet.

Generera inte imitationer av brandillustrationer utan uttryckligt godkännande.

## Layout

Prioritera generösa fria ytor, tydlig hierarki, lugn komposition, läsbar typografi, tydliga innehållssektioner och återhållsam färganvändning.

Ljusa brandfärger kan användas för att separera innehållsområden.

I operativa applikationer har användbarhet och responsivt beteende företräde framför att efterlikna trycksaker eller marknadsföringsmaterial.

## Komponenter

Gemensamma komponenter följer `docs/UX-UI.md`.

Brandkaraktären ska främst skapas med typografi, färg, spacing, bilder och logotyp.

Knappar, formulär, navigation, tabeller och andra funktionella komponenter ska vara förutsägbara och tillgängliga.

## Tillgänglighet

Brandregler får inte försämra tillgängligheten.

Säkerställ tillräcklig kontrast, synliga focus states, keyboard navigation, läsbara textstorlekar, semantisk HTML, korrekta labels och tydliga error states.

Om en brandbehandling inte ger tillräcklig kontrast ska en annan godkänd behandling väljas.

## Instruktion till AI-agent

Innan Hufvudstaden-design skapas eller ändras:

1. Läs `docs/UX-UI.md`.
2. Läs detta dokument.
3. Kontrollera i `PROJECT.md` om lösningen primärt är intern eller extern där detta är relevant.
4. Inspektera `./assets/`.
5. Inspektera `./fonts/`.
6. Läs aktuell manual under `./manuals/` när en regel inte framgår här.
7. Följ etablerade applikationsmönster när de är förenliga med riktlinjerna.

Hitta inte på brandfärger, typografiregler, logotyper, illustrationer, bildmanér eller visuella regler.

Om något inte är dokumenterat ska det betraktas som odefinierat.

<!-- hufvudstaden-guidance:end -->
