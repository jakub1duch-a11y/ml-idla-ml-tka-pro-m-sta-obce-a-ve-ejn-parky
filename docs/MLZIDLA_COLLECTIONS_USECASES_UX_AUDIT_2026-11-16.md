# MLŽIDLA.cz — UX audit kolekcí a řešení podle využití

**Datum:** 16. 11. 2026  
**Rozsah:** Veřejné landing pages pro kolekce, katalog a segmenty využití.  
**Stav:** pracovní podklad k posouzení, nepředstavuje schválenou obrazovou ani produktovou dokumentaci.  
**Autorizace:** žádné změny v produkci; práce v samostatném PR.  
**Evidence:** zjištění ze zdrojových souborů označena [KÓD], z veřejného vyhledávatelného webu [WEB]. Vizuální prohlídka všech rozlišení před nasazením chybí [QA].

## Rozdělení webu — každá stránka řeší jinou otázku

1. **Katalog** = „Jaký model a rodina existují?“ Zde je jediný plný interaktivní katalog, filtry a srovnání produktu.
2. **Kolekce podle prostoru** = „Co z nabídky dává smysl pro můj typ místa?“ Ukázka prostředí, omezení, 2–4 relevantní ověřené modely, CTA.
3. **Řešení podle využití** = „Jak vyřešit konkrétní provoz?“ Příklad z praxe, umístění, technické souvislosti, harmonogram přípravy, CTA.
4. **Zakázková výroba** = „Jak vznikne můj vlastní tvar?“ Skica → schválená geometrie a technický návrh → výroba HolmTec → hotové provedení.
5. **Detail produktu** = „Co přesně dostanu a jak se instaluje?“ Reálné parametry z dat produktu, fotografie verze, FAQ, příslušenství a poptávka. Už rozpracováno v PR #131.

Plný katalog neopakovat jako „vhodné produkty pro X“ na každé stránce: všechna katalogová mlžítka nejsou automaticky vhodná do všech prostředí. Jasně oddělit „katalog“ od „doporučených modelů pro konkrétní účel“.

## Matice úkolů po veřejných URL

| Stránka | Jedno hlavní sdělení a publikum | Jedinečná sekce | Primární médium | CTA |
|---|---|---|---|---|
| `/katalog-mlzitek` | Najít vhodný model, návštěvník již vybírá | Filtr dle skutečného metadata využití, ne slov v popisu; rodiny a varianty | Přesné produktové snímky jednotlivých verzí | Zobrazit detail / porovnat |
| `/mestske-mlzitka` | Městský prostor, který má správně fungovat a být udržovatelný; samospráva | Fotografie realizace + schéma přípravy prostoru + podklady pro projekt | Ověřené skutečné náměstí (kandidát Polná), nikoli generic mist | Poptat městský projekt |
| `/zahradni-mlzitka` | Zahradní mlžítko se navrhuje podle místa; soukromý vlastník | Kam je umístit vzhledem k větru, posezení a vodě | Ověřená fotografie BENDY / LINEA ze zahrady | Posoudit zahradu |
| `/zakazkova-mlzitka` | Vlastní tvar v mezích reálné výroby; architekt nebo objednavatel | Skica → konstrukce → nerezové ohýbání → skutečná realizace | Autentická výroba HolmTec a ověřená reference | Poptat výrobek na míru |
| `/kategorie/mesta-obce` | Konkrétní město: rozmístění, provoz a údržba | Realizace/bezpečnost/provoz + plánovací podklady, ne druhý katalog | Reálný exteriér, například Polná při správné vazbě | Vypracovat řešení pro obec |
| `/kategorie/parky-hriste` | Osvěžení parkové pěší trasy a pobytové zóny | Vztah zeleně, pohybu a bezpečné cirkulace, stín a vítr | Reálná parková instalace, fotky nesmí falšovat model | Navrhnout parkovou zónu |
| `/kategorie/koupaliste` | Osvěžení v areálu se specifickým provozem | Příprava vody, intervaly, servis, provozní kontext; netvrdit univerzální účinek | Ověřená realizace v podobném provozu, jinak foto s příznakem „ilustrační“ | Posoudit areál |
| `/kategorie/architekti` | Technické podklady a přesná geometrie pro projektanta | Download CAD/rozměry/technické varianty a reálná výroba | Kvalitní skutečný detail nerezu, technický výkres schválené verze | Vyžádat technické podklady |
| `/kategorie/komercni` | Gastro a hotely: přirozené ochlazení bez narušení provozu | Umístění mimo stoly, drift mlhy, regulace, připojení, fotopoint | Terasa s ověřeným produktem – kandidátní asset nutno zkontrolovat | Posoudit terasu |
| `/kategorie/eventy` | Dočasná instalace respektující pohyb a infrastrukturu akce | Montáž, mobilita, napájení/voda, fotopoint a provozní plán | Autentická instalace z eventu nebo řádně označená vizualizace | Poptat akci |
| `/kategorie/outdoor-zahrady` | Zahradní prostředí s konkrétním provozním scénářem | Interaktivní porovnání stálá vs. mobilní instalace | Věrohodný detail v zahradě, ne generické video | Vybrat řešení pro zahradu |
| `/kategorie/art-instalace` | Umělecká mlžná plastika podle projektu | Atelier: skica, model, výroba, realizace | Čisté fotografie nerezových tvarů a autorství HolmTec | Probrat vlastní koncept |
| `/kategorie/skoly-skolky-deti` | Umístění, provoz, hygiena a bezpečnost v instituci | Technické podmínky a označení „není herní prvek, nesplňuje ČSN EN 1176“ | Ověřená realizace s povoleným použitím fotografie | Posoudit školní dvůr |
| `/kategorie/dopravni-uzly` | Průchodnost a ochlazování v dopravním provozu | Schéma přístupu, šíření mlhy, servisní přístup | Foto vhodné skutečné reference, NE jedna parková fotka pro všechny případy | Posoudit terminál |
| `/kategorie/sportoviste` | Správa mlžení u pohybových ploch | Typické směry pohybu, umístění, regulace podle využití | Reálné sportoviště, schválený tvar | Poptat sportoviště |
| `/kategorie/hotely-resorty` | Diskrétní technické osvěžení jako součást hostinského prostoru | Navázání na architekturu, přístup k vodě/servisu, opatrné umístění kolem posezení | Hotelová skutečná realizace; ne generický park | Probrat hotelový prostor |
| `/kategorie/verejne-instituce` | Připravené řešení pro veřejnou instituci a její provoz | Údržba, přívod vody, dotčené trasy a přístupnost | Ověřená fotografie instalace u veřejné budovy | Konzultovat instituci |

