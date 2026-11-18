import test from 'node:test';
import assert from 'node:assert/strict';
import { loadProductOfferSheets } from '../base44/shared/productOfferSheetsWorkflow.mjs';
const base44 = { asServiceRole: { connectors: { getConnection: async () => ({ accessToken: 'fake-secret' }) } } };
test('server-side fetch skips partner column I, and builds three prices', async () => {
 const ranges = [];
 const fetcher = async (url, opts) => {
  assert.equal(opts.headers.Authorization,'Bearer fake-secret');
  if (url.includes('userinfo')) return {ok:true,json:async()=>({email:'meduna@holmtec.cz'})};
  const range = decodeURIComponent(url);
  ranges.push(range);
  if (range.includes('A2:H1000')) return {ok:true,json:async()=>({values:[['Produkt','','','','','','','Základní cena'],['BRÁNA 60_2130','Brána','TR60','2100','3000','',7,'45 000 Kč']]})};
  if (range.includes('J2:K1000')) return {ok:true,json:async()=>({values:[['Cena 2','Cena 3'],['85500','120850']]})};
  throw new Error('unexpected URL');
 };
 const [sheet] = await loadProductOfferSheets(base44,['BRÁNA 60_2130'],{},fetcher);
 assert.deepEqual(sheet.prices.map(x=>x.total_ex_vat),[45000,85500,120850]);
 assert.equal(ranges.length,2);
 assert.equal(ranges.some(x=>x.includes('I2:')),false);
 assert.doesNotMatch(JSON.stringify(sheet),/fake-secret|partner/i);
});
test('wrong account prevents any price read', async()=>{
 let called=false;
 await assert.rejects(()=>loadProductOfferSheets(base44,['BRÁNA 60_2130'],{},async()=>({ok:true,json:async()=>({email:'wrong@example.com'})})),/Nesprávný účet/);
 assert.equal(called,false);
});
test('missing price range fails closed',async()=>{
 const fetcher=async(url)=>url.includes('userinfo')?{ok:true,json:async()=>({email:'meduna@holmtec.cz'})}:{ok:false,status:403};
 await assert.rejects(()=>loadProductOfferSheets(base44,['BRÁNA 60_2130'],{},fetcher),/HTTP 403/);
});
