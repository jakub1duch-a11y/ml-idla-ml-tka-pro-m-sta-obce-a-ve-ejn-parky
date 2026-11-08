---
title: "Mlžidla.cz – CRM, obchod, poptávky, objednávky a správa webu"
status: "architecture-proposal"
updated: "2026-11-08"
base44_app_id: "6a3ee88c10959cd3588c4d68"
---

# Jednotné administrační centrum Mlžidla.cz

## Ověřený výchozí stav
V Base44 existují entity: `CrmContact`, `CrmActivity`, `EmailMessage`, `ContactInquiry`, `B2BLead`, `ProjectOrder`, `ProductionOrder`, `ProjectPayment`, `OfferAgentRun`, `OfferAsset`, `OfferVariant`, `Product`, `MarketingPost`. Nové řešení má **navázat na tyto existující entity**, ne vytvořit paralelní CRM.

## Navigace
- **Přehled:** nové poptávky, odpovědi v Gmailu, nabídky čekající na schválení, zakázky, úkoly, chyby synchronizace.
- **CRM a kontakty:** organizace, kontaktní osoby, historie komunikace, štítky, segmenty, duplicity.
- **Poptávky:** příjem z webu a Gmailu, triáž, přiřazení produktu a kontaktu, tisk/PDF, nabídka jedním kliknutím.
- **Nabídky:** cenová kalkulace z ověřeného ceníku 2026, Canva šablona Mlžidla TP, SUPLA jako povinná varianta/příloha, náhled a schválení, Gmail koncept.
- **Objednávky a realizace:** přijetí nabídky, záloha, výroba, montáž, předání, fakturace.
- **Produkty:** parametry, fotografie, AI vizualizace ve dvojicích, schvalování, synchronizace s produktovými složkami Mlžného disku.
- **Web:** obsah, tematické stránky, SEO, reference, publikace a revize.
- **Marketing:** kampaně, plánování, schválené produktové vizualizace, blog.
- **Integrace a audit:** stav Gmail/Drive/Sheets/Base44, synchronizační fronta, chyby a opakování.

## Integrace a zdroj pravdy
- **Base44:** stav obchodního případu, schválení, vazby mezi entitami, přístupová práva a audit.
- **Gmail:** identifikace příchozích a odchozích vláken přes `gmail_thread_id`/`gmail_message_id`; deduplikace; příchozí odpověď aktualizuje kontakt i případ; návrhy odpovědí jen jako koncepty, nikdy automaticky neodesílat.
- **Google Drive – Mlžný disk:** archivace PDF poptávek, nabídek, smluv, objednávek, fotografií; zachovat existující složky, uložit `drive_file_id` a URL. Ověřený kořen ID `1eVnUbhtyVv7trdGtJpjNfaACh3ht8QXq`.
- **Google Sheets:** synchronizovat existující tabulku „MLŽIDLA.cz — obchodní kontakty, nabídky“ a zdroj cen „Kalkulace 2026“ po ověření konkrétních listů; neudržovat dvě nezávislé autoritativní ceny.
- **Google Workspace:** integrační identita, oprávnění, případné Apps Script/Workspace automatizace jen tam, kde jsou skutečně potřeba; přístupové tokeny držet mimo veřejný klientský kód.

## Stavový automat
`nova_poptavka → kvalifikace → nabidka_rozpracovana → ke_schvaleni → koncept_gmail → odeslana → vyjednavani → prijata/zamitnuta → objednavka → zaloha → vyroba → realizace → predano → uzavreno`.

Přechody musí mít vlastníka, čas a auditní záznam. Stav „odeslaná“ nastavit až po potvrzení skutečného odeslání z Gmailu. Stav „zaplaceno“ pouze z ověřeného účetního/příjmového podkladu, nikoli z domněnky.

## Vazby a deduplikace
- Kontakt: normalizovaný e-mail; organizace: ověřená identita, nikoli pouze podobný název.
- E-mail: unikátní `gmail_message_id`; vazba na `gmail_thread_id` a konkrétní obchodní případ.
- Poptávka: zachovat původní ID webového formuláře; detekovat opakované importy.
- Nabídka: `quote_number`, verze, datum platnosti, použitá cenová verze a přílohy.
- Objednávka: `project_order_id`, `production_order_id`, zálohy a předání.
- Synchronizace: idempotentní klíče, fronta, retry, poslední úspěch, přehled chyb.

## UX a bezpečnost
- Jedna karta případu: zákazník, zprávy, produkty, nabídky, přílohy, úkoly, stav a historie.
- Příchozí poptávky zvýraznit; odpovědi rozpoznávat z Gmailu a ukazovat u kontaktu i nabídky.
- Schvalování nabídek, publikace na webu, schvalování vizualizací a odeslání e-mailů jsou oddělené akce.
- Role a oprávnění, GDPR, zákaz nechtěného zveřejnění kontaktních údajů.
- Preview ve feature větvi; žádné nasazení do `main` bez kontroly a schválení.

## Implementační pořadí
1. Audit existujících Base44 entit, komponent, workflow a napojených Google účtů.
2. Datová mapa a migrace vazeb bez mazání záznamů.
3. CRM + Poptávky + Gmail synchronizace, testovací data a deduplikace.
4. Nabídky + Drive + Sheets + schvalovací brány.
5. Objednávky, výroba, platby a realizace.
6. Jednotná produktová a webová administrace, vizualizace a marketing.
7. End-to-end testy, audit, preview, ruční schválení publikace.

**Tento soubor je specifikace. Neprokazuje zapnuté integrace ani hotovou implementaci.**