### Konkrétní potvrzená zjištění [KÓD]

- `src/pages/kategorie/UseCaseCategory.jsx` vykresloval fotografický Hero následovaný druhým velkým barevným Hero, s opakováním nadpisu a popisu. V tomto PR zůstává jediný fotoblok s H1 a pod ním úsporná navigace, poptávka a obsah. Všechna čtyři prostředí zatím sdílejí ilustraci městského parku; **focení/nahrazení relevantními originálními snímky je otevřený úkol**.
- `src/pages/kategorie/Komercni.jsx` obsahoval nepodložený výrok, že hosté objednají více, a neověřené numerické sliby **+34 % tržeb, +2,4 hodiny pobytu a 4–6 týdnů sezóny**. V tomto PR byly odstraněny a nahrazeny technicky opatrným blokem umístění, větru a provozu. Také odstraněn duplicitní arbitrární seznam prvních šesti produktů.
- `src/components/kategorie/AllProductsCatalog.jsx` používá obecný seznam bez filtru skutečné vhodnosti na 11+ kategoriích, proto v tomto PR bylo opraveno zavádějící označení „Všechny produkty pro...“ na obecný katalog s upozorněním na individuální ověření vhodnosti. Cílený filtr podle ověřeného metadata je další krok.
- `src/pages/Kolekce.jsx` filtrování podle prostoru částečně odvozuje ze substringů textu produktu, které mohou vyvolat falešná doporučení. K nápravě je potřeba ověřit datový model Product a případně zavést skutečný multi-select use-case, nikoli hádat zařazení produktů.
- `src/pages/kategorie/Eventy.jsx`, `ParkyHriste.jsx`, `Koupaliste.jsx` používají generovaná videa / obrazové náhledy. Je nutné rozlišit referenční fotografii, schéma a ilustraci a prověřit vizuální identitu výrobků.
- `/ai-vizualizace` je v routeru přesměrované na `/poptavka`, zatímco některé hero CTA je prezentují jako aktivní vizualizátor. To je UX nesoulad k ověření a sjednocení.

### Další kroky [QA — neověřeno vizuálně]

- Otevřít každou URL v desktop a mobile 360 / 390 / 768 / 1280, vizuální stránku po stránce porovnat s návrhem.
- Pro linky a product cards použít skutečný Product.slug, nededuplikovat automaticky na základě jména.
- Zkontrolovat OG fotografii, canonical, H1, přístupnost a interní odkazy; zakázat claimy o výnosu bez reálné studie.
- Výběr obrázků zavést jako `product slug → MASTER image → reference real photo → optional visualization`, ne obrázek podle podobného názvu.

## Designový jazyk bez generického „AI vzhledu“

### Vzor A: **Kolekce / produkt-first**

Jeden autentický detail (vpravo/vlevo), stručný nadpis, 2–3 ověřené rodiny, a přístupné srovnání variant s konkrétním rozdílem. Bílé plochy, tenké oddělovací linky, absence dekorativních ikonických roštů. Výrobek na samostatném světelném pozadí, bez falešného měřítka.

### Vzor B: **Využití / context-first**

Velká realizace v prostoru, vysvětlení problému a místa, jednoduché schéma umístění (vítr, odpařování, trasa osob), max. tři projektová hlediska a osobní CTA. Bez více než jednoho Hero, bez celé galerie generovaných identických karet. Ke každému účelu konkrétní příběh, nepřenášet sadu univerzálních claimů.

