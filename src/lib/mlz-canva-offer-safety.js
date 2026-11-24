/**
 * Client/server-safe Canva quote QC contract.
 * Source: selected Canva Brand Template EAHbBX1hTpE ("Mlžítka HolmTec").
 * Inspected on 2026-11-15: a SINGLE-page product sheet for Aura 700.
 * No native Canva Autofill dataset is present.
 *
 * This module does not call Canva or send email. It only rejects unsafe
 * exports and provides required-field instructions to a human/editor.
 */
import { MLZ_CANVA_AUTOFILL_TEMPLATES } from './mlz-canva-autofill-registry.js';

export const CANVA_OFFER_MASTER = Object.freeze({
  brandTemplateId: 'EAHbBX1hTpE',
  title: 'Mlžítka HolmTec',
  inspectedPageCount: 1,
  inspectedProduct: 'AURA 700',
  datasetFieldsAvailable: false,
  hardcodedPriceExamples: Object.freeze(['26 580 Kč', '50 550 Kč', '71 400 Kč', '2 610 Kč', '8 340 Kč']),
  technicalValuesToReplace: Object.freeze(['TR42x2', '2200 mm', '700 mm', '2–8 bar']),
  essentialFields: Object.freeze([
    'contactEmail', 'inquiryId', 'productName', 'variantName',
    'technicalRevision', 'masterImageVerified',
    'quantity', 'priceExVat', 'priceSource', 'priceRevision',
    'vatRate', 'offerNumber', 'offerValidity',
    'canvaCopyUrl', 'pdfUrl', 'pdfReviewed', 'accountVerified',
  ]),
  outputMode: 'gmail_draft_only',
});

const meaningful = value => typeof value === 'string' && value.trim().length > 0;
const validUrl = value => {
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
};
export function verifyCanvaOfferForDraft(input = {}) {
  const errors = [];
  const warnings = [];
  for (const key of CANVA_OFFER_MASTER.essentialFields) {
    if (input[key] === undefined || input[key] === null || input[key] === '') {
      errors.push('Chybí ověřený údaj: ' + key);
    }
  }
  if (input.masterImageVerified !== true) errors.push('MASTER fotografie nebo geometrie není schválena.');
  if (input.pdfReviewed !== true) errors.push('Není dokončena kontrola finálního PDF.');
  if (input.accountVerified !== true) errors.push('Není potvrzen firemní účet meduna@holmtec.cz.');
  if (input.autoSend === true) errors.push('Automatické odesílání je zakázáno.');
  const registeredDesign = Object.values(MLZ_CANVA_AUTOFILL_TEMPLATES)
    .find(item => item.designId === input.templateId);
  if (input.templateId && input.templateId !== CANVA_OFFER_MASTER.brandTemplateId && !registeredDesign) {
    errors.push('Neznámá nebo neschválená Canva šablona.');
  }
  if (!Number.isInteger(input.quantity) || input.quantity < 1) errors.push('Množství není kladné celé číslo.');
  if (!(typeof input.priceExVat === 'number' && Number.isFinite(input.priceExVat) && input.priceExVat > 0)) errors.push('Neověřená cena bez DPH.');
  if (!(typeof input.vatRate === 'number' && Number.isFinite(input.vatRate) && input.vatRate >= 0)) errors.push('Neověřená sazba DPH.');
  if (!validUrl(input.canvaCopyUrl)) errors.push('Chybí platný odkaz na vlastní Canva kopii.');
  if (!validUrl(input.pdfUrl)) errors.push('Chybí ověřená PDF příloha.');
  if (!meaningful(input.contactEmail) || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.contactEmail || '')) errors.push('Neplatný e-mail příjemce.');
  if (!meaningful(input.priceSource) || !meaningful(input.priceRevision)) errors.push('Chybí zdroj a revize aktuální kalkulace.');
  if (input.productName && input.canvaExtractedText) {
    const all = String(input.canvaExtractedText);
    if (!all.toLocaleLowerCase('cs').includes(String(input.productName).toLocaleLowerCase('cs'))) {
      errors.push('Obsah Canva kopie neodpovídá vybranému produktu.');
    }
    // Any unreplaced example amount from the source template is unsafe even
    // if it happens to match the latest price by coincidence.
    for (const amount of CANVA_OFFER_MASTER.hardcodedPriceExamples) {
      if (all.includes(amount) && !(input.replacedTemplatePriceElements === true)) {
        errors.push('V dokumentu zůstala původní cena z šablony: ' + amount);
      }
    }
  } else {
    errors.push('Chybí kontrola skutečně vyplněného obsahu Canva kopie.');
  }
  if (input.canvaAutofillClaimed) {
    if (!registeredDesign) errors.push('Původní Brand Template nemá Autofill dataset; nelze tvrdit automatické vyplnění.');
    if (registeredDesign && input.canvaDatasetFieldsVerified !== true) {
      errors.push('Chybí ověření skutečných polí a typů Canva Autofill datasetu.');
    }
  }
  if (!input.hubspotDealVerified) warnings.push('Ověř vazbu na správný HubSpot Deal před archivací.');
  if (!input.googleDriveArchiveVerified) warnings.push('Ulož PDF do potvrzeného firemního Mlžného disku.');
  return {
    readyForGmailDraftWithAttachment: errors.length === 0,
    emailMode: 'draft_only',
    errors: [...new Set(errors)],
    warnings,
  };
}
