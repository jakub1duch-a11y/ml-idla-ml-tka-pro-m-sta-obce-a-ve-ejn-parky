import test from 'node:test';
import assert from 'node:assert/strict';
import { selectApprovedOfferMedia, offerProductPagePlan, OFFER_CANVA_REV3 } from '../base44/shared/offerVisualMasterPolicy.mjs';

test('wrong product or variant never receives another SKU photo', ()=>{
  const assets=[{id:'a1',sku:'AURA 700',variant:'',role:'studio',image_url:'https://cdn.example/aura.jpg',
    approved_master:true,geometry_checked:true,nozzle_count_checked:true,cropping_checked:true}];
  assert.equal(selectApprovedOfferMedia({sku:'BENDY_60',assets}).status,'blocked');
  assert.equal(selectApprovedOfferMedia({sku:'AURA 900',assets}).status,'blocked');
});
test('unapproved AI visualization is never a product MASTER', ()=>{
  const assets=[{id:'a2',sku:'LINEA TR 60',role:'environment',image_url:'https://cdn.example/linea.jpg',
    approved_master:true,geometry_checked:true,nozzle_count_checked:true,cropping_checked:true}];
  assert.equal(selectApprovedOfferMedia({sku:'LINEA TR 60',assets}).image_url,null);
});
test('a single exact approved studio MASTER is displayed without cropping', ()=>{
  const assets=[{id:'x',sku:'BENDY_60',role:'studio',image_url:'https://cdn.example/bendy.jpg',
    approved_master:true,geometry_checked:true,nozzle_count_checked:true,cropping_checked:true}];
  const result=selectApprovedOfferMedia({sku:'BENDY_60',assets});
  assert.equal(result.status,'approved');
  assert.equal(result.crop.fit,'contain');
  assert.equal(result.crop.minimum_subject_visible_fraction,1);
});
test('duplicate approved photos require human selection',()=>{
 const a={sku:'BENDY_60',role:'studio',image_url:'https://cdn.example/a.jpg',
    approved_master:true,geometry_checked:true,nozzle_count_checked:true,cropping_checked:true};
 assert.equal(selectApprovedOfferMedia({sku:'BENDY_60',assets:[a,{...a,image_url:'https://cdn.example/b.jpg'}]}).reason,'ambiguous_master');
});
test('different item counts dynamically repeat product pages and never send',()=>{
 for(const n of [1,2,4]){
  const p=offerProductPagePlan(Array.from({length:n},(_,i)=>({sku:'TEST'+i,quantity:1,unit_price_czk:20000+i,price_verified:true})));
  assert.equal(p.page_count,8+n);
  assert.equal(p.pages.filter(x=>x.startsWith('product:')).length,n);
  assert.equal(p.customer_send_allowed,false);
  assert.equal(p.ready_to_attach_to_deal,false);
 }
});
test('a missing price is labeled clearly and Canva autofill is not misrepresented',()=>{
 const p=offerProductPagePlan([{sku:'TEST',quantity:2}]);
 assert.equal(p.rows[0].unit_price_czk,null);
 assert.equal(p.rows[0].price_display,'K nacenění');
 assert.equal(OFFER_CANVA_REV3.autofill_dataset_verified,false);
});
