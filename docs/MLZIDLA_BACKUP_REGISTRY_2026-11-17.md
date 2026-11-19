# MLŽIDLA.cz — zálohovací registr 2026-11-17

## Sdílený MLŽNÝ DISK
- [Záložní složka](https://drive.google.com/drive/folders/1HSL9qETXqla-AWZJYmbjebg0PbwA_59p)
- [Záloha workflow a stav](https://docs.google.com/document/d/19ynfu2sCHSe4w-C8RGK-vLX1W703exTOrVjkPDywhOo/edit)
- [38 pracovních produktových listů](https://drive.google.com/drive/folders/1RNoasMjTYf1YCcC-EW5nccaFLHCdoQ_M)
- [Obchodní evidence Gmail a poptávek](https://docs.google.com/spreadsheets/d/1Rn4sAEa80OKTHCRhrEldSFmIHVNKxAGIF-VAQTVorqw/edit)

## Interní zdroje aplikace
- `docs/product-offer-sheets-2026/manifest.json` — 38 pracovních listů
- `data/offer-product-sheets-2026.snapshot.json` — očištěná data bez privátního sloupce I
- `scripts/generate-offer-product-sheets.mjs` — generátor listů
- `agent/skills/create-sales-offer/SKILL.md` — workflow odpovědí a nabídek

## Obnova a kontrola
Tento soubor je **manifest zálohy**; sám o sobě neobsahuje úplnou kopii dokumentů, obrázků ani binárních PDF. Pracovní listy jsou na Drive, zdrojové HTML a JSON ve verzované pracovní větvi Base44. Není ověřena automatická obousměrná synchronizace ani obnova ze zálohy. Produkční nasazení a zveřejnění vyžaduje kontrolu a schválení. 

## Pravidla
Každý dotaz zákazníka = poptávka; nabídka má vlastní ID, revizi, PDF a vazbu na Gmail thread a HubSpot portál 149778217. Neodesílat bez schválení, nepublikovat pracovní cenové listy a neexportovat interní partner ceny.
