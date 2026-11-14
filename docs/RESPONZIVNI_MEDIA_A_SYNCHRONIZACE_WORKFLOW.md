# MLŽIDLA.cz — pravidla responzivních médií a synchronizace workflow

Platí pro web, produktové listy, obchodní nabídky, e-mailové koncepty a navazující aplikace.

## Obrázky a mobilní zobrazení
- Obrázky v HTML používat s `max-width:100%;height:auto`; v e-mailu preferovat kontejner do 600 px a inline styly kompatibilní s Gmail.
- Na mobilu řadit obrázky pod sebe; bez horizontálního posouvání, deformací a nechtěného ořezu produktu.
- Zachovat čitelnost produktu a popisků; testovat mobilní šířky 320, 375 a 430 px i desktop.
- U fotografií výrobků zachovat skutečnou geometrii; informativní alternativní texty a optimalizované JPG/PNG/WebP dle cílového kanálu.
- Při editaci existujících Gmail konceptů nepřepisovat vložené obrázky způsobem, který odstraní inline přílohy. Před uložením ověřit zachování obrázků.

## Synchronizace obchodního workflow
- Každá potvrzená změna poptávky, kontaktu, produktu, ceny, nabídky či komunikace spouští aktualizaci **relevantních** propojených systémů: Base44, Obchodní centrum, Google Sheets/Drive, Gmail koncepty, HubSpot a Canva.
- Definovat autoritativní zdroj pro každé pole, identifikátory záznamů, mapování, čas poslední synchronizace, auditní log a idempotentní opakování.
- Nepřepisovat novější údaje staršími; při konfliktu označit záznam ke kontrole. Nevytvářet duplicitní kontakty ani koncepty.
- Cenové údaje ověřovat z platného ceníku/kalkulace; rozlišovat schválené údaje a návrhy.
- Změny v dokumentaci nejsou samy o sobě funkční integrací. Každý konektor vyžaduje implementaci, oprávnění a test.
- Neodesílat e-maily, neměnit produkční data ani nenasazovat na main bez kontroly a schválení správcem.

## Kontrola před schválením
1. Mobilní a desktopové náhledy, obrázky a odkazy.
2. Konzistence dat napříč systémy, ochrana proti duplicitám, historie změn.
3. Build, testy a preview; teprve potom schválení merge a nasazení.
