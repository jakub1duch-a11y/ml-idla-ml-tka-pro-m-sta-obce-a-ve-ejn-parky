# MLŽIDLA.cz – jednotná identita web / Canva / obchod 2026

## Zdroj pravdy
- Originální logo: `public/brand/official-2026/` a `manifest.json`.
- Web: `src/components/brand/MlzidlaLogoSvg.jsx`, `src/components/layout/Logo.jsx`, `src/styles/brand-logo-system.css`, `index.html`.
- Canva: https://www.canva.com/folder/FAHa1qOC90E – varianty loga; brand master: https://www.canva.com/folder/FAHa1qChD08.
- Sdílený Mlžný disk: https://drive.google.com/drive/folders/1OjzgBfHAZe2ov4-l_TUfeZXSArGC2fnL.
- Produktová data: administrace Base44 (app 6a3ee88c10959cd3588c4d68) a platná Kalkulace mlžítka 2026.

## Použití značky
1. **Web a mobil:** hlavička / patička používají SVG symbol a wordmark; na světlém pozadí tmavé logo, na tmavém bílé. Favicon z `favicon.svg`.
2. **Canva:** zachovat stejné logo, Montserrat, Inter, paletu. Produktový master má **2 listy na produkt**: první popis, přínosy, hlavní vizualizace a technické informace; druhý galerie skutečné řady a tabulka všech variant.
3. **Nabídky a katalogy:** používat variantu `logo-holmtec.svg`, ověřené výrobní parametry a ceny 1/2/3 ks **bez DPH** pro instituce; úsporu vypočítat z aktuální platné kalkulace. Pracovní ceny oddělit od schválených.
4. **Gmail:** do podpisů a konceptů preferovat export PNG, protože SVG nemusí podporovat e-mailové klienty. Před odesláním ověřit vložené obrázky, odkazy a ceny. **Nic automaticky neposílat.**
5. **Sociální sítě:** `social-avatar.svg`, pro Stories 9:16 a příspěvky 4:5 navazovat na schválené Canva šablony, ne deformovat logo.
6. **Vizualizace produktů:** fotografie přiřazovat jen ke správnému výrobku/variantě z Base44 či Mlžného disku. Záměny a nepřesnou AI geometrii nevydávat za originál. Označovat ilustrační vizualizace.

## Schvalovací workflow
- GitHub **pracovní větev → Pull Request do main → kontrola CI/build a preview** (včetně mobilu, desktopu, světlého a tmavého pozadí, favicon a tiskových materiálů).
- Před zveřejněním ověřit, že konkrétní Base44 aplikace skutečně nasazuje kód ze stejného repozitáře / PR.
- Merge, úpravy Base44 produkce, změny v nabídce a odeslání Gmailu **jen po schválení správcem**.
- Pro návrat použít revert PR; originální zdrojové SVG a Canva master zůstávají archivované.
