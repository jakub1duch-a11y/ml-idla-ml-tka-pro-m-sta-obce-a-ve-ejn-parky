# MLŽIDLA.cz / HolmTec — standard publikace produktů, fotografií a článků
Verze: 2026-11-14. Platí pro veřejný web, administraci, nabídky a jejich zdrojové soubory.

## Pravidla schvalování
- Originály uchovávat beze změn. Změny provádět v samostatné větvi; build, testy, náhled, schválení, až poté publikace.
- U fotografie rozlišit **reálná realizace**, **produktové studio**, **ilustrační vizualizace**. Vizualizace nesmí být označena za realizaci.
- Nezaměňovat modely, geometrie, průměry, trysky ani varianty. Použít schválenou MASTER referenci; pokud chybí, zablokovat publikaci konkrétní fotografie a požádat o ověření.
- Ceny a technické parametry přebírat jen z aktuálně ověřeného zdroje, zaznamenat datum a odkaz; neodvozovat je z názvu souboru.

## Fotografie – příjem a export
1. Při příjmu zaznamenat: produktový slug, varianta, autor/zdroj, oprávnění k použití, typ fotografie, schválení, alt text, hlavní objekt a bezpečný bod výřezu.
2. Zkontrolovat orientaci, ostrost, expozici, duplicity, rozlišení, metadata a barevný profil; odstraňovat nepotřebné EXIF/GPS údaje.
3. Exportovat responzivní varianty 400, 800, 1200, 1600 a podle potřeby 1920 px na šířku, pouze pokud originál rozlišení dovoluje. Preferovat AVIF/WebP, JPEG jako záložní variantu; transparentní produkt může být PNG/WebP.
4. Doporučené poměry: produktová karta 4:5, galerie 4:3, hero desktop 16:9, hero mobil 4:5, detail 1:1. Neprovádět destruktivní ořez konstrukce.
5. Produktové studio zobrazovat s `object-fit: contain`; prostředí/realizace s `cover` a schváleným `object-position`. U produktových snímků ponechat celou konstrukci a kotvení v záběru.
6. Generovat skutečné soubory různých rozlišení a sestavit `srcSet` / `sizes`; samotná změna HTML atributů velký soubor nezmenší. Do manifestu uložit URL, rozměry, typ, bytes, varianty a alt text.
7. Definovat šířku/výšku nebo `aspect-ratio` proti CLS; první hero obrázek nenačítat lazy, ostatní pod přehybem lazy. Ověřit mobil, desktop, pomalé připojení a Lighthouse.

## Nový produkt
- Ověřit unikátní slug, název, kategorii, variantu, materiál, geometrii, rozměry, trysky, instalaci, příslušenství a zdroj každého parametru.
- Zkontrolovat správné zařazení v katalogu a že se nezobrazuje interní nebo archivovaný produkt.
- Přiřadit schválenou titulní fotografii a galerii, typ snímků a alt texty. Nedoplňovat fotografii jiného produktu jako náhradu.
- Doplnit přínosy pro konkrétní prostředí (město, park, škola, zahrada) bez neověřených tvrzení, související servis/úpravu vody a poptávku.
- Ověřit SEO title, description, canonical, interní odkazy, strukturovaná data jen s pravdivými údaji.

## Nová fotografie do existujícího produktu
- Ověřit slug a variantu proti MASTER referenci a povolenému seznamu fotografií.
- Přidat do galerie s pořadím, popiskem, zdrojem a příznakem realizace/vizualizace; neměnit hlavní fotografii bez schválení.
- Ověřit výřez na 360/768/1440 px, alt text, načítání, rozměry a dostupnost všech URL.

## Nový blogový článek
- Ověřit odborné tvrzení, autorství a aktuálnost; text původní, bez kopírování konkurence.
- Jeden H1, logická H2/H3, perex, datum, title, meta description, canonical a smysluplný slug.
- Vybrat skutečně relevantní schválené fotografie; vizualizace označit. Vygenerovat responzivní obrázky a alt texty.
- Přidat odkazy na související produkty, servis/podporu a případně úpravu vody. U tvrzení o bezpečnosti, výkonu a úsporách uvést ověřitelné podklady.
- Náhled na mobilu a desktopu; kontrola odkazů, rychlosti, přístupnosti a strukturovaných dat.

## Publikační kontrola
- [ ] Přesná identita produktu a ověřené parametry
- [ ] Oprávnění k fotografiím a označení vizualizací
- [ ] Originály zachovány, webové varianty skutečně vytvořeny
- [ ] Správný výřez a žádná useknutá konstrukce
- [ ] Alt, srcSet/sizes, rozměry, lazy/eager a dostupné URL
- [ ] SEO, interní odkazy, mobil a desktop
- [ ] Build, automatické testy, preview, schválení

## Automatický export tří formátů (2026-11-14)
- `node scripts/build-media-variants.mjs` zpracuje místní schválené zdroje `public/media/optimized` a `public/assets` do `public/media/variants`.
- Vytváří AVIF, WebP a JPEG (JPEG má bílé pozadí, proto průhledné produkty preferují AVIF/WebP). Varianty šířek 480 a 960 px se generují jen při dostatečném rozlišení originálu; originál zůstává zálohou.
- `src/lib/mediaVariantsManifest.json` obsahuje skutečné cesty a rozměry; `ImageOptimized.jsx` vybírá správný formát podle prohlížeče. U ostatních obrázků zůstává původní zdroj.
- Vzdálené obrázky z Base44 CMS, Drive a dynamických záznamů nelze považovat za optimalizované, dokud nebyly získány, schváleny a exportovány. Neslepovat automaticky fotografie různých produktů.
