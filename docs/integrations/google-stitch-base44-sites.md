# Google Stitch → GitHub → Base44 a ChatGPT Sites: MLŽIDLA.cz

Stav: **připravený integrační návrh; není aktivní synchronizace**. Navazuje na issues [#91](../issues/91) a [#93](../issues/93). Datum: 2026-11-07.

## 1. Co je skutečně ověřeno
- Google Stitch umožňuje agentům přes MCP načítat návrhy, jejich `Design DNA` a designové parametry. Google návod: https://codelabs.developers.google.com/design-to-code-with-antigravity-stitch
- Base44 oficiálně nabízí propojení s GitHubem v režimu 2-Way Sync (Builder+). Zdroj: https://base44.com/blog/news/base44-github-integration
- U konkrétního projektu je aktivní konektor `GitHub API`, ale aktivaci **projektového GitHub 2-Way Sync** je nutné zvlášť ověřit v Base44 Builderu.
- Žádný potvrzený nativní „live“ dvousměrný sync Stitch↔Base44. Neslibovat, že editace ve Stitch automaticky přepíše stávající web.

## 2. Zamýšlená architektura (bez rizika publikace)

```text
Existující brand na mlzidla.cz / GitHub (zdroj pravdy)
                  │
                  ▼
       Stitch – návrh nových obrazovek
                  │
            MCP (API Key)
                  │
                  ▼
       Agent / importér Stitch dat
             │ verze a diff
             ▼
    GitHub feature branch (NIKDY main)
             │ build + visual QA + test
             ▼
         Pull Request / preview
             │ kontrola a schválení
             ▼
       Merge main / Base44 sync
             │ další publikace dle skutečného workflow
             ▼
                mlzidla.cz

Druhý konzument týchž tokenů: ChatGPT Sites obchodní centrum
(oddělený projekt; bez automatického přístupu, nejdříve najít jeho editor).
```

Pokud bude žádoucí pravidelná synchronizace, nejprve ověřit podporovaný MCP/API způsob čtení změn a náklady; pak možné plánované vyžádání nových exportů a automatické vytvoření **návrhového PR**, nikoli automatické nasazení.

## 3. Co převzít beze změny

- Sdílené tokeny: [design-system/mlzidla-stitch-bridge.json](../../design-system/mlzidla-stitch-bridge.json) (cesta v projektu: `design-system/mlzidla-stitch-bridge.json`).
- Barvy z existujícího `src/index.css`: `#0B2A4A` (primární), `#071A2F` (text/tmavé plochy), `#00B7FF` (akcent), `#F5FAFD` (světlé pozadí), `#FFFFFF` (karty).
- Písmo: Montserrat pro nadpisy a Inter pro text; stávající design systém má typografii, radius i stíny.
- Žádné vymyšlené logo. Používat existující `/brand/mlzidla-logo-dark-master.png` na světlem pozadí, `/brand/mlzidla-logo-horizontal-master.png` na tmavém, případně `src/components/brand/MlzidlaLogoSvg.jsx` pro React; při zobrazení v Sites vyexportovat originální asset s průhledností.
- Základní vizuální princip: skutečná nerezová mlžítka, jemná mlha, reálné použití, prostředí měst/parku, krátké texty. Geometrii a počet trysek zjišťovat z produktových dat; žádné „fantasy“ varianty.
- Pohyb: jemné přechody pro interakce, efekty mlhy jen pokud nepřekryjí výrobek, `prefers-reduced-motion` a rychlé mobilní načítání.

## 4. Úpravy webu MLŽIDLA.cz

1. Detail produktu: přesné parametry; 3 z produktových dat odvozené varianty osazení trysek; vizuální volba a předvyplněná poptávka.
2. Produktové karty: skutečná fotografie, název, vhodný prostor, CTA; bez nesprávných produktů v galerii (zejména Linea Avenue).
3. Hero, reference, galerie: video/foto z ověřených médií, vhodné komprese.
4. Mikroanimace: odhalování komponent, hover/focus a jemná mlha; neanimovat neměnnou fyzickou konstrukci.
5. Poptávka: navržený produkt a varianta se předá do formuláře, který neklade zbytečné otázky.

## 5. ChatGPT Sites: obchodní centrum

Cílová obrazovka: prémiový, ale praktický **CRM dashboard MLŽIDLA.cz**. Na horním panelu vlevo originální logo a název „Obchodní centrum“; vpravo stav synchronizace a akce `Synchronizovat`. Postranní menu: Přehled, Kontakty, Nabídky, Odpovědi, Koncepty, Mapa, Veřejné zakázky, Nastavení. Na přehledu kompaktní KPI (kontakty, oslovení, odpovědi, aktivní poptávky, obchodní příležitosti), tabulka aktuálních aktivit a mapa pouze když jsou k dispozici údaje.

- Celá aplikace má stejnou paletu a typografii jako web; světlejší základna pro husté tabulky.
- Oslovené kontakty zůstávají beige/jemně označené dle existujícího workflow, stav odpovědi má čitelný štítek a čas.
- Zachovat existující funkce a oprávnění. Nevyvozovat stav nabídky pouze z otevření emailu; párovat konkrétní vlákna Gmailu a kontaktů podle Message-ID / Thread-ID, stavu a adresy.
- Logo je k dispozici v GitHubu, ale pro jeho vložení do Sites je nutný přístup do správného projektu; nelze tvrdit, že dashboard už byl změněn.

## 6. Dva vstupní prompty pro Google Stitch

**Web produkt / Mlžidla**

> Vytvoř návrh prémiového responzivního detailu produktů pro existující značku MLŽIDLA.cz. Použij přesně přiložený původní logotyp, Montserrat a Inter a brand barvy #0B2A4A, #071A2F, #00B7FF, #F5FAFD. Zachovej skutečnou geometrii fotografovaného nerezového mlžítka a navrhni vizuální volbu tří osazení trysek M2, technické parametry, uměřenou animaci jemné mlhy a výrazné CTA Nezávazná poptávka. Nepoužívej fiktivní výrobky, tlaky, ceny ani certifikace. Připrav desktop i mobil.

**Sites obchodní centrum**

> Navrhni profesionální desktopový a mobilní CRM dashboard pro MLŽIDLA.cz a použij originální firemní logo, brand barvy #0B2A4A / #071A2F / #00B7FF / #F5FAFD, Montserrat/Inter. Moderní, vzdušný, precizní nástroj pro obchodní nabídky: KPI, kontakty, nabídky, odpovědi Gmail, koncepty, mapa ČR, veřejné zakázky a stav synchronizace. Tabulky jsou prioritou; vhodná hustota informací, silný kontrast a přístupnost, kvalitní mobilní UX. Jemné mikroanimace bez dekorativního přetížení. Zachovat existující data a funkčnost.

## 7. Checklist před přepnutím na skutečnou automatizaci

- [ ] V Google Stitch vytvořen projekt, potvrzeno vlastnictví a bezpečné připojení MCP. Klíč uložen v secrets, nikoli commit nebo zpráva.
- [ ] Identifikátor Stitch projektu uložen do bezpečné konfigurace; export prvního schváleného návrhu a design tokenů.
- [ ] Ověřeno, že konektory Base44–GitHub nejsou zaměňovány za produktový 2-Way Sync.
- [ ] Proveden pull/import do nové větve, porovnané skutečné změny designu (žádné přepsání obsahu a cen).
- [ ] V testu potvrzen fallback při výpadku Stitch MCP; neselže produkce.
- [ ] PR CI: build, kontrola vizuálu desktop/mobil, přístupnost, SEO, mediální soubory.
- [ ] Sites editor nalezen a přístupný; skutečné logo ověřeno v hlavičce i mobilu.
- [ ] Správce schválil preview a teprve potom se provádí merge; publikace zvlášť.

### Stav k uložení
Připravené zadání + manifest značky; **neexistuje dosud aktivní Google Stitch synchronizace ani upravené produkční UI**. Po obnovení Work kreditů lze pokračovat z issues #91 a #93.
