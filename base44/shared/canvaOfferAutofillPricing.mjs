// MLŽIDLA.cz / read-only pricing contract for Canva. Prices MUST be obtained from live
// Kalkulace mlžítka 2026 via pricingSheet.ts; never from embedded fixture, AI or Product.price_from.
export const CANVA_MULTI_A4 = Object.freeze({
  2: { design_id: 'DAHbICZZIgU', edit_url: 'https://www.canva.com/d/3xpBqPwv8_V_MGK', layout: 'duo' },
  3: { design_id: 'DAHbINIjpZM', edit_url: 'https://www.canva.com/d/9yanxAMnQXWHglQ', layout: 'trio' },
  4: { design_id: 'DAHbIO0bjWQ', edit_url: 'https://www.canva.com/d/ZqgIUigI8CW1X00', layout: 'kombinace' }
});
export const PRICING_FILE_ID = '1kyxH-ihr6YC5xnu8Ef5X4jbR81VVaJtDO1UVWK5d_S8';
const fmt = (value) => Number(value).toLocaleString('cs-CZ', { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' Kč';
const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toUpperCase();

export async function buildLiveCalculatedOffer(items, priceLookup) {
  if (!Array.isArray(items) || items.length < 1 || items.length > 4)
    throw new Error('one_to_four_products_required');
  if (typeof priceLookup !== 'function') throw new Error('live_pricing_lookup_required');
  const rows=[];
  for(const [index,item] of items.entries()){
    const sku=String(item?.sku||'').trim();
    const qty=Number(item?.quantity);
    if(!sku || !Number.isSafeInteger(qty) || qty<1 || qty>500)
      throw new Error('sku_and_positive_integer_quantity_required');
    if(items.findIndex(x => normalize(x?.sku) === normalize(sku))!==index)
      throw new Error('duplicate_sku_requires_aggregation');
    // priceLookup MUST fail closed on missing/ambiguous catalog SKU, unavailable Sheets or price.
    const p=await priceLookup(sku);
    if(!p || p.matched!==true || !(Number(p.base_unit_czk)>0) || p.canonical_sku && normalize(p.canonical_sku)!==normalize(sku))
      throw new Error('verified_price_unavailable:'+sku);
    const base=Number(p.base_unit_czk);
    const volume=qty===2?Number(p.volume_2_czk):qty===3?Number(p.volume_3_czk):0;
    const volumeUsed=Number.isFinite(volume) && volume>0;
    const line=volumeUsed?volume:base*qty;
    if(!(line>0) || !Number.isFinite(line))throw new Error('invalid_calculated_price:'+sku);
    // Qty 2-3: volumes in columns J/K are TOTAL prices, not per-unit prices.
    rows.push({sku,quantity:qty,base_unit_czk:base,effective_unit_czk:line/qty,line_total_czk:line,
      source:volumeUsed?(qty===2?'catalog_volume_J':'catalog_volume_K'):'catalog_base_H',
      price_source_ref:p.source||'',price_verified:true,
      image_approved:item?.approved_media?.status==='approved',image_asset_id:item?.approved_media?.canva_asset_id||null});
  }
  const total=rows.reduce((sum,row)=>sum+row.line_total_czk,0);
  if(!(total>0)||!Number.isFinite(total))throw new Error('invalid_total');
  const template=CANVA_MULTI_A4[rows.length]||null;
  const data={};
  rows.forEach((row,i)=>{
    const n=i+1;
    Object.assign(data,{
      [`product_${n}_name`]:{type:'text',text:row.sku},
      [`product_${n}_qty`]:{type:'text',text:`${row.quantity} ks`},
      [`product_${n}_unit_czk`]:{type:'text',text:fmt(row.effective_unit_czk)},
      [`product_${n}_line_total_czk`]:{type:'text',text:fmt(row.line_total_czk)}
    });
    if(row.image_approved&&row.image_asset_id)
      data[`product_${n}_image`]={type:'image',asset_id:row.image_asset_id};
  });
  data.products_total_czk={type:'text',text:fmt(total)};
  return {mode:'internal_draft_only',currency:'CZK',tax_basis:'without_vat',source_file:PRICING_FILE_ID,
    rows,total_czk_without_vat:total,canva_template:template,canva_data:data,
    installation_included:false,installation_quoted:false,
    supla_included:false,supla_note:'SUPLA PRO pro chytrá města od 29 800 Kč bez DPH; konkrétní konfiguraci kalkulovat samostatně.',
    template_note:template?null:'Single product uses verified separate A4 master, not multi-product template.',
    blocking_checks:[...rows.filter(x=>!x.image_approved).map(x=>'unapproved_media:'+x.sku),
      ...(template?[]:['missing_multi_template_for_one_product'])],
    ready_to_send:false,crm_write_executed:false,email_mode:'DRAFT_ONLY' };
}
