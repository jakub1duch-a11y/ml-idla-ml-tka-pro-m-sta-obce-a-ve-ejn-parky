# Google Apps Script – Base44 R01

Stav: připravený zdrojový kód, nikoli aktivní Google deployment. App ID 6a3ee88c10959cd3588c4d68.
Účet Google: meduna@holmtec.cz. Založit samostatný projekt na https://script.google.com/home/projects/create, vložit Code.gs a appsscript.json. V Project Settings → Script Properties vložit BASE44_API_TOKEN (nový osobní token s nejmenším potřebným přístupem). Token nikdy neukládat do Git, tabulky, klientského JS ani logu. Token předaný v chatu rotovat.

Spustit testBase44Connection, odsouhlasit Google external_request a ověřit HTTP 200 i JSON. Endpoint vychází z Base44 popisu App API (slug + /api/entities/CrmContact); skutečný OpenAPI dokument v MCP byl zkrácen, proto ověřit přes Dashboard → API. Test pouze čte max. jeden kontakt a neloguje údaje zákazníků.

Další krok: navázat na docs/admin-business-sync-20261126.md a existující contactSyncPlan. Ověřit hlavičky a stabilní ID, snapshot, konflikty, audit a idempotenci. Nepouštět automatický trigger ani produkční zápisy před testem a schválením. BT/CN, ceny, stav odeslání zůstávají chráněné. Gmail pouze koncepty. Nepřidávat souběžnou automatizaci bez kontroly stávající.
