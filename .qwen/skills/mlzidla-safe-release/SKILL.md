---
name: mlzidla-safe-release
description: Příprava bezpečných změn webu MLŽIDLA.cz pro GitHub Pull Request a Base44 preview; kontrola git diff, buildu, bezpečnosti a schvalování před nasazením.
---

# MLŽIDLA.cz — bezpečná publikace

1. Ověř správný repozitář, větev a `git status`. Vycházej z aktuálního `main` pouze pokud je čistý pracovní strom.
2. Vytvoř pracovní větev; neupravuj přímo `main`. Do commitu zahrň jen související soubory.
3. Zkontroluj, že nejsou v diffu tokeny, interní ceníky, zákaznické kontakty ani environmentální tajemství.
4. Spusť `git diff --check`, `npm run lint`, `npm run typecheck`, `npm run build`; chyby výslovně zaznamenej, nezamlčuj.
5. Vytvoř PR s přehledem změn, rizik a výsledků kontrol. Preview Deployment ověř v Base44 před požadavkem na merge.
6. Merge, publikace, produkční migrace či změny DNS prováděj pouze po výslovném schválení správce.
7. Po nasazení ověř živý web, navigaci, CTA, mobil, fotografie a formuláře. Pokud to není ověřené, neuveď „nasazeno“.
