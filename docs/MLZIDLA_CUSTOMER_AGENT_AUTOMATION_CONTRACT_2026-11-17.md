# MLŽIDLA.cz – Customer Agent → Canva → HubSpot → Gmail (implementační kontrakt)
Datum: 2026-11-17. Stav: připraveno k implementaci a integračnímu testu; NENÍ dokladem aktivace v HubSpotu.

## Identita a rozsah
- Použít EXISTUJÍCÍ upravený agent v HubSpotu, nevytvářet druhého. Požadovaný zobrazovaný název: **Tým MLŽIDLA.cz | Radek Meduna**. Původní interní označení Customer Agent nesmí být v zákaznickém podpisu, předmětu, přílohách ani záhlaví nabídky. Přejmenování v HubSpotu musí být ověřeno přímo v nastavení agenta; tato specifikace jej sama nepřejmenovává.
- Zákaznické obchodní e-maily a nabídky: zobrazované jméno odesílatele **Radek Meduna**, adresa **meduna@holmtec.cz**. Standardní podpis: **Radek Meduna**; **MLŽIDLA.cz | HolmTec**; **meduna@holmtec.cz**; **https://mlzidla.cz**. Telefon a přesný právní název firmy načíst ze schváleného Brand Profile, neodhadovat. Použít originální firemní logo a grafickou patičku, pokud je ověřená. Interní název asistenta **Tým MLŽIDLA.cz | Radek Meduna** se nemá automaticky vkládat do odesílatele ani podpisu.
- Agent pracuje jako asistent obchodní pošty Radka Meduny: připravuje koncepty jeho jménem, ale nesmí je bez jeho schválení odesílat ani označit jako osobně schválené. Po skutečném schválení obchodníkem může být zpráva odeslána pod jeho běžným jménem a podpisem bez povinného technického dodatku o AI přípravě.
- Neuvádět v obchodních konceptech technické názvy agentů ani interní poznámky o generování. Pokud zákazník jedná přímo s automatizovaným chatovacím agentem, nesmí být klamán, že mluví přímo s člověkem; odpovídající transparentnost zachovat.
- Portál MLŽIDLA.cz: 149778217; před každým zápisem ověřit identitu portálu. Konfigurace jiného portálu (149032244) nesmí být použita.
- Odesílatel Gmail: meduna@holmtec.cz; pouze DRAFT, nikdy SEND.
- Spouštěče: nová zákaznická poptávka v Base44/Gmailu nebo aktualizace poptávky vyžadující novou revizi. Vyžadovat originální source_id a zamezit opakovanému založení.
- Poptávka zakládá účel komunikace o poptávce, sama o sobě není univerzálním marketingovým souhlasem. Marketingové oprávnění evidovat odděleně podle skutečného právního titulu.

## Datový tok
1. Přijmout poptávku; zvalidovat kontaktní e-mail, zdroj, produkty, množství, místo instalace.
2. HubSpot: vyhledat kontakt dle e-mailu, firmu dle ověřené identity, Deal dle source_id. Upsert bez duplicit. Vázat vše na MLŽIDLA pipeline.
3. Načíst produktové parametry a schválený MASTER z Base44; cenu a DPH z aktuální schválené kalkulace. Neověřené ceny ani vizualizace nesmí do finální nabídky.
4. Připravit číslo nabídky a revizi, položky a 3 varianty SUPLA (BASIC, SMART, SMART PLUS). Rozšíření o průtokoměr, vodoměr, tlakové a pohybové senzory uvádět pouze s ověřenou kompatibilitou a cenou; jinak jako individuální volbu bez ceny.
5. Canva: vytvořit NOVOU kopii schválené šablony, nikdy nepřepisovat master. Pro 2 produkty použít ověřenou A_DUO REV4b, design_id DAHbICZZIgU; dostupná textová pole product_1_name, product_1_qty, product_1_unit_czk, product_1_line_total_czk, product_2_name, product_2_qty, product_2_unit_czk, product_2_line_total_czk, products_total_czk; obrázky product_1_image a product_2_image vyžadují platné Canva asset_id. Testovací kopie DAHbIV0Cti0 není produkční šablona.
6. Přílohy ve správném pořadí: produktový list, SUPLA a senzory, technické řešení, závěrečná číslovaná cenová nabídka s položkami, DPH, podmínkami a podpisem. PDF skutečně exportovat a ověřit soubory, stránky, identitu, částky, českou diakritiku, logo a fotografie.
7. Uložit PDF do neveřejné složky případu na Mlžném disku a odkazy k HubSpot Dealu. Koncept obchodní zprávy vytvořit v HubSpotu, pokud dané rozhraní podporuje CRM e-mailové koncepty; jinak evidovat HubSpot Note/Activity s odkazem na Gmail koncept a nepředstírat CRM draft.
8. Gmail: vytvořit/aktualizovat právě jeden koncept ve správném vlákně s reálnými PDF přílohami; ověřit attachment metadata a thread_id. Bez příloh není stav READY.
9. Zapsat audit: source_id, hubspot_contact_id, deal_id, offer_number, revision, canva_design_id, export_job_id, PDF URL, gmail_thread_id, gmail_draft_id, status, error_code, last_verified_at.

