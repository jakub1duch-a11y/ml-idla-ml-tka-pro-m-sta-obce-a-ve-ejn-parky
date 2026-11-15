/** Desired MLŽIDLA CRM configuration — NOT applied to the existing HubSpot pipeline.
 * HubSpot portal 149778217, existing pipeline 4351532258 currently has 6 stages.
 * This eight-stage scheme is customer-approved as a target definition,
 * but requires migration, live stage IDs and data safeguards before writes.
 */
export const MLZ_HUBSPOT_TARGET = Object.freeze({
  portalId: 149778217,
  existingPipelineId: '4351532258',
  schemaStatus: 'migration_required_not_applied',
  stages: Object.freeze([
    { key:'new', label:'Nová poptávka (Web / Kalkulačka)', probability:0.10 },
    { key:'qualification', label:'Kvalifikace & Technické zadání', probability:0.20 },
    { key:'design', label:'Návrh řešení & Vizualizace', probability:0.40 },
    { key:'offer_sent', label:'Odeslaná cenová nabídka', probability:0.50 },
    { key:'approval', label:'Schvalování / Veřejná zakázka', probability:0.70 },
    { key:'contract', label:'Objednávka / Smlouva', probability:0.90 },
    { key:'won', label:'Realizace & Instalace (Vyhráno)', probability:1.00 },
    { key:'lost', label:'Ztraceno / Odloženo', probability:0.00 },
  ]),
  requiredDealProperties: Object.freeze({
    client_segment: ['Město / Obec','Architekt / Projektant','Komerční prostor','Koupaliště / Sportoviště','Event / Pronájem','Rezidenční'],
    product_type: ['Mlžná brána','Nerezové mlžítko (Linea / Bendy)','Mlžoviště','Mobilní mlžítko','Úprava vody / Smart ovládání'],
    space_type: ['Náměstí / Ulice','Park / Dětské hřiště','Terasa / Zahrada','Veřejná akce'],
    cooperation_type: ['Prodej na klíč','Pouze dodávka','Krátkodobý pronájem (Event)','Dlouhodobý pronájem'],
  }),
});
const all = (v) => typeof v === 'string' && !!v.trim();
/** Fail closed. Schema labels are not internal HubSpot property keys. */
export function hubspotOfferDealPreflight(deal = {}, config = {}) {
  const blockers = [];
  if (Number(config.portalId) !== MLZ_HUBSPOT_TARGET.portalId) blockers.push('Neověřený HubSpot portál.');
  if (config.pipelineId !== MLZ_HUBSPOT_TARGET.existingPipelineId) blockers.push('Neověřená pipeline.');
  if (!config.eightStageMigrationVerified) blockers.push('Cílová osmifázová pipeline není ověřena jako nasazená.');
  if (!all(config.stageId) || !config.stageIdVerified) blockers.push('Fáze nemá ověřený interní HubSpot stage ID.');
  if (!all(deal.clientName) || !all(deal.sourceId)) blockers.push('Chybí klient či ID poptávky.');
  for (const [property, values] of Object.entries(MLZ_HUBSPOT_TARGET.requiredDealProperties)) {
    if (!values.includes(deal[property])) blockers.push('Neznámá nebo chybějící vlastnost: '+property);
    if (!config.propertyMap?.[property]) blockers.push('Neověřený interní HubSpot název: '+property);
  }
  if (!config.dedupeChecked) blockers.push('Neověřena duplicita kontaktu, firmy a Dealu.');
  if (!config.oauthIdentityVerified) blockers.push('Neověřen OAuth portál přímo v Base44.');
  return { writeAllowed: blockers.length===0, blockers, mode:'draft_only_until_verified' };
}
