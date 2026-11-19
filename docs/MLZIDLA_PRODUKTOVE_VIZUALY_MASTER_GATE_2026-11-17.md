# MLŽIDLA – výrobně přesné vizuály a publikace

Stav: návrh výrobního a publikačního postupu. Nepovažovat za schválení konkrétních nových produktových obrázků.

## Povinný vstup
Pro každý produkt načíst Base44 admin záznam (`slug`, `visual_master_reference_url`, `visual_master_verified`), skutečný výkres a fotografii konkrétní verze z MLŽNÉHO DISKU. Ověřit počet kontinuálních trubek, průměr, rádiusy, kotvení, počet a orientaci trysek, proporce a měřítko vůči člověku. Použít `validateProductForVisualization` ze `src/lib/driveProductMasterRegistry.js`. Chybějící MASTER = stop publikaci produktu.

## Výstupy na jeden ověřený model
1. Transparentní produktový výřez WebP/PNG: skutečná fotografie nebo geometricky přesný render bez pozadí a bez textu; zachovat originální tvar a povrch.
2. Fotografie v reálném prostředí: město, park, škola či náměstí, bez změny konstrukce; označit ilustrační vizualizaci, není-li skutečná realizace.
3. Krátká smyčka videa: statická konstrukce a pouze jemný pohyb mlhy vycházející z ověřených trysek. Respektovat reduced-motion; poster jako první načtený obraz.
4. Katalogový detail: 3–5 ověřených záběrů, technický výkres či schéma pouze z výrobních podkladů.

## Design a bezpečnost
Navy/cyan/white, originální logo MLŽIDLA/HolmTec, bez textu přímo v obrázcích. Žádné generické náhrady produktů ani nepodložené údaje. Videa komprimovat a nezhoršovat LCP. Kontrola člověkem před zveřejněním. Nezveřejnit interní ceny, výkresy s neveřejnými detaily ani pracovní návrhy.

## Implementace
Ukládat schválené soubory do produktových složek; v Base44 referencovat přesný asset konkrétního produktu. Před merge provést build, vizuální kontrolu desktop/mobil a ověřit ostrou URL. Nepoužívat přímo generovaný obrázek jako MASTER.
