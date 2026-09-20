---
name: mlzidla-scrollcraft-astra
description: Navrhovat a upravovat web MLŽIDLA.cz podle principů Astra/Scrollcraft: vrstvená prostorová kompozice, scroll-depth, řízená typografie, motion graphics, reference-first design, vysoká čitelnost, přehledná navigace a obchodní filtr Pain–Person–Promise. Použít při redesignu homepage, hero sekcí, produktových landing pages, smart řízení, realizací, footeru, mobilní navigace a kampaní.
version: 1.1
---

# MLŽIDLA Scrollcraft / Astra

Cíl: vytvořit moderní prémiový web, který nepůsobí jako generická AI šablona. Každá stránka musí být vizuálně specifická pro MLŽIDLA®, zachovat technickou pravdivost produktu a zároveň vést uživatele ke konkrétnímu obchodnímu kroku.

## 1. Nejdřív Pain – Person – Promise

Před návrhem každé sekce pojmenuj:
- Pain: problém návštěvníka, například přehřáté náměstí, nekomfortní terasa, složité řízení nebo nejistota při výběru.
- Person: konkrétní publikum, například město/obec, architekt, správce areálu, gastro nebo rezidenční zákazník.
- Promise: jediný hlavní výsledek, který MLŽIDLA slibují, například chytré ochlazení prostoru bez čerpadla nebo rychlý návrh řešení pro konkrétní místo.

Pokud sekce neumí podpořit alespoň jednu z těchto tří částí, zjednoduš ji nebo odstraň.

## 2. Reference-first design

- Nezačínej generickou představou „moderního webu“. Nejprve použij reálné fotografie, videa, produktové reference, realizace a existující brand MLŽIDLA.
- Každou inspiraci převeď do vlastního systému značky; nekopíruj cizí identitu.
- Pro produktové vizuály platí absolutní ochrana geometrie: neměnit proporce, počet ramen/trubek, trysky, patku, ukotvení ani materiál.

## 3. Vrstvy místo plochého layoutu

Každý klíčový hero nebo prezentační blok skládej minimálně ze tří vizuálních rovin:
1. ambient/background: foto, video, světlo, mlha, textura;
2. subject/product: produkt nebo dominantní objekt;
3. information/UI: typografie, CTA, data, štítky, progress.

Vrstvy se při scrollu nebo pointer interakci pohybují rozdílnou rychlostí. Rozdíly mají být jemné; cílem je prostorovost, ne efekt pro efekt.

## 4. Scrollcraft pravidla

- Desktop hero může mít delší řízený scroll; mobilní hero drž typicky kolem 180–220vh.
- Sticky scéna má vyprávět 3–4 jasné kroky. Jeden krok = jedna myšlenka.
- Text, vizuál a CTA se nesmí překrývat tak, aby byla zhoršená čitelnost.
- Animuj opacity, translate, scale, clip/mask a parallax před složitými 3D efekty.
- Respektuj prefers-reduced-motion a pomalé připojení.
- Video používej progresivně: poster první, video až následně. Nezhoršuj LCP kvůli dekoraci.

## 5. Typografie a spacing

- Jedna dominantní věta na viewport.
- Nadpisy mají mít silnou hierarchii a dostatek negativního prostoru.
- Nepoužívej současně mnoho font sizes a dekorativních stylů.
- Microcopy musí být zákaznická; interní výrazy jako „hero animace“, „component“, „section“ se na veřejném webu nezobrazují.
- CTA má vždy pojmenovat užitek nebo další krok: „Navrhnout řešení“, „Vizualizovat v prostoru“, „Získat cenu“, „Prohlédnout realizace“.

## 6. Motion graphics pro MLŽIDLA

Motion má vysvětlovat skutečný systém:
- přívod vody → filtr → chytrý ventil → průtok/senzor → mlžítko → jemná mlha;
- teplota/čas/senzor → SUPLA/TUYA → spuštění zóny;
- městský prostor před/po ochlazení;
- montáž: skrytá patka a přívod vody pod povrchem.

Preferuj krátké editovatelné sekvence a webové animace. Pro komplexní 3D nebo filmové scény použij externí video/3D nástroj, ale výsledek musí zůstat v souladu s reálným produktem.

## 7. Struktura homepage

Doporučený tok:
1. Hero: hlavní promise + produkt v reálném prostoru + hlavní CTA.
2. Důkaz: realizace, města, reference.
3. Segmentace publika: města/architekti/komerční/rezidence.
4. Princip fungování: jasná vizuální demonstrace mlhy a systému.
5. Smart řízení: SUPLA/TUYA, scénáře, spotřeba/průtok.
6. Produkty: reálné produktové karty bez vymyšlených variant.
7. Realizace a důvěryhodnost.
8. Proces spolupráce a jednoduchá poptávka.

