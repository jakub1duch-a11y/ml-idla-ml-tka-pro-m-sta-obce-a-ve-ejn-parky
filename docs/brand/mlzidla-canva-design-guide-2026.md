# MLŽIDLA.cz × Canva — grafický manuál 2026

Tento návod dokumentuje grafický systém pro produkty, nabídky, webové prvky a sociální sítě. Jde o **pracovní grafické podklady**, které podléhají schválení; nejsou publikováním ani změnou produkčního webu.

## Zdroje

- `src/index.css` — aktivní typografie, barvy a UI tokeny.
- `src/styles/brand-logo-system.css` — odkazy na originální logo a ochranná zóna.
- `src/components/brand/MlzidlaLogoSvg.jsx` — vektorová komponenta symbolu a wordmarku.
- `src/components/brand/BrandTypographyGuide.jsx` a `BrandColorPalette.jsx` — veřejný značkový manuál webu.
- `src/components/brand/BrandAdvertisingGuide.jsx` — vizuální reklamní pravidla.

## Základní styl

- Logo: skutečný symbol brány a kapky; nezkreslovat, nenahrazovat novým znakem.
- Nadpisy: Montserrat 700–900. Běžný text: Inter 400–600. Parametry: JetBrains Mono volitelně.
- Barvy: Deep Ink `#071A2F`, Ocean Blue `#0878E8`, Fresh Cyan `#00B7FF`, Mist Blue `#7DD3FC`, Ice White `#F5FAFD`.
- Logo má vlastní přesné varianty: `#07182B` a `#00C9F2`, podle originálních podkladů.

## Produktové listy

Každá produktová řada má **dva listy**.
1. Produktový list: název, popis, 4 přínosy, hlavní vizualizace, studio/detail, parametry konkrétní varianty, ceny bez DPH a vypočtená úspora.
2. Varianty a galerie: odlišné produktové záběry, rozměrové parametry a cenová tabulka variant pro 1/2/3 ks.

Ceny patří výhradně do schválených obchodních podkladů; technické varianty musí být ověřené podle platné dokumentace a kalkulace. **Neukládejte cenové a zákaznické dokumenty do veřejného repozitáře.**

## Vizuální pravdivost

Fotografie musí zobrazovat správnou produktovou řadu; neznámé varianty označte k ověření. AI vizualizace oddělujte od fotografií realizací. Rozměrová studie s člověkem není výrobní výkres. Respektujte skutečné rádiusy, profily, umístění a směr trysek.

## Kanály

- Sociální příspěvky: poměr 4:5, nadpis do 8 slov, jedno sdělení, jedno CTA.
- Stories: 9:16, bezpečné okraje, výrazné logo, krátký text.
- Web hero: desktop 16:9, mobil vlastní ořez, text čitelný na tmavém pozadí, CTA na Fresh Cyan.
- Tisk: PDF A4, kontrastní typografie, bez glow efektu loga.

## Schvalování a správa

Grafika se připravuje v oddělených editovatelných šablonách Canva. Vkládají se originální podklady a ověřené údaje. Žádná změna produkčního webu nebo větve `main` bez kontroly, Preview a souhlasu správce.

© HolmTec s.r.o. / MLŽIDLA.cz. Vizuální manuál je pracovní dokument.
