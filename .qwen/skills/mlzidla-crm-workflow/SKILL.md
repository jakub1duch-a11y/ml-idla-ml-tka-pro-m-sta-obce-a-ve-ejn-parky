---
name: mlzidla-crm-workflow
description: Audit a návrh integrace poptávek Base44, kontaktů a Deals v HubSpot, obchodních tabulek Google, Canvy, Gmail konceptů a schvalování nabídek MLŽIDLA.cz.
---

# MLŽIDLA.cz – CRM workflow bez nechtěných zápisů

1. Nejprve přečti `docs/QWEN_WORKFLOW_MLZIDLA.md` a `docs/audits/2026-11-14-web-workflow-etapa-1.md`. Respektuj označení ověřeno/neověřeno.
2. Před úpravami vyhledej konkrétní kód `hubspotOfferCaseGateway`, `hubspotProductCatalogSync`, `AdminOffers`, `AdminCRM` a příslušné funkce pro synchronizaci.
3. HubSpot: v repozitáři existují dvě ID portálů (149778217 a 149032244). Bez ověření aktuálního OAuth připojení nikdy nepřenášej produkty, nezakládej Deals ani neupravuj natvrdo portálová ID.
4. Navrhni mapování zdrojové poptávky na Contact, Company a Deal podle ověřených atributů. Deduplikaci zakládej na jednoznačných identifikátorech, e-mailu a původní komunikaci; nejprve preview/dry-run.
5. Zpracování nabídky: ověřit variantu a MASTER vizuály, schválený aktuální ceník, SUPLA podle prostoru, Canva šablonu, přílohy a stav `pending_approval`.
6. Gmail: koncept s ověřenými přílohami a odkazy; nikdy neposílej. Nepřidávej duplicitní koncepty, nezapisuj stav `odesláno` bez důkazu.
7. Při každém návrhu vypiš chybějící souhlasy, neověřené údaje a přesné změny v systému. Nevydávej návrh workflow za existující automatizaci.
8. Nepropojuj ChatGPT-only nebo Base44-only tokeny s Qwen bez schváleného, ověřeného MCP endpointu.