### Vzor C: **Zakázková výroba / process-first**

Sekvence autentických fotek: výkres či výrobní skica → ohýbání trubky → detail svařování → hotový objekt → realizace; jediný vyznačený odkaz „Poptat návrh na míru“. Do vizuálů nevkládat nové vymyšlené tvary, nestavět o nich technická tvrzení bez ověření výrobou.

## Foto databáze — existující soubory, schválení dosud nepotvrzeno

| Médium | Potenciální použití | V jakém stavu |
|---|---|---|
| `/media/optimized/6a220ebf9_Reference-mstoPolna03.webp` | Reálný městský prostor / Polná | Soubor v projektu, ověřit referenční souvislost pro danou stránku |
| `/media/optimized/e7593e68f_realizace-IMG_5072.webp` | BENDY a LINEA v jedné zahradní realizaci | Povoleno ve dvou curated seznamových kontextech, nutno ověřit konkrétní záběr |
| `/media/optimized/03ba352a3_mlzitka-zahradni-hotely-restaurace.webp` | Gastro/hotel – stávající hero | Asset v projektu, **nesmí být prezentován jako ověřená reference bez kontroly** |
| `/media/products/mrak/mrak_maly_terasa.webp` | Konkrétní MRAK v terase (kandidát) | Zkontrolovat typ vizualizace, správnou variantu a MASTER |
| `/media/optimized/0f64f6136_mlzne_trysky.webp` | Detail trysek, technická karta | Ověřit zda jde o skutečnou trysku právě příslušného typu |
| `/media/optimized/94c2b5f74_instalace-mlzitka-mrak.webm` | Fotopříběh výroby / montáže | Ověřit původ a produktový kontext |
| `/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp` | Současný sdílený Hero 4 šablon | **Vyměnit za účelově odpovídající schválené obrázky**; zatím ilustrační |

Pokud MASTER chybí, nepoužívat generovanou podobu a nespouštět publikaci.

## Vzorové návrhy netechnických CTA

- Město: „Posoudit veřejné prostranství“ / „Vyžádat projektové podklady“
- Zahrada: „Najít umístění pro zahradu“
- Gastro: „Posoudit terasu podle fotografie“
- Škola: „Probrat školní dvůr“
- Event: „Poptat mobilní řešení na termín“
- Architekt: „Vyžádat rozměry a výkresy“
- Foto point: „Navrhnout vlastní fotopoint“

Jedna primární poptávka na stránku, přípustné sekundární CTA podle potřeby. Neduplikovat plný katalog vícekrát na stránce.

## Designová inspirace – ověřené současné zdroje

- **mmcité, městský mobiliář**: https://www.mmcite.com/en/catalogue — technická střídmost, typologie, samostatný katalog, podklady.
- **Vestre, JUNE bench**: https://www.vestre.com/products/series/june/june-seat — klidná typografie, galerie, materiály, přístup k modelům a dokumentaci.
- **Landscape Forms, Link Bench**: https://www.landscapeforms.com/products/link-bench — přehled projektových fotografií, varianty, CAD a planning guide.
- **Lapalma, Outdoor**: https://www.lapalma.it/en/pages/outdoor — velké fotografie reálného prostředí a návrhová zkušenost, nikoliv pouhé karty.
- **Landscape Forms, Modified products**: https://www.landscapeforms.com/modified-products — přirozená prezentace práce na míru s reálnými projekty.

Poznámka: inspirace určuje informační architekturu a fotografický přístup; cizí fotografie, značku, ikonografii ani CSS nepřebírat.

## Testovací a publikační brána

1. Jedna H1, jediné hlavní sdělení, žádný opakující se generický claim.
2. Právě jeden Hero a jedno hlavní CTA; katalog jednou.
3. Každá fotografie má produktovou identitu, popisek o povaze foto/vizualizace, ALT a odpovídající mobilní ořez.
4. Neuvádět čísla a teploty, pokud nejsou schválenými technickými údaji. Nesmáčení plochy není univerzálně zaručené.
5. Zkontrolovat 360, 390, 768 a 1280 px, klávesnici, loading, odkazy, SEO, Core Web Vitals.
6. GitHub PR → kontrola CI → Preview screenshot desktop + mobil → souhlas správce → teprve pak merge / produkce.

## Agentní workflow a dostupnost

Úkol designového agenta byl vytvořen jako `AdminTask 6afae188376c875975bd50ed`; jsou u něj i podřízené úkoly `6afae188376c875975bd50ee` až `6afae188376c875975bd50f2`. Běh Base Code coding session nelze spustit z aktuálního účtu (session launching isn't enabled). Pokus delegovat rešerši připojenému Base44 Superagentu byl zablokován měsíčním limitem zpráv. Stav je tedy: **agentní zadání evidované, agent nepotvrdil přijetí ani nedodal výsledek**. Tento MD audit je autorský podklad připravený v ChatGPT z kontroly zdrojů a veřejných webů.
