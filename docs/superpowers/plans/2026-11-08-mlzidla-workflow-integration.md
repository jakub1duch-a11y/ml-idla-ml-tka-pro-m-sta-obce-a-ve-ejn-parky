# MLŽIDLA workflow integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bezpečná základna pro automatizaci nabídek se správným účtem, oficiální cenou, ověřenou geometrií a koncepty bez odeslání.

**Architecture:** Base44 React/Vite + Deno backend; před operací s Google zdroji se serverově ověří identita OAuth. Přesné katalogové ceny se čtou výhradně z veřejných cen nového zdroje. Canva/ChatGPT Sites jsou oddělené integrace, dokud se ověří přímé API.

**Tech Stack:** Base44 SDK, Deno, React, Node test runner, Google Drive/Sheets/Gmail OAuth.

**Spec:** `docs/superpowers/specs/2026-11-08-mlzidla-workflow-design.md`

## Global Constraints
- Nic nepsat na `main`.
- Ceny veřejné pouze ze sloupce H listu `💧 Katalog produktů 2026`; staré zdroje nikdy nezaměnit.
- Google account musí být `meduna@holmtec.cz`; jinak fail-closed.
- Podoby produktů jen z ověřených MASTER zdrojů, žádné AI domýšlení.
- Nikdy neodesílat e-maily automaticky, ani nepublikovat web bez schválení.

## Review Focus
- Konektor je aktivní, ale hlásí jiný účet → blokace.
- Token expiroval / Google API vrátilo 403 → blokace bez úniku tokenu.
- Název varianty je nejednoznačný → cena se nevyplní odhadem.
- Veřejný výstup nesmí vystavit sloupce partnerských cen ani interní náklady.
- Canva a Sites jsou připravené pouze tam, kde existuje skutečně ověřené API.

## Tasks

### Task 1: Account guard and public price resolver
**Files:** Create `base44/shared/businessWorkflowGuard.mjs`, `tests/businessWorkflowGuard.test.mjs`.
- [ ] RED: test účtu Gmail a Drive, chybějící identity a nedostupného API; test přesné ceny bez partner sloupců.
- [ ] GREEN: minimální čisté funkce a bezpečný požadavek na identitu OAuth.
- [ ] Ověřit `node --test tests/businessWorkflowGuard.test.mjs`.

### Task 2: Diagnostic API and visible administration
**Files:** Modify `base44/functions/getMarketingConnectorHealth/entry.ts` and `src/components/admin/marketing/MarketingConnectorHealth.jsx`.
- [ ] Zachovat admin-only kontrolu.
- [ ] U Google Drive, Sheets a Gmail doplnit identitu a blokující stav při nesouladu.
- [ ] Ukázat rozdíl mezi připojeno a ověřenou identitou v administraci.
- [ ] Ověřit `npm run build` a ESLint dotčeného JSX.

### Task 3: Prevent misrouted writes and sync
**Files:** Modify `base44/functions/saveQuoteToDriveAuto/entry.ts`, `base44/functions/syncGmailAndContacts/entry.ts` only after inspecting callers.
- [ ] Než dojde k operaci s Drive/Gmail, ověřit identitu služby.
- [ ] Při nesouladu vrátit chybu bez side effects.
- [ ] Ověřit testy a build.

### Task 5: Ověřený podklad pro produktový list v Canvě (9. 11. 2026)
**Files:** `base44/shared/brandOfferPacket.mjs`, `base44/shared/brandOfferWorkflow.mjs`, `base44/functions/getBrandOfferPreflight/entry.ts`, `base44/entities/Product.jsonc`, `src/components/admin/marketing/BrandOfferPreflight.jsx`, `src/pages/admin/AdminMarketing.jsx`, `tests/brandOfferPacket.test.mjs`, `tests/brandOfferWorkflow.test.mjs`.
- [x] RED → GREEN: přesná varianta, veřejná cena z A:H, unikátní MASTER pro vícero variant, bez partnerských údajů.
- [x] RED → GREEN: nesprávný Google účet a selhání Google Sheets blokují celý postup.
- [x] Admin-only read-only endpoint a formulář v Marketing Hubu; SUPLA vždy samostatný list, bez dosazování neověřené ceny.
- [x] Ověřeno 18 automatických testů, ESLint a build.
- [ ] Provozní otestování po dokončení OAuth jako meduna@holmtec.cz; vizuální kontrola v preview.
- [ ] Napojení na vytvoření Canva designu / PDF / archivaci / koncept Gmail až po potvrzení datových polí a oprávnění.

### Task 4: Handoff and release gate
**Files:** `docs/MLZIDLA_CANVA_SITES_INTEGRATION_STATUS.md`.
- [ ] Zapsat potvrzené účty, zdrojové folder ID, cenu, média, SUPLA a stav Canva.
- [ ] Vytvořit checkpoint a případný PR pro kontrolu (bez merge).
- [ ] Vypsat nehotové OAuth a Sites kroky; nevydávat je za dokončené.
