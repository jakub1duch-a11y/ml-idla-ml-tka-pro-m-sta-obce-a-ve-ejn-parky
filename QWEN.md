# MLŽIDLA.cz — pokyny pro Qwen Code

Pracuješ ve zdrojovém repozitáři webu MLŽIDLA.cz (React, Vite, Base44). Odpovídej česky, stručně a technicky přesně.

## Bezpečný postup
- Nejprve prohlédni skutečnou strukturu souborů, `package.json`, pracovní větev a `git status`. Nevymýšlej API, databázi, soubory ani integrace.
- Neměň `main` přímo. Pracuj ve vlastní větvi; změny připrav do Pull Requestu.
- Bez výslovného schválení správce neprováděj merge, publikování v Base44, produkční změny, migrace dat ani odesílání zákaznických zpráv.
- Neukládej tokeny, osobní údaje, interní ceny ani klíče do GitHubu, logů nebo promptů. `.env.local` zůstává mimo Git.
- Jakýkoliv zásah do CRM, objednávek, cen, Gmailu, Google Sheets, Canvy nebo Supabase vyžaduje ověřený zdroj a povolení. MCP připojení nejsou automaticky aktivní.
- Před PR kontroluj `git diff --check`, `npm run lint`, `npm run typecheck`, `npm run build` podle dostupných závislostí. Chyby neschovávej, zaznamenej je.
- Připojení Base44 na produkční backend není automaticky bezpečné: před destruktivními akcemi ověř cílové prostředí.

## Design a produktové informace
- Zachovej identitu MLŽIDLA.cz: čistá geometrie, kvalitní fotografie, výrazná typografie, mobilní responzivita, přístupnost a výkon.
- Nezaměňuj výrobky, rozměry, materiály, počty trysek, fotografie a ceny. Technické údaje ověř ze skutečných projektových dat nebo schválených podkladů.
- Mlžítka neprezentuj jako herní prvky splňující ČSN EN 1176, pokud nemáš doloženou certifikaci.
- Pro UI preferuj existující komponenty a styly; zachovávej fungující navigaci, formuláře a integrace.
- Nové obrázky optimalizuj; nové komponenty kontroluj na desktopu i mobilu.
- V obchodních návrzích rozlišuj ověřené ceny od odhadů; komunikaci pouze navrhuj, automaticky neposílej.

## Vývojové příkazy
- `npm install` — instalace závislostí dle repozitáře (přednostně použij lockfile-kompatibilní instalaci, pokud je lockfile aktuální).
- `npm run dev` — lokální Vite frontend.
- `npm run lint` — ESLint.
- `npm run typecheck` — kontrola typů.
- `npm run build` — produkční sestavení včetně projektových postbuild skriptů.
- `base44 dev` — pouze pokud je Base44 CLI nainstalováno a prostředí správně nakonfigurováno.

## Před odevzdáním
Uveď seznam změněných souborů, výsledky skutečně spuštěných kontrol, rizika pro Base44 a odkaz na PR. Nikdy netvrď, že je změna nasazena, pokud není ověřena na mlzidla.cz.
