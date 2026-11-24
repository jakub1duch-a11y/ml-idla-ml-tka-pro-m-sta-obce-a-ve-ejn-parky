# MLŽIDLA.cz – schválený směr prémiového webu 2026

Datum: 2026-11-19. Stav: uživatel schválil návrhový směr; neznamená automatické schválení neověřených fotografií, cen ani parametrů.

## Vizuální rukopis
- Architektonický minimalismus: velké skutečné fotografie, přirozené měřítko s lidmi, dostatek volného místa, jedna dominantní věta na obrazovku.
- Technický detail: povrch broušené nerezi, přesné ohyby, kotvení, výrobní záběry HolmTec; konkrétní materiál podle schváleného produktového MASTER.
- Ambientní vrstva: jemná mlha, odlesky, světlo, tlumené textury. Nepoužívat falešné výsledky měření ani vizuálně změněnou geometrii.
- Barvy #071D2B, #00A7B5, #F3F7F7 jsou pracovní směrové reference, nikoliv potvrzené brand tokeny. Před plošnou změnou porovnat se skutečnou značkovou šablonou a existujícími CSS tokeny.
- Typografie a logo: vycházet z aktuálních originálních podkladů; nevytvářet nové logo generativním nástrojem.

## Stránky a skladba
| Segment | První obraz | Důkaz | Technika | CTA |
| --- | --- | --- | --- | --- |
| Města a obce | Reálná realizace v městském prostoru | Reference a lokalita | Antivandal konstrukce, kotvení, voda, provoz | Navrhnout řešení |
| Školy a školky | Školní zahrada se schváleným modelem | Fotografie konkrétního produktu | Provozní dohled, hygiena, filtrace, kotvení; není herní prvek | Poptat řešení pro školu |
| Parky a hřiště | Parková cesta, pobytová zóna | Reálné použití v zeleni | Údržba, odolnost, mokré povrchy, kotvení | Navrhnout parkové mlžítko |
| Mlhoviště | Pobytový prostor s mlžením | Sestava a rozmístění | Příprava vody, řízení, filtrace, servis | Poslat podklady |
| Zakázková výroba | Produktový MASTER → skutečné prostředí | Fotografie a výrobní postup | Ohyby, materiál, technologie, schválený výkres | Konzultovat návrh |

## Animace a výkon
- Scroll příběh 3 kroky, na mobilu kratší než na desktopu. Používat jemné opacity/translate/scale, nikoliv blokující efekty.
- Poster vždy první; video pouze z existujícího ověřeného zdroje, lazy load, pause mimo viewport a ruční ovládání. `prefers-reduced-motion` = statický poster.
- Prvky rozdělit na ambient/background, skutečný produkt, text a CTA. Zajistit kontrast a přístupnost klávesnicí.
- Změny ověřit buildem, responzivitou, Core Web Vitals a skutečnou poptávkou před tvrzením o funkčním nasazení.

## Obrazové podklady
- Nejdříve ověřit master fotografie a videa na MLŽNÉM DISKU a v Base44; screenshoty z Instagramu nepoužívat jako finální zdroj.
- Transparentní produktové výřezy jen podle výrobního MASTER. Nikdy neměnit rádiusy, průměry, trysky, počet ramen ani patky.
- Pro web: 16:9 desktop, 4:5 mobilní výřez, 9:16 sociální sítě. Důležité části produktu nesmí být oříznuté.
- Figma: návrhy responzivních sekcí a komponent. Canva: produktové listy a schválené obrazové výstupy. Každé publikování ověřit zvlášť.

## Inspirace (nikoliv převzatá identita)
- https://www.awwwards.com/
- https://www.siteinspire.com/
- https://dribbble.com/tags/architecture-website
- https://www.behance.net/gallery/245468841/Fluid-Glass
- https://www.behance.net/gallery/251813361/Kononenko-Architectural-Website
- https://www.behance.net/gallery/255079677/Forma-Web-Design-Development

## Publikační brána
1. Ověřit konkrétní fotografii a produktový MASTER.
2. Implementovat na pracovní větvi a provést kontrolu diffu.
3. Spustit build a cílené testy.
4. Ověřit náhled na mobilu a desktopu, odkazy a formuláře.
5. Nasazení a veřejné URL potvrdit jen po nezávislé kontrole. Nepublikovat interní ceny ani pracovní návrhy.
