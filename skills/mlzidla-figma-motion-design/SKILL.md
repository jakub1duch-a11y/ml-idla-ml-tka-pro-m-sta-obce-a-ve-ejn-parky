---
name: mlzidla-figma-motion-design
description: Navrhovat ve Figmě prémiové animované webové sekce, stránky, produktové prezentace a mediální moduly pro MLŽIDLA.cz a následně je převádět do Base44. Použít při požadavcích na Figma webdesign, motion design, scroll animace, blur/focus, glass UI, interaktivní hero, produktové galerie, 3D/Spline prvky, prototypy, animační média, mikrointerakce a systematický redesign celého webu. Vždy zachovat produktovou geometrii a brand MLŽIDLA V3.
---

# MLŽIDLA Figma Motion Design

Cíl: vytvářet ve Figmě editovatelný, prémiový a animačně promyšlený design pro celý web MLŽIDLA.cz, ne statické makety. Návrh musí být převoditelný do Base44/React bez ztráty hierarchie, výkonu a produktové pravdivosti.

## 1. Začni skutečným obsahem

Nejdřív načti:
- ověřené fotografie a videa produktu;
- schválená média z Admin → Média;
- aktuální texty, CTA a technické údaje;
- existující V3 komponenty, barvy, typografii a navigaci.

Nevytvářej náhradní geometrii produktu. U MLŽIDLA platí reference-first: počet ramen, trubek, trysek, ohybů, patka, proporce a materiál musí zůstat stejné.

## 2. Figma systém, ne jednorázový screen

Každou stránku skládej z komponent:
- Header / Mega menu / Product menu;
- Hero / Section header / CTA;
- Product card / Gallery card / Video card;
- Glass panel / Data chip / Badge;
- Slider controls / Pagination / Tabs;
- Smart control diagram;
- Footer / Mobile nav.

Používej Auto Layout, variants, component properties a konzistentní spacing tokeny. Desktop, tablet a mobil musí být součást stejného design systému.

## 3. Motion vrstvy

Každý klíčový prezentační blok rozděl do tří rovin:
1. ambient: světlo, mlha, gradient, textura, prostor;
2. subject: produkt, fotografie, video nebo technický objekt;
3. information: text, CTA, data, navigace, stav.

Animace mají tyto vrstvy pohybovat odlišnou rychlostí. Výsledkem má být hloubka, nikoli vizuální chaos.

## 4. Vzory převzaté z referenčního videa

Používej jako inspiraci, ne jako kopii identity:

- Interaktivní 3D hero: vložená 3D/Spline scéna nebo její webový ekvivalent, pouze pokud neohrozí přesnost produktu.
- Atmosférické glow vrstvy: velké rozostřené světelné plochy za produktem a typografií.
- Perspective/grid depth: jemné perspektivní linky nebo technická mřížka na okrajích, střed ponechat čistý.
- Frosted glass: průsvitný panel, jemný stroke, background blur a kontrolovaný kontrast.
- Angled ticker: nakloněná lišta pro reference, města, média nebo technologické značky; nikdy nesmí rušit CTA.
- Typografický kontrast: dominantní sans-serif nadpis + střídmý akcent pouze tam, kde podporuje význam.
- Primary CTA + ghost CTA: jasná primární akce a sekundární nízko-emisní alternativa.
- Motion rhythm: idle → reveal → focus → interaction → exit. Neanimuj vše současně.

Brand MLŽIDLA nepřebírá fialovou identitu z reference. Používej V3 navy / cyan / white / mist palette.

## 5. Blur → focus systém

Pro texty, média a sekce používej při scrollu:
- vstup: opacity 0–35 %, blur 8–18 px, translateY 16–36 px;
- focus: opacity 100 %, blur 0, scale 1;
- odchod: jemný opacity fade nebo scale 0.98–1.02.

Blur nesmí zhoršit čitelnost primárního obsahu. Na mobilu sniž intenzitu a délku animace.

## 6. Scroll-trigger design

Pro dlouhé storytelling sekce:
- jedna myšlenka na jeden scroll krok;
- sticky viewport maximálně 3–4 kroky;
- text a produkt nesmí soupeřit o pozornost;
- používej progress indikaci, pokud sekce trvá déle než jeden viewport;
- preferuj opacity / translate / scale / clip / mask / parallax před těžkým WebGL.

