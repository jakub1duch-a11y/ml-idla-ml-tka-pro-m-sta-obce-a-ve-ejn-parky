# AI workflow pro MLŽIDLA.cz a HolmTec.cz — návrh integrace (9. 11. 2026)

**Stav:** návrh architektury a bezpečných pracovních pravidel; není to zprovozněná integrace. Žádné přeposlání zákaznických dat, automatické odesílání ani publikace se tímto dokumentem nezapíná.

## Ověřené stávající systémy

- MLŽIDLA.cz: Base44/Vite/React repozitář `jakub1duch-a11y/ml-idla-ml-tka-pro-m-sta-obce-a-ve-ejn-parky`.
- Gmail a Kalendář: připojen účet `meduna@holmtec.cz`; zprávy adresované `info@mlzidla.cz` se v něm vyskytují, ale samostatné oprávnění k odesílání z této adresy není potvrzeno.
- GitHub PR #89: schválené vizualizace pro generování nabídek — otevřený draft PR.
- GitHub PR #90: marketingový agent IG/Stories/blog — otevřený draft PR; nesmí být duplicitně implementován.
- Marketing Hub a nabídky již mají základní implementaci v Base44 (viz `docs/MLZIDLA_SOCIAL_AGENT.md` a `docs/MLZIDLA_OFFER_WORKFLOW.md`).
- HolmTec.cz: web je veřejně dostupný, avšak jeho konkrétní zdrojový repozitář a právo k produkčnímu nasazení nebyly potvrzeny. Neměnit HolmTec web, dokud není ověřen jeho source-of-truth.

## Doporučený stack (externí nástroje, neinstalováno)

| Vrstva | GitHub | Role |
|---|---|---|
| Orchestrace | https://github.com/n8n-io/n8n | Spouštěče, idempotence, schvalování, audit, API propojení |
| AI a znalostní báze | https://github.com/langgenius/dify | Extrakce, copy, nabídky, dokumentové RAG |
| Produktové vizualizace | https://github.com/Comfy-Org/ComfyUI | Řízené generování a editace, MASTER referenční fotografie |
| Nabídkové PDF | https://github.com/gotenberg/gotenberg | Render HTML/Markdown do PDF; alternativa stávající Base44/Canva export |
| Obchodní průzkum | https://github.com/getmaxun/maxun | Veřejné firemní kontakty a monitorování; respektovat podmínky a soukromí |
| Browser QA | https://github.com/browser-use/browser-use | Volitelně kontrola náhledů a formulářů; ne nepřetržitý přístup do účtů |

**Licence a provoz:** n8n je fair-code; Dify používá zvláštní open-source licenci; ComfyUI GPL, Maxun AGPL. Prověřit licence, nároky na infrastrukturu, přístupová práva a zpracování osobních údajů ještě před nasazením.

## Jednotný zpracovatelský tok

1. **Příchozí e-mail** z autorizovaného Gmailu → zachovat `gmail_message_id`, `thread_id`, schránku, datum a URL zdroje. Deduplikace podle `source_account + gmail_message_id`.
2. **Klasifikátor** → `MLZIDLA_LEAD`, `HOLMTEC_RFQ`, `WEB_ISSUE`, `SUPPLIER`, `MARKETING`, `SPAM`, `NEEDS_REVIEW`. Každý případ má jednu firmu; smíšené případy se rozdělí do úkolů bez slučování zákaznických dat.
3. **Zápis CRM** jen do správné firmy a přístupově chráněného úložiště; kontakt se nerozšiřuje veřejně. Pole: `source_id`, `company`, `contact`, `subject`, `product`, `stage`, `owner`, `next_action`, `due_date|null`, `source_url`, `offer_url|null`, `last_sync_at`.
4. **Generátor nabídky MLŽIDLA** → ověřená produktová karta/varianty, aktuální tabulka `Kalkulace mlžítka 2026`, schválený Brand Kit, předloha `Mlžidla TP`, správné WebP/PDF a samostatná příloha SMART SUPLA. Neznámé technické nebo cenové hodnoty jsou `null`, nikoli odhad.
5. **Generátor nabídky HolmTec** → RFQ, výkres/STEP, materiál, rozměry, toleranční a výrobní požadavky; technický a cenový vstup musí být doložen kalkulací, nikoli vymyšlen agentem.
6. **Schválení obchodníkem** → Gmail draft + odkazy na nabídku a CRM; automatická rozesílka není výchozí režim. Záznam `Osloveno` vzniká až po prokazatelném odeslání.
7. **Práce s termíny** → datum potvrzené v e-mailu přesně do Kalendáře; není-li termín, zapisovat pracovní kontrolní datum výslovně jako interní plán, ne jako zákaznický deadline.
8. **Novinky webu** → pouze schválená produktová či referenční událost → koncept hero/blog/marketing. Generování bez publikace. Používat existující `scanMarketingNews` a PR #90, nikoli druhý duplicitní skener.
9. **Nasazení webu** → nová větev z `main`, PR, CI build + mobilní/desktop preview, kontrola správné geometrie a CTA, teprve poté schválený merge. Žádný tajný klíč ani CRM data v repozitáři.

