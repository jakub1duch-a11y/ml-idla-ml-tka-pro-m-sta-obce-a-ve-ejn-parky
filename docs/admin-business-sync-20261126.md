# MLŽIDLA / HolmTec – obousměrná evidence, příprava R01

Rozhodnutí uživatele 26. 11. 2026: upravovat v Base44 i Google Sheets.
Existující reconcileBusinessRecords je pouze jednostranný import nových kontaktů (apply=false výchozí); neměnit jeho bezpečnostní režim.
API seznam workflows k této aplikaci vrátil prázdné pole. Nový produkční plánovač nezakládat, dokud není ověřeno, zda existuje starší scheduler a zda je připraven adapter s autorizací.

## Připraveno v této větvi
- Hlavní obchodní přehled z existujících Base44 entit a SyncRun; refresh pohledu 60 s není synchronizace do Google.
- Čistá funkce contactSyncPlan.mjs (třístranné porovnání společného snapshotu, Base44 a Sheets); testy syntetických dat.
- Povolena pouze pole name, organization, role, next_step; další pole po ověření mapování a stavových pravidel.
- Bez společného snapshotu nebo shodného stabilního ID nikdy neaplikovat plán. E-mail není trvalý identifikátor. Existující čísla BT/CN, cena, stav skutečného odeslání a objednávky vyžadují ověřené podklady.

## Další implementační brána
Ověřit skutečné hlavičky a mapování Google Sheets na firemním účtu (zejména 0_BT, KONTAKTY – VŠE, CRM – Příležitosti, CRM – Cenové nabídky).
Zavést stabilní ID a snapshot po odsouhlasení prvotních neshod, log a frontu konfliktů. Aplikace plánu musí znovu zkontrolovat obě verze, být idempotentní, omezit souběh a neměnit nedoložené stavy. První běh pouze dry-run, druhý na testovacích datech, až poté kontrolovaný produkční běh. Interval 15 min po ověření oprávnění a schválení nasazení. Žádné automatické odesílání Gmail.
