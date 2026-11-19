---
name: mlzidla-hubspot-crm
description: Bezpecne zpracovani obchodnich poptavek MLZIDLA a jejich vazeb na HubSpot, Gmail, Canva a Google Workspace.
---

# MLŽIDLA.cz — HubSpot CRM, Google Workspace a obchodní nabídky (interní agent)

## Rozsah a oprávnění
Interní pracovní postup pro Base44, HubSpot 149778217, Google Workspace meduna@holmtec.cz, Gmail, Canva, Mlžný disk a GitHub. **Pouze admin / firemní kontext**; tokeny, klientské fotografie, marže a soukromé záznamy nepředávat veřejným agentům ani externím odkazům. Neautorizovaný nebo neověřený konektor znamená STOP. Odesílat obchodní e-maily smí výhradně člověk po schválení; agent pouze vytváří koncepty.

## Zdroje pravdy
| Oblast | Primární systém | Pravidlo |
|---|---|---|
| Poptávka a produkt | Base44 app `6a3ee88c10959cd3588c4d68`, Poptavka/ContactInquiry/Product | Číst originální ID, variantu, místo, technické parametry a přílohy |
| CRM kontakt, firma, obchodní případ | HubSpot firemní portál **149778217** | Před každou akcí ověřit `/integrations/v1/me`; při nesouladu zastavit |
| Kontakty a původní obchodní evidence | Google Sheets `1m-NObbjCYDYG6Sg3B-2g-TcLZkkqGzejDFfCKjqQyUE` | Záložka **KONTAKTY – VŠE** má výpočtový zdroj v A2; zásadně nepsat do tohoto agregátu |
| Cena | Kalkulace mlžítka 2026 `1kyxH-ihr6YC5xnu8Ef5X4jbR81VVaJtDO1UVWK5d_S8` | Cenu konkrétní varianty ověřit aktuálně ve `💧 Katalog produktů 2026`, **sloupec H**, nebrat historické Product.price_from ani starý ceník |
| Schválené fotografie a výkresy | Product MASTER, technické soubory na sdíleném MLŽNÉM DISKU | Vizuály geometricky odpovídají skutečnému výrobku; chybějící schválení znamená STOP |
| Grafika a PDF | Canva, schválená značková šablona „Mlžidla TP“; ověřená alternativní Brand Template `EAHZVIjydfU` | Originál nepřepisovat, vytvořit kopii; ověřit oprávnění a případná autofill pole před exportem |
| E-mailové odeslání | Gmail `meduna@holmtec.cz` | `DRAFT` není `SENT`; stav odeslání pouze z opravdu odeslané zprávy s přílohami |
| Zdrojový kód a publikace | GitHub `jakub1duch-a11y/ml-idla-ml-tka-pro-m-sta-obce-a-ve-ejn-parky` + Base44 | Vývojová větev → review PR → build → kontrola náhledu → schválení → merge/deploy |

## Vizuální identita
Použít skutečné logo ze souborů značky MLŽIDLA.cz, nikdy nevymýšlet nové logo; v interním UI navazovat na navy `#102b3a`, cyan `#008ea5`, bílé plochy a čistou typografii používanou na webu. Pro nabídky zachovat fotografické bloky, jasnou technickou specifikaci, tabulku rozpočtu, samostatný list SUPLA podle potřeby, přehled montáže a platební podmínky. Pro Gmail HTML používat přístupné JPEG/PNG a čitelný mobilní layout.

## Ochrana cen a produktových podkladů
- Nikdy nepočítat jednotkové ceny z interních nákladů či partnerských sloupců. Před uvedením ceny rozlišit základ bez DPH / s DPH podle aktuální metodiky a typu zákazníka; bez potvrzení režimu zapsat „K ověření“.
- U aktuální kalkulační tabulky byly zaznamenány rozdíly mezi popisnými údaji a sloupcem profilu: např. AURA 700 v popisu TR42×3, ve sloupci profilu TR42×2; BENDY_60 v popisu TR60,3×3, ve sloupci profilu TR60,3×2. Rozhoduje potvrzená technická dokumentace konkrétní varianty, jinak návrh zablokovat.
- Nikdy neposílat do Canvy nebo zákazníkovi technicky neověřenou generovanou fotografii jako skutečný výrobek.
- Technická data a tvar pouze z Product + schválené MASTER reference a výkresů, nikoliv odhad podle obrázku.
- Před nabídkou vždy znovu ověřit cenu, množství, SUPLA, dopravu, montáž, kotvení, staveništní připravenost a technické nároky.

## Bezpečné zpracování poptávky
1. **Přijetí**: načíst konkrétní Base44 Inquiry; sesbírat originální zdrojové ID, typ produktu, variantu, kontakt, lokalitu, souhlas a přílohy.
2. **Deduplikace**: normalizovat e-mail a dohledat kontakt v HubSpotu i hlavní obchodní tabulce. Firmu párovat přes ověřené IČO/doménu, nikoliv pouze obecný e-mail. Příležitost deduplikovat dle source Inquiry ID nebo CRM-2026 identifikátoru. Pokud je shoda nejednoznačná → ruční kontrola.
3. **Deal**: použít existující pipeline `4351532258`, nikdy nevytvářet paralelní pipeline bez auditu. Aktuální pipeline obsahuje **6 fází**; plán 8 fází zatím není publikovaný.
4. **Návrh**: doporučit vhodný produkt z katalogu s reálnou geometrií, klientským prostorem a schválenou fotografií.
5. **Cena**: číst živou kalkulaci 2026; chybějící nebo rozporná hodnota = bez ceny a požadavek na ověření.
6. **Canva/Drive**: vytvořit kopii značkové šablony, doplnit ověřený obsah a PDF; uložit pouze do přístupově omezené složky případu na Mlžném disku.
7. **Gmail**: připravit personalizovaný koncept, originální logo a obrazové bloky; připojit skutečné PDF a schválené fotografie; nikdy neodesílat automaticky.
8. **Schválení a evidence**: nabídku zařadit ke kontrole v Obchodním centru; do HubSpotu a CRM – Cenové nabídky uložit zdrojová ID, stav, schválené PDF, další krok a navazující Gmail thread. „Odesláno“ až podle Gmail SENT; odpověď pouze podle příchozí zprávy.
9. **Audit**: zapsat do SyncRun co se skutečně podařilo, chyby, nejasné duplicity a verzi dat. Žádné tiché vynechávání chyb.

## Minimální přejímací test
Při každém nasazení: ověření správného HubSpot portálu 149778217, Google účtu meduna@holmtec.cz a oprávnění; import ne více než 5–10 zvolených testovacích reálných kontaktů s ruční kontrolou; zkouška idempotence, chybných identit, duplicit a chyb API; kontrola PDF geometrie, loga a cen; kontrola Gmail DRAFT vs SENT a zákaz automatického send. Produkce pouze po potvrzeném CI a schválení.
