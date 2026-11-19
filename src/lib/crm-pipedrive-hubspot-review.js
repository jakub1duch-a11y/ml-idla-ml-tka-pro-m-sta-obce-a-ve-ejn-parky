/**
 * HolmTec + MLŽIDLA.cz: safe, read-only cross-CRM staging.
 *
 * Confirmed 2026-11-19: Pipedrive (Holmtec s.r.o.) is available through
 * ChatGPT, but the Base44 application's OAuth connector catalogue does NOT
 * provide a Pipedrive connector. HubSpot (portal 149778217) remains the
 * source of truth for customer deals and offer approvals.
 *
 * No network requests or mutations are performed by this module.
 * Client records, marketing consents and pricing are deliberately excluded.
 */
export const CRM_BRIDGE_GUARDRAILS = Object.freeze({
  sourceSystem: 'pipedrive',
  sourceCompany: 'Holmtec s.r.o.',
  sourceCurrency: 'CZK',
  sourceTimezone: 'Europe/Prague',
  sourceSalesPipelineId: 2,
  sourceProductionPipelineId: 3,
  sourceDealCategoryFieldKey: '5bebc321af5ac5b7667fd3152e1051c261f033b4',
  targetSystem: 'hubspot',
  targetPortalId: 149778217,
  mlzHubSpotPipelineId: 4351532258,
  // Pipeline for HolmTec must be retrieved explicitly from HubSpot before use.
  holmTecHubSpotPipelineId: null,
  dryRun: true,
  autoCreateContacts: false,
  autoCreateDeals: false,
  autoUpdateDeals: false,
  autoSendEmails: false,
  autoCreateCalendarEvents: false,
  autoSyncGoogleContacts: false,
  allowInternalPartnerPriceInPayload: false,
  ownerApprovalRequired: true,
});

export const PIPEDRIVE_SALES_STAGES = Object.freeze({
  6: 'Deal Added',
  7: 'Contact Made',
  8: 'Intro Meeting',
  9: 'Discovery Meeting',
  10: 'Proposal Sent',
  11: 'Contract Signed',
});

export const PIPEDRIVE_PRODUCTION_STAGES = Object.freeze({
  12: 'Kickoff Meeting',
  13: 'Design',
  14: 'Production Scheduled',
  15: 'In Production',
  16: 'Quality Check',
  17: 'Delivery',
  18: 'Follow-Up',
});

/**
 * Category is a REVIEWED CRM field, not an inferred keyword from arbitrary
 * correspondence. Unrecognized and multiple category values stop sync.
 */
const categories = Object.freeze({
  'mlzidla': ['mlzidla', 'mlžidla', 'mlžitka', 'mlžítka', 'mlžne sochy', 'mlžné sochy', 'mlžne prvky', 'mlžné prvky'],
  'ohybani': ['ohybani trubek a tyci', 'ohýbání trubek a tyčí', 'holmtec ohybani trubek a tyci'],
  'nastroje': ['trny a tvareci nastroje', 'trny a tvářecí nástroje', 'holmtec trny a tvareci nastroje'],
  'pripravky': ['kontrolni pripravky', 'kontrolní přípravky', 'holmtec kontrolni pripravky'],
});
const deaccent = value => String(value ?? '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLowerCase().replace(/[–—\-_/]/g,' ').replace(/\s+/g,' ').trim();

export function classifyPipedriveDealCategory(rawCategory) {
  if (typeof rawCategory !== 'string' || !rawCategory.trim()) {
    return { ok: false, brand: null, service: null, reason: 'Chybí schválený typ obchodní zakázky.' };
  }
  const normalized = deaccent(rawCategory);
  const matches = Object.entries(categories).filter(([, values]) =>
    values.some(value => deaccent(value) === normalized));
  if (matches.length !== 1) {
    return { ok: false, brand: null, service: null, reason: 'Typ obchodní zakázky není jednoznačně přiřazen.' };
  }
  const key = matches[0][0];
  return {
    ok: true,
    brand: key === 'mlzidla' ? 'mlzidla' : 'holmtec',
    service: key,
    reason: null,
  };
}

export function preparePipedriveToHubSpotReview({
  deal,
  confirmedCategory,
  sourceAccountCompany = null,
  hubspotPersonEmail = null,
  existingHubspotDealIds = [],
  sendingEvidence = null,
} = {}) {
  const reasons = [];
  if (!deal || typeof deal !== 'object') {
    return { readyForReview: false, writePermitted: false, reasons: ['Chybí Pipedrive Deal.'] };
  }
  if (sourceAccountCompany !== CRM_BRIDGE_GUARDRAILS.sourceCompany) {
    reasons.push('Zdrojový Pipedrive účet firmy HolmTec nebyl ověřen.');
  }
  const dealId = Number(deal.id);
  if (!Number.isInteger(dealId) || dealId <= 0) {
    reasons.push('Neplatné ID Pipedrive obchodního případu.');
  }
  if (deal.pipeline_id !== CRM_BRIDGE_GUARDRAILS.sourceSalesPipelineId) {
    reasons.push('Zdrojový obchod nepatří do ověřené obchodní pipeline 2.');
  }
  const stageId = Number(deal.stage_id);
  if (!Object.prototype.hasOwnProperty.call(PIPEDRIVE_SALES_STAGES, stageId)) {
    reasons.push('Neznámá fáze Pipedrive Deal.');
  }
  if (typeof deal.title !== 'string' || /^\[sample\]/i.test(deal.title.trim())) {
    reasons.push('Ukázkový či neplatný název nelze synchronizovat jako klientský obchod.');
  }
  if (deal.status === 'deleted' || deal.is_deleted || deal.is_archived) {
    reasons.push('Smazaný/archivovaný obchod nelze převzít.');
  }
  const cat = classifyPipedriveDealCategory(confirmedCategory);
  if (!cat.ok) reasons.push(cat.reason);
  if (!hubspotPersonEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(hubspotPersonEmail)) {
    reasons.push('Chybí ověřený klientský e-mail pro deduplikaci.');
  }
  const duplicateCandidates = Array.isArray(existingHubspotDealIds)
    ? existingHubspotDealIds.filter(id => String(id).trim()) : [];
  if (duplicateCandidates.length) {
    reasons.push('Potenciální duplicita HubSpot obchodu vyžaduje ruční kontrolu.');
  }
  if (stageId === 10 && sendingEvidence?.verifiedSent !== true) {
    reasons.push('Fáze Proposal Sent bez dokladu o odeslání není skutečně odeslanou nabídkou.');
  }
  return {
    readyForReview: reasons.length === 0,
    writePermitted: false, // Never a write; a separate explicitly approved service is required.
    dryRun: true,
    source: dealId > 0 ? { system: 'pipedrive', dealId } : null,
    target: cat.ok ? {
      portalId: CRM_BRIDGE_GUARDRAILS.targetPortalId,
      brand: cat.brand,
      service: cat.service,
      pipelineId: cat.brand === 'mlzidla'
        ? CRM_BRIDGE_GUARDRAILS.mlzHubSpotPipelineId : null,
    } : null,
    draftOnly: true,
    evidenceOfSentRequired: stageId === 10,
    reasons,
  };
}
