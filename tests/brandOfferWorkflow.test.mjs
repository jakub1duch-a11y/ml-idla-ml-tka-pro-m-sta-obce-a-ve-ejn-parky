import test from 'node:test';
import assert from 'node:assert/strict';
import { loadVerifiedBrandOfferPacket } from '../base44/shared/brandOfferWorkflow.mjs';

const product = {
  id:'P1', slug:'aura-mlzitko', name:'AURA',
  visual_master_verified:true,
  visual_master_reference_url:'https://media.base44.com/images/other-variant.jpg',
  partner_price:21300, internal_cost:11565,
  variants:[
    {name:'AURA 700',profile:'TR42x2',dimensions:'2200 x 700',nozzles:'5',
      visual_master_verified:true,visual_master_reference_url:'https://media.base44.com/images/aura700-original.jpg'},
    {name:'AURA 900',profile:'TR42x2',dimensions:'2200 x 900',nozzles:'6'}
  ]
};
const makeBase44 = () => ({
  asServiceRole:{
    connectors:{getConnection: async (type)=> {assert.equal(type,'googlesheets'); return {accessToken:'secret-private'};}},
    entities:{Product:{get:async(id)=>{assert.equal(id,'P1');return product;}}}
  }
});
test('verified workflow reads only A:H from public 2026 sheet and produces Canva draft packet',async()=>{
  let sheetsCalls=0;
  const fetcher = async (url,options)=>{
    assert.equal(options.headers.Authorization,'Bearer secret-private');
    if(url.includes('userinfo'))return {ok:true,json:async()=>({email:'meduna@holmtec.cz'})};
    if(url.includes('sheets.googleapis.com')){
      sheetsCalls++;
      assert.match(decodeURIComponent(url),/Katalog produktů 2026/);
      assert.match(decodeURIComponent(url),/A3:H80/);
      assert.doesNotMatch(decodeURIComponent(url),/I3:|AJ/);
      return {ok:true,json:async()=>({values:[['AURA 700','','',2200,700,'',5,'26 580 Kč'],['AURA 900','','',2200,900,'',6,'29 036 Kč']]})};
    }
    throw Error('Unexpected URL');
  };
  const packet=await loadVerifiedBrandOfferPacket(makeBase44(),{productId:'P1',variant:'AURA 700'},fetcher);
  assert.equal(sheetsCalls,1);
  assert.equal(packet.ready_for_canva,true);
  assert.equal(packet.product.price_ex_vat,26580);
  assert.equal(packet.product.price_source.includes('1kyxH-ihr6YC5xnu8Ef5X4jbR81VVaJtDO1UVWK5d_S8'),true);
  assert.equal(JSON.stringify(packet).includes('secret-private'),false);
  assert.equal(JSON.stringify(packet).includes('11565'),false);
  assert.equal(JSON.stringify(packet).includes('21300'),false);
});
test('wrong Base44 Sheets account aborts before product read or sheet read',async()=>{
  let productCalled=false,sheetCalled=false;
  const b=makeBase44(); b.asServiceRole.entities.Product.get=async()=>{productCalled=true;return product;};
  const fetcher=async(url)=>{
    if(url.includes('userinfo'))return {ok:true,json:async()=>({email:'jakub1duch@gmail.com'})};
    sheetCalled=true;throw Error('Should not access pricing');
  };
  await assert.rejects(()=>loadVerifiedBrandOfferPacket(b,{productId:'P1',variant:'AURA 700'},fetcher),/Nesprávný účet/);
  assert.equal(sheetCalled,false);
  assert.equal(productCalled,false);
});
test('Sheets outage prevents stale fallback and does not return a fabricated price',async()=>{
  const fetcher=async(url)=>url.includes('userinfo')?
    {ok:true,json:async()=>({email:'meduna@holmtec.cz'})}:
    {ok:false,status:403};
  await assert.rejects(()=>loadVerifiedBrandOfferPacket(makeBase44(),{productId:'P1',variant:'AURA 700'},fetcher),/Google Sheets API HTTP 403/);
});