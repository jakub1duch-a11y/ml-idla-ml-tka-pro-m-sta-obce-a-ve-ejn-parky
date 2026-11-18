# MLŽIDLA.cz – UX sekce pro města a obce

Stav: pracovní specifikace; nikoli publikace. Datum 2026-11-17.

## Existující stránky
- `/mlzitka-pro-mesta-obce` (`src/pages/kategorie/MestaObce.jsx`)
- `/mlhoviste` (`src/pages/Mlhoviste.jsx`)
- `/mestske-ochlazovani-verejneho-prostoru` – ověřit stávající obsah a routování
- Nové adresy nezakládat duplicitně; řešit canonical a redirect.

## Sekce v pořadí
1. Full-width hero s ověřenou fotografií/videem a CTA „Navrhnout řešení“.
2. Skutečné realizace: místo, produkt, video, ověřené údaje.
3. Výběr podle prostoru: náměstí, park, pěší zóna, školy.
4. Tabulka řešení: samostatné mlžítko, brána, sestava, zakázkové řešení; bez neověřených cen.
5. Postup: konzultace, návrh, technické podklady, nabídka, výroba, instalace dle smlouvy.
6. Technické tabulky: voda, kotvení, elektřina, řízení, filtrace, hygiena, údržba; hodnoty až z MASTER.
7. SUPLA: jen ověřené volitelné funkce.
8. FAQ a formulář s návazností na HubSpot, otestovat skutečné doručení.

## UX a měření
- Zachovat logo, barvy, písmo, mobilní čitelnost, reduced-motion a lazy-load videa s posterem.
- Navržené GA4 události: municipal_hero_cta, municipal_reference_open, municipal_compare_view, municipal_tech_expand, municipal_form_start, municipal_form_submit. Před zavedením porovnat s existující taxonomií.
- Ověřit přístupnost, 360px mobil, SEO canonical, LCP/CLS, odkazy, skutečná CRM data.
- Žádné nepodložené sliby účinku chlazení nebo vymyšlené produktové fotografie. Podmínkou je schválený produktový MASTER.

## Ověřená inspirace
- https://www.nngroup.com/reports/b2b-websites-usability/
- https://www.nngroup.com/articles/b2b-vs-b2c/
- https://www.mistinggroup.com/en/sectors/public-spaces
- https://mist.storks.si/en/
- https://handbook.metrocouncil.org/required-plan-elements/climate/climate-action-library/install-misting-stations-and-shaded-seating-in-high-use-public-spaces/

## Nasazení
Samostatná větev → build → vizuální kontrola → ověření CRM → schválení → produkce. Nezveřejňovat interní ceny ani pracovní návrhy.
