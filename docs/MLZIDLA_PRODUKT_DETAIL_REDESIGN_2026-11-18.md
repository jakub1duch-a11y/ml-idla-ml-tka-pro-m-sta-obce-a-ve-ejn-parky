# MLŽIDLA.cz – schválené zadání produktových detailů

Stav: zadání pro implementaci v pracovní větvi. Publikace po kontrole a schválení.

## Hero
Zachovat současný čistý, elegantní a vizuálně kvalitní hero detailu produktu. Nezahlcovat rozměry, ikonami, technickým textem ani animacemi. Zachovat současnou skutečnou produktovou fotografii, responzivitu, SEO a navigaci.

## Nové sekce až pod hero
1. Proměna prostoru před a po: stejný pohled na prostor bez mlžítka a s mlžítkem v provozu, s lidmi; jasně rozlišit realitu od vizualizace. Nesmí být slibována neověřená změna teploty.
2. Galerie s lidmi a měřítkem: přesná geometrie produktu, skutečné rozměry dle schválené dokumentace, přírodní a městská prostředí, varianta se zapnutým i vypnutým mlžením. Kótovanou vrstvu lze zapnout a vypnout.
3. Materiály a detaily: ověřené fotografie nerezu, svařování, trysek a povrchových úprav; neuvádět jiné materiály, než má daná varianta.
4. Technické řešení: výrobní výkresy a schémata připojení vody, kotvení, rozvodů a případně řízení SUPLA s odpovídajícími zdroji.
5. Standardní instalace: běžně osazujeme výrobek na již připravené betonové patky a připojujeme na připravenou vodovodní větev. Výkopy, betonáže a tvorba vodovodní větve nejsou automaticky v standardní ceně, ale lze je individuálně zajistit nebo pomoci koordinovat.
6. Realizace, případová galerie a video: pouze skutečné realizace nebo přesně označené vizualizace.
7. Dvě CTA: „Zjistit cenu produktu“ a „Požádat o nezávaznou nabídku“; přenášet produkt a variantu do poptávkového formuláře. Evidovat poptávku, žádné automatické odesílání nabídky zákazníkům.

## Brand
Prémiový čistý design MLŽIDLA, V3 navy/cyan/white/mist; inspirace schválenou e-mailovou patičkou, nikoli přepis původní identity. Použít existující originální SVG logo. Správný kontakt Radek Meduna: +420 774 700 390.

## Pravidla zdrojů a bezpečnosti
Produkt je vždy načten z Base44 katalogu a identifikován slugem. MASTER reference, rozměry, materiály, počet a poloha trysek, patky a vzhled musí být ověřené. Pokud schválený obrázek pro sekci chybí, sekce se nezobrazuje nebo zůstává interní; nikdy nedoplňovat vymyšlenou produktovou vizualizaci. Nezveřejňovat interní ceny. Nezměnit současné ceny, SEO, produktové vazby a funkční formuláře bez ověření.

## Implementace a QA
Zavést znovupoužitelné komponenty pod PdCompactHero v src/pages/ProduktDetail.jsx, navázané na reálná produktová data a schválená média. Responzivita desktop/tablet/mobil, interakce klávesnicí, touch 44px+, reduced-motion, lazy-load sekundárních médií, žádný layout shift. Pilotní produkt, potom ostatní po ověření. Otestovat build, odkazy, poptávky, geometrii, obsah a bezpečnost na preview. Merge/deploy do produkce teprve po explicitním souhlasu správce.
