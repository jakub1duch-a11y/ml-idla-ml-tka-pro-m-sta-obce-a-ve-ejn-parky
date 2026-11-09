# MLŽIDLA.cz — bezpečné propojení obchodního workflow (návrh schválený zadáním)

**Cíl:** sjednotit poptávku → produkt/varianta → ověřené ceny a geometrie → Canva list produktu + SUPLA → PDF/WebP → produktová složka MLŽNÝ DISK → koncept Gmail → evidence CRM/ChatGPT Sites.

## Závazná pravidla

- Obchodní identita: `meduna@holmtec.cz` (Drive, Sheets, Gmail). Spojení pod jiným účtem je chyba, nikoli náhradní cesta.
- Cenový veřejný zdroj: [Kalkulace mlžítka 2026](https://docs.google.com/spreadsheets/d/1kyxH-ihr6YC5xnu8Ef5X4jbR81VVaJtDO1UVWK5d_S8/edit), list `💧 Katalog produktů 2026`, sloupec A produkt, H katalogová cena bez DPH. I–K obsahují partnerské/cenové slevy a nesmějí do veřejných dat.
- Starší tabulka `Mlžítko` není sama o sobě ekvivalentní novému ceníku 2026. Při neshodě nahrávání a odeslání blokovat, nikoli hádat.
- Vstup vizualizace musí být MASTER konkrétní varianty a lidsky ověřená geometrie, počet trysek, kotvení; nezkreslovat AI. U produktu s více variantami nestačí obecný MASTER celého produktu, každá varianta potřebuje vlastní schválení.
- Nabídka musí mít produktový list a samostatný list SUPLA, včetně případného šachtového rozvaděče a zcela transparentní ceny bez/s DPH (neodhadovat neověřenou cenu).
- Využívat existující Canva originální brand šablonu `EAHZTN-hiGc` a předložené obrazové listy; žádné duplicitní regenerování hotových listů.
- Výstupy archivovat po produktu/variantě v `01_PRODUKTOVY_KATALOG` (Drive folder `1KJqen97HpD9yAmo7yMBpaFZI8iqk0mdE`) a pro zákazníka v jeho nabídce, s odkazy v CRM.
- Gmail výhradně koncepty, žádný automatický send. Produkční merge/publikace až po preview a schválení.
- Interní náklady, marže a partnerská cena jsou pouze pro autorizované uživatele; nenačítat do veřejného katalogu.
- Integrace ChatGPT Sites není automaticky součástí Base44 OAuth; dokud neexistuje podložené API a autentizace, vykazovat ji jako externí nehotovou závislost.

## Implementační strategie

Zvolené řešení: ponechat stávající systém Base44 a zavést serverový *fail-closed* audit oprávnění pro Google Drive/Sheets/Gmail a cenový/produktový validátor. Canva a Sites napojovat až po ověření účtu a konkrétního API. Přímou publikaci ani rozesílku nezapínat.

## Aktuálně zjištěné blokace

- Google Drive v Base44 připojen jako `jakub1duch@gmail.com` (nesprávný účet).
- Google Sheets v Base44 má expirovanou autorizaci; proces opětovného připojení byl zahájen.
- Gmail v ChatGPT: `meduna@holmtec.cz`; identita Gmail konektoru uvnitř Base44 zatím neověřena.
- Canva v ChatGPT připojená, ale nalezená Canva brand šablona nemá pojmenovaná autofill pole (nelze tedy předstírat plnou automatickou editaci).
- Web Base44 používá React/Vite a stávající backendové funkce, které je nutno zachovat.