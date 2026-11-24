import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CANVA_OFFER_MASTER, verifyCanvaOfferForDraft } from '../src/lib/mlz-canva-offer-safety.js';

const valid = {
  templateId: 'EAHbBX1hTpE', inquiryId: 'inq-123', contactEmail: 'test@example.com',
  productName: 'AURA 700', variantName: 'AURA 700', technicalRevision: 'approved-rev',
  masterImageVerified: true, quantity: 1, priceExVat: 20000,
  priceSource: 'verified sheet', priceRevision: 'rev 1', vatRate: 21,
  offerNumber: 'NAB-2026-TEST', offerValidity: '2026-12-01',
  canvaCopyUrl: 'https://www.canva.com/design/valid', pdfUrl: 'https://example.com/quote.pdf',
  pdfReviewed: true, accountVerified: true, autoSend: false,
  canvaExtractedText: 'AURA 700 | 20 000 Kč | verified', replacedTemplatePriceElements: true,
  hubspotDealVerified: true, googleDriveArchiveVerified: true,
};
test('template has no Autofill and is one page', () => {
  assert.equal(CANVA_OFFER_MASTER.datasetFieldsAvailable, false);
  assert.equal(CANVA_OFFER_MASTER.inspectedPageCount, 1);
});
test('named A4 design with verified dataset may be used for an approved draft', () => {
  const result = verifyCanvaOfferForDraft({
    ...valid, templateId: 'DAHbIPt73-s', canvaAutofillClaimed: true,
    canvaDatasetFieldsVerified: true,
  });
  assert.equal(result.readyForGmailDraftWithAttachment, true);
  assert.equal(result.emailMode, 'draft_only');
});

test('claims of AutoFill without the actual Canva field types fail closed', () => {
  const result = verifyCanvaOfferForDraft({
    ...valid, templateId: 'DAHbIPt73-s', canvaAutofillClaimed: true,
    canvaDatasetFieldsVerified: false,
  });
  assert.equal(result.readyForGmailDraftWithAttachment, false);
});

test('fully reviewed and verified customer quote may become draft only', () => {
  const result = verifyCanvaOfferForDraft(valid);
  assert.equal(result.readyForGmailDraftWithAttachment, true);
  assert.equal(result.emailMode, 'draft_only');
});
test('a copied template with old prices cannot be attached', () => {
  const result = verifyCanvaOfferForDraft({...valid,
    replacedTemplatePriceElements: false,
    canvaExtractedText: 'AURA 700 | 26 580 Kč'});
  assert.equal(result.readyForGmailDraftWithAttachment, false);
});
test('unknown price, wrong account, unreviewed pdf and autoSend block draft', () => {
  const result = verifyCanvaOfferForDraft({...valid, priceExVat: null, accountVerified:false, pdfReviewed:false, autoSend:true});
  assert.equal(result.readyForGmailDraftWithAttachment,false);
  assert.ok(result.errors.some(x=>x.includes('odesílání')));
});
test('a wrong product in copied template blocks draft', () => {
  const result=verifyCanvaOfferForDraft({...valid,productName:'BRÁNA GATE',canvaExtractedText:'AURA 700 | 20 000 Kč'});
  assert.equal(result.readyForGmailDraftWithAttachment,false);
});
