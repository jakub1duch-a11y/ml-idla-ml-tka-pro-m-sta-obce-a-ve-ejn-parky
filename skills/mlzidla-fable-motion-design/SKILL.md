---
name: mlzidla-fable-motion-design
description: Pravidla pro přístupné a přesné scroll animace, hero sekce, interaktivní galerie a produktový motion design na MLŽIDLA.cz v Base44/React. Používat také při práci s návrhy modelu Fable 5.2 nebo agenty Base44.
version: 1.0
---

# MLŽIDLA · Motion design, vizuální rytmus a Fable

## Úloha modelu / agenta
- Fable 5.2 nebo jiný generativní agent slouží k návrhu storyboardu, CSS/React prototypu, kreativní animace a variant rozhraní. Konkrétní dostupnost modelu ověř v používaném nástroji; nepřisuzuj mu autorství bez doloženého běhu.
- Agent Base44 pro obchodní nabídky není automaticky agentem pro úpravu veřejného webu. Jeho výstup podléhá stejné kontrole jako jakákoli kreativní reference.
- Každá implementace musí mít oddělenou pracovní větev, build, preview a schválení před merge / publikací.

## Důkaz před efektem
1. Vezmi produkt, slug a jeho schválený obraz z Base44 Admin / MLŽNÉHO DISKU.
2. Zachovej geometrii výrobku, počet trysek, patku, povrch a proporce beze změny. AI nesmí domalovat jinou konstrukci.
3. Rozlišuj reálnou fotografii, vizualizaci a video; zobrazuj vhodný popisek.
4. Nepublikuj nabídky, ceny ani interní výrobní data do veřejného webu.

## Vzorové motion bloky
- **Hero arrive**: jeden nenápadný úvodní pohyb fotografie (scale 1.045 → 1, opacity 0.82 → 1, max. 1.2 s); text a CTA musejí být čitelné ihned. Hero obrázek je LCP, nedávej mu lazy-loading.
- **Product story**: při prvním scrollu jemný nástup sekce (translateY 16–20 px, opacity minimálně 0.9 → 1, 0.45–0.7 s). Žádný text nesmí zůstat skrytý při vypnutém JavaScriptu.
- **Carousel discoverability**: po prvním dosažení slideru jednou jemně posuň vpřed a zpět; okamžitě přeruš při dotyku, drag, kliknutí na navigaci nebo klávesové akci. Trvalá šipka, indikátor počtu a text „Posuňte galerii do stran“.
- **Ambient mist**: mlha jen v dekorativní vrstvě za skutečnou fotografií, nikdy nesimulovat trysky na nesprávném místě ani nepřekrývat CTA.
- **Video**: statický poster před spuštěním; ovládání play/pause; přehrávání pozastavit mimo viewport. Žádný autoplay se zvukem.

## Přístupnost a výkon
- Vše respektuje prefers-reduced-motion; bez pohybu zůstává stejný obsah a ovládání.
- Navigace šipkami, swipe, klávesnicí a indikace pozice. Fokus má viditelný outline, dotykové cíle aspoň 44×44 px.
- Zásadní údaje (H1, popis, CTA, parametry) musí existovat v čitelném HTML.
- Zachovej kontrast na fotografii, breakpointy, image aspect-ratio a prostor pro captions.
- Vyhnout se scroll hijackingu, nekonečným autorotacím a animacím mnoha velkých obrázků současně.
- Optimalizuj LCP/CLS/INP, reálně testuj mobil i desktop.

## Workflow Base44
1. Zkontroluj existující komponenty Home2026, ProductPhotoGallery, MistSceneSelector, PdVisualGalleryCompact a PdDescription, neopakuj jejich funkce.
2. Navrhni pouze zlepšení s jasným účelem: orientace, porozumění produktu, důvěra, poptávka.
3. Implementuj v pracovní větvi; spustit npm run build.
4. Zkontroluj desktop / mobil, porovnej geometrii každého výrobku s MASTER referencí.
5. Vytvoř checkpoint. Merge a publikace až po kontrole a výslovném schválení.

## Schválené hodnoty
- Intro 700–1200 ms, reveal 420–700 ms, karta hover 180–300 ms.
- Transform a opacity před nákladným filter blur; pohyby do 20–48 px, scale max cca 1.05.
- Brand používá navy, cyan, mist, white, skutečné logo MLŽIDLA a fotografický přístup.
