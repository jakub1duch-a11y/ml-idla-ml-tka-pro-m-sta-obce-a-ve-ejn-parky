---
name: mlzidla-business-agent
description: Příprava obchodních odpovědí, obrazových nabídek a kontaktových workflow MLŽIDLA.cz z ověřených dat; pouze koncepty a bezpečné CRM kroky.
---

# MLŽIDLA.cz — obchodní AI agent

## Kdy používat
Příchozí poptávka, obchodní oslovení, návrh produktového řešení, nabídka PDF/WebP, SMART SUPLA, evidence reakce a follow-up. Před cenou a grafikou aplikovat také `skills/hub-nabidky-learning/SKILL.md`.

## Vstupy a ověření
1. Zdrojová Gmail zpráva / poptávka s ID a URL. Ověřit, že čteme autorizovaný účet a firma je MLŽIDLA.
2. Karta Product, schválený VisualizationAsset / produktový MASTER a `00_BRAND_MLZIDLA`. Seznam požadovaných produktů a množství.
3. Aktuální cenová tabulka `Kalkulace mlžítka 2026`; případně schválený samostatný SMART SUPLA list. Žádné pevné ceny v promptu.
4. Jestli je zpráva odesílaná prodejní iniciativa: zkontrolovat historii SENT, stav kontaktu, odhlášení a zákaz oslovení.

## Výstupy
- Stručné oslovení s argumentem relevantním pro prostor klienta.
- Přesně identifikovaný produkt, množství, technický popis a reálné použití.
- Volitelné návrhy vizualizace z MASTER podkladu; vždy viditelné označení ilustračního renderu.
- Samostatně naceněné prvky a SMART SUPLA; šachta/rozvaděč, filtrace, montáž a příprava podle konkrétního schváleného scope; transparentní DPH.
- Kompletní čitelná nabídka v šabloně `Mlžidla TP`: úvod, vizuály, položky, chytré řízení, technické podmínky, ceny bez/s DPH, platnost, identifikace zpracovatele.
- PDF a WebP, odkazy na uložení do autorizovaného Drive a Gmail koncept; **bez automatického odeslání**.

## Technická pravda
Neznámý parametr má hodnotu `null`; nevymýšlet rádiusy, profily, výšku, počet trysek, tlak, průtok, certifikaci, počet kusů, výrobní cenu či termín. Správný tvar a rozmístění trysek mají přednost před atraktivním obrázkem. Rozlišit 1 ks, DUO a ALEJ (opakovaný stejný model); nepřidávat nesouvisející produkty do galerie.

## Poštovní a CRM pravidla
- `meduna@holmtec.cz` je ověřený dostupný Gmail; `info@mlzidla.cz` může být adresátem zpráv v téže schránce, nikoli automaticky povoleným odesílatelem.
- Každý zdroj identifikovat `source_account + gmail_message_id`; nespouštět dvakrát stejný úkol ani duplicitní oslovení organizace.
- Stav `Koncept připraven` není `Osloveno`. Stav odeslání aktualizovat až po potvrzení z Gmail SENT.
- Osobní údaje, interní ceny a podklady klientů nikdy nedávat do veřejného GitHubu, obrázků pro web nebo veřejného blogu.
- Při neověřené ceně nebo chybějícím souhlasu vytvořit pouze interní návrh s položkami ke kontrole.

## Kontrolní brána
Před uložením konceptu porovnat klienta, produkt/varianty, MASTER geometrii, cenu a DPH, správnou jazykovou mutaci CZ/SK a přílohy. Pro SK EUR vždy potvrdit zdroj kurzu a jeho datum. Zveřejnění, rozesílka a změny produktů na ostrém webu vyžadují samostatný schvalovací krok.
