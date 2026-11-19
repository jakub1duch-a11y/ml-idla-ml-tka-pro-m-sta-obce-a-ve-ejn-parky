import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MLZ_CANVA_AUTOFILL_TEMPLATES,
  MLZ_CANVA_WORKFLOW_SETTINGS,
  planMlzCanvaPages,
  validateMlzCanvaDataset,
  resolvePublicMlzLinePrice,
  makeMultiModelCanvaData,
  makeOutreachCanvaData,
  inspectRenderedMlzCanvaSummary,
} from '../src/lib/mlz-canva-autofill-registry.js';

test('three target audiences use editable A4 Canva designs, never customer send', () => {
  for (const segment of ['mesta', 'architekti', 'gastro']) {
    const plan = planMlzCanvaPages({ purpose: 'outreach', segment });
    assert.equal(plan.ready, true);
    assert.equal(plan.draftOnly, true);
    assert.equal(MLZ_CANVA_AUTOFILL_TEMPLATES[plan.templateKeys[0]].category, 'outreach');
  }
  assert.equal(MLZ_CANVA_WORKFLOW_SETTINGS.autoCustomerSend, false);
  assert.equal(MLZ_CANVA_WORKFLOW_SETTINGS.humanApprovalRequired, true);
});

test('the correct multi-product summary is chosen before autofill', () => {
  assert.deepEqual(planMlzCanvaPages({products:[{}, {}]}).templateKeys, ['quote_duo','product_photos']);
  assert.deepEqual(planMlzCanvaPages({products:[{}, {}, {}]}).templateKeys, ['quote_trio','product_photos']);
  const plan = planMlzCanvaPages({products:[{}, {}, {}, {}]});
  assert.equal(plan.photoSheetCopies, 4);
  assert.deepEqual(plan.templateKeys, ['quote_4models','product_photos']);
  assert.equal(planMlzCanvaPages({products:[{}, {}, {}, {}, {}]}).ready, false);
});

test('verified 2/3 unit pricing is taken from J/K totals; partner I never exposed', () => {
  const row = ['BENDY_60','', '', '', '', '', '3', '21 720 Kč', 'DO_NOT_EXPORT', '41 300 Kč', '58 350 Kč'];
  assert.deepEqual(resolvePublicMlzLinePrice({
    row,sku:'BENDY_60',quantity:2,accountVerified:true,sourceVerified:true,sourceRevision:'approved-2026',
  }),{
    ready:true,sku:'BENDY_60',quantity:2,unitPriceExVatCzk:21720,lineTotalExVatCzk:41300,
    priceSource:'Kalkulace mlžítka 2026 / 💧 Katalog produktů 2026',
    priceRevision:'approved-2026',vatBasis:'bez DPH',priceVerified:true,
  });
  assert.equal(resolvePublicMlzLinePrice({
    row,sku:'BENDY_60',quantity:3,accountVerified:true,sourceVerified:true,sourceRevision:'rev'
  }).lineTotalExVatCzk, 58350);
  assert.doesNotMatch(JSON.stringify(resolvePublicMlzLinePrice({
    row,sku:'BENDY_60',quantity:1,accountVerified:true,sourceVerified:true,sourceRevision:'rev'
  })), /DO_NOT_EXPORT/);
});

test('untrusted sources and ambiguous product variants are rejected', () => {
  const row = ['BENDY_60','','','','','','','21 720 Kč','','41 300 Kč','58 350 Kč'];
  assert.equal(resolvePublicMlzLinePrice({row,sku:'BENDY_60',quantity:1}).ready, false);
  assert.equal(resolvePublicMlzLinePrice({row,sku:'BENDY_76',quantity:1,
    accountVerified:true,sourceVerified:true,sourceRevision:'rev'}).ready,false);
  assert.equal(resolvePublicMlzLinePrice({row,sku:'BENDY_60',quantity:4,
    accountVerified:true,sourceVerified:true,sourceRevision:'rev'}).ready,false);
});

