import test from 'node:test';
import assert from 'node:assert/strict';
import { buildProductOfferSheets, parseCzkPrice } from '../base44/shared/productOfferSheets.mjs';
const rows = [
 ['Produkt','Popis','Profil','Výška','Šířka','Hloubka','Trysky','Základní cena','Cena pro partnery','Cena za 2 ks','Cena za 3 ks'],
 ['BRÁNA 60_2130','Brána','TR60,3x2','2100','3000','',7,'45 000 Kč','36000','85500','120850'],
 ['BRÁNA 60_2115','Brána','TR60,3x2','2100','1500','',4,'35 940 Kč','28800','68300','96500'],
];
test('generates independent product sheets with 1/2/3 quantity totals and VAT',()=>{
 const sheets=buildProductOfferSheets(rows,['BRÁNA 60_2130','BRÁNA 60_2115'],{vatRate:0.21});
 assert.equal(sheets.length,2);
 assert.deepEqual(sheets[0].prices.map(p=>p.total_ex_vat),[45000,85500,120850]);
 assert.equal(sheets[0].prices[1].unit_ex_vat,42750);
 assert.equal(sheets[0].prices[2].total_inc_vat,146228.5);
 assert.equal(sheets[0].author,'Ing. Radek Meduna');
 assert.equal(sheets[0].status,'NEEDS_REVIEW');
 assert.doesNotMatch(JSON.stringify(sheets),/36000|28800|partner|marže|náklad/i);
});
test('blocks unknown, duplicate, missing and invalid prices',()=>{
 assert.throws(()=>buildProductOfferSheets(rows,['GATE_60']),/není v katalogu/);
 assert.throws(()=>buildProductOfferSheets(rows,['BRÁNA 60_2130','BRÁNA 60_2130']),/duplicitní/);
 assert.throws(()=>buildProductOfferSheets([['X','','','','','','','', '', '', '']],['X']),/chybějící/);
 assert.throws(()=>parseCzkPrice('CENA K OVĚŘENÍ'),/Neplatná/);
});
test('does not assume VAT without verified rate',()=>{
 const [sheet]=buildProductOfferSheets(rows,['BRÁNA 60_2130']);
 assert.equal('total_inc_vat' in sheet.prices[0],false);
});
