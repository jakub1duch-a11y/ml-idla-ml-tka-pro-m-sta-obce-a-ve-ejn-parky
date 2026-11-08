---
title: "VOLAVKA – geometrické reference pro AI vizualizace"
product_family: "VOLAVKA"
purpose: "visualization_geometry_reference"
status: "draft-needs-source-verification"
variants:
  - slug: "volavka-gracilis"
    height_mm: 1800
    nozzles: 7
  - slug: "volavka-gigantea"
    height_mm: 2400
    nozzles: 9
tube: "TR 42,4 × 2 mm"
material: "nerezová ocel"
---

# VOLAVKA – pravidla věrné vizualizace

## Základní pravidlo
Vizualizace musí vycházet z **hlavního schváleného obrázku konkrétní varianty produktu** na mlzidla.cz. Tento dokument je doplňující geometrická specifikace, nikoliv náhrada referenční fotografie, výkresu nebo 3D modelu.

## Varianty a skutečné měřítko

| Varianta | Výška | Trysky | Poznámka |
| --- | ---: | ---: | --- |
| VOLAVKA Gracilis | 1 800 mm | 7 | Menší provedení |
| VOLAVKA Gigantea | 2 400 mm | 9 | Větší provedení |

Gigantea je o **600 mm vyšší**; při stejném měřítku scény je její výška **1,333×** výšky Gracilis. Nesmí být zobrazeny jako dvě stejně velké sochy. V každé scéně používat skutečné měřítko vůči lidem, dveřím, lavičkám a okolním objektům.

## Geometrie, která se nesmí měnit
- Zachovat **siluetu, zakřivení, počet a polohu větví/trubek** podle schválených referenčních fotografií a technického výkresu.
- Zachovat průměr a proporce nerezové trubky **TR 42,4 × 2 mm**; bez svévolného zesilování či zužování.
- Zachovat příslušný **počet trysek**: Gracilis 7, Gigantea 9; jejich přesné umístění ověřit podle referenční dokumentace.
- Kotvení zobrazit jako nenápadné/skryté dle reálného řešení; orientační podkladová patka 300 × 300 mm vyžaduje ověření pro konkrétní montáž.
- Nevymýšlet další ohyby, ornamenty, ramena, trysky ani konstrukční spoje.

## Pravidla pro generátor
1. Načíst identifikátor varianty a její **hlavní produktovou fotografii**.
2. Načíst ověřené rozměry a případné další pohledy / CAD / STEP.
3. Umístit výrobek v měřítku 1:1 do vybrané scény: gastro a hotely, parky a náměstí, školky a školy, hřiště a sportoviště.
4. AI smí upravovat **prostředí, osvětlení, počasí, kompozici, lidi a mlžení**, nikoliv geometrii výrobku.
5. Před uložením vyžadovat kontrolu siluety, proporcí, počtu trysek a výšky. Není-li přesnost doložitelná, označit výstup jako **ilustrační koncept**, nikoliv technicky věrnou vizualizaci.
6. Schválený obrázek uložit ke konkrétní variantě do galerie produktu; Marketing používá tentýž záznam bez duplikování.

## Chybějící podklady k ověření
- Přesné URL hlavních obrázků obou variant v aktuálním webu.
- Výrobní výkres nebo CAD/STEP pro kontrolu obrysů, poloh trysek a kotvení.
- Potvrzení technických hodnot v aktuálním katalogu před automatickým vynucováním.

**Bez schválené fotografie nebo 3D podkladu nelze samotným textovým promptem garantovat geometricky přesný výstup.**
