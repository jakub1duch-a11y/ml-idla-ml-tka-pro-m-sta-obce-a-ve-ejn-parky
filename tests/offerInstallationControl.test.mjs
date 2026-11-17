import test from 'node:test';
import assert from 'node:assert/strict';
import { buildOfferInstallationControlSummary } from '../base44/shared/offerInstallationControl.mjs';

test('product offer gives basic timer and app options without treating either as included', () => {
  const summary = buildOfferInstallationControlSummary({ product: { use_cases: ['Zahradní terasy', 'Gastro', 'Parky'] } });
  assert.equal(summary.control_modes.length, 2);
  assert.equal(summary.control_modes[0].id, 'without_app');
  assert.equal(summary.control_modes[0].included_in_base_price, false);
  assert.equal(summary.control_modes[0].price_ex_vat, null);
  assert.equal(summary.control_modes[1].id, 'supla_app');
  assert.equal(summary.control_modes[1].price_ex_vat, null);
  assert.equal(summary.placement.recommended_distance_m, null);
  assert.equal(summary.placement.dry_ground_guaranteed, false);
  assert.match(summary.placement.description, /stoly nebo lavičky/);
  assert.equal(summary.visual_policy.no_geometry_changes, true);
  assert.deepEqual(summary.placement.use_cases, ['Zahradní terasy','Gastro','Parky']);
});

test('SUPLA price is exposed only when positive finite live value supplied', () => {
  assert.equal(buildOfferInstallationControlSummary({supla:{standard_price_ex_vat: 29639}}).control_modes[1].price_ex_vat,29639);
  assert.equal(buildOfferInstallationControlSummary({supla:{standard_price_ex_vat: 29639}}).control_modes[1].price_status,'verified_current_supla_sheet');
  for(const value of [null,undefined,0,-1,'29639',Infinity,NaN]){
    const mode=buildOfferInstallationControlSummary({supla:{standard_price_ex_vat:value}}).control_modes[1];
    assert.equal(mode.price_ex_vat,null);
    assert.equal(mode.price_status,'requires_current_quote');
  }
});

test('never inherits internal product prices or false use-case metadata', () => {
  const summary=buildOfferInstallationControlSummary({ product:{partner_price:1200, internal_cost:500, visual_allowed_environments:['gastro'], use_cases:null} });
  assert.equal(JSON.stringify(summary).includes('1200'),false);
  assert.equal(JSON.stringify(summary).includes('500'),false);
  assert.equal(JSON.stringify(summary).includes('gastro'),false);
  assert.deepEqual(summary.placement.use_cases,[]);
});
