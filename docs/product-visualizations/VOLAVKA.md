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


## Kamerové pohledy – včetně dronu
Generátor musí nabízet přepínač **Pohled kamery**:
- **Úroveň očí** – realistický pohled chodce, srovnání s výškou člověka.
- **Šikmo shora / dron 45°** – viditelná konstrukce i okolní prostor.
- **Dron téměř kolmo shora (cca 75–85°)** – půdorysné uspořádání a umístění ve scéně.
- **Kolmo shora / top-down 90°** – ortografický nebo perspektivní půdorysný záběr podle dostupných 3D podkladů.

### Závazné podmínky pro dronové vizualizace
- Volba kamery mění **pouze úhel pohledu**, nikoliv fyzický tvar, výšku nebo proporce produktu.
- Horní pohled nesmí být pouhým překlopením čelní fotografie; potřebuje skutečnou geometrii z více pohledů nebo 3D/CAD model.
- Při dronovém záběru dodržet půdorysnou orientaci ohybů, trubek, trysek a kotev; žádné domyšlené smyčky.
- **Gigantea 2400 mm a Gracilis 1800 mm** mají odlišnou skutečnou výšku. V čistě kolmém pohledu nelze výškový rozdíl spolehlivě vyčíst z obrazu; pro porovnání obou variant nabídnout současně šikmý záběr nebo kótu výšky.
- Zachovat realistické měřítko vůči dlažbě, lavičkám, lidem a dalším známým prvkům.
- Výstupy bez ověřeného horního pohledu či 3D modelu označit **ilustrační pohled – geometrie neověřena**.
- Uložit s vizualizací metadata: `product_variant`, `camera_view`, `camera_angle_deg`, `reference_assets`, `geometry_verified`, `scene_category`, `approval_status`.

### Uživatelské ovládání
V záložce **Produkty → Vizualizace produktu**: vybrat produkt a variantu → kategorii prostředí → **Pohled kamery** (oči / dron 45° / dron 80° / kolmo shora) → vytvořit návrh → porovnat s referencemi → schválit a uložit do galerie. Umožnit i dávku všech čtyř pohledů pro jednu scénu.


## Výchozí generování ve dvojicích a fotografické momentky
- **Výchozí dávka: 2 samostatné obrázky** na jedno zadání, pokud to obrazový generátor podporuje; uživatel může zvolit další varianty.
- První obrázek: **celkový pohled** na produkt a okolí (např. úroveň očí nebo dron 45°).
- Druhý obrázek: **odlišná kompozice nebo momentka** téže instalace (např. lidé v přirozeném pohybu, detail mlhy, jiný úhel kamery nebo dron 80°).
- Volby stylu: **architektonická vizualizace**, **fotorealistická momentka**, **dronový záběr**, **detail produktu**.
- Zachovat stejné provedení produktu, rozměry, orientaci a umístění v obou obrázcích; změny scény musí být fyzikálně uvěřitelné.
- Přednostně využít již existující **schválené produktové fotografie a vizualizace v Base44** jako reference; nesmazat ani nepřepisovat původní soubory.
- Obě varianty ukládat jako **neschválené návrhy** s možností samostatného výběru a schválení; teprve schválené varianty zařadit do galerie a nabídnout Marketingu.
- Pokud generátor neumí nativně dvě varianty v jedné dávce, vytvořit dva samostatné úkoly se stejnou sadou geometrických referencí.


## Schválení → synchronizace s Mlžným diskem
**Ověřená kořenová složka Google Drive:** `Mlžný disk` (ID `1eVnUbhtyVv7trdGtJpjNfaACh3ht8QXq`). Existuje také `02_BRAND_A_MEDIA` (ID `1SejWt7RWWQeNZfj9NU1etv65aq--w_BK`), ale cílové produktové podsložky je nutné zmapovat před zápisem. Nevytvářet duplicitní strom bez kontroly.

- U každého z obou obrázků samostatně zaznamenat `approval_status`, `approved_by`, `approved_at`, `product_id`, `variant_id`, `visualization_id`.
- Po **schválení pro workflow** zařadit synchronizační úlohu pro nahrání do existující produktové složky na Mlžném disku; pokud složka neexistuje, řízeně ji vytvořit pod ověřeným produktovým kořenem.
- Nahrát originální soubor bez přepsání; idempotentní klíč `visualization_id + asset_version` zabrání opakovanému uploadu.
- Uložit `drive_file_id`, `drive_url`, `sync_status`, `sync_error` a čas synchronizace zpět k vizualizaci v Base44.
- **Schválení pro workflow není totéž jako publikace na webu**; samostatný přepínač `publish_to_web` a samostatná kontrola před publikací.
- Marketing a obchodní nabídky čerpají schválené soubory z jednoho zdroje, ne z kopií v různých galeriích.
- Při selhání synchronizace zobrazit stav „Čeká na nahrání“ a nabídnout bezpečné opakování; nikdy netvrdit, že soubor je na disku, dokud to nepotvrdí Google Drive.