test('all multi-sheet values match the actual field types and do not contain partner pricing', () => {
  const products = [1,2,3].map(n => ({
    productName: 'BENDY',productVariant:'BENDY_60',quantity:n,
    unitPriceExVatCzk:21720,lineTotalExVatCzk:n===1?21720:n===2?41300:58350,
    priceVerified:true,masterVerified:true,priceSource:'live',priceRevision:'2026',
    canvaAssetId:'A_CANVA_IMAGE_'+n,
  }));
  const values=makeMultiModelCanvaData({templateKey:'quote_trio',products});
  const schema=MLZ_CANVA_AUTOFILL_TEMPLATES.quote_trio.fields;
  assert.deepEqual(Object.keys(values).sort(), Object.keys(schema).sort());
  assert.deepEqual(Object.entries(values).map(([key,obj])=>[key,obj.type]).sort(),
    Object.entries(schema).sort());
  assert.match(values.products_total_czk.text, /bez DPH/);
  assert.match(values.product_2_line_total_czk.text, /41\s?300 Kč/);
});

test('no image or price is filled without exact verified source and MASTER', () => {
  assert.throws(()=>makeMultiModelCanvaData({
    templateKey:'quote_duo',
    products:[{productName:'AURA 700', quantity:1, priceVerified:false, canvaAssetId:'fabricated'},{}],
  }),/Nevyřešená cena/);
});

test('outreach values must provide all 11 text fields and the approved image asset', () => {
  const fields={};
  for(const [name,type] of Object.entries(MLZ_CANVA_AUTOFILL_TEMPLATES.outreach_mesta.fields)){
    if(type==='text')fields[name]='Ověřený text pro '+name;
  }
  const values=makeOutreachCanvaData({templateKey:'outreach_mesta',fields,canvaAssetId:'MAHbIIKTsn4'});
  assert.equal(values.hero_image.asset_id,'MAHbIIKTsn4');
  assert.equal(Object.keys(values).length,12);
});

test('dataset validation detects incorrect Canva field types without inventing a fix', () => {
  const schema=MLZ_CANVA_AUTOFILL_TEMPLATES.product_photos.fields;
  const observed=Object.fromEntries(Object.entries(schema).map(([k,type])=>[k,{type}]));
  observed.main_image_type={type:'image'}; // Known Canva decorative-shape anomaly.
  assert.equal(validateMlzCanvaDataset('product_photos',observed).valid,true);
  observed.environment_image={type:'text'};
  assert.equal(validateMlzCanvaDataset('product_photos',observed).valid,false);
});

test('Canva DUO rendered text catches old unfillable static text and price', () => {
  const result = inspectRenderedMlzCanvaSummary({
    renderedText: [
      'INTERNÍ TEST · AURA 700',
      'KATALOG / LINEA TR 60',
      '26 580 Kč bez DPH',
      'INTERNÍ TEST · LINEA TR 60',
      'KATALOG / BENDY_60',
      '20 940 Kč bez DPH',
      '17 900 Kč',
      'bez DPH',
      'OD',
    ].join('\n'),
    expectedProducts: [
      {productName:'AURA 700',productVariant:'AURA 700',priceVerified:true,unitPriceExVatCzk:26580,lineTotalExVatCzk:26580},
      {productName:'LINEA TR 60',productVariant:'LINEA TR 60',priceVerified:true,unitPriceExVatCzk:20940,lineTotalExVatCzk:20940},
    ],
  });
  assert.equal(result.safeForCustomer,false);
  assert.ok(result.blockers.some(x=>x.includes('17 900')));
  assert.ok(result.blockers.some(x=>x.includes('BENDY_60')));
  assert.ok(result.blockers.some(x=>x.includes('OD')));
});

test('even clean rendered data requires a visual/PDF human QA sign-off', () => {
  const result=inspectRenderedMlzCanvaSummary({
    renderedText:'AURA 700\n26 580 Kč\n26 580 Kč bez DPH',
    expectedProducts:[{
      productName:'AURA 700',productVariant:'AURA 700',
      unitPriceExVatCzk:26580,lineTotalExVatCzk:26580,priceVerified:true,
    }],
  });
  assert.equal(result.blockers.length,0);
  assert.equal(result.safeForCustomer,false);
  assert.equal(result.reviewRequired,true);
});
