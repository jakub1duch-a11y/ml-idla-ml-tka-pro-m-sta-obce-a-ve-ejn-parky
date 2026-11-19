# HolmTec + MLŽIDLA.cz — Pipedrive, HubSpot, Base44 a Google Workspace

**Stav:** pracovní konfigurace k revizi, 19. 11. 2026. Žádný automatický CRM zápis, rozesílka, merge ani publikace.

## 1. Skutečně ověřené systémy

| Systém | Ověřeno | Omezení |
| --- | --- | --- |
| Pipedrive | Holmtec s.r.o.; uživatel 28317394; CZK, Europe/Prague. Sales pipeline ID 2; Production pipeline ID 3. | Dva otevřené ukázkové Deals; produktový katalog prázdný. Pipedrive konektor ChatGPT není důkazem, že je Pipedrive napojený na Base44. |
| HubSpot | Portál 149778217; účet meduna@holmtec.cz. MLŽIDLA pipeline ID 4351532258. | Zůstává autoritativní evidencí zákaznických nabídek. Nevytvářet paralelní Dealy bez deduplikace. |
| Base44 | App 6a3ee88c10959cd3588c4d68. HubSpot, Gmail, Google Sheets a Drive připojeny firemním účtem. | Base44 seznam OAuth integrací nenabízí Pipedrive. Pro reálnou synchronizaci potřebný samostatný bezpečný backend konektor. |
| Google Disk | Soubor [MLZIDLA_CRM_kalkulace_a_nabidky.xlsx](https://docs.google.com/spreadsheets/d/1QUC9eDqJJZABcpnCbEZrE3WziNspL6XF/edit), vlastník meduna@holmtec.cz. | **Office XLSX**, ne nativní Google Sheet. Jde o prázdnou pracovní evidenci s hlavičkami a pravidly; není schváleným ceníkem. Neprovádět neodsouhlasenou konverzi. |
| Google Tasks/Docs/Slides v Base44 | Konektor je aktivní. | Připojená identita: **jakub1duch@gmail.com**, nikoli meduna@holmtec.cz; do firemního CRM workflow nezařazovat, dokud není účet napraven. Google Calendar identitu nelze z konektoru ověřit. |
| Gmail | Firemní účet meduna@holmtec.cz. | Jen koncepty, nikoli odesílání. Grafická patička musí být součástí HTML těla a vizuálně ověřena. |

Zdroj pro MLŽIDLA agent v HubSpotu: dodaný soubor `MLZIDLA_AI_Obchodni_zastupce_HubSpot(2).md` (interní agent, nikoli Customer Agent; evidence, duplicity, zákaz automatického odeslání).

## 2. Pipedrive — aktuální a navržené členění

Skutečné obchodní fáze Pipedrive Sales pipeline 2:

| Stage ID | Pipedrive | Propojení do HubSpot — pouze návrh |
| --- | --- | --- |
| 6 | Deal Added | Nová poptávka |
| 7 | Contact Made | Upřesnění zadání / kontaktování |
| 8 | Intro Meeting | Upřesnění zadání |
| 9 | Discovery Meeting | Upřesnění zadání |
| 10 | Proposal Sent | „Nabídka odeslána“ **jen pokud existuje ověřený důkaz skutečného odeslání**, nikoli pouze Pipedrive stage |
| 11 | Contract Signed | Vyhráno až po ověření skutečného potvrzení/objednávky |

Production pipeline 3 (Design → Production Scheduled → In Production → Quality Check → Delivery → Follow-Up) je určena na realizaci po schválení. Nemapovat ji zpátky jako novou obchodní poptávku.

V Pipedrive je custom field **Typ obchodní zakázky**, klíč `5bebc321af5ac5b7667fd3152e1051c261f033b4`. Pole je textové; musí se kontrolovat přesná hodnota, nikoli nekontrolovaně odvozovat značku z názvu obchodu.

Interní kategorie:

- **MLŽIDLA.cz:** mlžítka, mlžné sochy a veřejné ochlazování.
- **HolmTec / Ohýbání:** trubky a tyče.
- **HolmTec / Nástroje:** trny a tvářecí nástroje.
- **HolmTec / Přípravky:** kontrolní přípravky, montážní přípravky a navazující výroba.

Dokud neexistuje schválená kategorie, unikátní ID a ověřená identita osoby/firmy, přenos do HubSpotu je zablokovaný. Není vhodné automaticky přenášet Pipedrive kontakty z Google Contacts; v prvním výběru již jsou osobní a nesouvisející položky, které je nutné oddělit od firemních.

## 3. Autorita dat, deduplikace a synchronizace

**Master záznam pro obchodní případy:** HubSpot 149778217, dvě oddělené značky a příslušné pipeline. Pipedrive nyní používáme jako **read-only zdroj pro audit / druhou pracovní agendu**, dokud se nerozhodne o jediné primární platformě a neotestují se konflikty.

Vazební klíče: `source_system`, `source_deal_id`, `hubspot_deal_id`, `brand`, `service_category`, `email_normalized`, `company_domain`, `last_verified_communication`, `offer_number`, `offer_revision`, `offer_pdf_url`, `gmail_thread_id`, `draft_url`, `approval_state`. Pokud v cílovém CRM neexistuje odpovídající vlastnost, založení vyžaduje správce; neukládat citlivé interní ceny do veřejných/popisných polí.

Pravidla: před vytvořením porovnat e-mail, doménu a firmu, source ID a historii; řešit konflikt ručně, nikdy ne „last write wins“ bez záznamu změn. Bez opt-in marketingu neprovádět segmentové rozesílky. Při vymazání či archivaci zdrojového záznamu neprovádět automatické mazání cílového.

## 4. Nabídkový proces

1. Nová poptávka z ověřeného firemního Gmailu / webu / osobního zadání.
2. Přiřadit značku, typ zakázky a existující kontakt/firmu. V HubSpotu u MLŽIDLA použít pipeline `4351532258`, vlastnost `obchodni_znacka=mlzidla`.
3. Vytvořit evidenci poptávky s číslem MLZ ID nebo HolmTec číslem, popisem, ověřenými přílohami, stavem.
4. Cenový zdroj pouze platná **Kalkulace mlžítka 2026** (pro MLŽIDLA), nikoli prázdný XLSX evidenční soubor. Před kalkulací ověřit variantu, materiál a množství. Nezveřejňovat partnerské ceny.
5. Canva: A4 nabídka podle segmentu / počtu modelů. Každý MASTER foto musí odpovídat skutečnému produktu; reálnou realizaci odlišit od vizualizace. V nabídce pro gastronomii doporučovat nízkotlaká mlžítka s odstupem od posezení, ne přímo mezi stoly. Nenabízet absolutně suchý povrch.
6. Kontrola výsledných stránek a PDF **po Autofill**. Reálný test DUO odhalil statické staré názvy a ceny, takže existence datasetu nestačí. Souvisí s GitHub draft PR #135.
7. Přidat do existujícího Deal číslo/revizi nabídky, ověřený PDF odkaz, podklady a připravený Gmail koncept s tabulkou cen a evidenčním listem.
8. Pouze člověk schvaluje konečnou nabídku a **odesílá**. Stage „Nabídka odeslána“ měnit až na základě skutečného odeslaného e-mailu.

## 5. Vizuální identita a patička

Použít dodané obrazové předlohy: firemní HolmTec logo s mottem **OHÝBACÍ CENTRUM TRUBEK A TYČÍ**, značkové logo MLŽIDLA a dvouřádkovou patičku. Patička obsahuje název, obchodní roli, firemní e-mail, telefon a oba weby. Nezaměňovat grafiku značky za nezávaznou ilustraci a nepoužít samovolně generované logo.

V Pipedrive funkce vytvoření e-mailového konceptu **nepřikládá automaticky podpis** a nepodporuje přílohy přes dostupné rozhraní. Pro plnohodnotné zákaznické nabídky proto upřednostnit Gmail koncept s ověřeným HTML podpisem a soubory PDF, dokud nebude přílohový tok do Pipedrive vyřešen.

## 6. AI Sales Assistant v Pipedrive

Oficiální Pipedrive Sales Assistant je k 19. 11. 2026 stále **beta** a podle Pipedrive vyžaduje souhlas administrátora s podmínkami AI Beta. Screenshot obchodní stránky není důkaz, že je aktivovaný v konkrétním Pipedrive účtu.

Bezpečné připravené otázky pro Pipedrive asistenta:
- „Zobraz otevřené obchody bez plánované aktivity, rozdělené podle Typ obchodní zakázky. Nic neupravuj.“
- „Ukaž otevřené obchody MLŽIDLA, které čekají na doplnění vstupů pro nabídku.“
- „Najdi obchody HolmTec – ohýbání trubek, jejichž poslední komunikace je starší než 14 dní. Neodesílej zprávy.“
- „U každého obchodu v Proposal Sent ověř, zda existuje skutečně odeslaný e-mail; jinak označ stav ke kontrole.“
- „Najdi možné duplicity kontaktů a firem podle e-mailu a domény. Nepřepisuj ani nemaž.“
- „Připrav souhrn obchodů a další konkrétní krok pro kontrolu obchodníkem; nevytvářej nové klientské záznamy.“

## 7. Technický základ a otevřené kroky

- Předložené [daniti/pipedrive-laravel](https://github.com/daniti/pipedrive-laravel) je **Laravel Marketplace boilerplate** s OAuth; není to existující implementace Pipedrive v Base44/Vite. README odkazuje na Laravel 5.7. **Nepřidávat tento PHP balíček do JS webu**.
- Pro budoucí bezpečné propojení zvažovat server-side Pipedrive API v2, OAuth/server secrets, webhooky v2, deduplikaci a auditní log. API tokeny nikdy do frontendového kódu.
- Pipedrive má dostupnou synchronizaci Google Contacts a Calendar, ale dokud nejsou potvrzené firemní identity a oddělené pracovní kalendáře/kontakty, nezapínat obousměrné synchronizace.
- Google Sheets ↔ Pipedrive se v dokumentaci řeší mimo jiné přes Zapier/Coefficient; **není potvrzený přímý sync XLSX na Drive**.
- Odstranit problém s připojením Google Tasks/Docs/Slides v Base44 k jinému účtu. Zkontrolovat, zda účty mají být pracovní, a vyměnit jen po odsouhlasení.
- Teprve po schválení sestavit testovací prostředí, ověřit 1 MLŽIDLA a 1 HolmTec obchod, kontrolu duplicity, propojení souborů a 100% nulové automatické odesílání.

## 8. Akceptační kritéria

1. Žádná ukázková ani soukromá položka z Pipedrive se nedostane do firemního HubSpotu.
2. Značka a typ zakázky se nikdy nevyvozují z textu bez ověření.
3. Stav „odesláno“ odpovídá skutečně odeslané zprávě.
4. Evidence kalkulace XLSX je odlišena od ceníku i od výrobního kusovníku.
5. Canva PDF před připojením do nabídky prošlo vizuální kontrolou všech cen a fotografií.
6. Všechny integrace používají správný firemní účet; ostatní jsou zablokované.
7. PR a workflow projdou testy, náhledovou kontrolou a schválením správce. **Žádný merge nebo produkční deploy před schválením.**
