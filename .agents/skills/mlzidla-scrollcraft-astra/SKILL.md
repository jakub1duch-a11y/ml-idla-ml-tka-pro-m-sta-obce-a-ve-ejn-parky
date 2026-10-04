---
name: mlzidla-scrollcraft-astra
description: Navrhovat a upravovat web MLŽIDLA.cz podle principů Astra/Scrollcraft: vrstvená prostorová kompozice, scroll-depth, řízená typografie, motion graphics, reference-first design, vysoká čitelnost, přehledná navigace a obchodní filtr Pain–Person–Promise. Použít při redesignu homepage, hero sekcí, produktových landing pages, smart řízení, realizací, footeru, mobilní navigace a kampaní.
version: 1.1
---

# MLŽIDLA Scrollcraft / Astra

Cíl: vytvořit moderní prémiový web, který nepůsobí jako generická AI šablona. Každá stránka musí být vizuálně specifická pro MLŽIDLA®, zachovat technickou pravdivost produktu a zároveň vést uživatele ke konkrétnímu obchodnímu kroku.

## 1. Nejdřív Pain – Person – Promise
Před návrhem každé sekce pojmenuj Pain, Person a Promise. Pokud sekce nepodporuje alespoň jednu z těchto částí, zjednoduš ji nebo odstraň.

## 2. Reference-first design
Používej reálné fotografie, videa, produktové reference a existující brand MLŽIDLA. Nekopíruj cizí identitu. U produktů neměň proporce, geometrii, počet ramen/trubek, trysky, patku, ukotvení ani materiál.

## 3. Vrstvy místo plochého layoutu
Klíčové hero a prezentační bloky skládej z ambient/background, subject/product a information/UI vrstvy. Vrstvy se mohou při scrollu nebo pointer interakci pohybovat rozdílnou rychlostí, ale efekt nesmí zhoršit čitelnost.

## 4. Scrollcraft pravidla
Desktop hero může mít delší řízený scroll; mobilní hero typicky 180–220vh. Sticky scéna má 3–4 jasné kroky. Preferuj opacity, translate, scale, clip/mask a parallax. Respektuj prefers-reduced-motion a pomalé připojení. Video načítej progresivně přes poster.

## 5. Typografie a spacing
Jedna dominantní věta na viewport. Silná hierarchie, negativní prostor, omezený počet velikostí písma. Microcopy je zákaznická. CTA pojmenovává konkrétní užitek nebo další krok.

## 6. Motion graphics pro MLŽIDLA
Animace vysvětlují skutečný systém: přívod vody → filtr → chytrý ventil → průtok/senzor → mlžítko → jemná mlha; teplota/čas/senzor → SUPLA/TUYA → spuštění zóny; montáž se skrytou patkou a přívodem pod povrchem.

## 7. Struktura homepage
Hero → důkaz/reference → segmentace publika → princip fungování → Smart řízení → produkty → realizace → proces spolupráce/poptávka.

## 8. Kontrola kvality
Během prvních 5 sekund musí být jasné co nabízíme a komu. Produkt musí být geometricky věrný. Mobilní scroll kratší než desktop. Každý blok má jednu hlavní myšlenku. CTA je snadno dohledatelné. Reduced-motion funguje. Core Web Vitals se nesmí zhoršit.

## 9. Čitelnost, kontrast a hierarchie textu
Na tmavých plochách drž důležité texty přibližně white/80–100, sekundární text typicky white/65–75. Na světlém pozadí preferuj slate-950/slate-900 pro nadpisy a slate-600 až slate-700 pro běžný text. Při textu přes foto/video vždy použij lokální gradient nebo backdrop. Delší odstavce drž cca 60–68 znaků na řádek, mobil 34–42.

## 10. Navigace, mobil a footer
Desktop navigaci drž na 5–7 hlavních položkách. Mobilní navigaci seskup na Produkty, Použití, Technologie/Smart, Inspirace/Reference, Podpora/Kontakt. Dotykové cíle minimálně 44×44 px. Footer funguje jako mapa webu. Bezpečnostní značení je malé a věcné: kompaktní ShieldCheck, „Zabezpečené připojení / Kontrola odkazu“, bez dojmu certifikace nebo partnerství. Kontaktní a právní údaje musí zůstat čitelné.

## 11. Animace funkce mlžítka a PEVEKO / SUPLA
Technická animace má zobrazit: vodovodní řád → filtr → PEVEKO nebo projektově zvolený chytrý ventil → volitelný snímač průtoku → SUPLA/scénář → mlžítko → jemná mlha. U PEVEKO zobrazuj jen ověřené funkce konkrétní sestavy. Nezobrazuj záložní napájení, senzory, dohled nebo havarijní uzavření jako univerzální vlastnost. Animace má ukázat OTEVŘENO/ZAVŘENO, směr průtoku, aktivní zónu a vazbu na smart řízení. Reduced-motion fallback = statické schéma se stejnou informační hodnotou.

## 12. Implementační priorita
1. čitelnost a kontrast; 2. informační hierarchie a navigace; 3. mobilní ergonomie; 4. produktová pravdivost; 5. interaktivita a motion; 6. dekorativní efekty. Efekt, který snižuje čitelnost nebo výkon, nepoužívej.

## Zdroj metodiky
Principy vycházejí z Astra/Scrollcraft workflow a jsou rozšířeny pro MLŽIDLA o ochranu produktové věrnosti, výkon, přístupnost, čitelnost, navigační ergonomii, technické animace a obchodní CTA.