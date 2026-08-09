# MLZIDLA — Aplikace pro města, obce a veřejné parky

Tento repozitář obsahuje zdrojové soubory aplikace, kterou můžete spouštět a upravovat lokálně a následně publikovat přes platformu Base44.

Jakékoli změny odeslané do repozitáře se promítnou do Base44 Builderu a mohou být publikovány přes dashboard.

## Požadavky

1. Naklonujte repozitář pomocí Git URL projektu.
2. Otevřete terminál a přejděte do kořenového adresáře projektu.
3. Instalujte závislosti:

```bash
npm install
```

4. (Volitelné) Nainstalujte Base44 CLI, pokud budete používat lokální backend nebo dashboard:

```bash
npm install -g base44@latest
```

Více informací najdete v dokumentaci Base44: https://docs.base44.com/developers/references/cli/get-started/overview

## Spuštění lokálně (celé prostředí)

Pro spuštění lokálního vývojového prostředí (backend i frontend) z kořenového adresáře projektu spusťte:

```bash
base44 dev
```

Příkaz `base44 dev` spustí lokální backend Base44 a — pokud je projekt nakonfigurovaný — rovněž spustí frontendový vývojový server. V konzoli se zobrazí lokální URL pro frontend i backend.

Poznámka: pokud chcete, aby `base44 dev` automaticky spouštěl frontend, přidejte do konfiguračního souboru `base44/config.jsonc` položku `site.serveCommand` (např. `"npm run dev"`).

## Pouze frontend (bez lokálního backendu)

Pokud chcete vyvíjet pouze frontend vůči již nasazenému backendu, spusťte:

```bash
npm run dev
```

Otevřete URL, kterou Vite vypíše v konzoli (obvykle http://localhost:5173).

## Připojení na nasazený backend

Pro směrování lokálního frontendového serveru na nasazený Base44 backend vytvořte v kořeni projektu soubor `.env.local` s následujícím obsahem (bez uvozovek):

```
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-app.base44.app
```

- `VITE_BASE44_APP_ID` identifikuje vaši Base44 aplikaci.
- `VITE_BASE44_APP_BASE_URL` říká Vite pluginu kam posílat volání na `/api` během vývoje.

Důležité: nikdy necommitujte skutečná tajemství nebo citlivé údaje do repozitáře. Místo toho přidejte soubor `.env.local` do `.gitignore` a do repozitáře uložte pouze `env.local.example` s ukázkovými hodnotami.

## Nasazení a vlastní doména

Po dokončení změn pusťte build a publikujte aplikaci přes Base44 dashboard:

```bash
base44 dashboard open
```

V dashboardu můžete provést publikaci, zobrazit záznamy z buildu a přidat vlastní doménu (např. `mlzidla.cz`). Base44 poskytne instrukce k nastavení DNS a vystavení SSL certifikátu.

Doporučení pro produkci
- Pro nejlepší výkon a soukromí self‑hostujte webfonty (WOFF2) a použijte preload pro kritické zdroje.
- Omezte počet načítaných vah písma (např. 400, 600, 700) a používejte `font-display: swap`.

## Úprava typografie

V tomto repozitáři je doporučená základní typografická konfigurace (CSS custom properties, měřítko nadpisů, řádkování). Pro rychlé nasazení:

- Importujte CSS soubor s typografií do vstupního modulu aplikace (`src/main.js`, `src/main.ts`) nebo napojte link do `index.html`:

```js
import './styles/typography.css';
```

Nebo v HTML:

```html
<link rel="stylesheet" href="/src/styles/typography.css">
```

Pokud chcete profesionální typografické řešení (self‑hosted písma, ladění měřítka a kerningu, tiskové styly), připravím kompletní balík změn v samostatné větvi včetně náhledů a instrukcí pro nasazení.

## Podpora a dokumentace

- Base44 integrace: https://docs.base44.com/Integrations/Using-GitHub
- Base44 CLI reference: https://docs.base44.com/developers/references/cli/commands/introduction
- Podpora: https://app.base44.com/support

---

Pokud chcete, aby změny převedl do nové větve a vytvořil PR (včetně profesionálních úprav typografie a konfigurace nasazení na `mlzidla.cz`), dejte mi vědět — připravím kompletní commit a PR s náhledy.