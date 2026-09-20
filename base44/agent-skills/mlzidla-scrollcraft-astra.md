# MLŽIDLA Scrollcraft / Astra — v1.1

Používej při každé úpravě veřejného webu MLŽIDLA.cz, zejména homepage, hero, navigace, mobilního menu, footeru, produktových detailů, Smart Cooling, PEVEKO/SUPLA prezentace a motion graphics.

## Priority
1. Čitelnost a kontrast.
2. Informační hierarchie a navigace.
3. Mobilní ergonomie.
4. Produktová a technická pravdivost.
5. Interaktivita a motion.
6. Dekorativní efekty.

## Pain – Person – Promise
Před návrhem každé sekce určete problém uživatele, konkrétní publikum a jediný hlavní výsledek. Sekci bez jasného účelu zjednoduš nebo odstraň.

## Reference-first
Začínej reálnými fotografiemi, videi, realizacemi a skutečnými produktovými daty MLŽIDLA. Nevymýšlej nové tvary, trubky, ramena, trysky, patky, ukotvení ani technické parametry.

## Scrollcraft
Klíčové prezentační scény skládej ze tří rovin: ambient/background, subject/product, information/UI. Jemný parallax a scroll depth mohou mít různé rychlosti, ale nesmí snižovat čitelnost. Mobilní sticky hero typicky 180–220vh, desktop může být delší. Respektuj prefers-reduced-motion a slabé připojení; poster se načítá před videem.

## Typografie a kontrast
Na tmavém pozadí drž primární obsah přibližně white/80–100 a sekundární text typicky nejméně white/65–75. Na světlém pozadí preferuj slate-950/900 pro nadpisy a slate-600/700 pro delší text. Text přes foto/video vždy chraň lokálním gradientem nebo backdropem. Dlouhé odstavce drž do cca 60–68 znaků na řádek; mobil cca 34–42.

## Navigace
Desktop: 5–7 hlavních položek, sekundární obsah seskupovat. Mobil: jasné skupiny Produkty, Použití, Technologie / Smart, Inspirace / Reference, Podpora / Kontakt. Dotykové cíle minimálně 44×44 px.

## Footer a důvěryhodnost
Footer je mapa webu a obsahuje produkty, řešení, inspiraci, podporu, kontakt a právní/důvěryhodnostní prvky. Kontaktní a právní údaje nesmí být příliš světlostně utlumené. Bezpečnostní badge má být kompaktní: malý ShieldCheck/Lock, text „Zabezpečené připojení“ nebo „Kontrola odkazu“, bez dojmu neexistující certifikace či partnerství.

## Motion graphics MLŽIDLA
Animace mají vysvětlovat systém: přívod vody → filtr → ventil → volitelný průtok/senzor → řídicí logika → mlžítko → jemná mlha. Druhý logický tok: teplota/čas/senzor → SUPLA/TUYA → spuštění konkrétní zóny.

### PEVEKO / SUPLA
Zobrazuj jen funkce ověřené pro konkrétní sestavu. Wi‑Fi a ovládání ventilu přes SUPLA lze zobrazit u odpovídajícího modelu. Záložní baterie, záplavová čidla, GSM, stavové senzory a další funkce jsou variantní/doplňkové a nesmí být prezentovány jako univerzální vlastnost všech PEVEKO ventilů. Animace má umět stav OTEVŘENO / ZAVŘENO, směr průtoku, aktivní zónu a příkaz z řízení. Reduced-motion fallback musí předat stejné informace statickým schématem.

## CTA
Používej konkrétní akce: Navrhnout řešení, Vizualizovat v prostoru, Získat cenu, Prohlédnout realizace, Spočítat provoz. Vyhýbej se interním výrazům typu component, hero animation nebo section.

## Kontrola před dokončením
Do 5 sekund musí být jasné co značka nabízí a komu. Produkt musí být geometricky věrný. CTA je viditelné. Mobilní navigace je přehledná. Text je čitelný na reálných fotografiích. Reduced-motion funguje. Efekt nesmí zhoršit Core Web Vitals ani čitelnost.