---
description: Internal MLŽIDLA branded-offer and Canva workflow rules. Use for every product sheet or quotation created from Base44, CRM, Canva and Google Workspace.
updated: 2026-11-15
status: working-draft-until-verified
---

# MLŽIDLA® – nabídky, produktové listy a Canva workflow

## Povinné pravidlo značky
- V KAŽDÉ klientské stránce prezentace a PDF musí být přesný schválený logotyp MLŽIDLA (originální asset, nikdy vykreslený textem ani znovu generovaný AI).
- Schválená původní grafika: `Logo_full.png`; pro záhlaví je připraven nezměněný ořez originálu `MLZIDLA_logo_original_tight.png`.
- Canva asset: `MAHa8en15Zg` (ořez originálu); archiv původní grafiky `MAHa8SMqpOU`.
- Base44 master: `https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4ad6dc249_MLZIDLA_logo_original_tight.png`.
- Identita: tmavá petrolejová, tyrkysová a bílá; geometrické titulky Montserrat a čitelný text Inter. Žádné ručně napodobované logo, neautorizované slogany nebo nejednotné vizuály.
- Zachovat odlišení technické značky HolmTec od klientské značky MLŽIDLA. Podpis „by HolmTec“ pouze jako text mimo logo nebo ve schválené podobě.
- V grafice používat fotografie konkrétních reálných výrobků, skutečné katalogové fotografie, ověřené reference a schválené klientské vizualizace. Nepřekreslovat počet trysek, geometrii, rozměry nebo kotvení.

## Typy výstupů
1. Produktový list BEZ CENY: značka, fotografie, produkt v prostředí, technické parametry konkrétní varianty, možnost kotvení, voda a řízení (jen pokud relevantní), CTA/QR.
2. Produktový list S CENOU: totéž + identifikovaná cenová varianta, počet kusů, příslušenství, oddělená technologie, DPH, cena bez a s DPH, revize, zdroj a schválení ceny.
3. INDIVIDUÁLNÍ NABÍDKA klientovi: titulní řešení → lokalita/situace → 1–3 schválené vizualizace → přesné výrobky a technická specifikace → chytré řízení SUPLA a příslušenství → podmínky, stavební připravenost a výluky → položková cena bez DPH, DPH a celkem s DPH → platnost, kontakty, podpis. Pro obec či město navíc schéma zónování a umístění.

## Vizuální režimy (stejná identita)
- LIGHT TECHNICAL: bílé A4, tmavý ink, tenké tabulkové linky, detail nerezových povrchů; pro technické listy a rozpočty.
- DARK HERO: reálná fotografie z veřejného prostoru nebo výroby, tmavý gradient, bílé titulky, vždy čitelné přesné logo s dostatečným kontrastem; pro úvod nabídky.
- SITE STORY: situační plán a označené body A/B, fotorealistická vizualizace bez falešné geometrie, přínosy, instalace; pro města, architekty a větší areály.
- SMART CONTROL: reálné komponenty a jen ověřené schéma SUPLA, senzory, ventil, případně šachta, režimy řízení; volitelný samostatný list.

## Interní Canva pracovní zdroje – nejsou finální klientské šablony
- Brand Kit `kAGJuqUZsdc`, Brand Master `DAHa8YIy0GA`.
- Bez ceny: `DAHa8bhukf8` → https://www.canva.com/d/mT4z_0LYe0G3j7u
- S cenou: `DAHa8fqwRyo` → https://www.canva.com/d/RvD5B1ZyIIfdynm
- Projektová: `DAHa8cMG0Dg` → https://www.canva.com/d/mOwJSRmVTSN6IV2
- Tyto kopie dosud nemají ověřené Autofill dataset fields. Nejprve doplnit a potvrdit mapování prvků a logo na každé stránce. Dokud není dataset funkční, nepředstírat automatizaci a nepouštět dávkový export.
- Standardní klientská čtyřstránková šablona „Mlžidla TP“ zůstává originální referencí a není bez kontroly nahrazena.

