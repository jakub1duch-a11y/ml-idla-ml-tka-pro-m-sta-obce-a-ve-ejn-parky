import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CRM_BRIDGE_GUARDRAILS,
  classifyPipedriveDealCategory,
  preparePipedriveToHubSpotReview,
} from '../src/lib/crm-pipedrive-hubspot-review.js';

const base = Object.freeze({
  id: 167, title: 'MLŽIDLA.cz – MRKEV pro město',
  pipeline_id: 2, stage_id: 9, status: 'open', is_archived: false,
});
const verified = {
  deal: base,
  confirmedCategory: 'Mlžidla',
  sourceAccountCompany: 'Holmtec s.r.o.',
  hubspotPersonEmail: 'customer@example.com',
  existingHubspotDealIds: [],
};

test('Pipedrive API staging is always read-only and cannot send customer messages', () => {
  assert.equal(CRM_BRIDGE_GUARDRAILS.autoCreateContacts, false);
  assert.equal(CRM_BRIDGE_GUARDRAILS.autoCreateDeals, false);
  assert.equal(CRM_BRIDGE_GUARDRAILS.autoUpdateDeals, false);
  assert.equal(CRM_BRIDGE_GUARDRAILS.autoSendEmails, false);
  assert.equal(CRM_BRIDGE_GUARDRAILS.autoSyncGoogleContacts, false);
});

test('approved misting product category routes to existing MLŽIDLA HubSpot portal/pipeline only for review', () => {
  const x=preparePipedriveToHubSpotReview(verified);
  assert.equal(x.readyForReview,true);
  assert.equal(x.writePermitted,false);
  assert.equal(x.target.brand,'mlzidla');
  assert.equal(x.target.pipelineId,4351532258);
  assert.equal(x.target.portalId,149778217);
});

test('manufacturing categories stay separate from MLŽIDLA', () => {
  for (const name of ['Ohýbání trubek a tyčí','Trny a tvářecí nástroje','Kontrolní přípravky']) {
    const route=classifyPipedriveDealCategory(name);
    assert.equal(route.ok,true);
    assert.equal(route.brand,'holmtec');
    const x=preparePipedriveToHubSpotReview({...verified,confirmedCategory:name});
    assert.equal(x.target.pipelineId,null); // HolmTec pipeline must be looked up, never invented.
    assert.equal(x.writePermitted,false);
  }
});

test('known Pipedrive sample deals are not synchronized into real CRM', () => {
  const x=preparePipedriveToHubSpotReview({
    ...verified,deal:{id:1,title:'[Sample] Quality Control System Implementation',
    pipeline_id:2,stage_id:9,status:'open'},
  });
  assert.equal(x.readyForReview,false);
  assert.ok(x.reasons.some(reason=>/Ukázkový/.test(reason)));
});

test('proposal stage does not mean the actual email offer was sent', () => {
  const x=preparePipedriveToHubSpotReview({...verified,
    deal:{...base,stage_id:10}});
  assert.equal(x.readyForReview,false);
  assert.ok(x.reasons.some(reason=>/bez dokladu/.test(reason)));
  const withEvidence=preparePipedriveToHubSpotReview({...verified,
    deal:{...base,stage_id:10},sendingEvidence:{verifiedSent:true}});
  assert.equal(withEvidence.readyForReview,true);
});

test('wrong CRM account, missing dedup email, or uncertain category fail closed', () => {
  for (const change of [
    {sourceAccountCompany:'Other company'},
    {hubspotPersonEmail:''},
    {confirmedCategory:'HolmTec nebo MLŽIDLA?'},
    {existingHubspotDealIds:[993]},
  ]) {
    const x=preparePipedriveToHubSpotReview({...verified,...change});
    assert.equal(x.readyForReview,false);
    assert.equal(x.writePermitted,false);
  }
});

test('production pipeline is never auto-converted into a sales deal', () => {
  const x=preparePipedriveToHubSpotReview({...verified,deal:{...base,pipeline_id:3,stage_id:16}});
  assert.equal(x.readyForReview,false);
  assert.equal(x.writePermitted,false);
});

test('unknown, missing or mixed personal contacts stay out of customer sync', () => {
  for(const cat of ['',null,'T-Mobile','Lékař','mlžidla / holmtec']){
    assert.equal(classifyPipedriveDealCategory(cat).ok,false);
  }
});
