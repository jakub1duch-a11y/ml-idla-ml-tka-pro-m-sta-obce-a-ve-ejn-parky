# MLŽIDLA.cz — Canva Autofill / Base44 / HubSpot / Gmail

Revize 2026-11-19. Stav: pracovní PR. Neznamená nasazení do produkce.

## Ověřená identita a zdroje

- Base44 aplikace: 6a3ee88c10959cd3588c4d68.
- Firemní Gmail a Google Drive v ChatGPT: meduna@holmtec.cz.
- HubSpot portál: 149778217. Existující pipeline Mlžidla.cz – poptávky a nabídky má ID 4351532258. Nevytvářet duplicitu.
- Jediný živě kontrolovaný ceník: Kalkulace mlžítka 2026, ID 1kyxH-ihr6YC5xnu8Ef5X4jbR81VVaJtDO1UVWK5d_S8, list 💧 Katalog produktů 2026. Sloupec A = SKU, H = veřejná základní cena, J = cena za 2 ks dohromady, K = cena za 3 ks dohromady. Sloupec I obsahuje partnerskou cenu a není zákaznický zdroj.
- Dokud není doložen reálný export PDF a bezpečná vazba na Deal, stav je pouze příprava, žádné automatické odeslání.

## Canva — existující editovatelné A4 návrhy

| Typ | Canva design ID | Ověřené Autofill pole |
| --- | --- | --- |
| Oslovení měst | DAHbIPt73-s | 12 |
| Oslovení architektů | DAHbIPfIgA8 | 12 |
| Oslovení gastro | DAHbIAfsc1w | 12 |
| Foto-list produktu | DAHbICVcThc | foto produktu, prostředí, tryska + texty |
| Souhrn ceny 2 modelů | DAHbICZZIgU | 11 |
| Souhrn ceny 3 modelů | DAHbINIjpZM | 16 |
| Souhrn ceny 4 modelů | DAHbIO0bjWQ | 21 |
| Hlavní nabídka REV4 | DAHbIJYI2NA | NEPŘIPRAVENA: vadný typ součtů |

Oslovovací listy jsou v Canva složce 01_NABIDKY_PODLE_KLIENTA (FAHa-544Shg).
Fotografický list je ve složce 02_PRODUKTOVE_LISTY_A_CENY (FAHa-6C-yYA), obě uvnitř HUBSPOT_WORKFLOW_FINALNI_SABLONY_MLZIDLA.

Původní Brand Template EAHbBX1hTpE má stále prázdný Autofill dataset; nelze jej zaměnit za samostatné designy uvedené výše.

U foto-listu DAHbICVcThc Canva chybně typuje dekorativní pole main_image_type jako image. Nepoužívat při vyplňování. V REV4 jsou jako image chybně typovány quote_total_czk, quote_total_eur, supla_from_price a quote_total_czk_with_currency. Bez opravy a nového ověření datasetu nesmí probíhat automatický finální export.

## Výběr a správná prezentace fotografií

1. Přednost mají skutečné fotografie z MLŽNÉHO DISKU a schválené MASTER podklady konkrétního výrobku/varianty v Base44.
2. Reálné instalace, studio a ilustrační vizualizace musí být v nabídce jasně rozlišeny.
3. Nikdy nepřenášet fotografii jiné varianty, neměnit geometrii, směr a počet trysek, kotvení ani proporce; ořez musí zachovat většinu konstrukce.
4. Canva assets k dispozici: MRKEV Polná reálná realizace MAHbIIKTsn4, AURA studio MAHbIBPZoVk, LINEA studio MAHbIKcq0N4, BENDY gastro vizualizace MAHbIB9QL1Y, AURA zahrada vizualizace MAHbIALlsBc, detail trysky MAHbIGMpbhg.
5. Pokud klient poslal fotografii nebo výkres místa, vytvořit realistický návrh osazení stejného modelu a výsledek označit jako vizualizaci. Bez fotografie klienta neprezentovat smyšlenou scénu jako jeho skutečný prostor.

## Cenová a technologická pravidla

