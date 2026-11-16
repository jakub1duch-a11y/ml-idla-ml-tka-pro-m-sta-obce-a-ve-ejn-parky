# MLŽIDLA · nabídky REV3 (Canva A4 × HubSpot) – pracovní master

## Vytvořené skutečné výstupy 16. 11. 2026
- Nový **Canva editovatelný 9stránkový vzor**: design `DAHbHrijg6I`, https://www.canva.com/d/r4hRReci7q1wlnQ
- **PDF REV3** s fotorealistickou ilustrační vizualizací kotvení a přívodu vody na listu 05: https://drive.google.com/file/d/1VHKGcnPsL3jaRSzTiqatutaoiF01AW3y/view
- **Zdrojový ZIP** (HTML, samostatné fotky, CSS, preflight generátor pro 1–4 produkty, data příkladu): https://drive.google.com/file/d/1bkHcXRUtvGLKgQwGEXV-5D4J1HlgvU0w/view
- **Interní test 2 výrobků** LINEA TR 60 + 2× BENDY_60 (10 stran, obě položky s katalogovou cenou 20 940 Kč a 21 720 Kč/ks): Canva `DAHbHlyAwGI`, https://www.canva.com/d/OJ7tx2E7MGCcohv. Není zákaznická nabídka!
- **Test PDF** pro 2 modely: https://drive.google.com/file/d/1fOLMx-vfzbaXWfy8UDRR2qffGeRSxq26/view
- **Dokumentace agentovi:** https://drive.google.com/file/d/1id98M6imKiVCzWrnIuTrvkzOTY9Oap6s/view

## Řazení stran
Titulní list → shrnutí navržené sestavy → **jedna produktová stránka za každé SKU** → konkrétní prostor → instalace → varianty ovládání → katalogové/konceptové vizualizace → položková nabídka → tištěné potvrzení objednávky.
Jednoproduktový master má 9 stran. Ukázka se dvěma produktovými listy má 10 stran.

## Rozlišení skutečných produktů od generických vizualizací
- Přesná shoda `product.sku + variant`; ne shoda volným textem ani podle podobného tvaru.
- Role `studio`, `approved_master`, `geometry_checked`, `nozzle_count_checked`, `cropping_checked` musí být `true`, jinak **zablokovat finální výstup**. Pomocný preflight `base44/shared/offerVisualMasterPolicy.mjs` má unit testy.
- Produktový obrázek s `object-fit:contain`, soustředit minimálně celý tvar, nepřerušovat nohu, kotvení ani trysky. V prostředí použít výřez jen při dobře viditelném výrobku a zřejmém měřítku.
- Nikdy nezaměnit koncepční řez ve straně 05 za skutečnou výrobní dokumentaci. Neuvádět z ilustrace rozměry základu, vedení potrubí, přesnou polohu přívodu, garanci suchého povrchu ani typ ventilů.
- Ceny vždy z aktuálního spreadsheetu `Kalkulace mlžítka 2026`, list `💧 Katalog produktů 2026`, sloupec H, přesné SKU. Zde použitý příklad je ověřený k 16. 11. 2026, **nikoli trvale platný ceník**.
- Není-li vybraný model, cena, správa fotografie, DPH nebo napojení prokazatelné, označit `K nacenění` a stav `DRAFT / NEODESÍLAT`.

## Workflow HubSpot
1. Načíst konkrétní Base44 `Poptavka`/`ContactInquiry` s `source_id` a klientským zadáním.
2. Deduplikovat osoby a firmy v **HubSpot portálu 149778217**, pipeline `4351532258`.
3. Ověřit přesnou vazbu na existující Deal nebo vytvořit Deal až po oprávněném preflight a schválení.
4. Získat skutečná SKU a jejich cenu z aktuálního listu, vybrat schválené MASTER fotografie, seřadit produktové strany.
5. Generátor sestaví HTML/ZIP pro Canva import a kontrolní A4 PDF; může mít různý počet stran. Canva je určená k ruční výměně a finální úpravě vrstev; původní master zůstává nedotčen.
6. Dokončit kalkulaci včetně varianty řízení (ruční / zahradní časovač / SUPLA), dopravních a instalačních nákladů a DPH.
7. Schválené PDF uložit do soukromé složky na MLŽNÉM DISKU a připojit ke **správnému ověřenému Dealu**. V této verzi **je zápis do CRM pouze plánovaný**; nebyl proveden u žádného reálného zákazníka.
8. Připravit Gmail **koncept** pro kontrolu. Žádný autonomní send; stage `Nabídka odeslána` jen podle ověřeného `SENT`.

## Co je a není funkční
**Funkční a vyzkoušené:** HTML/PDF generátor pracovního vzoru a skutečný import do Canvy, 9stránková a 10stránková testovací nabídka; samostatně editovatelné texty a vložené obrázky. `--final` odmítne chybějící schválení fotky, ceny a HubSpot Deal.

**Vyžaduje integraci a QA:** konverze z opravdové Base44 poptávky bez ručního předávání JSON, automatické vytvoření Canva designu, finální export pomocí Canva/Acrobat API, bezpečné přiřazení k HubSpot Dealu a uložená revize v Gmail draftu. K dnešnímu ověření měl Canva design **prázdný Autofill dataset**.

**Figma:** není pro tento opakovaně editovaný A4 nabíd­kový workflow nutná. Mohla by se hodit na návrh UI editoru / interaktivní prototyp, ale nepřináší vyplňování podkladů, kalkulaci ani export PDF sama o sobě.

**Bezpečnost:** dřívější nevhodně automaticky odeslané zákaznické e-maily `MLZIDLAcz Customer Agent` se dosud neprokázaly jako vypnuté. Žádný automatický odesílací krok neaktivovat.

## Před merge/produkcí
Zkontrolovat CI, Canva vrstvy na stránkách 03/04/05/09, produktové fotografie v měřítku, přetečení textu, cenu po přidání 1/2/4 produktů, DPH, souhlasy a reálné HubSpot OAuth oprávnění. Produkční nasazení jen po QA a správcově schválení.
