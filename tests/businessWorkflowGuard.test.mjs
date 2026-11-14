import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assertBusinessAccount,
  getVerifiedGoogleAccount,
  getBusinessConnectorStatus,
  resolvePublicCatalogPrice,
  CURRENT_PUBLIC_CATALOG,
} from '../base44/shared/businessWorkflowGuard.mjs';

test('expected trading identity is the only authorized Google account', () => {
  assert.equal(assertBusinessAccount('Meduna@HolmTec.cz', 'googledrive'), 'meduna@holmtec.cz');
  assert.throws(() => assertBusinessAccount('jakub1duch@gmail.com', 'googledrive'), /Nesprávný účet Google Drive/);
  assert.throws(() => assertBusinessAccount('', 'gmail'), /Není ověřena identita Gmail/);
});

test('Google Drive and Gmail OAuth identity is retrieved safely', async () => {
  const fetcher = async (url, options) => {
    assert.match(String(options.headers.Authorization), /^Bearer /);
    if (url.includes('drive/v3/about')) return { ok:true, json: async () => ({ user: { emailAddress:'meduna@holmtec.cz' } }) };
    if (url.includes('gmail/v1/users/me/profile')) return { ok:true, json: async () => ({ emailAddress:'meduna@holmtec.cz' }) };
    if (url.includes('/userinfo')) return { ok:true, json: async () => ({ email:'meduna@holmtec.cz' }) };
    return {ok:false, status:404};
  };
  assert.equal(await getVerifiedGoogleAccount('x_secret', 'googledrive', fetcher), 'meduna@holmtec.cz');
  assert.equal(await getVerifiedGoogleAccount('x_secret', 'gmail', fetcher), 'meduna@holmtec.cz');
  assert.equal(await getVerifiedGoogleAccount('x_secret', 'googlesheets', fetcher), 'meduna@holmtec.cz');
});

test('Google API failure fails closed and never includes OAuth secret in errors', async () => {
  const fetcher = async () => ({ ok: false, status:401 });
  await assert.rejects(() => getVerifiedGoogleAccount('token-do-not-reveal', 'googledrive', fetcher), /Google Drive.+401/);
  try { await getVerifiedGoogleAccount('token-do-not-reveal', 'gmail', fetcher) } catch(error) {
    assert.equal(String(error).includes('token-do-not-reveal'), false);
  }
});

test('connector health blocks wrong account instead of reporting healthy', async () => {
  const base44 = { asServiceRole: { connectors:{getConnection:async () => ({accessToken:'x'})}}};
  const fetcher = async () => ({ok:true,json:async()=>({user:{emailAddress:'jakub1duch@gmail.com'}})});
  const status=await getBusinessConnectorStatus(base44,'googledrive',fetcher);
  assert.equal(status.ready,false);
  assert.equal(status.account,'jakub1duch@gmail.com');
  assert.equal(status.type,'googledrive');
});

test('catalog price is matched exactly and partner/internal columns are excluded', () => {
 const rows=[
  ['AURA 700','','',2200,700,'',5,'26 580 Kč','21 300 Kč',50550],
  ['AURA 900','','',2200,900,'',6,'29 036 Kč','23 250 Kč',55200],
  ['VOLAVKA Gracilis','','',1800,1000,'',7,'67 716 Kč','54 200 Kč',128700],
  ['MRKEV','','',2000,600,'',8,'',''],
 ];
 assert.equal(CURRENT_PUBLIC_CATALOG.id,'1kyxH-ihr6YC5xnu8Ef5X4jbR81VVaJtDO1UVWK5d_S8');
 const found=resolvePublicCatalogPrice(rows,'AURA_700');
 assert.equal(found.price_ex_vat,26580);
 assert.equal(found.needs_review,false);
 assert.equal(JSON.stringify(found).includes('21 300'),false);
 assert.equal(JSON.stringify(found).includes('partner'),false);
 const unavailable=resolvePublicCatalogPrice(rows,'MRKEV');
 assert.equal(unavailable.price_ex_vat,null);
 assert.equal(unavailable.needs_review,true);
 assert.equal(resolvePublicCatalogPrice(rows,'AURA').needs_review,true);
 assert.equal(resolvePublicCatalogPrice(rows,'NEZNÁMÉ').needs_review,true);
});

test('duplicate matching variants fail closed', () => {
 const rows=[['AURA 700','','','','','','','26 580 Kč'],['AURA_700','','','','','','','27 500 Kč']];
 const result=resolvePublicCatalogPrice(rows,'AURA 700');
 assert.equal(result.price_ex_vat,null);
 assert.equal(result.needs_review,true);
});
