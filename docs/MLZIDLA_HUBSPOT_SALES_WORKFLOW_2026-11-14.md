# MLŽIDLA.cz — obchodní workflow a integrace (návrh k implementaci)
Datum: 2026-11-14
Cílový HubSpot: **149778217**. Portál 149032244 není povolen pro synchronizaci MLŽIDLA.cz.

## Vlastnictví dat
- HubSpot: CRM kontakty, společnosti, obchodní případy, aktivity, stav nabídky a schůzky.
- Base44: zdroj webových poptávek, produktového katalogu, technických profilů, schvalování vizualizací a generování nabídky.
- Google tabulka `1m-NObbjCYDYG6Sg3B-2g-TcLZkkqGzejDFfCKjqQyUE`: pracovní evidence a přehled, ne autorita stavů v CRM.
- Google Drive: interní produktové soubory, schválené PDF a fotografie; u klienta veřejně sdílet jen schválené dokumenty.
- Canva: grafické šablony, vizualizace, produktové listy; finální výstupy připojit k nabídce.
- Gmail: `meduna@holmtec.cz`; ukládat koncepty, odesílat jen po schválení.
- ChatGPT/OpenAI/MCP: asistované návrhy přes autorizované integrační rozhraní, nikoliv implicitní synchronizace chatem.

## Události
1. `inquiry.created`: Base44 form => validace a deduplikace dle source_id; ověření CRM portálu a vyhledání kontaktu podle normalizovaného e-mailu.
2. `email.received`: Gmail thread => vyloučit spam, automatické systémové zprávy, soukromé a výrobní HolmTec; uložit Gmail thread id + msg id + fingerprint; klasifikovat obchodní poptávku MLŽIDLA.
3. `lead.qualified`: segment (města, školy, architekti, zahrady, hotely/gastro, ZOO/eventy, soukromý), produkt, region, stav souhlasu s marketingovým oslovením.
4. `offer.requested`: nabídku připravit jednou dle stabilního inquiry id; cenu pouze z ověřené aktuální kalkulace, přehled položek, DPH, podmínky a platnost s konkrétním datem.
5. `offer.assets.ready`: reference na MASTER produktové foto, schválenou vizualizaci, katalogový list, SUPLA volitelně, PDF; nedostupné či neschválené obrázky blokují finální nabídku.
6. `offer.reviewed`: ruční schválení textu, cen, výrobních parametrů, příloh, příjemce a odeslání.
7. `offer.sent`: po schválení Gmail/HubSpot; zapsat čas, identifikátor zprávy, verzi nabídky, kontakt, deal a změnu stavu.
8. `reply.received`: párování dle Gmail thread id nebo HubSpot record id; vytvořit úkol obchodníka, zaznamenat poslední komunikaci.
9. `meeting.requested`: návrh termínů teprve po ověření dostupnosti Google Calendar/HubSpot; potvrzenou schůzku zaznamenat k dealu.
10. `deal.won`/`deal.lost`: ruční potvrzení výsledku, uzavření otevřených úkolů, archivace poslední schválené nabídky.

## Bezpečnost a spolehlivost
- Každý zápis do HubSpotu: server-side OAuth `/integrations/v1/me`, portalId === 149778217, odmítnout nesoulad.
- Idempotency key: `source_system:source_record_id:event_type:version`; uchovat externí record ids; nejprve upsert/read-before-write, nepřepisovat cizí data.
- Neodesílat marketingové e-maily bez platného právního základu a respektování odhlášení.
- Nevyvážet interní ceny, tokeny ani soukromé údaje do veřejných asset URL nebo do URL parametrů.
- Backend logging bez obsahu osobních údajů a tajných tokenů; zálohovat chybové události do retry queue s limity.
- Nenastavovat automatické odesílání cenových nabídek bez ručního schvalovacího kroku.
- Žádné úpravy produkce bez PR, CI a schválení.

## Kontrolní checklist pro nasazení
- [ ] Ověřit OAuth Base44 HubSpot skutečně vrací 149778217.
- [ ] Připojit HubSpot konektor ChatGPT ke správnému účtu (nyní ukazuje 149032244).
- [ ] Vyzkoušet 1 testovací poptávku a 1 testovací e-mail bez produkčního odeslání.
- [ ] U všech konektorů ověřit přístup jen k firemním zdrojům.
- [ ] Otestovat idempotenci, zakázané příjemce, neschválené vizualizace a chybějící cenu.
- [ ] Ověřit, že Gmail štítky a Google Sheet neslouží jako paralelní zdroj deal states.
- [ ] Ověřit tvorbu úkolu, návazného e-mailového konceptu a schůzky.
- [ ] CI / build a preview test; schválení správce; až pak merge a nasazení.
