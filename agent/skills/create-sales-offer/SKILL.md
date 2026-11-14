---
name: create-sales-offer
description: Prepare verified MLŽIDLA.cz customer offers for every catalog product using Base44, approved Google Drive pricing, Canva templates, realistic visuals and unsent Gmail drafts.
---
# MLŽIDLA.cz — create-sales-offer

## Scope
Apply to **all current and future MLŽIDLA.cz products and variants**, including custom sculptures. Never restrict to a hardcoded product list. Identify the requested SKU/variant from the inquiry and current approved Base44 catalog. If multiple products are requested, prepare one coordinated proposal with individual product sections and an itemized consolidated quote.

## Mandatory product truth
Before using images or generating visualizations, read `docs/MLZIDLA_VERIFIED_PRODUCT_BRAND_WORKFLOW.md`. Match the product's verified MASTER from the Base44 admin and approved MLŽNÝ DISK source. Preserve exact geometry, dimensions, bend radii, tube profiles, brushed stainless steel surface, nozzle placement and anchoring. Never invent product specs or prices. If a verified MASTER is missing, block product-accurate AI visualization and flag for review.

## Workflow
1. Read the authorized website/Base44 or Gmail inquiry; identify customer, contact, organization/private status, products/variants/quantities, site, timing and attachments. Preserve original conversation thread. Check sales register for duplicates.
2. Retrieve verified catalog photos and existing environmental renders from Base44/Drive. Prefer the customer's supplied site photos for site-specific visualizations. Without site photos, use approved existing catalog/environment images; label generic renders as illustrative, never as the customer's actual property. When necessary, call `generate-photo` if installed and supported; otherwise request the approved image workflow. Do not replace actual product geometry with AI approximations.
3. Read the **current approved pricing spreadsheet** on the shared Google Drive, with traceable sheet, row, revision/date and currency. Quote each requested product and variant, accessories, controls, delivery and installation only if verified. Missing prices: `CENA K OVĚŘENÍ`; do not invent totals.
4. Propose proportional water control: simple suitable valve/timer for a private garden if appropriate; SUPLA time/temperature/humidity control for institutional or public spaces where useful; zones, filtration, pump and cabinet only if technically justified. Verify pressure, flow, filtration, water/electricity connections and winterization. Show basic recommendation and priced optional upgrade separately. Caption illustrative shaft photos: 'Ilustrační fotografie. Finální provedení určíme podle prostoru a umístění.'
5. Use the existing approved Canva `Mlžidla TP` branded template and previously approved product sheets. Create a **customer-specific** document: (1) introduction and benefits, (2) photos/visualizations, (3) variants and verified specs, (4) technical solution and item prices, (5) control/SUPLA, (6) site readiness and terms, (7) subtotal, VAT, total excluding/including VAT, (8) contact, validity, signature/stamp. Preserve logo and brand assets, readable Czech, professional layout.
6. Institutional/B2B offer: prominently show prices without VAT; private customer: prominently show prices including VAT. In both cases show VAT rate, VAT amount and both totals. Confirm current applicable VAT; do not assume.
7. Export and verify the Canva PDF, customer name, SKU, images, Czech accents, all prices and attachments. Prepare a **Gmail draft in the existing inquiry thread** with the verified customer address, concise Czech message and correct PDF/product sheets. Never send automatically; do not duplicate SUPLA sheets.
8. Update the authorized sales register with inquiry, products, price provenance, Canva/PDF links, Gmail thread, status and next action; prevent duplicate contacts and drafts. Preserve audit trail.

## Quality gates
- Product and variant verified against catalog MASTER
- Geometry, material, nozzles and scale preserved
- Price source current and auditable; VAT arithmetic checked
- Recommended control proportionate to site and customer
- Canva document and PDF actually created and checked
- Gmail draft actually saved, recipient/thread/attachments verified
- If any gate fails: mark NEEDS REVIEW, do not claim completion
- Never publish website changes, send emails or overwrite approved visuals without explicit authorization

## Language
Write customer-facing content in natural professional Czech unless the inquiry requires another language.
