# MLŽIDLA.cz – inspirace navigací a interakcemi HubSpotu

Stav: návrh k realizaci a kontrole • 15. 11. 2026  
Reference: https://www.hubspot.com/  
Pracovní větev: fix/menu-kliknuti-zavreni • PR https://github.com/jakub1duch-a11y/ml-idla-ml-tka-pro-m-sta-obce-a-ve-ejn-parky/pull/129

## Co bylo zjištěno

- Na hlavní stránce je nahoře dvouúrovňová navigace, po posunutí zůstává kompaktní hlavní navigace.
- Nabídka má rozbalovací tlačítka, samostatné odkazy a vizuálně výrazná CTA.
- Úvod kombinuje velký text, popis, dvojici odlišných CTA a navazující obrazové karty.
- Následuje pás log s ovládáním pozastavení, produktové karty, karusel s předchozí/další a pozastavením a přepínatelné reference.
- Nezjištěno: přesná implementace cizího webu, animační knihovna, časování, chování ve všech breakpointech. Klikací menu podle požadavku Radka, nikoli tvrzení o úplně změřeném chování HubSpotu.

## 1. Navigace – aktuální úkol

Zjištěno ve zdrojích: `src/components/layout/Header.jsx`, `MegaCatalogMenu.jsx` a `UsageMenu.jsx`. Položky Produkty, Použití, Jak fungují a Informace se dosud otevíraly při najetí myší. Mega menu Produkty je vykresleno mimo wrapper samotného tlačítka; při přechodu kurzoru proto potřebuje zrušit časovač zavření.

Požadované chování:
- Na hover nikdy neotevírat. Kliknutí nebo Enter/Space nabídku přepíná.
- Pohyb z tlačítka do otevřeného panelu menu nezavře; po opuštění panelu/tlačítka zavřít s krátkou prodlevou 150 ms. Prodleva je návrh pro použitelnost.
- Otevření jiného menu zavře původní; další kliknutí na aktivní tlačítko zavře menu.
- Escape zavře všechna menu. Klávesnice a dotyk musí zůstat použitelné, aria-expanded odpovídá stavu.
- Ověřit i rychlý přechod mezi položkami, kurzor v mezeře a otevření/zavření bez překrývání.
- Mobilní menu má samostatnou interakci; po změně vyzkoušet i mobil.

Stav: změna v pracovní větvi, připravená k revizi; build, CI, skutečný prohlížeč a preview zatím nepotvrzeny. PR není nasazený.

## 2. Další použitelné interakce pro MLŽIDLA.cz

### A. Kompaktní hlavička při scrollu – priorita vysoká
Na výchozí pozici plná navigace, při posunutí kompaktnější provedení bez skákání obsahu. Vždy zachovat přístup k menu a Poptat cenu. Ověřit stávající `Header.jsx`, který už reaguje na směr scrollu; před změnou rozhodnout vztah k současnému skrývání hlavičky. Nepřidávat druhou sticky hlavičku.

### B. Produktové karty a CTA – priorita vysoká
Krátký nadpis, ověřená fotografie přesného modelu, jasné využití, odkazy Detail / Poptat. Jemná změna stínu nebo posun maximálně několik pixelů; odkaz a text musí zůstat čitelné i bez hoveru. Fotografie podle MASTER produktu.

### C. Karty použití v prostoru – priorita střední
Sekce Města a obce / zahrady / koupaliště / školy. Karty s fotografií, jednou větou a odkazem. Postupné objevení při vstupu do viewportu navrženo jako 250–400 ms, malé posunutí a opacity; nezdržovat obsah ani nebránit používání.

### D. Reference a přepínání – priorita střední
Filtrování referencí podle typu prostoru pomocí skutečných tlačítek; procházení klávesnicí, viditelný aktivní stav, propojení na konkrétní realizaci. Žádné smyšlené údaje o městech a úsporách.

### E. Karusel realizací – priorita střední
Předchozí/další, pozice, jasný detail a tlačítko pauzy při automatickém pohybu; dostupné dotykové ovládání. Před implementací zkontrolovat existující karusely a znovu použít vhodnou komponentu.

### F. Vysvětlení ovládání – priorita střední
Voda → filtrace → volitelný ventil → mlžítko, doplněné volitelným ovládáním SUPLA. Jemné postupné rozsvícení; text i statické schéma dostupné bez animace. Funkce ověřovat podle konkrétní sestavy.

### G. Patička – priorita nižší
Seskupit produkty, použití, reference, podporu a kontakt do čitelných sloupců; na mobilu rozbalovací skupiny s klávesnicí. Respektovat nedávné souběžné změny footeru a ověřit aktuální hlavní větev.

## Design a přístupnost

Využít identitu MLŽIDLA.cz a skutečné fotografie; nepřejímat logo, obrázky ani brand HubSpotu. Nadpisy a text v existujících značkových fontech. Na tmavém i světlém pozadí ověřit kontrast. Požadavek `prefers-reduced-motion` musí nahradit animace statickým zobrazením bez ztráty obsahu. Cíle na dotyk alespoň 44 × 44 px. Nezobrazovat přesné ceny ani technické parametry bez ověření.

## Vytvoření, kontrola a nasazení

1. Ověřit aktuální `main`, související otevřené větve a souběžné úpravy; pro každý okruh vytvořit samostatnou větev.
2. Navrhnout konkrétní komponentu podle existující struktury projektu a připravit lokální/staging náhled.
3. Spustit odpovídající lint, build a cílené testy; zobrazit změnu na desktopu i mobilu. Zkontrolovat klávesnici, focus, Escape, čtečku, reduced-motion a konzoli.
4. V PR popsat změnu a skutečné výsledky kontrol. Pokud build nebo náhled neprojde, nepokračovat do produkce.
5. Po úspěšné kontrole předložit správci ke schválení sloučení a nasazení; po schválení ověřit produkční URL a reálné chování. Bez náhledu ani schválení netvrdit, že změna běží na webu.

## Akceptační scénáře pro menu

- Hover na zavřené menu → zůstane zavřené.
- Klik na Produkty → otevřeno; klik znovu → zavřeno.
- Produkty → přesun kurzoru do panelu → zůstane otevřeno.
- Opustit panel → zavře se po krátké prodlevě.
- Klik na jiné menu → otevřené právě jedno.
- Escape → zavřeno; klávesnice Tab/Enter funguje.
- Mobilní menu a odkazy fungují; rozvržení bez překryvů.

Poznámka: výše uvedené scénáře jsou kontrolní plán, ne tvrzení o provedených testech.
