# Qwen Code × MLŽIDLA.cz — mapa workflow
Datum revize: 2026-11-15. Stav: konfigurace vývojového asistenta; bez aktivace nových propojení.

## Ověřená technická hranice
- Repozitář: `jakub1duch-a11y/ml-idla-ml-tka-pro-m-sta-obce-a-ve-ejn-parky`, React/Vite, Base44.
- Base44 aplikace: `6a3ee88c10959cd3588c4d68` (podle `docs/MLZIDLA-WEB-A-WORKFLOW.md`).
- Katalog: `src/pages/admin/AdminProducts.jsx`, `publicCatalogProducts.js`, `productDetailConfig.js`, `driveProductMasterRegistry.js` (umístění modulů nejprve dohledat).
- Poptávky/nabídky: `src/pages/admin/AdminPoptavky.jsx`, `src/pages/admin/AdminOffers.jsx`; admin CRM a SalesHub.
- Gmail / Google Drive / Sheets / Canva / HubSpot: v tuto chvíli nejsou Qwen MCP servery aktivovány. Přítomnost konektoru v Base44 či připojení v jiném prostředí neznamená přístup pro Qwen.
- Dokumenty pro orientaci: `docs/audits/2026-11-14-web-workflow-etapa-1.md`, `docs/MLZIDLA-WEB-A-WORKFLOW.md`, `docs/MLZIDLA_OFFER_WORKFLOW.md`.

## Zjištěný konflikt HubSpot
- `base44/functions/hubspotOfferCaseGateway/entry.ts` ověřuje portál `149778217`.
- `src/components/admin/HubspotCatalogSync.jsx` uvádí produktový portál `149032244`.
- NEZAMĚŇOVAT automaticky. Před konsolidací ověřit vlastníka a účel obou portálů, identitu OAuth spojení a skutečný cílový portál pro jednotlivé entity; neprovádět import či zápis. Pokud je cílem jeden portál, změnu navrhnout odděleně jako auditovaný PR.

## Tok poptávky (zamýšlený, nikoli plně ověřený end-to-end)
1. Web/Base44 přijímá poptávku; zachovat `source_system`, `source_id`, `product_slug`, `variant_id`, `received_at`.
2. Deduplikace: normalizovaný e-mail + organizace + původní `source_id`; odděleně ověřit Gmail thread ID. Neslučovat různé zákazníky jen podle podobného názvu.
3. HubSpot: před založením Contact/Company/Deal ověřit identitu portálu a existující záznam; mapování osmifázové pipeline zjistit z živého CRM, nevymýšlet ID fází.
4. Produkty: ověřený MASTER zdroj fotografie, správný SKU/varianta a rozměry; neobcházet `validateProductForVisualization`.
5. Kalkulace: platná kalkulační tabulka na sdíleném Mlžném disku; hodnoty v nabídce musí mít zdroj a datum. Bez potvrzení `price_status = needs_verification`.
6. Nabídka: Canva šablona `Mlžidla TP`, produktové vizuály, příslušenství a přiměřená varianta SUPLA; finální PDF pouze po kontrole geometrie a cen.
7. Gmail: návrh jako koncept, včetně ověřených příloh. Žádné automatické odesílání. Udržovat jeden aktuální koncept na návaznou komunikaci.
8. QA → `pending_approval` → ruční schválení → případné odeslání → evidence odpovědi / follow-up. Zápis změn do CRM jen s povolením a auditní stopou.

## Identifikátory známých zdrojů (NEJSOU API přístupy)
- HubSpot obchodní portál deklarovaný pro poptávky: `149778217`, workflow `5358756048`.
- Google Sheets evidence: `1m-NObbjCYDYG6Sg3B-2g-TcLZkkqGzejDFfCKjqQyUE`.
- Další Google Sheets: `121ONcZqTkHWr5YQoPE7gvdrHBoUU7qDFv2FWBYECJzw`.
- Google Docs: `156u0QSPzvmQq3xI16o2Q5ll36Sj7o5JWB_RfveZHAKM`.
- Před použitím ověřit jejich obsah, oprávnění, účel a aktuální data; nikdy nevkládat neveřejné ceny do repozitáře.

## Co smí Qwen autonomně
- Číst a vyhodnocovat projektový kód, navrhovat bezpečné změny, kontrolovat konzistenci a generovat testy.
- Připravovat Markdown, PR a lokální validační reporty bez osobních údajů.
- Vyžádat schválení před nástroji měnícími soubory a před externími API akcemi.

## Co musí mít explicitní schválení a ověření
- Zápisy do HubSpot, Base44 entit, Google Sheets/Docs/Drive, Gmail a Canvy.
- Import katalogu, vytváření Deals, aktualizace stavu poptávky, publikování marketingu a jakékoli odeslání.
- Merge do main, produkční deploy, práce s DNS, klíči, billingem a migracemi.

## Kontrola stavu
- Spustit `npm ci`, `npm run lint`, `npm run typecheck`, `npm run build` a projektové testy podle repozitáře.
- Ověřit CI PR, Base44 preview a správnou větev před sloučením.
- Reportovat samostatně: `confirmed`, `unverified`, `blocked`, `recommended_action` a zdroj důkazu.
