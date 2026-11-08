---
title: "Mlžidla.cz – registr Canva šablon a nastavení"
status: "proposed-mapping-awaiting-visual-confirmation"
updated: "2026-11-08"
---

# Canva šablony: konfigurace pro produkty, města a obchodní nabídky

## Dohledané existující návrhy v Canva
| Účel | Název v Canva | Canva design ID | Strany | Výchozí role |
|---|---|---|---:|---|
| Produktová cenová nabídka | MLŽIDLA.cz – originální šablona produktové nabídky | `DAHaEgSNXuU` | 5 | kandidát pro produktovou nabídku |
| Produktové listy | MLŽIDLA.cz \| MRAK 10R 1414 a 13R 2424 \| Produktové listy – VZOR 2026 | `DAHaFZRKvdU` | 4 | kandidát pro produktové listy |
| Města a obce | MLŽIDLA.cz • Města a obce – nabídka pro nové kontakty (editovatelná) | `DAHZ1nc65xo` | 1 | kandidát pro úvodní oslovení samospráv |
| Webové poptávky | MLŽIDLA \| Hlavní šablona nabídek z webu \| 2026 | `DAHaCNi4acY` | 5 | kandidát pro webové poptávky |
| Produktový list | Produktový list MLŽIDLA.cz | `DAHZ5_BxXQQ` | 1 | kandidát pro samostatný list |
| Produktový katalog | MLŽIDLA.cz \| Katalog 13 produktových listů – obrazová nabídka 2026 | `DAHaNPd1ouk` | 13 | katalog, nikoliv výchozí cenová nabídka |

**Pozor:** výběr výchozích šablon je zatím návrh podle názvů a počtu stran; před aktivací ověřit vizuální podobu, skutečný obsah, aktuálnost a případná autofill pole. Uživatel již dříve určil čtyřstránkovou šablonu **Mlžidla TP** jako standard; neměnit ji bez ověření, zda odpovídá některému z dohledaných designů.

## Konfigurace přiřazení v administraci
V **Nastavení → Canva a šablony** vytvořit registr:
- `template_key`: `product_offer`, `product_sheet`, `municipality_outreach`, `web_inquiry_offer`, `supla_sheet`, `catalog`.
- `canva_design_id`, `canva_edit_url`, `name`, `active`, `is_default`, `version`, `last_verified_at`.
- `audience`: soukromý zákazník / město a obec / škola / gastro / architekt / ZOO.
- `product_slugs`: pro které produkty/varianty je šablona použitelná.
- `required_pages`, `include_supla`, `include_smart_shaft`, `pricing_source`, `vat_mode`, `language`, `currency`.
- `image_source_policy`: pouze schválené vizualizace z produktové galerie.
- `export_formats`: PDF pro nabídku, WebP/JPG pro náhled; `drive_folder_rule`, `gmail_attachment_rule`.
- `requires_approval`, `allow_auto_send=false`, `allow_auto_publish=false`.

## Automatické přiřazení
- Poptávka konkrétního produktu → výchozí produktová nabídka + produktový list + list SUPLA.
- Město/obec, první oslovení → šablona samosprávy; po reakci a konkrétní poptávce → plná produktová nabídka.
- Poptávka z webu → webová nabídka, produktové varianty podle poptávky.
- Více produktů → katalogové listy vybraných produktů, ne celý katalog bez důvodu.
- Každá nabídka: příjemce, konkrétní výrobek, technické údaje, dvě schválené vizualizace dle dostupnosti, cena bez DPH/s DPH, SUPLA a šachtový rozvaděč, platnost, termín a kontakty.
- Zdroj cen: aktuální schválená kalkulace 2026 v Google Sheets; neodhadovat chybějící ceny.
- Vždy **kopírovat zdrojový design** a pracovat na kopii, nikdy nepřepisovat originální šablonu.
- Po kontrole a schválení uložit PDF a obrazové exporty na Mlžný disk, vytvořit koncept Gmailu, neodesílat automaticky.

## Moderní vizuální systém administrace
- Světlý, vzdušný dashboard, jemné neutrální pozadí, tmavá typografie, decentní tyrkysová/modrá odvozená od vizuální identity Mlžidla.cz.
- Přehledné karty šablon s náhledem, typem zákazníka, počtem stran, verzí, stavem, přiřazenými produkty a tlačítkem **Upravit nastavení**.
- Žádné duplicity Canva designů; centrální registr a možnost přepnout šablonu při přípravě konkrétní nabídky.
- Responsivní, přístupné, rychlé ovládání, historie změn a schvalování.

## Implementační poznámky
Nejprve ověřit Canva designy, jejich dataset/autofill možnosti a technické možnosti exportu; až poté propojit Base44 s Canva konektorem nebo schváleným Workspace workflow. Žádný návrh zde neznamená, že je propojení již aktivní.
