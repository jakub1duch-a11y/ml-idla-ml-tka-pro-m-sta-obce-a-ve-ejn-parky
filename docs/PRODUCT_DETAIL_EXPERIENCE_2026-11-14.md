# MLŽIDLA.cz — pravidla a návrh produktového detailu
Datum: 2026-11-14
Stav: zadání k implementaci, nikoli implementovaná nebo nasazená změna.
Rozsah: všechny produktové detaily; společná struktura, individuální ověřený obsah.

## Závazná obsahová logika
Každá sekce produktového detailu musí odpovědět na jinou otázku zákazníka a přidat novou informaci: nejprve ukázat produkt a jeho použití, potom skutečné mlžení a detail provedení, následně možnosti instalace a ovládání, uvést technické údaje pouze jednou a umožnit snadnou poptávku konkrétní varianty.

Materiál (včetně označení AISI), provozní tlak, velikost kapek, počet trysek a spotřeba se nesmějí opakovat v několika tabulkách či kartách. Jeden ověřený zdroj dat a jeden kanonický technický přehled. Z ostatních sekcí na něj odkazovat. Zachovat odlišné údaje variant; rozpory nezakrývat a neřešit odhadem.
Před změnou projít všechny tabulky, hero štítky, galerie, FAQ a technické bloky. Odstraňovat obsahovou duplicitu, nikoli užitečné ovládání nebo CTA.

## Navržený průchod stránkou
1. Produkt v prostoru: skutečná fotografie, název, konkrétní použití, CTA „Poptat tento produkt“. Jasně odlišit fotografii od vizualizace.
2. „Podívejte se, jak mlží“: krátké schválené video konkrétního produktu, celkový záběr a detail trysky. Směr a charakter mlhy musí odpovídat skutečnosti.
3. Detail zpracování a měřítko: ověřená fotografie trysky, povrchu a celého produktu v prostoru. Žádná další tabulka již uvedených parametrů.
4. „Jak zapadne do vašeho prostoru“: instalace, povrchy, viditelné/skryté kotvení podle konkrétního produktu.
5. „Ovládání podle vašeho provozu“: jednoduché zahradní varianty až městské a profesionální automatizované systémy HolmTec / Mlžidla.cz; pouze ověřené funkce konkrétní sestavy.
6. Jeden technický přehled, varianty a případné ověřené podklady ke stažení.
7. Poptávka s předvyplněným produktem/variantou, místem instalace a možností přiložit fotografii prostoru. Výzva „Navrhnout řešení pro můj prostor“.

## Potvrzené informace výrobce z rozhovoru
- Označení varianty: „S patkou“.
- Navařená patka může být viditelná nebo skrytá podle povrchu a instalace. Skryté kotvení není samostatná konstrukční varianta.
- Hned nad patkou je navařený přívod vody pro připojení přes ventil k běžnému vodovodnímu řadu. Přívod může být rovněž skrytý.
- Provedení bez patky může být určeno pro zatížený přenosný podstavec typu stojanů dopravního značení nebo pro upevnění do zemního vrutu.
- Tyto možnosti nejsou automaticky kompatibilní s každým produktem. Zobrazovat pouze potvrzené kombinace, neodvozovat rozměry, nosnost nebo stavební skladbu.
- Řízení je volitelné řešení; nezobrazovat všechny senzory a funkce jako součást každé dodávky. Nezaměňovat běžný vodovodní a vysokotlaký systém.

## Storyboard instalace
Hotový produkt v prostoru → odkrytý řez instalací s patkou a přívodem → detail připojení → opět finální povrch.
Samostatně přepínat viditelné/skryté provedení s patkou. Bezpatkové varianty zobrazit vlastní scénou.
Povrchy zobrazovat realisticky s materiálovou strukturou a stíny, ale pouze s ověřenou skladbou. Trávník nesmí působit jako samostatná nosná základna.
Na desktopu nejvýše 3–4 kroky; na mobilu krátké přechody a tlačítka bez vynuceného dlouhého scrollu.

## Video, zvuk, přístupnost
Poster před videem, sekundární média načítat odloženě. Automatické přehrávání pouze bez zvuku; slyšitelný zvuk výhradně po stisku „Zapnout zvuk“, se snadným vypnutím.
Použít skutečný zvuk daného záznamu. Umělý zvuk nevydávat za důkaz hlučnosti výrobku.
Pauza mimo viewport, ovládání klávesnicí, dotykové cíle alespoň 44 px, reduced-motion statická alternativa.
Chybí-li ověřené video, zobrazit schválenou fotografii; žádné nefunkční tlačítko ani video jiného produktu vydávané za vlastní.
Respektovat celé produktové fotografie na mobilu, kontrast textů, poměry stran a přístupnost. Nepouštět zvuk při scrollování.

## Vizuální směr a inspirace
Použít aktuální brand MLŽIDLA: stávající logo a tokeny navy/cyan/white, čistou typografii, střídmé prostorové vrstvy a jemnou mlhu.
Princip postupného odhalování informací: Nielsen Norman Group, https://www.nngroup.com/articles/progressive-disclosure/ — nejdříve důležité informace, podrobnosti dostupné na vyžádání. Pravidlo jedné tabulky je konkrétní požadavek Radka, nikoli citace NN/G.
Digitální a motion inspirace: https://unseen.co/ — nekopírovat identitu ani média.
Kandidát pro scroll animace: https://gsap.com/docs/v3/Plugins/ScrollTrigger/ — před přidáním závislosti ověřit stávající animační řešení; nepřidávat více knihoven pro stejnou funkci.

## Místa pro implementační audit
V obou repozitářích byla ověřena existence:
- src/components/installation/AnchoringInstallationSection.jsx
- src/components/installation/AnchorMotionPreview.jsx
- src/components/produkt/ProductTechnicalDetailSection.jsx
- src/components/produkt/ProductMotionSection.jsx
- src/components/produkt/ProductVisualShowcase.jsx
- src/components/produkt/ProductContactForm.jsx
- src/lib/productDetailConfig.js
- public/media/installation/ (stávající GIF animace a desktop/mobile postery)
Obsah komponent zatím nebyl auditován. Před úpravou ověřit skutečné importy a vykreslování na produktové stránce; nevytvářet druhou paralelní šablonu.

## Akceptační kontrola implementace
- Každý materiál/tlak/kapky/spotřeba/počet trysek je na detailu pouze v jednom technickém přehledu; hodnoty a jednotky zachované.
- Každý produkt má vlastní ověřená média a pouze kompatibilní varianty.
- Zvuk se nikdy nespustí bez výslovného ovládání návštěvníkem.
- Chybějící média mají funkční statickou alternativu.
- Mobil 360/390 px, tablet a desktop bez ořezu výrobku, přetékání a překryvů.
- Zkontrolovat reduced motion, klávesnici, video pauzu a odkazy.
- Poptávka přenese správný produkt a variantu.
- Ověřit build a používané CI, preview a výkon. Produkční nasazení až po kontrole a schválení.
- Změřit přehrání videa, volbu instalace, kliknutí na poptávku a skutečně úspěšné odeslání bez osobních údajů v analytice. Zvýšení konverze je cíl, nikoli doložený výsledek.

Tento dokument uchovává zadání v GitHubu. Jeho přítomnost neznamená synchronizaci do Base44 Builderu, dokončení implementace ani nasazení na mlzidla.cz.
