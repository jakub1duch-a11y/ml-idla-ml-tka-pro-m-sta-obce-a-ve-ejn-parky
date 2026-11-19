# MLŽIDLA.cz – AI nabídky: audit připravenosti (2026-11-14)

## Ověřeno v projektu
- Existují Base44 agenty: nabidkovy_super_agent, marketing_content_agent, produktovy_optimalizator, produktovy_poradce, supla_control, thumbnail_director.
- Existují backend funkce: autoDraftOfferFromInquiry, prepareOfferConcept, offerWorkflowPreflight, getBrandOfferPreflight, generateOfferPresentation, saveImageOfferToDrive, sendOfferForReview, approveOfferConcept, sendClientOffer.
- autoDraftOfferFromInquiry používá Base44 InvokeLLM, zpracovává Poptavka / ContactInquiry, čte zákaznické fotografie a má kontrolu opakovaného ProjectOrder podle inquiry_id.
- Tato funkce na začátku vyžaduje přihlášeného admina; nelze tvrdit, že se automaticky spouští veřejným formulářem bez ověření triggeru a serverových oprávnění.
- V projektu jsou guard testy ceníku a účtu Google; jejich průchod neprokazuje reálné OAuth spojení nebo schopnost vytvořit Canva dokument a Gmail koncept.

## Před povolením plné automatizace
1. Ověřit skutečné webhooky/triggery pro Poptavka a ContactInquiry a běh pod serverovou rolí s nejmenšími oprávněními.
2. Ověřit identitu firemního Google účtu, platný ceník, čtení Drive, Canva šablonu, práva pro Gmail koncepty a vazbu na poslední vlákno.
3. Ověřit, že připojení Canvy vytváří skutečný editovatelný návrh a že přílohy PDF + JPG/PNG jsou dostupné.
4. Pro každý nový inquiry_id vytvořit idempotentní běh, uchovat log a kontrolu správné varianty, ceny, SUPLA a příloh.
5. Připravit pouze koncept, nikdy automaticky neodesílat bez schválení.
6. Otestovat anonymní formulář → databázový záznam → interní příprava → Canva → Gmail koncept → ruční schválení na testovací poptávce.
7. OpenAI API agenta připojit až po vytvoření schváleného klíče, uložení do serverového secret manageru a ověření účtování; neskladovat API klíč ve frontendu.

## Stav
Zdrojový audit hotov, reálná integrace všech externích služeb a end-to-end test dosud nepotvrzeny. Nenasazovat nové automatické odesílání.
