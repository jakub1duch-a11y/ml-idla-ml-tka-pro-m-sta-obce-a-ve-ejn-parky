# MLŽIDLA / HolmTec — příjem poptávek (Base44, Antigravity, Google Sheets, Gmail)

## Existující produkční systémy

- Base44 app ID: `6a3ee88c10959cd3588c4d68`; propojený GitHub: `jakub1duch-a11y/ml-idla-ml-tka-pro-m-sta-obce-a-ve-ejn-parky`.
- Hlavní evidence: [MLŽIDLA — Poptávky a klienti](https://docs.google.com/spreadsheets/d/1EvZ7JRpOHQoBZRG-ZJhC_x8fxm2_D8aj4pfZTv7iEto/edit), listy `Poptávky` a `Klienti`. **Nevytvářet další paralelní evidenci.**
- Stávající funkce `syncInquiryToSheets` zapisuje do listu `Poptávky` podle ID v 10. sloupci a aktualizuje `Klienti`.
- Přijímané Base44 entity: `Poptavka` a `ContactInquiry`. Přímo z webu používají Base44 SDK; nenahrazovat je vložením Apps Script tajného tokenu do prohlížeče.
- Dva nové definované entity-create workflow spouštějí `syncInquiryToSheets` jednou při založení záznamu. Každý další pokus stejného ID přenosu je detekován.
- Aktuální Base44 konektor `googlesheets` byl při auditu 9. 11. 2026 ve stavu `expired`. **Před aktivací workflow je nutné obnovit OAuth a ověřit přesně přístup k cílovému souboru.**

## Externí Antigravity formuláře: Google Apps Script (oddělená vstupní cesta)

Soubor `scripts/google-apps-script/Code.gs` je připravená samostatná implementace pro serverové systémy, které neumějí zapisovat do Base44. Apps Script projekt se **nedá automaticky nasadit pouhým merge GitHub PR**, je nutné provést první publikaci ve správném účtu Google.

1. V prohlížeči přihlášeném jako `meduna@holmtec.cz` otevřít https://script.google.com/home/projects/create a vložit obsah `Code.gs`.
2. **Project Settings → Script Properties** nastavit:
   - `SPREADSHEET_ID` = `1EvZ7JRpOHQoBZRG-ZJhC_x8fxm2_D8aj4pfZTv7iEto`
   - `WEBHOOK_SECRET` = kryptograficky náhodný řetězec min. 32 znaků; nikdy nevkládat do GitHubu, frontendového JS ani veřejné dokumentace.
   - `NOTIFICATION_EMAIL` = `meduna@holmtec.cz`
   - `CUSTOMER_AUTOREPLY_ENABLED` = `false` (záměrně; existuje samostatná zákaznická notifikace a pro obchodní odpovědi jen koncepty).
3. **Deploy → New deployment → Web app**: Execute as `Me` (vlastník `meduna@holmtec.cz`); Who has access `Anyone` pouze pokud externí server nemá Google přihlášení, a s povinným tajným tokenem. Udělit skriptu oprávnění do konkrétní tabulky a k posílání Gmailu/Emailu. Uložit přidělenou `/exec` URL jako serverové tajemství v Antigravity. **Nikdy ji nevolat z veřejného frontendového formuláře s tokenem v JavaScriptu.**
4. Server Antigravity volá `POST` s `Content-Type: application/json`, payload např.:
```json
{
  "token": "<SERVER_ONLY_WEBHOOK_SECRET>",
  "inquiry_id": "<STABILNI_UNIKATNI_UUID>",
  "source": "Antigravity/HolmTec",
  "name": "Testovací klient",
  "email": "test@example.com",
  "phone": "+420 777 000 000",
  "company": "Test",
  "product": "LINEA",
  "message": "Zkušební nezávazná poptávka",
  "send_customer_confirmation": false
}
```
5. Validovat odpověď `status: success` a ID; test zopakovat se **stejným** `inquiry_id` a ověřit `duplicate: true` a jen jeden řádek. Ověřit stav `SENT` interní notifikace v jedenáctém sloupci a žádný zákaznický auto-e-mail.
6. V případě `status: error`, `code: busy_retry` nebo `warnings` zaznamenat selhání a opakovat se stejným ID. Apps Script `ContentService` může vracet JSON chybu také s HTTP 200; vždy kontrolovat **JSON status**, nejen HTTP status. Ověřit reálné doručení na adresu `meduna@holmtec.cz`.
7. Pokud poptávka z externího formuláře musí být také v Base44 obchodním centru, **nezakládat další záznam naslepo**: propojit serverově přes autentizovanou Base44 entitu a přenášet stabilní ID; srovnat klíče a nezdvojovat příchozí zprávy. Apps Script do Base44 sám nezapisuje.
8. Apps Script oprávnění `Anyone` dává URL veřejnou dostupnost: bezpečnost stojí na serverovém tokenu, proto použít rotaci tajemství, minimální přístupy, log bez PII, limitaci na serveru, případně ochranu formulářů CAPTCHA/honeypot. Pro přísnější autentizaci lze nahradit Apps Script endpoint serverovou Base44 funkcí s ověřeným podpisem.

## Base44 synchronizace (bez Apps Script)

Při uložení `Poptavka` nebo `ContactInquiry`: entity-create workflow → `syncInquiryToSheets` → deduplikace podle `ID poptávky` v J → zápis a aktualizace `Klienti`. Stav konektoru `googlesheets` musí být `active` a připojený účet musí mít přístup k tabulce.

**Důležité:** Nové workflow negenerují nabídky, neodesílají zákaznické odpovědi, nespouštějí ceny a nejsou závislé na Apps Script endpointu. Zpracování obchodního oslovení a schvalování se řídí [pravidlem prvního oslovení](./OBCHODNI_PRVNI_OSLOVENI.md). Nezaměňovat příchozí poptávku s marketingovým prvním oslovením.

## Postup před produkčním merge

- Zkontrolovat GitHub CI `Validate web build` a případný Base44 preview.
- Obnovit expirovaný konektor Google Sheets v Base44 a provést test vytvoření **jednoho testovacího záznamu** z každého formuláře.
- Ověřit jediný řádek pro jednu poptávku, telefon/e-mail/produkt, stav, aktualizaci `Klienti`, interní notifikaci, chyby a dostupnost administrace.
- Nasadit externí Apps Script jako zvláštní, ručně autorizovanou službu a uložit URL i token pouze do serverových nastavení Antigravity.
- Ověřit, že žádný obchodní koncept není automaticky odeslán a že příjemce žádá informace přes správný formulář.
- **Neslučovat PR automaticky**, dokud testy a OAuth nejsou v pořádku.

### Omezení aktuální implementace
Apps Script odesílá interní notifikaci pomocí `MailApp` po prvním přijetí externího formuláře. Dodání e-mailu a změna statusu v listu nejsou atomickou transakcí: v nepravděpodobném případě pádu přesně mezi odesláním a označením `SENT` může opakování vytvořit duplicitní notifikaci. Pro garanci exactly-once doručení je nutná samostatná fronta/outbox se stavem. `WEBHOOK_SECRET` zůstává mimo GitHub a žádná nová data se nenahrávají bez nasazeného Apps Scriptu.
