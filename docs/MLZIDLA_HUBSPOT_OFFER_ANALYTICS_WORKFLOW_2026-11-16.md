# MLŽIDLA.cz — HubSpot jako centrum nabídky, komunikace a webové analytiky

**Pracovní návrh:** 16. listopadu 2026 · čeká na revizi, CI a Preview.  
**Správný firemní HubSpot účet:** meduna@holmtec.cz · portál 149778217.  
**Deal pipeline:** 4351532258 „Mlžidla.cz – poptávky a nabídky“.

## Potvrzený stav dat

- HubSpot API v připojeném firemním portálu potvrdilo 6 fází: Nová poptávka (6441744588), Upřesnění zadání (6441744589), Příprava nabídky a příloh (6441744590), Nabídka odeslána (6441744591), Vyhráno (6441744592), Prohráno (6441744593).
- ChatGPT konektor HubSpot má v tomto portálu oprávnění číst i zapisovat kontakty, firmy a obchodní případy; **OAuth konektor Base44 je samostatný** a musí projít kontrolou `hubspotPortalHealth`. Oprávnění ChatGPT nejsou důkazem aktivního připojení Base44.
- Ve vlastních HubSpot webových statistikách je aktuálně patrná pouze vlastní stránka /404, nikoli ověřená návštěvnost mlzidla.cz. Není důkazem, že se na MLŽIDLA.cz načítá HubSpot tracking.
- V kódu webu existuje admin-side `marketingIntelligence`, `getAnalyticsData`, `getPublicAnalyticsConfig` s GA4. Bez ověření property a skutečných reportů není dovoleno tvrdit, že konverzní měření funguje.
- Stávající `syncHubspotOfferCase` je chráněný administrátorskou autentizací. Výchozí akce je **read-only preview**; zápis probíhá jen s `action=sync` a ověřenými parametry potvrzení.
- `ProjectOrder` aktuálně nemá vlastní `hubspot_deal_id`. Nesmí se domýšlet podle firmy či poslední komunikace; pro případ se používá jednoznačné `source_id`.

## Jednotná obchodní cesta

| Krok | Hlavní zdroj a způsob práce | Ověřovací podmínka |
|---|---|---|
| 1. Návštěva stránky | GA4: anonymizované/consentované návštěvy, UTM, landing page, produkt, CTA | funkční GA4 stream a souhlas s analytikou |
| 2. Odeslaná poptávka | Base44: `Poptavka` nebo `ContactInquiry`, původní `source_id`, kontakt a soubory | deduplikace, souhlas se zpracováním, validní kontaktní údaje |
| 3. Kontakt a firma | HubSpot 149778217: jedna identita podle ověřeného e-mailu / firmy; ne vytvářet duplicity | kontrola existující osoby a jednoznačného ID |
| 4. Obchodní případ | HubSpot Deal pipeline 4351532258, návaznost na zdrojovou poptávku | `syncHubspotOfferCase` preview + schválení zápisu |
| 5. Návrh výrobku | Base44 Product, MASTER fotografie přesné varianty, schválené vizualizace | nikdy nepřebírat AI deformovanou geometrii ani neověřené trysky |
| 6. Ověřená kalkulace | Aktuální Google Sheets 2026, konkrétní varianta, veřejný cenový sloupec H | chybějící cena = pouze „k nacenění“, bez odhadů |
| 7. Obrazová nabídka | Canva „Mlžidla TP“ a brand šablona, produktový list + cenový list + vizualizace | skutečný logo asset, revize každé stránky, schválený export |
| 8. Varianty ovládání | A: lokální intervalový časovač bez aplikace; B: SUPLA s mobilní aplikací | obě volitelné a vždy pouze s potvrzeným technickým vybavením |
| 9. Koncept e-mailu | Gmail meduna@holmtec.cz; PDF a odkazy do obchodního případu | koncept ≠ odesláno; zákaznické odeslání jen člověkem |
| 10. Odeslaná nabídka | HubSpot stage 6441744591 pouze po ověření skutečné zprávy SENT | kontrola odeslání v Gmailu nebo ověřené CRM timeline |
| 11. Výsledek | HubSpot Deal vyhráno / prohráno, Base44 archiv a zakázka | potvrzená objednávka, žádné domyšlené konverze |

## Co se implementuje v PR

