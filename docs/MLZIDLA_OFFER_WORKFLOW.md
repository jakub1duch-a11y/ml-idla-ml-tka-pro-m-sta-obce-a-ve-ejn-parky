# MLŽIDLA.cz – obchodní nabídky: workflow a kontrola (2026-11-08)

Tento dokument stanoví proces přípravy **konceptů** obchodních nabídek. Neobsahuje klientská data, interní kalkulace ani přihlašovací údaje. Není automatickým povolením k rozesílání.

## Zdroje pravdy
- **Brand**: připojený firemní Google Drive, složka `00_BRAND_MLZIDLA`. Pro vizuální identitu používat schválené logo, barvy a produktové fotografie; nevymýšlet produktovou geometrii.
- **Ceny výrobků**: poslední ověřené hodnoty z firemní tabulky `Kalkulace mlžítka 2026`; každou cenu v nabídce uvádět s odpovídajícím režimem DPH.
- **Chytré řízení**: nejnovější schválený produktový/cenový list `SMART SUPLA` (CZ nebo SK). **Nevkládat napevno ceny do šablon**. Šachtový rozvaděč, armatury, filtrace, montáž a stavební práce jsou samostatné položky dle konkrétního projektu, pokud aktuální cenový list výslovně neuvádí jinak.
- **Obrazová nabídka**: schválený brandový obrázek WebP a aktuální PDF katalog z firemního Drive. Soukromé odkazy a soubory zákazníků do veřejného repozitáře neukládat.

## 1. Před výběrem adresátů
1. Přečíst stav kontaktu v obchodní tabulce a ověřit adresu organizace.
2. Prověřit Gmail `in:sent` pro adresu i doménu/organizaci, aby nevzniklo duplicitní oslovení.
3. Respektovat odhlášení, `NEOSLOVOVAT`, pozastavené kontakty, bezpečnostní blokace a zvláštní režimy komunikace k veřejným zakázkám.
4. Neexistuje-li platná adresa nebo je organizace již oslovena, nevytvářet další hromadné oslovení.

## 2. Obsah každého konceptu
- Osobní oslovení a text v jazyce příjemce (CZ/SK). Uvedené použití výrobku musí odpovídat jeho prostředí; nepředstírat existující zakázku.
- Krátké představení vhodných výrobků s orientační **cenou za ks**, variantami a upozorněním na stavební připravenost a bezpečný provoz.
- Samostatný odstavec **SMART SUPLA**: vzdálené ovládání, časové programy a volitelné senzory; cena dle aktuálního listu; šachta a montáž zvlášť.
- HTML e-mail s **ověřeně veřejně dostupným obrázkem přímo v těle**, popisem `alt` a odkazy, plus čtyři přílohy: hlavní nabídka PDF, hlavní náhled WebP, SUPLA PDF, SUPLA WebP. Pouhé `<img>` s odkazem vyžadujícím přihlášení nestačí.
- SK nabídky v EUR jen s uvedeným datem a podkladem přepočtu; výsledné ceny před závaznou nabídkou potvrdit.

## 3. Kontrola a evidence
- Před uložením ověřit jméno, organizaci, jazyk, ceny, přílohy, názvy, technické parametry a tvrzení (např. účinek chlazení).
- Gmail pouze v příslušném schváleném obchodním účtu; **standardně koncept, nikoli automaticky odeslaná zpráva**.
- Ke kontaktu v obchodní tabulce zapsat text, odkaz na draft, připojené materiály, stav `Koncept připraven – neodesláno` a případnou blokaci; stav `Osloveno` až po prokazatelném odeslání.
- Před případným odesláním znovu ověřit Gmail SENT a existenci blokací. Potvrzení odeslání zapisovat s konkrétním ID zprávy.

## 4. GitHub a web
- Úpravy repozitáře připravovat jen v samostatné větvi z aktuálního `main`, přes PR a preview/CI; **žádné přímé zápisy do main**.
- Marketingový workflow nesmí zapisovat kontakty, soukromé PDF ani interní kalkulace do veřejného zdrojového kódu.
- Pro webové ceny a komponenty je třeba odstranit nekonzistentní pevné částky po ověření nejnovějšího zdroje; automatická změna ceny bez přepočtu a kontroly není povolena.
- Kód `base44/shared/suplaOfferLayout.ts` k datu kontroly obsahoval pevné hodnoty SUPLA a šachty, které se liší od aktuálního obchodního listu. Jde o **otevřený bod k reconciliaci**, nikoli schválenou změnu produktového kódu.

## 5. Schválení
- Před hromadným odesláním kontrolovat stav odhlášení a duplicity; k odeslání je potřebné samostatné oprávněné zadání.
- Odesílání a publikaci nikdy nespouštět jen proto, že je koncept uložen.
