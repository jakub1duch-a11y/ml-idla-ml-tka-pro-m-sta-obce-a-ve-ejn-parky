# MLŽIDLA · Profesionální produktový detail – editorial design a chování mlhy

**Status:** návrh ve vývojové větvi, bez schválení publikace.  
**Datum:** 16. 11. 2026  
**Vazba:** Obecné úkoly AdminTask, týden 16.–22. 11. 2026  
**Pracovní komponenta:** `src/components/produkt/new/PdPlacementGuide.jsx`

## Ověřené inspirační weby (pouze metodika, nikoli kopie)

1. **mmcité** – https://www.mmcite.com/en/stack  
   Co převzít: oddělení produktových variant, materiálů, technických výkresů, 3D/CAD a galerie. Technické údaje a skutečná výroba jsou rovnocennou součástí prezentace.
2. **Vestre** – https://vestre.com/products/seating/june-seat  
   Co převzít: čistá typografie, promyšlené bílé plochy, snadný výběr variant a kvalitní izolovaný produktový snímek.
3. **Landscape Forms** – https://www.landscapeforms.com/products/link-bench  
   Co převzít: fotografie skutečných realizací, podklady pro architekty, plánovací výkresy, instalační dokumentaci, rozlišení standardního výrobku a možnosti úprav.
4. **Landscape Forms – zakázkové úpravy** – https://www.landscapeforms.com/modified-products  
   Co převzít: přirozené propojení katalogového produktu a výroby na míru.

Nepřebírat cizí fotografie, loga, ilustrace ani grafické prvky. Výsledek musí mít vlastní identitu MLŽIDLA a vlastní ověřená média.

## Směr vizuálu

- **Fotografie:** jen původní autentické záběry z realizací a výroby, nebo produktový obrázek navázaný na konkrétní schválený MASTER.
- **Typografie:** jedna výrazná věta, stručný technický odstavec, malá typografická legenda; nepřetěžovat zbytečnými ikonami.
- **Rytmus stránky:** světlá editorial sekce po katalogovém detailu, jedna velká produktová fotografie, vedle čitelná technická ilustrace.
- **Paleta:** navy #0A2536, zklidněná cyan #217F96, teplá bílá #F5F8F9, šedé linky #D2E2E7.
- **Motion:** žádný umělý digitální kouř ani nekonečně rotující 3D model. Pouze mikrointerakce, které zpřístupňují informace; respekt `prefers-reduced-motion`.
- **Copy:** neutrální a faktické; bez odvážných slibů snížení teploty, garantované suché země či zaručeného zvýšení tržeb.
- **Poptávka:** tlačítko „Posoudit umístění“ předává `produkt` do existujícího formuláře.

## Pravidla fyziky a instalace (obsahový standard)

- Nízkotlaká mlžítka nedoporučovat bezprostředně mezi stoly, lavičky a sedící osoby.
- Ve vysoké teplotě a suchém prostředí může jemná mlha rychleji odpařovat; nikdy neslibovat univerzální nezmáčení podlahy.
- Při proudění vzduchu se mlha může rozšířit i několik metrů po větru; poloha a odstup je věcí projektu.
- Za nižších teplot nebo vyšší vlhkosti může docházet ke smáčení povrchu; doporučit provozní režim podle podmínek.
- Schéma je **orientační, bez měřítka**; nevyjadřuje dosah ani minimální doporučenou vzdálenost.
- Nesmí se doplňovat nevymyšlené normativní vzdálenosti, průměry kapek ani parametry konkrétního modelu.

## Fotografický plán – co použít

1. **Hlavní produktová fotografie:** `hero_product_image_url` pouze při `hero_visual_verified`, případně stávající veřejné `image_url` při kontrole identity a fotografické věrnosti. Nenahrazovat generickým podobným modelem.
2. **Městské prostředí / Polná:** v projektu `/media/optimized/6a220ebf9_Reference-mstoPolna03.webp`; fotografie reálné realizace. Pouze v referenčním bloku se správným popisem, ne jako fotografie jiného produktu.
3. **BENDY × LINEA:** `/media/optimized/e7593e68f_realizace-IMG_5072.webp`, společný registrovaný snímek konkrétní instalace. Pouze pro příslušné produkty, po vizuální kontrole.
4. **Gastro / zahrady:** v knihovně jsou soubory `/media/optimized/03ba352a3_mlzitka-zahradni-hotely-restaurace.webp`, `/media/products/mrak/mrak_maly_terasa.webp`; **pouze kandidáti** k ověření skutečného výrobku, MASTER, původu a označení fotografie vs. vizualizace.
5. **Detail trysek / nerezu / kotvení:** použít makrofotografie z výroby a instalací s ověřeným původem; chybějící záběry raději nafotit než vytvořit generovanou napodobeninu.
6. **Zakázková výroba HolmTec:** trojdílný autentický obrazový příběh: návrh či ověřený výkres → ohýbání / svařování → hotová instalace.

## Pořadí sekcí detailu

Produktový hero → popis → technické parametry → galerie a výsledný detail → přínosy → **Umístění a chování mlhy** → instalace → volitelné řízení → FAQ → reference → poptávka → další mlžítka.

Sekci držet přehlednou: na desktopu dvě dominantní plochy (aktuální produkt a schéma), na mobilu vertikální kompozice s plnou šířkou a popisky bez překryvů.

## Ověření před schválením

- Fotografie produktu se nikdy nepoškodí ořezem, nedeformuje a nepřepíše cizím modelem.
- Všechny odkazy jdou na správný `slug`, FAQ neobsahuje duplicity a technická sdělení jsou pravdivá.
- Responzivita 360 / 390 / 768 / 1280 px; žádný horizontální scroll sekce.
- Kontrast textů, klávesnice, čitelnost popisků diagramu, ALT a lazy loading pod foldem.
- ESLint a Vite build projdou; vizuální Preview kontrola a souhlas správce před merge.
