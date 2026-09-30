

<!-- hufvudstaden-guidance:start -->
Shared company guidance, version 0.16.0. Updated centrally; do not edit this block.
Keep application-specific details outside this block. The shared rules here supersede older copied shared rules; explicit project exceptions still apply.


# Development Template

Detta repository är organisationens gemensamma template för nya egenutvecklade applikationer.

Utgångsläget för teknik står i `PROJECT.md`.

Den innehåller gemensamma principer för:

- utveckling,
- arkitektur,
- testning,
- UX/UI,
- brand,
- AI-agenter.

## Struktur

| Fil/mapp | Syfte |
| --- | --- |
| `AGENTS.md` | Gemensam instruktion för Cursor, Codex, Lovable, Claude Code och GitHub Copilot |
| `CLAUDE.md` | Pekare för Claude Code till `AGENTS.md` |
| `.github/copilot-instructions.md` | Pekare för GitHub Copilot till `AGENTS.md` |
| `PROJECT.md` | Projektspecifik information, valt brand och eventuella avvikelser |
| `docs/DEVELOPMENT.md` | Kodkvalitet, tester och Definition of Done |
| `docs/ARCHITECTURE.md` | Gemensamma arkitekturprinciper |
| `docs/UX-UI.md` | Gemensamma UX/UI-principer |
| `docs/adr/` | Dokumentation av större arkitekturbeslut |
| `brand/` | Brandregler och officiella designresurser |
| `brand/*/DESIGN-GUIDELINES.md` | Maskinläsbara brandregler |
| `brand/*/manuals/` | Officiella designmanualer och PDF:er |
| `brand/*/fonts/` | Officiella, licensierade typsnitt |
| `brand/*/assets/` | Logotyper, ikoner, illustrationer och annan grafik |

## AI-verktyg

Cursor, Codex och Lovable läser `AGENTS.md` i reporoten. Claude Code läser `CLAUDE.md` och GitHub Copilot läser `.github/copilot-instructions.md`. Båda filerna pekar vidare till `AGENTS.md`.

Skapa inte en parallell regeluppsättning i verktyget. I Lovable ska Project knowledge inte motsäga `AGENTS.md`.

## Starta ett nytt projekt

1. Skapa ett nytt repository med GitHub `Use this template`.
2. Fyll i `PROJECT.md`.
3. Ange exakt ett primärt brand.
4. Ta vid behov bort brandmappar som projektet inte använder.
5. Välj projektets teknikstack.
6. Komplettera `.gitignore` och `.editorconfig` med sådant teknikstacken kräver.
7. Lägg till projektets kod.
8. Sätt upp CI som minst kör relevanta automatiserade tester. Lägg även till lint, type check och build där det är relevant.
9. Dokumentera större arkitekturbeslut med ADR när det behövs.
10. Utvecklare och AI-agenter följer de gemensamma styrdokumenten.

## Brand

Brandmaterial under `brand/` ska betraktas som styrande källmaterial.

När officiellt material ändras ska motsvarande brandmapp uppdateras.

Se respektive `brand/<brand>/README.md` för vad som ska ligga i `manuals/`, `fonts/` och `assets/`.

Typsnitt får endast lagras i Git om licensen tillåter lagring och distribution på det sätt repositoryt används.

## Efter Use this template

Alla brandmappar kopieras till det nya projektet.

Om projektet endast använder ett brand får övriga brandmappar tas bort för att minska risken för oklarhet.

`PROJECT.md` avgör alltid vilket brand som gäller.

## Viktigt

Utgångsläget för nya webbapplikationer står i `PROJECT.md`: Vite, React 18, Tailwind och Node.

Databas, hosting, autentisering, CI och arkitektur väljs i respektive projekt. En avvikelse från utgångsläget dokumenteras i `PROJECT.md`.

<!-- hufvudstaden-guidance:end -->
