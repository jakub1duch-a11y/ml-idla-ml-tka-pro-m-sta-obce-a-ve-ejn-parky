---
name: mlzidla-brand-product-commerce
description: Pravidla značky MLŽIDLA.cz a HolmTec pro webové stránky, produktový katalog, technická data, nabídky a komunikaci zákazníkům.
version: 1.0
---

# MLŽIDLA.cz × HolmTec — design, produktová přesnost a obchod

Používej tento skill pouze pro úkoly značek MLŽIDLA.cz a HolmTec, jejich katalog, veřejný web, nabídky, poptávky a související workflow. Neaplikuj jej na samostatný projekt REINCARS.

## Design / značka
- MLŽIDLA jsou české architektonické mlžné prvky, mlžné sochy a systémy ochlazování prostoru s výrobním zázemím HolmTec v Trutnově.
- Reference-first: vycházej z reálných fotografií, modelů a schválených produktových médií; nevymýšlej geometrii mlžítek, šachtu, trysky ani realizace.
- Dodržuj existující CSS design tokeny; prémiová identita navy / cyan / white / mist, technická přesnost, velká jasná typografie, střídmé vrstvení a vysoký kontrast.
- Pro webové změny čti také `skills/mlzidla-scrollcraft-astra/SKILL.md` a `skills/mlzidla-figma-motion-design/SKILL.md`. Přístupnost (mobil, kontrast, touch, reduced motion) má přednost před efektovostí.
- Značky jsou odlišné: MLŽIDLA = produkt a řešení prostoru; HolmTec = technické a výrobní zázemí. Neprezentuj je jako dvě nesouvisející firmy.

## Produktová pravdivost
- Při úpravě produktu vždy nejprve ověř aktuální data z produktového katalogu Base44, případně výrobní dokumentace nebo schváleného Google Disku.
- Nesmí se svévolně měnit profil, průměr, ohybový rádius, výška, počet trysek, směr rozprašování, typ patky nebo kotvení.
- Parametry TR42×3, TR60 či vyšší/nižší tlak nejsou univerzální pro všechna mlžítka. Rozlišuj nízkotlaká řešení a případné samostatně specifikované vysokotlaké systémy.
- Netvrď, že každá sestava obsahuje SUPLA, senzory, chytrý ventil či čerpadlo. Vždy rozlišuj základní systém a volitelné řízení.
- Neuváděj bez podkladu zaručené úspory vody, ochlazení v °C, výkon, tlaky, počty trysek, doby výroby nebo životnost.
- U objektů pro děti vždy respektuj skutečné určení; mlžná socha sama o sobě není deklarovaným herním prvkem ČSN EN 1176.

## Cenové nabídky
- Autoritativní ceny a kalkulační sazby načítej z nejnovější schválené tabulky `Kalkulace 2026` na MLŽNÉM Google Disku. Nikdy nevymýšlej ceny ani neber historické ceny webu bez ověření.
- Základní šablona vizuálních nabídek: schválená Canva `Mlžidla TP` (4 strany). Opakovaně používej dokončené nabídky, místo abys je znovu generoval.
- U institutions veřejného sektoru prezentuj částky bez DPH a s DPH v transparentním položkovém rozpisu, vždy uveď základ DPH a správnou sazbu pro danou transakci.
- Kompletní nabídka obsahuje příjemce, přínos produktu, pravdivé foto / vizualizace, technickou specifikaci, cenu mlžítka, volitelnou automatizaci SUPLA včetně šachtového rozvaděče, stavební připravenost, montáž, dopravu, dodací dobu, platnost a identifikaci HolmTec.
- Šachta ve vizualizaci řízení je **ilustrační foto**; finální provedení se určí dle prostoru a umístění.
- Individuální nabídka podle poptávky není totéž co marketingové první oslovení.

## První obchodní oslovení
- Pro první kontakt s dosud neosloveným zákazníkem použij **již schválenou a odeslanou všeobecnou obrazovou nabídku MLŽIDLA.cz**, PDF a odpovídající WebP. Podle potřeby doplň existující list SUPLA.
- První oslovení personalizuj jménem, organizací a místem, ale nevymýšlej individuální ceny ani parametry, dokud není zadána konkrétní poptávka.
- Používej obchodní Gmail `meduna@holmtec.cz`; připravuj **koncepty**, nikoli automaticky odeslané zprávy.
- Uživatel schvaluje odeslání; v rámci webové úpravy nikdy nespouštěj hromadnou marketingovou rozesílku.
- Centrální CRM kontakty, stavy oslovení, odpovědi, nabídky a poptávky synchronizuj podle ověřených identifikátorů a deduplikuj; nevytvářej paralelní tabulky bez důvodu.

## Vývoj a publikace
- GitHub branch → konkrétní commit → CI → PR → preview / kontrola mobilu → schválený merge main → Base44 synchronizace → produkční deploy → ověření.
- Měň pouze skutečně relevantní soubory. Při úpravě `/o-nas` zachovej kontaktní fakta, právní identifikaci, odkazy na katalog, reference, poptávku a HolmTec.
- Nepřidávej sekret, OAuth token nebo privátní osobní data do zdrojových souborů.