Na mobilu scroll sekvenci zkrať a nahraď část efektů swipe/slider interakcí.

## 7. Produktové galerie

Galerie produktu má fungovat jako příběh:
1. hero produkt;
2. produkt v reálném prostoru;
3. detail materiálu / trysky / skrytého kotvení;
4. zákres shora / plán / zaměření;
5. schválená vizualizace;
6. realizace;
7. video.

Používej slider s šipkami, swipe, stav 1/N a jasně odliš fotografii, vizualizaci, zákres a video.

## 8. Smart řízení

Smart/SUPLA sekce navrhuj jako kombinaci:
- reálné fotografie hardware;
- telefon/UI;
- řízený tok vody a logiky;
- stavové karty;
- časovač, senzor, Wi‑Fi, tlak, provozní scénář.

Animace má vysvětlovat funkci, ne pouze dekorovat.

## 9. Média a video

Pro video komponenty:
- 16:9 nebo přesný poměr zdroje;
- poster před načtením videa;
- autoplay pouze muted;
- pause mimo viewport;
- slider šipky + swipe;
- full-screen/lightbox pouze na explicitní akci.

Pro animační média připrav ve Figmě storyboard: Start frame → Transition → Focus frame → CTA frame.

## 10. 3D a Spline pravidla

3D použij jen když:
- přináší skutečný užitek pro pochopení produktu/prostoru;
- má bezpečný poster/fallback;
- nepřepisuje reálnou geometrii;
- nezhorší LCP, CLS a mobilní výkon.

U produktů MLŽIDLA se nesmí generický 3D model vydávat za skutečný výrobek.

## 11. Figma → Base44 workflow

1. Vytvoř nebo otevři Figma soubor.
2. Stav komponenty přes Auto Layout.
3. Připrav desktop + mobil.
4. Definuj motion states a prototype transitions.
5. Ověř kontrast a CTA.
6. Přenes komponenty do React/Tailwind v Base44.
7. Nahraď designové placeholdery reálnými Admin médii.
8. Ověř prefers-reduced-motion.
9. Spusť produkční build.
10. Zkontroluj responsive regresi a Core Web Vitals.

Design není hotový, dokud není převod do Base44 technicky čistý.

## 12. Motion tokeny

Výchozí:
- micro interaction: 160–240 ms;
- card/hover: 240–360 ms;
- section reveal: 420–700 ms;
- cinematic hero: 700–1200 ms;
- easing: ease-out nebo cubic-bezier podobný [0.22, 1, 0.36, 1];
- parallax rozsah: malý, typicky 16–48 px;
- scale: 0.985–1.025;
- background blur: 12–32 px pro UI, vyšší pouze pro ambientní světlo.

Nepoužívej nekonzistentní arbitrary utility, pokud lze hodnotu bezpečně definovat přes token/style.

## 13. Přístupnost a výkon

- respektuj reduced motion;
- ovládací prvky min. 44 × 44 px;
- klávesnice pro slider/lightbox/menu;
- text nikdy nezávisí jen na animaci;
- animuj transform/opacity před layout vlastnostmi;
- lazy-load sekundární média;
- video a 3D mají poster/fallback;
- mobil nesmí dostat desktopovou animační zátěž.

## 14. Kontrola před předáním

Ověř:
- odpovídá produkt referenci 1:1?
- je během 5 sekund jasná hlavní myšlenka?
- vede motion oko k CTA?
- lze komponentu znovu použít?
- funguje desktop i mobil?
- má slider šipky, swipe a stav?
- jsou reálná média odlišena od AI vizualizací?
- funguje reduced-motion fallback?
- lze návrh převést do Base44 bez ručního překreslování celé stránky?

Pokud některý bod neprojde, návrh ještě není hotový.

## Referenční video

Metodika byla rozšířena podle videa YouTube iIhyNCQ7aXE, zejména o interaktivní 3D hero, Spline/Anima workflow, ambientní glow vrstvy, perspektivní gridy, frosted-glass panely, nakloněné ticker vrstvy, CTA systém a Figma-to-code přístup. Tyto principy vždy převáděj do vizuální identity MLŽIDLA V3 místo kopírování cizího stylu.
