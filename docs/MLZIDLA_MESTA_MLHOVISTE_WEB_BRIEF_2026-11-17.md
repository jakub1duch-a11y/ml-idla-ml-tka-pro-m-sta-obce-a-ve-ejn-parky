# MLŽIDLA.cz – veřejné stránky pro města, obce a mlhoviště
Datum: 2026-11-17
Stav: schválené zadání; implementace a publikace se ověřují samostatně.

## Existující trasy – nevytvářet duplicity
- /mlzitka-pro-mesta-obce → src/pages/kategorie/MestaObce.jsx
- /mlhoviste a /mlziste → src/pages/Mlhoviste.jsx
- /mestske-ochlazovani-verejneho-prostoru → existující veřejná stránka (ověřit routu a obsah)
- Vlastní návrhy mlžení: nejprve vyhledat existující stránky a jejich canonical URL.

## Obsahové pořadí pro města a obce
1. Hero přes šířku viewportu, reálná schválená fotografie či video, stručná věta o ochlazení veřejného prostoru; CTA „Navrhnout řešení“ a „Prohlédnout realizace“.
2. Ověřené reference: lokalita, konkrétní model, fotografie a případně video; bez nepodložených výsledků měření.
3. Výběr řešení: samostatné mlžítko, mlžná brána, mlžná socha, sestava a individuální návrh. Každá karta odkazuje na skutečný produkt či relevantní detail.
4. Srovnávací tabulka: řešení / vhodné umístění / způsob rozmístění / potřebné podklady pro návrh.
5. Jak spolupracujeme: konzultace → návrh a vizualizace → technické řešení → položková nabídka → výroba a instalace dle smlouvy → provozní podpora.
6. Stavební připravenost: přívod vody, kvalita vody, tlak a průtok, napájení podle varianty, kotvení, odvod vody, servisní přístup, provozní a hygienická opatření.
7. Řízení: manuální, časové, SUPLA a senzory pouze podle skutečné konfigurace; nevytvářet plošný příslib funkčnosti.
8. FAQ, technické dokumenty, kontaktní CTA a poptávkový formulář napojený na existující bezpečný workflow.

## Mlhoviště a mlžiště
Hero s reálnou pobytovou zónou; tři způsoby rozmístění (pobytová zóna, alej, volná sestava); tabulka požadavků na místo; schéma postupu realizace; reference a FAQ. Nízkotlaké a vysokotlaké varianty nerozlišovat podle domněnek: údaje musí odpovídat konkrétní konfiguraci.

## Technická tabulka (veřejná)
| Oblast | Informace pro investora |
| --- | --- |
| Přívod vody | Tlak, průtok a kvalitu ověřit na místě |
| Elektroinstalace | Požadavky podle zvoleného řízení a technologie |
| Kotvení | Typ podkladu a provedení podle technického návrhu |
| Ovládání | Časové režimy a volitelné senzory podle sestavy |
| Údržba | Kontrola filtrace, trysek, odstavení a zazimování |
| Bezpečnost | Designová mlžítka nejsou automaticky herní prvky ČSN EN 1176 |

## Obsah a důkazy
- Reálné foto/video jen z ověřené galerie, administrace nebo schváleného MLŽNÉHO DISKU.
- Pro produktový vizuál povinně MASTER dle docs/MLZIDLA_VERIFIED_PRODUCT_BRAND_WORKFLOW.md.
- Žádné neověřené parametry, ceny, garance ochlazení, certifikace ani názvy realizací.
- Veřejné ceny jen z aktuální schválené kalkulace; interní ceny a obchodní kontakty neveřejné.

## UX a měření
- Mobil: čitelné CTA, rychlý poster videa, tabulky s horizontálním posuvem a přístupnými popisky.
- Sledovat landing_view, reference_open, product_open, technical_expand, inquiry_start, inquiry_submit v existujícím GA4 měřicím systému; před úpravou ověřit skutečné názvy eventů.
- Kontrolovat přístupnost, LCP, CLS, broken links, canonical a formuláře.

## Publikační kontrola
1. Zkontrolovat existující stránky a nepřidávat duplicitní routy.
2. Upravit pouze cílené komponenty a obsah; zaznamenat diff.
3. Spustit npm run build a cílené testy.
4. Ověřit mobilní i desktopové zobrazení a formulář.
5. Zaznamenat commit/checkpoint, stav publikace a skutečné URL.
6. Nasazení označit dokončené až po ověření veřejné stránky.

## HubSpot agent – správa prezentace
Průběžně kontrolovat čtyři tematické oblasti (městská mlžítka, města a obce, mlhoviště/mlžiště, zakázkové mlžení), ověřovat podklady, hlásit chyby s URL a návrhem opravy, evidovat schválení a verze. Neposílat e-maily automaticky. HubSpot portál 149778217; zápis úkolu je blokován povinnými poli hs_task_type a hs_timestamp, nikoli dokončen.