- `base44/functions/hubspotSalesOverview/entry.ts`: nová read-only admin funkce kontroluje portál, pipeline, fáze a vrací počty a osm posledních záznamů. Žádná tvorba, změna ani smazání CRM záznamu.
- `src/components/admin/crm/HubspotSalesOverview.jsx`: čitelný přehled dealů, fáze, odkaz na správný HubSpot portál, rozlišení chyby připojení od skutečné nuly.
- `src/pages/admin/AdminAnalytics.jsx`: HubSpot CRM přehled vedle současné GA4 analytiky, bez falešného sčítání návštěv a obchodních případů. CRM zůstane viditelný i při výpadku GA4.
- `src/pages/admin/AdminOffers.jsx`: odkaz na skutečnou firemní HubSpot nástěnku.
- `base44/shared/offerInstallationControl.mjs`: jednotný bezpečný obsah pro instalaci, umístění, varianty řízení a vizualizace.
- `base44/shared/brandOfferPacket.mjs`: do Canva datového balíčku předává informaci o požadované vazbě na CRM; **netvrdí synchronizaci** a nezveřejňuje žádné interní ceny.
- `base44/shared/offerPricingLayout.ts` a `base44/shared/suplaOfferLayout.ts`: produktový cenový list s nabídkou obou variant ovládání. SUPLA cena jen z `fetchSuplaPricing` po čerstvém připojení; lokální časovač musí být samostatně oceněn.

## Umístění a snadná instalace

Doporučená formulace: „Instalaci lze zjednodušit, pokud má místo připravený přívod vody, vhodné kotvení a potřebné technické napojení. Přesný rozsah montáže stanovíme při návrhu.“

Nízkotlaká mlžítka se neumisťují přímo mezi stoly a lavičky. Vítr může mlhu nést i několik metrů. Výsledný povrch nelze zaručit suchý za každého počasí. Bez projektu nevymýšlet bezpečný odstup, průtok, technické parametry, cenu instalace ani úspory vody.

## Webová analytika — propojení bez dvojího měření

**Web/GA4** (souhrnně): návštěvnost, zdroj a médium, jednotlivé URL, produktové náhledy, interakce CTA, odeslané formuláře, případně eventy `view_item`, `select_item`, `form_start`, `generate_lead`. Identifikaci osoby nezískávat z GA4.

**Base44** (fakticky): skutečný počet záznamů poptávek, jejich typ, datum, produkt a původní `source_id`. UTM a landing-page mohou být předávány s poptávkou pouze po úpravě schématu, informování uživatele a zajištění souhlasu; nyní tato pole v `Poptavka` chybí.

**HubSpot** (obchodně): počet leadů v pipeline, přechody fáze, nabídky ke kontrole, skutečně odeslané, odpovědi, vyhrané/prohrané. Automatické porovnání se zdrojem GA4 je možné pouze po vytvoření jednoznačné vazby původní poptávka ↔ kontakt ↔ Deal a při zachování soukromí.

Pro **nativní HubSpot návštěvnost mlzidla.cz** by bylo nutné samostatně instalovat ověřený HubSpot tracking script podle pravidel cookies a souhlasu, ověřit doménu a typ licence. Nenasazovat tracker automaticky, dokud tato kontrola neproběhne.

## Před produkční aktivací

1. Ověřit Base44 connector pro HubSpot 149778217 a GA4 firemní property přes interní admin diagnostiku.
2. Otestovat nenalezený, duplicitní i existující kontakt a deal; preview nesmí měnit data.
3. Ověřit přesný tok poslední odeslané komunikace z Gmail SENT, nikdy neposouvat stage při vytvoření konceptu.
4. Ověřit cenu SUPLA a případné šachty z aktuální kalkulace, nikoli z pevné částky v PDF/Canvě.
5. Ověřit vzhled produktového listu a správný MASTER na mobilech, v A4 i v PDF a Canva pracovních kopiích.
6. Zkontrolovat CI a Preview, schválit CRM schéma a případné zápisy, teprve potom merge + produkce.

## Rozpracované / blokované

- Read-only CRM panel je připraven v pracovním kódu, neznamená to otestované serverové připojení ani hotovou synchronizaci reálných obchodních případů.
- Není implementováno automatické přenesení UTM/landing page do HubSpotu ani vlastních deal atributů.
- HubSpot portal onboarding není v připojeném účtu dokončen; podle potřeby dokončit řízeně v HubSpotu.
- Přímé změny CRM schématu a produkční web tracking je nutné nejprve přesně odsouhlasit.