## Ceny, technika a prohlášení
- Jediný použitelný zdroj aktuálních cen je ověřená aktuální kalkulace pro rok 2026 z firemního sdíleného Disku; nepřebírat částky z poslaných vizuálních návrhů, starých PDF, produktové cache nebo AI.
- Interní nákladové a partnerské ceny nezveřejňovat. Rozpor mezi starými ceníky, obrázky a živou kalkulací znamená STOP a kontrolu.
- Bez ověření neslibovat „bezúdržbové“, garantované snížení teploty, zdravotní nezávadnost, certifikaci či soulad s EN 1176. Mlžítko není herní prvek.
- Systém může používat filtraci a úpravu vody, UV jen pokud je skutečně součástí konfigurace a odborně navržena.
- Potvrdit hydraulické napojení, tlak, průtok, počet trysek, el. přípojku, kotvení, geometrii, stavební připravenost a provozní podmínky; hodnoty nespekulovat.

## End-to-end obchodní workflow
1. Base44: načíst novou poptávku s přesným zdrojovým ID, fotosoubory, lokalitou a kontakty.
2. Kontrola: ověřit úplnost zadání, duplicate key, shodu produktu/varianty a firemní OAuth účty.
3. HubSpot: cílový portál 149778217. Deduplikovat kontakt/firma/deal; vytvořit nebo aktualizovat pouze při platných interních vlastnostech a právech, nikdy v cizím portálu. Cílová osmifázová pipeline je v `src/lib/mlz-hubspot-deal-contract.js` a ZATÍM NENÍ nasazena (stávající má šest fází).
4. Produkt: vybrat dle místa, skutečného MASTER produktu a schválených konstrukčních parametrů, nepřebírat z ilustrace.
5. Kalkulace: číst aktuální data ze sdíleného sešitu, zapsat zdroj a revizi, potvrdit konkrétní částky. Neověřené položky = k nacenění.
6. Vizualizace: použít schválené reálné podklady; chybí-li fotografie, ukázat koncept s jasným označením, kontrola proporcí a počtu trysek.
7. Canva: vybrat segmentovou a typovou pracovní kopii, teprve po ověření Autofill polí naplnit data; před exportem kontrola všech stran a loga.
8. Drive: PDF se jménem, ID případu, revizí a oddělenými veřejnými/interními přílohami do autorizovaného firemního sdíleného Disku.
9. HubSpot: zaznamenat odkazy na skutečně vzniklé artefakty a stav revize; pokud se nepodaří PDF export, nepovažovat nabídku za připravenou.
10. Gmail: pouze koncept v meduna@holmtec.cz, stejné vlákno když existuje. Zákazníkovi bez člověka nikdy nic neposílat.

## Stavy a schvalování
`DRAFT` → `DATA_CHECKED` → `DESIGN_REVIEW` → `PRICE_REVIEW` → `APPROVED_FOR_EXPORT` → `PDF_VERIFIED` → `GMAIL_DRAFT_READY` → `SENT_BY_HUMAN`.
Každé selhání vrátí stav `BLOCKED`, chybu a potřebný další krok. Není-li potvrzen HubSpot OAuth portál či Google účet meduna@holmtec.cz, nepokračovat v zápisech a exportech.

## Validace před publikací
- Logo: správný obrazový asset a kontrast na všech stránkách, bez změny kresby.
- Layout: A4 210×297 mm, odsazení, výřezy, přetečení textu, mobilní náhled.
- Cena: revize aktuálního zdroje, počet kusů, výluky, zdanění, mezisoučet, celkem.
- Technika: skutečný výrobní profil, trysky, kotvení, materiál, provozní tlak.
- Provoz: voda, elektřina, filtrace, SMART, servis a zazimování podle konkrétní konfigurace.
- Obchod: identita příjemce, revize PDF, CRM odkaz, Drive, Gmail koncept, zákaz odeslání.
