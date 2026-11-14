# MLŽIDLA.cz — stav integrace obchodního workflow (8. 11. 2026)

## Zdroje / vazby (ověřeno)

- Base44 app: `6a3ee88c10959cd3588c4d68` (React/Vite + Deno backend).
- GitHub: `jakub1duch-a11y/ml-idla-ml-tka-pro-m-sta-obce-a-ve-ejn-parky`; práce jen v `feature/superpowers-obchodni-workflow-preflight`.
- Správný obchodní účet: `meduna@holmtec.cz`.
- Google Drive v *ChatGPT* je připojen pod `meduna@holmtec.cz` a má dostupný `01_PRODUKTOVY_KATALOG`: `1KJqen97HpD9yAmo7yMBpaFZI8iqk0mdE`.
- Gmail v *ChatGPT* potvrzen pod `meduna@holmtec.cz`.
- Veřejný cenový zdroj: [Kalkulace mlžítka 2026](https://docs.google.com/spreadsheets/d/1kyxH-ihr6YC5xnu8Ef5X4jbR81VVaJtDO1UVWK5d_S8/edit); tab `💧 Katalog produktů 2026`, sloupec A výrobek, H veřejná cena; partnerství I–K zůstanou neveřejné.
- Canva je dostupná prostřednictvím ChatGPT účtu Meduna Radek; nalezena originální brand šablona `EAHZTN-hiGc` a návrhy produktových listů. Datová struktura autofill šablony je aktuálně prázdná: `{}`.

## Zjištěné překážky

1. **STOP — Base44 Google Drive:** autorizovaný `jakub1duch@gmail.com`. Dokud není propojení přesměrováno na `meduna@holmtec.cz`, netvořit obchodní složky ani nearchivovat zákaznické nabídky přes tento konektor.
2. **STOP — Base44 Google Sheets:** stav `expired`; zahájena reautorizace s původními scopes (Sheets + email), která vyžaduje dokončení přes OAuth uživatelem. Přihlásit se výhradně jako `meduna@holmtec.cz`.
3. **K OVĚŘENÍ — Base44 Gmail:** metadata neuvádějí `connected_account`. Před synchronizací vždy načíst skutečný účet přes Gmail API.
4. **K OVĚŘENÍ — cenový reader Base44:** `base44/shared/pricingSheet.ts` nadále čte dokument `Mlžítko` (nikoliv `Kalkulace mlžítka 2026`). Zpracování nové veřejné tabulky je v `businessWorkflowGuard.mjs` připravené, ale dosavadní quote pipeline na něj **zatím není plně převedena**.
5. **CANVA:** chybí pojmenovaná data fields pro variabilní cenu, název, specifikaci a obrazové vrstvy; automatizované plnění a export PDF potřebuje vytvoření a ověření šablony (další změnu neukládat bez náhledu a schválení).
6. **ChatGPT Sites obchodní centrum:** pro přímý programový zápis do Sites nebylo ověřeno API; neslibovat automatickou synchronizaci, dokud nebude dostupné ověřené rozhraní.
7. **SUPLA:** musí být vždy součástí cenové nabídky jako samostatný list; cenový údaj je nutno potvrdit z aktuální tabulky, ne z obrázku či staré šablony.

## Aktuálně implementované v izolované větvi

- Pure-function testy: ověření účtu `meduna@holmtec.cz`, Google OAuth identita Gmail/Drive/Sheets, stop při 401, přesné párování veřejné varianty/ceny; partner sloupce nikdy nevstupují do výsledku.
- Admin `getMarketingConnectorHealth`: namísto pouhého stavu `connected` provádí identitní preflight s chybami a blokací.
- UI `MarketingConnectorHealth`: zobrazuje konkrétní nesoulad účtu, upozornění a stav `ready_for_business_workflow`.
- Bezpečnostní stop před přenosem PDF do Drive (`saveQuoteToDriveAuto`) a před importem Gmail + Google Sheets do CRM (`syncGmailAndContacts`).
- Žádný kód na `main`, žádné automatické publikování webu a žádné automatické odeslání nabídky zákazníkovi.

## Doplněno 9. 11. 2026 — kontrola produktového podkladu Canva

- Nové serverově ověřované rozhraní `getBrandOfferPreflight`: pouze pro admina, pouze čte `Kalkulace mlžítka 2026` (A:H), ověřuje připojený Google Sheets účet a odmítá fallback na starší ceník.
- Nový panel v Marketing Hubu umožňuje vybrat produkt a přesnou variantu; zobrazuje ověřenou veřejnou cenu a blokace, otevírá původní Canva brand šablonu a katalog na Drive.
- Pole `Product.variants[].visual_master_reference_url` a `visual_master_verified` umožňují schvalovat MASTER pro jednotlivé varianty; obecná fotografie vícero variant nestačí.
- SUPLA je vždy povinný samostatný list. Cena SUPLA ani šachtového rozvaděče se bez ověřeného zdroje nevyplňuje.
- Stále se **nevytváří Canva design ani PDF automaticky**, neukládá se do Drive a neodesílá Gmail; to vyžaduje dokončení OAuth, specifické Canva datové položky a cílové API Sites.
- V Canvě je existující katalog 13 produktových listů `DAHaNPd1ouk`; některé stránky mají textové místo reálných fotografií a část cen „na dotaz“, proto jej automaticky nepublikovat ani nehromadně nepoužívat jako hotový.
- Kontroly 9. 11.: `node --test tests/*.test.mjs` **18/18 PASS**, ESLint dotčené UI **PASS**, `npm run build` **PASS** (bez ffmpeg motion kroku).

## Další milníky

1. Dokončit OAuth Google Sheets, přepojit Base44 Google Drive na obchodní účet a ověřit identitu Gmail. Pouhé připojení v ChatGPT nestačí.
2. Převést **všechny** cenové cesty Base44 na aktuální veřejnou tabulku s jednoznačnou variantou; zakázat staré fallback ceny a průsak interních sazeb.
3. Ověřit produktové MASTER reference po variantách; pak teprve plnit Canva list a list SUPLA.
4. Rozšířit guard na všechny cesty zapisující do Drive/Sheets/Gmail.
5. Po získání ověřeného Sites API umožnit synchronizaci CRM a odkazů; bez API export.
6. Před produkcí: TDD, build, vizuální preview, PR review a explicitní potvrzení merge.

**Upozornění:** Tento dokument je technický stavový protokol, nikoli potvrzení plné automatizace.
