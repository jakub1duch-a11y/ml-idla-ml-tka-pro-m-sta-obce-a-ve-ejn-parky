# Mobilní detail produktu a řízení SUPLA — návrh 15. 11. 2026

Stav: pracovní větev, není nasazeno. Bez změn produkčních dat.

## Změny
- Popis produktu: explicitní horní a boční odsazení, řádkování nadpisu 1,12, odsazení kotev podle skutečné výšky sekční navigace a hlavičky.
- STÉBLO ALEJ: sjednocené boční okraje sekce a čitelnější řádkování nadpisu.
- SUPLA: odstraněn panel simulovaného zapnutí, sloupce i opakované štítky ilustračního stavu. Hlavními prvky jsou přístupná tlačítka Časový režim / Podmínky s měnícím se vysvětlením. Neodesílají příkazy zařízení.
- HolmTec: původní symbol i logotyp zachován z existujícího oficiálního assetu. Nový slogan OHÝBÁNÍ TRUBEK je samostatný text; nejde o novou kresbu symbolu. Nahrazen zástupný znak H na stránce O nás.
- Existující studiový obraz produktu má jemný svislý posun ±8 px při scrollu, vypnutí a reduced-motion fallback. Nejde o skutečný 3D model a nezobrazuje neznámé zadní strany produktu.

## Podklady a další vizualizace
Dodaný snímek Morseova obsahuje konkrétní klientskou lokalitu a údaj Ø2,6 m. Nepoužívat jej jako obecné pozadí všech produktů: rozměr neplatí pro celý sortiment. Pro obecný modul připravit samostatné neutrální pozadí bez těchto popisků; osadit pouze produkt se schváleným MASTER. Fotografie výroby může doplnit sekci výrobce po ověření původu; stylizované vizualizace neoznačovat za realizace. Tyto obrázky nebyly automaticky vloženy do katalogu.

## Ověření
- npm run build: PASS; 120 předgenerovaných SEO stránek, 138 URL, 17 přesměrování.
- Generování GIF/video souborů při buildu přeskočeno: ffmpeg v prostředí nedostupný.
- node --test tests/*.test.mjs: 20/20 PASS (existující obchodní a další testy; nejde o důkaz celého integračního workflow).
- ESLint dotčených JSX: PASS.
- npm run framework:check: PASS.
- git diff --check: PASS.
- Vizuální kontrola 360/390/768/1440 px: NEPROVEDENA; Chromium v prostředí končí při vytváření socketu. Před merge zkontrolovat náhled, překrytí záložek a nadpisů, dlouhé názvy, obě karty SUPLA, klávesnici a reduced motion.

## Produkce
Kontrolní GET dne 15. 11. 2026 z tohoto prostředí vrátil HTTP 500 (Database Error) pro /, /mlzitka-pro-sportoviste, /mlzitka-mestsky-mobiliar, /robots.txt, /sitemap.xml a /o-nas. Ověřit z další sítě a porovnat směrování vlastní domény s publikovanou Base44 adresou. Bez změny DNS či nasazení v tomto úkolu.