- Výchozí nabídková kalkulace: pouze samotné mlžítko. Montáž ani dopravu automaticky neoceňovat, pokud je klient nepožaduje.
- Jednotlivé kusové/množstevní sazby přesně z H/J/K. Interní a partnerské údaje nikdy do veřejných materiálů nepřenášet.
- Základní mlžítko je samostatné; klient může připojit manuální/zahradní/časové ovládání.
- SUPLA PROFI pro chytrá města je volitelný systém od 29 800 Kč bez DPH, specifikace a finální cena se určuje dle modulů, spínání, filtrací, senzorů, měřidel a případného osvětlení; bez ověření cenu do výsledného součtu automaticky nezapočítávat.
- Ceny uvádět jako Kč bez DPH. Přepočet EUR jen s ověřeným kurzem a datem; DPH podle ověřeného režimu zakázky.
- U nízkotlakého mlžení nedoporučovat umístění přímo mezi stoly a sezení; vítr může mlhu odnášet několik metrů, neslibovat univerzálně suchý povrch.

## Automatizace — požadovaná sekvence

1. Nová poptávka Base44 → zkontrolovat přílohy, model a místo.
2. HubSpot 149778217 → deduplikace kontaktu a firmy, kontrola historie, přiřazení správného Dealu a zdrojového ID.
3. Firemní Sheets → ověřit cenu a přesnou shodu varianty; při rozporu STOP.
4. Vyhledat schválenou fotografii a vytvořit podle potřeby ilustrační / klientskou vizualizaci přesného modelu.
5. Ještě před Canva Autofill zvolit správný počet listů: DUO, TRIO nebo 4MODELY, a produktové foto-listy pro všechny modely.
6. Canva → vytvořit kopii, načíst dataset a ověřit typy každého pole, vyplnit pouze schválené texty, ceny a Canva asset IDs.
7. QA tiskového A4 PDF: správná geometrie, kvalita ořezu, čeština, logo, cena, DPH, přílohy. Dokud nejsou ověřeny součty REV4, vyžadovat manuální finální kontrolu.
8. Uložit PDF a oddělené vizualizace WebP do ověřeného archivu; odkazy propojit s OfferAsset a Deal.
9. Připravit Gmail/HubSpot koncept e-mailu pro klienta, ideálně JPG/PNG náhled v těle a PDF přílohu. Potvrzení objednávky odpovědí na e-mail. Žádné automatické odeslání.

## Zbývající blokace

- Ověřit produkční OAuth identitu Base44 Google Sheets, Google Drive, Gmail; připojení v ChatGPT samo o sobě nestačí.
- Otestovat skutečný synchronizační zápis HubSpot→Canva Autofill→PDF→Drive→Deal→e-mailový KONCEPT. Dosavadní schéma a AgentSkill jsou konfigurační podklady, nikoli důkaz běžícího workflow.
- Prověřit technický rozpor v cenové tabulce AURA 700 (popis TR42×3 vs hlavní polotovar TR42×2), BENDY_60 (TR60,3×3 vs TR60,3×2), LINEA TR 50 (TR50×2 vs profil 4HR TR70×70×2). Neopravovat výrobní data odhadem.
- Zkontrolovat HubSpot marketingový souhlas, segmentaci a suppression před jakýmkoliv marketingovým odesláním.
- Funkční testy: 1–4 modely, chybějící cena, chybný účet, neplatný MASTER, nepřístupná příloha, selhání exportu, kontrola zákazu odeslání.
- GitHub PR musí projít build/testy, kontrolou náhledu a schválením správce. Bez toho neslučovat do main.


## Kritický nález reálného Canva Autofill testu 19. 11. 2026

V interním testu dvoumodelového listu DAHbICZZIgU Canva správně doplnila názvy a ceny AURA 700 a LINEA TR 60, ale v konečném návrhu ZŮSTALY pevné popisky KATALOG / LINEA TR 60, KATALOG / BENDY_60, stará cena 17 900 Kč a samostatné OD. Takový dokument je nevhodný jako cenová nabídka a nesmí být vložen do CRM jako schválené PDF. Samotná existence Autofill datasetu nestačí. V režimu kontroly je nutné po Autofill načíst výsledný design read_design, provést cenovou a vizuální kontrolu, odstranit statické přepisovací prvky v šablonách a až potom zvážit použití. Stejně prověřit TRIO a 4 modely: jejich originální návrhy obsahují pevné cenové údaje, názvy produktů a upozornění na neschválené fotografie. V kódu existuje kontrola inspectRenderedMlzCanvaSummary a regresní test. Neoznačovat tyto šablony za plně funkční pro klientský export.
