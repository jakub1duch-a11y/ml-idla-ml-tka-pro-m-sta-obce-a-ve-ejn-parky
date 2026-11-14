# Qwen Code — nastavení terminálu MLŽIDLA.cz

Qwen Code je AI agent běžící v lokálním terminálu. Tento repozitář obsahuje jeho projektové instrukce v kořenovém `QWEN.md` a bezpečnou výchozí konfiguraci `.qwen/settings.json`. To samo o sobě Qwen Code na počítači **neinstaluje** ani neaktivuje externí MCP servery.

## Instalace
1. Nainstalujte Node.js 22 nebo novější a Git.
2. Nainstalujte CLI: `npm install -g @qwen-code/qwen-code@latest`.
3. Naklonujte tento konkrétní repozitář:
   `git clone https://github.com/jakub1duch-a11y/ml-idla-ml-tka-pro-m-sta-obce-a-ve-ejn-parky.git`
4. `cd ml-idla-ml-tka-pro-m-sta-obce-a-ve-ejn-parky`
5. `npm install` (případně použijte `npm ci`, pokud je k dispozici aktuální `package-lock.json`).
6. Spusťte `qwen` a dokončete přihlášení. V terminálu lze přihlášení změnit příkazem `/auth`.
7. Ověřte projektové instrukce pomocí `/memory` a dostupné MCP servery přes `/mcp`.

## Každodenní pracovní postup
```bash
git checkout main
git pull origin main
git switch -c feature/popis-zmeny
qwen
# Po provedení úprav
git diff --check
npm run lint
npm run typecheck
npm run build
git status
git diff
```
Změny commitněte a odešlete na novou větev; otevřete PR do `main`. Merge a publikaci v Base44 provádějte pouze po schválení, kontrole buildu a preview.

## MCP a přístupová práva
Projekt má ve výchozím stavu prázdný seznam povolených MCP serverů. Neznamená to, že Qwen Code je připojen ke GitHubu, Base44 nebo CRM. Každý MCP server přidávejte až po ověření oficiální adresy, oprávnění a způsobu autentizace. Pro vzdálené servery lze použít `qwen mcp add --scope project --transport http NAZEV https://overena-adresa/mcp` a pak upravit seznam povolených názvů v `.qwen/settings.json`.

Přístupové klíče uchovávejte v lokálním bezpečném úložišti/proměnných prostředí, ne v repozitáři. Připojení pro CRM a Gmail začínejte v režimu čtení, pokud to daný server umožňuje. Neukládejte soukromá data do veřejného repozitáře.

## Dokumentace
- https://github.com/QwenLM/qwen-code
- https://qwenlm.github.io/qwen-code-docs/en/users/quickstart/
- https://qwenlm.github.io/qwen-code-docs/en/users/features/mcp/
- https://qwenlm.github.io/qwen-code-docs/en/users/features/memory/