## Stavový automat
NEW → CONTACT_LINKED → PRICING_VERIFIED → CANVA_FILLED → PDF_EXPORTED → PDF_VERIFIED → HUBSPOT_LINKED → GMAIL_DRAFT_READY → PENDING_HUMAN_APPROVAL.
Při chybě přejít do BLOCKED s konkrétním důvodem; nesimulovat úspěch. SENT pouze po skutečně ověřeném odeslání člověkem.

## Přijímací test – pan Starý
- Jeden kontakt a jeden Deal, bez duplikátů po dvojím spuštění.
- TeePee 50 a TeePee 60 jsou alternativy, nesčítat jejich ceny jako společný nákup.
- SUPLA BASIC / SMART / SMART PLUS, senzory volitelné, pouze ověřené ceny.
- Čtyři ověřené PDF ve správném pořadí, přiřazené k Dealu.
- HubSpot koncept nebo prokazatelně evidovaný odkaz na Gmail koncept.
- Gmail DRAFT v původním vlákně; žádná odchozí zpráva.
- Simulace chybějícího asset_id / ceny / exportu → BLOCKED, žádný neúplný koncept označený jako hotový.

## Předání do ChatGPT Work – dokončení přímo v HubSpotu
- Otevřít v ChatGPT Work Cloud Browser produkční HubSpot portál **149778217** přihlášený jako **meduna@holmtec.cz**. Neměnit portál 149032244.
- Vyhledat EXISTUJÍCÍHO Customer Agenta, ověřit jeho aktuální název a přejmenovat na **Tým MLŽIDLA.cz | Radek Meduna**. Nevytvářet nového agenta.
- V zákaznických obchodních e-mailech nastavit zobrazované jméno odesílatele **Radek Meduna**, e-mail **meduna@holmtec.cz** a ověřený podpis s originálním logem: Radek Meduna / MLŽIDLA.cz | HolmTec / meduna@holmtec.cz / https://mlzidla.cz. Nepoužívat v patičce označení Customer Agent, AI Assistant ani interní název týmu. Neuvádět neověřený telefon.
- U přímé automatizované konverzace zachovat transparentní označení asistenta. U obchodních e-mailů, které Radek Meduna schválí, lze použít jeho běžný podpis bez technického dodatku o AI přípravě.
- Propojit existujícího agenta s workflow Base44 → HubSpot Deal → ověřené ceny → Canva PDF → přílohy Deal → Gmail koncept; v HubSpotu ukládat koncept, pokud je podporován, jinak aktivitu s odkazem na Gmail draft.
- Ověřit správné oprávnění a připojené účty, že žádný automatický SEND není zapnutý, že stav DRAFT neznamená SENT, a že přílohy jsou skutečně připojené.
- Testovat na již existující poptávce pana Starého bez duplicit a bez odeslání; provést test chybějící ceny, fotografie, PDF a opakovaného spuštění.
- V závěrečném reportu uvést konkrétní změněné nastavení, URL nebo ID agenta, testované výsledky, odkazy na vzniklé koncepty a PDF, případné blokace. Neoznačovat nasazení jako hotové bez důkazu.

## Nasazení
Nejdříve připojení Customer Agenta a exportní API, následně test v izolovaném prostředí, kontrola oprávnění, logování, idempotence, build/CI a Preview. Produkční aktivace až po úspěšných testech a ověření správného portálu. Tento soubor je specifikace, nikoli aktivní webhook ani publikované workflow.