## Pravidla pro AI fotografie

- **MASTER**: schválený pravý tvar produktu a správné varianty. AI nesmí měnit průměry trubek, ohybové rádiusy, počet trysek, kotvení nebo počet výrobků.
- Produktová vizualizace není realizace: viditelný popisek „Ilustrační vizualizace“.
- Kontrola reálné perspektivy, měřítka osob, proporcí, pozadí, pozice mlžící trysky, mlhy, ochranných zón a práv ke zdrojové fotografii.
- Pro publikované grafiky používat optimalizované formáty WebP/JPG (max. 2000 px podle kontextu webu), schválené logo a barevnost. Vždy oddělená verze pro web, PDF a Stories.
- Bez schválené referenční fotografie / modelu nevytvářet domnělou věrnou produktovou fotografii; požadovat validaci.

## Markdown obsah a editorial

MLŽIDLA: `content/blog/*.md` pro články a strukturovaná produktová data dle **skutečného** importovacího rozhraní; zachovat YAML front matter, interní odkazy, alt texty, technické reference a datum revize. Homepage Hero měnit v aktuální komponentě, ne záměnou produktu v galeriích.

HolmTec: oddělený hlas značky a webový repozitář. Témata: CNC/3D ohýbání trubek, jednoúčelové a kontrolní přípravky, vulkanizační trny a konstrukce. Žádné nepodložené kapacity, přesnosti ani termíny.

## API kontrakty a zabezpečení

- Autorizace Google OAuth s minimálním rozsahem; `info@mlzidla.cz` se nesmí považovat za odesílací alias pouze proto, že se její zprávy zobrazují v Gmailu.
- Oddělit scopes a přístupová práva Mlžidla vs. HolmTec. CRM, soubory i API chránit server-side.
- Idempotentní zápisy, logy bez osobních údajů, limit rychlosti, retry s exponential backoff a trvalá evidence chyb.
- Pozastavené kontakty, odhlášení a zákazy automatického oslovení mají prioritu před AI klasifikací.
- Sent je **výhradně volitelný kanál SMS/WhatsApp/RCS** pro kontakty s odpovídajícím souhlasem; není to e-mailová infrastruktura. Nenastavovat odeslání před dokončením účtu, Sender Profile a šablon.

## Fáze uvedení do provozu

**F0 – inventura:** ověřit vlastníka repozitáře HolmTec, odesílací oprávnění `info@mlzidla.cz`, aktuální cenové a produktové zdroje, DNS `mlzidla.cz` / `www.mlzidla.cz`.

**F1 – read-only pilot:** zpracovat nejvýše 10 přijatých obchodních e-mailů do návrhů strukturovaných úkolů; bez zápisu CRM a bez odesílání. Ověřit klasifikaci a duplicity.

**F2 – omezený zápis:** zapisovat schválené úkoly do správného CRM a relevantní úkoly do kalendáře; Gmail koncepty s přílohami a správnou cenou. Ruční kontrola všech výstupů.

**F3 – web:** integrovat s existujícími PR #89 a #90 až po jejich testech; AI generuje pouze návrhy textů a obrázků, správce schvaluje. CI/preview před produkčním merge.

**F4 – provoz:** metriky kvality (přesnost klasifikace, chybovost, duplicitní úkoly, revize nabídky, cena podle zdroje, úspěšný preview), denní audit a rollback.

## Konkrétní otevřené body

- Vercel 7. 11. 2026 upozornil na konfiguraci domén `mlzidla.cz` a `www.mlzidla.cz`. Ověřit v dashboardu a DNS; neprovádět DNS zásah bez kontroly.
- CRM ChatGPT Sites není automaticky synchronizované pouhým zapsáním těchto instrukcí. Je třeba ověřit přístup, backendový kontrakt a autentizaci.
- Cenová data SUPLA v kódu `base44/shared/suplaOfferLayout.ts` byla dříve označena za nekonzistentní; porovnat s aktuální tabulkou před cenovou automatizací.
- GitHub CI workflow `.github/workflows/validate-build.yml` a produkční workflow `deploy-base44.yml` existují; před merge zkontrolovat preview a to, jaké soubory spouštějí produkční deploy.

**Související:** `docs/MLZIDLA_OFFER_WORKFLOW.md`, `docs/MLZIDLA_SOCIAL_AGENT.md`, `docs/MARKETING_WORKFLOW_MAP.md`, `skills/hub-nabidky-learning/SKILL.md`.
