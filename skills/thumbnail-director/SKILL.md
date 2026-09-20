---
name: thumbnail-director
description: Navrhovat, generovat, kontrolovat a ukládat profesionální miniatury a náhledové kreativy pro YouTube, Shorts, Reels, Instagram, web a reklamy MLŽIDLA.cz. Použít při požadavcích na thumbnail, miniaturu, cover, titulní obrázek, náhled videa, A/B varianty, zvýšení čitelnosti nebo CTR a při práci v Base44 Marketing Hubu.
---

# Thumbnail Director

Vytvářet náhledy, které rychle sdělí hodnotu, vzbudí konkrétní otázku nebo emoci a přitom zachovají pravdivý vzhled produktu.

## Povinný postup

1. Načíst zadání, název videa nebo příspěvku, cílové publikum, kanál a dostupné zdrojové fotografie.
2. Při zobrazení produktu načíst záznam Product a použít jeho ověřenou hlavní fotografii, hero_product_image_url nebo galerii jako referenci.
3. Pojmenovat jediný hlavní slib obsahu, otázku diváka a emoci, kterou má náhled vyvolat.
4. Vytvořit tři skutečně odlišné koncepty. Měnit psychologický mechanismus, nikoli jen barvu nebo několik slov.
5. Pro každý koncept uvést text o nula až čtyřech slovech, kompozici, dominantní objekt, barevný kontrast, vztah k titulku a obrazový prompt.
6. Vygenerovat čistou obrazovou vrstvu bez textu a bez falešného loga. Text a logo skládat až v editovatelné vrstvě Marketing Hubu, Canvy nebo Adobe Express.
7. Provést 50% test: zakrýt dolní polovinu. Horní polovina musí stále nést hlavní objekt, téma nebo hook.
8. Provést test malého náhledu přibližně 168 × 94 px. Text, výraz a dominantní objekt musí být srozumitelné bez přibližování.
9. Vyhodnotit scorecard a uvést konkrétní slabiny. Koncept pod 75/100 neoznačovat jako doporučený.
10. Uložit výsledek pouze jako koncept se stavem draft nebo review. Nikdy automaticky nepublikovat.

## Kreativní pravidla

- Upřednostnit jeden dominantní objekt, jeden vizuální příběh a jedno sdělení.
- Odstraňovat dekorace, které nepodporují otázku, emoci nebo identifikaci produktu.
- Nevkládat do obrazu dlouhý text. Preferovat nula až čtyři slova.
- Neopakovat v miniatuře doslova celý název videa. Titulek a miniatura se musí doplňovat.
- Používat kontrast velikosti, světla, teploty barev nebo výrazu, ne samoúčelné efekty.
- Nepoužívat clickbait, který obsah videa nesplní.
- Zachovat dostatečný kontrast textu a počítat s mobilním i televizním zobrazením.
- Připravit varianty A, B a C s odlišnou hypotézou, aby mělo A/B testování smysl.

## Ochrana produktové věrnosti

- Neměnit proporce, geometrii, počet ani polohu ramen, trubek, trysek, patku, ukotvení nebo materiál produktu.
- Nevymýšlet nové konstrukční prvky ani neexistující varianty.
- Používat nerez AISI 316L pouze tehdy, když to potvrzuje produktový záznam nebo schválená pravidla.
- Zobrazovat jemnou průsvitnou mlhu přibližně 50–100 μm jen tam, kde dává technický a scénický smysl.
- U vizualizace prostředí zachovat reálný kontakt se zemí, měřítko a bezpečný prostor kolem produktu.
- Pokud reference nestačí, vytvořit pouze koncept prostředí a výslovně označit produktovou vrstvu k ověření.

Před prací s konkrétním produktem přečíst references/brand-and-product-guardrails.md.
Před exportem nebo hodnocením přečíst references/channel-specs-and-scorecard.md.

## Směrování nástrojů a API

- Base44 InvokeLLM: strukturované koncepty, hooky, otázky, kompozice a scorecard.
- Base44 GenerateImage: čistá obrazová vrstva bez textu.
- Product, Realizace a MediaFile: zdroj pravdy pro vzhled produktu a autentické reference.
- Google Drive: archivace schválených i pracovních obrazových souborů do projektu MLŽIDLA.
- Canva: editovatelná typografie, logo, layout a týmové šablony, pokud je konektor dostupný.
- Adobe Express nebo Firefly: odstranění pozadí, generativní rozšíření, přesný ořez a finální kompozice, pokud je konektor dostupný.
- Magnific: zvětšení a jemné zpřesnění pouze po kontrole, že se nezměnila geometrie výrobku.
- OpenArt: alternativní obrazový směr; nepoužívat jako zdroj technické pravdy.
- Instagram, YouTube nebo reklamní kanál: předat až po výslovném schválení uživatelem.

Nepoužívat všechny poskytovatele slepě. Zvolit nejkratší řetězec, který zachová kvalitu a produktovou věrnost. Pokud externí služba není připojená, nabídnout připravený handoff a pokračovat přes Base44 Native.

## Povinný výstup konceptu

Pro každou variantu vrátit:

- název varianty a použitý psychologický mechanismus
- otázku, kterou si má divák položit
- cílovou emoci
- text miniatury o nula až čtyřech slovech
- doporučený doprovodný titulek
- přesnou kompozici a polohu textu
- prompt pro čistou obrazovou vrstvu
- sedm dílčích skóre a celkové skóre ze 100
- rizika nebo položky k ručnímu ověření
- doporučení A, B nebo C pro první test

Vždy jasně uvést, že publikace vyžaduje lidské schválení.
