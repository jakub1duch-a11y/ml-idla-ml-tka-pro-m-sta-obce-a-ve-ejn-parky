# MLŽIDLA.cz — Canva × HubSpot, pracovní osmistránkový nabídkový list

**Vytvořeno:** 16. 11. 2026. **Stav:** editovatelná Canva předloha; čeká na finální schválení pro klientske přílohy.  
**Canva design ID:** `DAHbHblpkWI`  
**Editace:** https://www.canva.com/d/lzPlXZ-s3O8teFh  
**Interní kontrolní PDF (MLŽNÝ DISK):** https://drive.google.com/file/d/1KUu9ymEq6Wm7ih8WTt1AGWN6BXfKGu0s/view  
**HTML/ZIP zdroj pro další import:** https://drive.google.com/file/d/1YzEuxjxW3-LOpyICDb8DzFpUaRjvZs0c/view  
**Původní brand template:** `EAHbBX1hTpE` (Canva; neměnit originál). Tato nová 8stránková kopie není nové schválené Brand Template a nemusí mít autofill dataset.

## Stránky a jejich přesné určení

| Strana | Význam | Povinné dosazení před odesláním |
|---|---|---|
| 1 Oslovení | titulní stránka a přínos produktu pro konkrétní místo | Klient, lokalita, číslo nabídky, datum, ověřená fotografie |
| 2 Produkt | vzhled a technické údaje vybrané varianty | Přesný Product/variant ID, MASTER reference, profil, rozměry, počet trysek |
| 3 Vizualizace | koncepční pohled a rozmístění | Konkrétní skutečné místo, souhlas klienta, režim foto × návrh |
| 4 Instalace | voda, kotvení, servis a podmínky | Schválený technický list, potřeba napájení, stavební připravenost; schéma NENÍ výrobní výkres |
| 5 Řízení | dvě možnosti: intervaly bez aplikace / SUPLA s aplikací | Kompatibilní ventil, modul/časovač, aktuálně ověřené ceny a rozsah |
| 6 Obrazové podklady | MASTER produktu × koncepční prostředí | Vyměnit ilustrace za ověřená média správné varianty, bez deformace geometrie |
| 7 Položková cena | produkt, filtrace, řídicí sestava, montáž, doprava | Čerstvá kalkulace, správný režim DPH, jednotkové ceny, součty, platnost |
| 8 Další krok | obchodní podpis, dodavatel, kontakt a schválení | Ověřený zpracovatel, telefon/e-mail, datum, platnost, poznámka k objednávce |

## Designová a technická pravidla

- Značka MLŽIDLA.cz, výrobce HolmTec s.r.o. Oficiální webový master oblouk + kapka: `src/components/brand/MlzidlaLogoSvg.jsx`; žádné převzaté alternativní logotypy z AI ilustrací.
- Barevnost tmavě modrá, tlumený cyan, bílá, střídmý kontrast. Typograficky hierarchie bez generických průhledných dlaždic a bez nadměrného marketingu.
- Zobrazené obrazové podklady `LINEA-produkt-mlzitko.jpg`, `Bendy Back-to-Back 0001.png` a výřez z ilustračního souboru `Urban_Mist_Architecture_-_Slide_10(2).png` jsou vstupní předlohy od uživatele. Zůstávají označeny **ilustrační vizualizace**. Nejsou automaticky fotografiemi certifikovaného produktu či skutečné reference.
- Nepřebírat z inspirací neověřené údaje typu **90 % úspora, 23 °C meteo práh, 3 mm nad dlažbou, garance suché země, 5–10 °C pokles teploty**. Pokud není měření doloženo, vynechat.
- U nízkotlakých mlžítek nedoporučovat umístění bezprostředně mezi stoly a lavičky. Vítr může unášet mlhu i několik metrů. Není stanovena universální bezpečná vzdálenost.
- Dvě varianty řízení nejsou automaticky zahrnuty do ceny produktu. SUPLA a časovač oceňovat z aktuální kalkulace a schválené sestavy.
- Podoba šablony je mimo schválenou zákaznickou nabídku. Ceny mají placeholdery `[Kč]`; nikdy neměnit na čísla bez ověřené kalkulace.

## Tok z poptávky do HubSpotu

1. Base44 `Poptavka`/`ContactInquiry`: načíst **původní `source_id`**, zákaznický kontakt, poptávaný produkt a případové fotografie.
2. HubSpot **portál 149778217**, pipeline **4351532258**: ověřit existující kontakt/firmu a odpovídající Deal, nevytvořit duplicitu. Před zápisem volat autorizovaný preflight gateway. **Samotné Canva ID není HubSpot Deal ID.**
3. V Canvě vytvořit samostatnou **kopii** pracovního designu `DAHbHblpkWI` pro konkrétní nabídku. Původní pracovní vzor se nemění.
4. Načíst schválenou MASTER variantu a její skutečné parametry; vzhled fotografií koncepčních vizualizací přezkoumat. Ceny jen ze živé Kalkulace mlžítka 2026 (veřejný cenový sloupec H pro správnou variantu).
5. Doplnit přílohy, zrevidovat každou stranu, ověřit položkový součet, DPH, podpis, platnost, logo, souhlas se zákaznickou fotografií. Vygenerovat PDF z klientské kopie; kontrolní vzor bez cen **nesmí** být klientovi odeslán jako nabídka.
6. Uložit PDF do privátní zákaznické složky na MLŽNÉM DISKU a uložit do stejného **ověřeného HubSpot Dealu** jako soubor/přílohu a odkaz na skutečnou kopii Canva. Přiřazení musí mít důkaz `hubspot_deal_id`, `drive_file_id`, `pdf_revision` a stav úspěchu. Tento krok v aktuálním stavu **není zprovozněná automatická integrace**.
7. V Gmailu `meduna@holmtec.cz` vytvořit **pouze KONCEPT** se skutečným PDF, grafikou, odkazem na reálný Deal. NIKDY neposílat automaticky. Do fáze „Nabídka odeslána“ přepnout až po ověření odeslání v Gmail SENT.
8. V HubSpotu zobrazit dostupné obchodní stavy a následný úkol; komunikace a návštěvnost webu musí být rozlišeny od GA4 agregátů.

## Blokace před produkčním používáním

- Chybějí potvrzené ceny základních výrobků/řízení/montáže pro konkrétní poptávku.
- Neexistuje vybraný zákazník ani ověřené CRM Deal ID pro připojení konkrétní přílohy.
- Přístup k firemnímu HubSpotu přes konektor ChatGPT byl ověřen, ale automatická Base44 OAuth ↔ HubSpot spolupráce vyžaduje vlastní živý test.
- Nevyžádané odchozí e-maily s podpisem „MLZIDLAcz Customer Agent“ jsou v Gmail SENT; **odstranění zdroje automatického odesílání není potvrzeno**. Dokud audit neskončí, neaktivovat žádné odesílací akce.
- Aktuální PDF z Drive je **pracovní ukázka**, nikoli finální cenová nabídka. Před odesláním je vyžadováno schválení.

## Evidence

- Canva design: `DAHbHblpkWI` — potvrzených 8 stránek A4 (794 × 1123 px) s načitatelnými textovými bloky.
- Drive: dva soubory vytvořené v `Mlžný disk/workflow/`, kontrolní PDF a HTML/ZIP.
- Base44 `AgentSkill`: `canva_offer_template_governance_2026`, `cl1_product_sheet_for_gmail_drafts_2026`.
- Base44 `AdminTask`: schválení vzoru, ceny, HubSpot přiřazení a bezpečnostní incident.
