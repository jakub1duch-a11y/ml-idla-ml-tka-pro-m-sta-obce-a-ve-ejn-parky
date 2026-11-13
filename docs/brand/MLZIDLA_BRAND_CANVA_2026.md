# MLŽIDLA.cz — Brand Master 2026 (Canva, web a dokumenty)

**Stav:** pracovní grafický systém k vizuální a technické kontrole, 13. listopadu 2026. **Bez automatického nasazení.**

## Zdroj a hierarchie informací
1. Vizuální tokeny aktuálního webu: `src/index.css`, `src/styles/brand-components.css`, `src/styles/brand-logo-system.css`, `tailwind.config.js`.
2. Originální logo: [LOGO_A_BRAND na Mlžném disku](https://drive.google.com/drive/folders/18CAZUan-wq6gvoN4iiQ9gONDtekM_UKX), soubory `MLZIDLA_logo_transparent.png` a `MLZIDLA_logo_dark.png`. Manuál logo [Google Doc](https://docs.google.com/document/d/1EGI-a-RRvENXvhXtX2mNM1krpS0u9ZVwRnH1XGrXXx4/edit).
3. Produkty, varianty, parametry a příznaky verifikace: `Product` entity v aplikaci Base44 `6a3ee88c10959cd3588c4d68`.
4. Ceny: platná kalkulace 2026, případně ceny z produktu označené **orientační / ke kontrole**, dokud není kalkulace ověřena.
5. Starší Canva listy a AI vizualizace jsou pouze **layout reference**; nejsou automaticky výrobní předlohou.

## Vizuální tokeny webu (13. 11. 2026)
| Role | Hodnota |
| --- | --- |
| Hlavní modrá | `#0B2A4A` |
| Inkoustová | `#071A2F` |
| Akcent cyan | `#00B7FF` |
| Tmavý cyan | `#007ACB` |
| Ledová bílá | `#F5FAFD` |
| Jemná mlha | `#EAF6FC` |
| Bílá | `#FFFFFF` |
| Šedý text | `#607789` |
| Linky | `#D6EAF3` |
| Ocel | `#94A3B8` |
| Nadpisy | **Montserrat** 600–800 |
| Text | **Inter** 400–600 |
| Technické hodnoty | **Inter** / případně JetBrains Mono |
| Zakulacení | 10 / 16 / 24 px dle webového CSS |

Logo má vlastní barevné master varianty a nemá se přebarvovat podle CSS. Soubory z Google Drive mají přednost před náhradním SVG v GitHubu. Historický dokument používá jinou barevnou paletu (např. `#22D3EE`); pro nové webově sladěné materiály byla použita současná webová paleta. Pro každou změnu CSS provést kontrolu masteru.

## Pravidla umístění a používání
- Zachovat proporce originálního loga. Světlé prostředí: transparentní tmavý wordmark; tmavé: white/cyan variant. Bez glow, stínu, geometrických změn a efektních filtrů.
- Zachovat ochrannou zónu nejméně podle výšky písmene M.
- Velké nadpisy Montserrat, věcný technický text Inter, omezené použití cyan k orientaci a cenám.
- **Fotografie vždy přiřadit k přesnému produktu a variantě**. Realizaci popsat pouze u potvrzené skutečné fotografie; AI prostředí označit „Vizualizace — ilustrativní“. Nesmí dojít ke změně tvaru, počtu ramen nebo trysek, patky, rozměrů a materiálu.
- Produktová řada má **přesně 2 listy**, nikoliv 2 na variantu: **1. Produkt** (hero, popis, ověřené parametry, foto, cena od bez DPH) a **2. Varianty** (galerie, varianta, rozměry, materiál/profil, trysky, cena bez DPH, zdroje).
- Ceny a parametry neodvozovat z AI obrázků. Chybějící cenu zobrazit **Na poptávku** a chybějící parametr **K ověření**, nikoliv jej vymýšlet.
- Používat správné názvosloví: **Ostrev**, nikoli Ostřev; identifikátor `ostrev-city` beze změny.

## Formáty
- Produktové listy: A4 na výšku, dvě stránky za produkt.
- Brand master: prezentace 16:9.
- Sociální sítě: čtverec 1080 × 1080, příspěvek 1080 × 1350, story 1080 × 1920, při exportu zkontrolovat poměr stran.
- Návody: A4 na výšku, pouze ověřené bezpečnostní a provozní pokyny.
- Webové komponenty: používat existující CSS proměnné a přístupné, responzivní rozvržení.

## Nové editovatelné Canva projekty
- [Brand Master — 13 stran](https://www.canva.com/d/YyuDG_ybjvXax_k)
- [Produktový AURA master — produkt + varianty, 2 strany](https://www.canva.com/d/S-7j5jd9dS2yW_G)
- [Sociální sítě — 4 grafické vzory](https://www.canva.com/d/tUHUOwQBEu2EZ31)
- [Návody — 3 vzorové stránky](https://www.canva.com/d/RACeQU6WN4TCIs2)
- [Složka v Canvě](https://www.canva.com/folder/FAHa1kQKo3Q)
- [Původní pracovní katalog V5](https://www.canva.com/d/aSyOfNYpdK5oqN8) ponechán beze změny.

**Poznámka k AURA:** ukázka byla převzata ze schváleného vizuálního vzoru. Obrázky jsou označeny jako ilustrativní. Variantní ceny 26 580 / 29 036 Kč bez DPH jsou aktuálně převzaté z Base44 Product (k 13. 11. 2026), **nikoliv ověřená prodejní kalkulace**. Před distribucí zkontrolovat technické údaje a platný ceník.

## QA před publikací
1. Přesný produkt a varianta v aktuálním katalogu, ne archivní duplicitní záznam.
2. Zdroj fotografie, typ (realizace / vizualizace), geometrie a případná `visual_master_verified` kontrola.
3. Rozměry, materiál, trysky a příslušenství ověřené proti aktuálnímu produktu a výrobní dokumentaci.
4. Ceny bez DPH proti poslední kalkulaci; datum platnosti.
5. Grafický review: čeština, kontrast, přetečení textu, čitelnost na mobilu a tiskový náhled.
6. Manuální schválení správcem; žádná úprava `main`, žádné produkční nasazení bez schválení.