## 8. Kontrola kvality před dokončením

Zkontroluj:
- Je během prvních 5 sekund jasné, co MLŽIDLA nabízí a komu?
- Je produkt skutečný a geometricky věrný?
- Jsou vrstvy vizuálně odlišné, ale ne rušivé?
- Je mobilní scroll kratší než desktop a bez zbytečných překryvů?
- Má každý blok jednu hlavní myšlenku?
- Je CTA viditelné bez dlouhého hledání?
- Funguje reduced-motion fallback?
- Nedochází k regresi Core Web Vitals?
- Nepůsobí sekce jako generická AI šablona?

Pokud některý bod neprojde, návrh není hotový.

## 9. Čitelnost, kontrast a hierarchie textu

- Na tmavých plochách nepoužívej důležité texty s příliš nízkou opacity. Primární obsah drž přibližně na white/80–100, sekundární text typicky alespoň white/65–75; dekorativní metadata mohou být slabší.
- Na světlém pozadí preferuj slate-950/slate-900 pro nadpisy a slate-600 až slate-700 pro běžný text. Vyhýbej se slate-400 u delších odstavců.
- Delší odstavce drž přibližně do 60–68 znaků na řádek, na mobilu zhruba 34–42 znaků.
- CTA, důležité hodnoty a stavové informace nesmí spoléhat jen na barvu; podpor je ikonou, štítkem nebo textem.
- Při překryvu textu přes foto nebo video vždy používej lokální gradient/backdrop vrstvu; nespoléhej na konkrétní jas jediné fotografie.

## 10. Navigace, mobil a footer

- Desktop navigaci drž na 5–7 hlavních položkách. Sekundární obsah seskup do logických menu místo řady samostatných položek.
- Mobilní navigace musí mít jasné skupiny: Produkty, Použití, Technologie / Smart, Inspirace / Reference, Podpora / Kontakt.
- Dotykové cíle minimálně 44 × 44 px a dostatečné mezery mezi akcemi.
- Footer má fungovat jako orientační mapa webu: produkty, řešení, inspirace, podpora, kontakt a důvěryhodnost.
- Bezpečnostní značení udržuj malé a věcné. Používej kompaktní ShieldCheck ikonu a text typu „Zabezpečené připojení / Kontrola odkazu“ bez dojmu neexistující certifikace nebo partnerství.
- Ve footeru nepoužívej klíčové kontaktní a právní údaje s kontrastem, který je na mobilu obtížně čitelný.

## 11. Animace funkce mlžítka a PEVEKO / SUPLA

Interaktivní technické animace musí vysvětlovat skutečný tok systému, ne jen dekorovat stránku:

1. vodovodní řád / přívod vody;
2. filtrace;
3. PEVEKO nebo jiný projektově zvolený chytrý ventil;
4. volitelný snímač průtoku / stavové měření;
5. řídicí logika SUPLA / scénář času, teploty nebo senzoru;
6. mlžítko;
7. jemná mlha a ochlazovaná pobytová zóna.

Pro prezentaci ventilu PEVEKO používej jen funkce ověřené pro konkrétní sestavu. Nezobrazuj záložní napájení, senzory, vzdálený dohled nebo automatické havarijní uzavření jako univerzální vlastnost všech variant. Animace má umožnit stav OTEVŘENO / ZAVŘENO, směr průtoku, aktivní zónu a vazbu na příkaz ze smart řízení. U reduced-motion zobraz statické schéma se stejnou informační hodnotou.

## 12. Implementační priorita

Při úpravách MLŽIDLA.cz postupuj v tomto pořadí:
1. čitelnost a kontrast;
2. informační hierarchie a navigace;
3. mobilní ergonomie;
4. produktová pravdivost;
5. interaktivita a motion;
6. dekorativní efekty.

Efekt, který snižuje čitelnost nebo výkon, se nepoužije ani tehdy, když působí vizuálně atraktivně.

## Zdroj metodiky

Principy byly odvozeny z workflow prezentovaného ve videu „GPT-6 Astra Kills AI Website Slop“ / ukázkách Astra webdesignu: reference-first návrh, Scrollcraft, vrstvení, scroll depth, typografie, spacing a filtr Pain–Person–Promise. Pro MLŽIDLA jsou rozšířeny o ochranu produktové věrnosti, výkon, přístupnost, čitelnost, navigační ergonomii, technické animace a obchodní CTA.
