# MLŽIDLA.cz — návrh automatického obchodního workflow Base44 (14. 11. 2026)

Stav: **vývojová větev, read-only preflight**. Nezaměňovat s aktivním workflow nebo plně provozní integrací Canva → Gmail.
Zdroje: [Creating workflows](https://docs.base44.com/Building-your-app/Creating-workflows), [Building a presentation](https://docs.base44.com/Building-your-app/building-a-presentation#presenting-from-the-editor), [Base Code](https://base44.com/base-code).
Aplikace: `6a3ee88c10959cd3588c4d68`, workflow engine `workflows`, frontend React/Vite.

## Aktualizace architektury: HubSpot jako primární CRM

**Hlavní CRM je HubSpot HolmTec, portál 149778217**. Base44 je klientská a produktová administrace, čte/kontroluje webové poptávky, PDF a galerie. Google Sheets zůstává pracovním registrem leadů a podkladem pro oslovení, nikoliv druhou autoritou stavů obchodních případů. Před zápisem do HubSpotu je povinná serverová kontrola portálu, e-mailového klíče kontaktu a idempotence případu. Zatím implementován pouze read-only lookup kontaktu; write-sync Deal/Company je samostatná etapa.

### Oddělené spouštěče v administraci

- **„Ověřit případ v HubSpotu“**: backend `hubspotOfferCaseGateway` načte danou `Poptavka` / `ContactInquiry` / `EmailMessage`, ověří OAuth portál a vyhledá kontakt podle e-mailu. Při jiném portálu vrátí blokaci. Neukládá nové obchodní případy.
- **„Spustit Base44 kontrolu“**: pro webovou poptávku spouští stávající `offerWorkflowPreflight`. Zatím jde o **kontrolu připravenosti**, nikoliv automatickou produkci PDF.
- **„Předat do ChatGPT chatu“**: zkopíruje individualizované zadání a otevře ChatGPT. **Jde o uživatelské předání, nikoliv programové API/MCP volání.** Kontext včetně e-mailu zůstane v clipboardu a nepřenáší se v URL.
- **Přímé ChatGPT API / MCP spuštění**: samostatný autentizovaný backend endpoint a návratový callback do HubSpotu navrhnout až po ověření API klíče, scopes a identifikátoru běhu. Před použitím produkčních údajů zajistit souhlas, práva a audit. Nepředstírat, že samotné otevření chatu volá API.
- **Gemini**: odložený poskytovatel. Nemá aktivní tlačítko ani běh.

Všechny cesty budou používat společnou strukturu podkladů, cenu a geometrickou kontrolu. Výsledky providerů musejí mít oddělené identifikátory běhu a nesmí zakládat duplicitní nabídky. Až po ověření cen a příloh smí vzniknout Gmail **koncept**, nikdy automaticky odeslaná zpráva.

## Cíl a rozhodnutí

1. **Web Poptavka.created / ContactInquiry.created** → zaznamenat případ, spárovat kontakt a původní zdroj (ID, e-mail, firma, přesná varianta). Workflow nesmí zacyklit aktualizacemi stejné entity.
2. **Gmail.newMessage** (jen firemní účet `meduna@holmtec.cz`) → filtrovat relevantní nové příchozí odpovědi, ignorovat spam, automatická potvrzení, nedoručenky a interní poštu; identifikovat Gmail `messageId` a `threadId` a svázat s existujícím případem. Před prací se zprávou ověřit OAuth identitu schránky.
3. **Deduplikace**: kontakty podle normalizovaného e-mailu, firmy podle ověřené domény/IČO, poptávky podle ID zdrojového záznamu, Gmail podle zprávy/vlákna. Jeden e-mail klienta může mít více *odlišných* poptávek. Zachovat poslední relevantní komunikaci, nevytvářet druhé koncepty.
4. **Produkt/varianta**: pouze přesné ID z Base44 `Product` a ověřené technické podklady z Mlžného disku. Při nejednoznačnosti status `manual_required`.
5. **Ceny**: vždy živě načíst `Kalkulace mlžítka 2026` → list `💧 Katalog produktů 2026` → veřejný sloupec **H** a konkrétní řádek varianty. Sloupce interních/partnerských cen neveřejné. Není-li autorizace nebo shoda, **zablokovat vytvoření klientské cenové nabídky**, nevzít starou hodnotu `Product.price_from` ani interní náklad.
6. **Návrh řešení**: návaznost na typ klienta; města/obce bez DPH, soukromí klienti včetně DPH. SUPLA jako odpovídající volitelná komponenta s cenou pouze z platné kalkulace; samostatný produktový list SUPLA.
7. **Obrázky**: při dodané fotografii místa vytvořit nejprve náhled; bez fotografie použít existující schválenou vizualizaci. Přesný MASTER včetně trubek, profilu, trysek, kotvení a rozměrů. Neschválený AI návrh nesmí do finální klientské přílohy.
8. **Cenové PDF**: hlavní nabídka v identitě MLŽIDLA.cz a šabloně Canva `Mlžidla TP`; oslovení, vizualizace, varianty, parametry, technické řešení, SMART SUPLA, podmínky, položková cena, DPH, kontakty a podpis. Použít stávající originální logo. Slogan přesně `MLŽIDLA.cz – Pro příjemnější místa k životu.`.
9. **Prezentace**: Base44 Presentation / Google Slides jako druhý reprezentativní výstup pro schůzku. Není potvrzen automatický převod Canvy do Base44 Presentation. Udržet sdílený brief, varianty a schválené podklady, ale netvrdit totožný export.
10. **Gmail koncept**: založit v `meduna@holmtec.cz` jen po ověření všech klientských příloh, reálného Gmail OAuth účtu a korektního adresáta. Gmail `drafts.create`, **nikdy `messages.send`**. Přílohy fyzicky ověřit jako součást MIME zprávy, nestačí externí odkaz v textu. Připojit značkový podpis, vizuální nabídku PDF, relevantní produktový list a SUPLA list.
11. **Revize/QA**: finální nabídka, koncept a kontrolní záznam propojeny s ID poptávky/zakázky. Číslo a datum nabídky, platnost, stav autorizace, konkrétní verze ceny a MASTER geometrie, existence všech příloh. Odeslání jen člověk.
12. **Propojení**: CRM (Base44/HubSpot) aktualizovat až po ověření portálu; kontakty v tabulce Google `KONTAKTY – VŠE`, bez duplicit; ukládat schválený výstup do odpovídající interní složky na `Mlžném disku`. ChatGPT Sites jen po prokázání oprávněného soukromého API.

## Povolené spouštěče

- Entity: `Poptavka` **create**; `ContactInquiry` **create**.
- Connector: `gmail` **new inbound message**; podmínka na firemní účet a relevantnost.
- Neaktivovat aktualizační trigger na entitě `Poptavka` bez idempotentního klíče a filtru stavu.
- Nepoužívat vysokofrekvenční polling bez potřeby; platforma účtuje kroky a AI výpočty.
- Workflow vydat až po ověření funkčních výstupů a samostatném schválení. Base44 API vytvoří workflow okamžitě **aktivní na main**, proto samotná tvorba do produkce bez schválení nepatří.

## Implementováno v této větvi

- `base44/functions/offerPipelineIntakePreflight/entry.ts` — pouze administrátorská kontrola nových `Poptavka`, `ContactInquiry` a importovaných obchodních odpovědí `EmailMessage`, doporučené kroky, neověřené ceny/MASTER označené jako blokace.
- `src/components/admin/OfferWorkflowInbox.jsx` — kontrolní panel v administraci / Obchodní centrum s odlišnými tlačítky HubSpot, Base44 a ChatGPT.
- `base44/functions/hubspotOfferCaseGateway/entry.ts` — serverově vázaná kontrola identifikátoru portálu 149778217 a čtení odpovídajícího kontaktu HubSpot, bez zápisu.
- Dosavadní `prepareOfferConcept`, `autoDraftOfferFromInquiry`, `generateOfferPresentation`, `sendInquiryReply` mají vlastní logiku, která před automatickým propojením vyžaduje audit zastaralých orientačních cen a kontroly přístupu. Nevolat je slepě z event triggeru.

## Dokončení před aktivací

- Otestovat pravý Gmail event na neprodukčním vzorku, kompletní autorizaci a historii nových odpovědí.
- Opravit staré kalkulační fallbacky ve všech nabídkových funkcích; jediný ceník platná Kalkulace 2026.
- Ověřit funkční úložiště a originální grafiku pro Canva listy, PDF export a schopnost přidat **přílohy** do Gmail draftu.
- Ověřit vazbu HubSpot na portál HolmTec 149778217; konektor ChatGPT ukazuje jiný účet 149032244.
- Vytvořit oddělené workflow `nová poptávka`, `nová Gmail odpověď`; před vytvořením validovat definice přes Apps API.
- Projít simulovaný test Poptavka → ProjectOrder → správná cena → MASTER → PDF → kontrola všech příloh → Gmail koncept → ruční odeslání.
- Zajistit logy, idempotenci, bezpečné retry, limit počtu zpracovaných záznamů a stav `blocked_needs_review`.

## Poznámka Base44 Presentation vs. Canva

Prezentační režim Base44 je vhodný pro editovatelný prodejní deck se slidy, poznámkami a zobrazením klientovi. Pro cenové nabídky nadále upřednostnit klientské **PDF v obrazovém stylu Mlžidla TP**. Canva autofill data bindings ani přímá tvorba Base44 presentation ze stejného dokumentu nebyly tímto commitem ověřeny a jsou navazujícím vývojovým úkolem.

