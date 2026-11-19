# MLŽIDLA.cz – etapa 1: inventura a plán sjednocení dat
Datum: 2026-11-14
Stav: pracovní audit; žádná produkční změna

## Ověřeno ve zdrojovém kódu Base44
- Veřejné trasy: /produkt/:slug, /poptavka, /podpora, /servis-udrzba, /uprava-vody.
- Administrace: AdminCRM, AdminOffers, AdminPoptavky, AdminProducts, AdminSalesHub, AdminIntegrations.
- Produktová data jsou rozložena mimo jiné mezi publicCatalogProducts.js, productDetailConfig.js a driveProductMasterRegistry.js. Je nutné zjistit, které moduly jsou zdrojem a které pouze prezentační projekcí.
- driveProductMasterRegistry.js obsahuje přesné Drive zdroje pouze pro bendy, steblo, linea a lineace. Ostatní produkty mohou mít ověřenou MASTER referenci přímo v administraci; samotná absence v registru není důkaz chyby.
- validateProductForVisualization vyžaduje schválenou MASTER referenci a lidské ověření; zachovat bez obcházení.
- offer-agent-config.js vyžaduje ověřené ceny/technické údaje, PDF, vizualizace, QA, pending_approval a zákaz automatického odeslání.
- Projekt má existující testy brandOfferWorkflow.test.mjs a businessWorkflowGuard.test.mjs.

## Neověřeno – nepovažovat za hotovou integraci
- Zda je každý produkt provázaný s jedinou aktuální položkou platného ceníku na Google Disku.
- Zda Canva skutečně používá správné produktové fotografie pro všechny varianty.
- Zda Gmail koncepty a obchodní centrum sdílejí stabilní identifikátor poptávky a pravidla deduplikace.
- Zda je SUPLA nabídka vždy správně připojena podle typu instalace.
- Reálné mobilní chování a měření Core Web Vitals.

## Etapa 2 – datové vazby
1. Inventarizovat produktové identifikátory: slug, SKU/varianta, zdroj fotografie, zdroj ceny, datum ověření.
2. Vytvořit mapu návazností veřejný katalog → produktová data → poptávka → nabídka → Canva/Gmail.
3. Přidat pouze neinvazivní validační report: chybějící cena, neověřená geometrie, neaktuální reference, chybějící přílohy. Neprovádět automatické opravy.
4. Rozlišit cenu bez DPH pro instituce a cenu včetně DPH pro soukromé osoby; sazbu DPH vždy ověřit podle platných podkladů.

## Etapa 3 – bezpečný obchodní proces
1. Zavést idempotentní párování poptávek a e-mailových vláken; jediný aktuální koncept na poslední komunikaci.
2. Stavové přechody intake → pricing → visualization → document → qa → pending_approval.
3. Neodesílat zákazníkovi nic bez explicitního schválení; uchovat historii změn a zdroje cen.
4. Ověřit oprávnění administrace a serverové kontroly, ne pouze skrytí prvků v UI.

## Akceptační kritéria
- Žádná cena bez ověřeného zdroje a data platnosti.
- Žádná vizualizace s jinou geometrií produktu.
- Žádný duplicitní aktuální koncept k téže komunikaci.
- Každá nabídka obsahuje audit zdrojů, QA a schválení.
- Build a existující testy procházejí; produkce beze změny až do schválení.
