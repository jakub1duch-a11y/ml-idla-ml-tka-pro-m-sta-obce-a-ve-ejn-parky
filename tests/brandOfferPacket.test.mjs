import test from 'node:test';
import assert from 'node:assert/strict';
import { createBrandOfferPacket } from '../base44/shared/brandOfferPacket.mjs';

const product = {
  id: 'product-1',
  name: 'MLŽÍTKO AURA GARDEN',
  slug: 'aura-mlzitko',
  visual_master_verified: true,
  visual_master_reference_url: 'https://media.base44.com/images/aura-original.jpg',
  variants: [
    { name: 'AURA 700', profile: 'TR42x2', dimensions: '2200 × 700', nozzles: '5', price_ex_vat: 26580 },
    { name: 'AURA 900', profile: 'TR42x2', dimensions: '2200 × 900', nozzles: '6', price_ex_vat: 29036 },
  ],
  partner_price: 21300,
  internal_cost: 11565
};

const verifiedPrice = { variant: 'AURA 700', price_ex_vat: 26580, needs_review: false, source: 'current-sheets-public' };

test('packet uses exact variant, public price, verified master and mandatory SUPLA sheet', () => {
  const packet = createBrandOfferPacket({ product, variant: 'AURA 700', price: verifiedPrice });
  assert.equal(packet.ready_for_canva, true);
  assert.equal(packet.product.variant, 'AURA 700');
  assert.equal(packet.product.price_ex_vat, 26580);
  assert.equal(packet.product.image_url, product.visual_master_reference_url);
  assert.equal(packet.supla.required_sheet, true);
  assert.equal(packet.supla.price_ex_vat, null);
  assert.equal(packet.supla.shaft_switchboard_required_to_define, true);
  assert.equal(packet.workflow.email_mode, 'draft_only');
  assert.equal(packet.workflow.publish_allowed, false);
  assert.equal(JSON.stringify(packet).includes('21300'), false);
  assert.equal(JSON.stringify(packet).includes('11565'), false);
});

test('unverified master blocks Canva and never falls back to gallery image', () => {
  const packet = createBrandOfferPacket({
    product: {...product, visual_master_verified:false, visual_master_reference_url:'', image_url:'https://example.com/ai.jpg'},
    variant: 'AURA 700', price: verifiedPrice
  });
  assert.equal(packet.ready_for_canva, false);
  assert.equal(packet.product.image_url, null);
  assert.ok(packet.blockers.some(x => /MASTER/.test(x)));
});

test('unverified or stale price blocks Canva instead of using old Product.variants price', () => {
  const packet = createBrandOfferPacket({
    product, variant: 'AURA 700',
    price: { variant:'AURA 700', price_ex_vat:null, needs_review:true, source:'current-sheets-public' }
  });
  assert.equal(packet.ready_for_canva, false);
  assert.equal(packet.product.price_ex_vat, null);
});

test('ambiguous or unknown product variant blocks output even if price object exists', () => {
  const packet = createBrandOfferPacket({ product, variant: 'AURA', price:{...verifiedPrice,variant:'AURA'} });
  assert.equal(packet.ready_for_canva, false);
  assert.equal(packet.product.price_ex_vat, null);
  assert.equal(packet.product.image_url, null);
});

test('different priced variant cannot be silently substituted', () => {
  const packet = createBrandOfferPacket({ product, variant: 'AURA 900', price:verifiedPrice });
  assert.equal(packet.ready_for_canva, false);
  assert.equal(packet.product.price_ex_vat, null);
});
