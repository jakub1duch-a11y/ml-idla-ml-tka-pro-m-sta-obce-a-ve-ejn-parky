import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, RefreshCw, Save, XCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const num = (value) => Number(value || 0);
const statusLabel = (status) => ({ approved: 'Schváleno', needs_review: 'Ke kontrole', rejected: 'Nepoužít', generated: 'Vygenerováno', draft: 'Koncept' }[status] || status || '—');

export default function OfferVariantTechnicalPanel({ inquiryId, onRegenerate, regenerateBusy = false }) {
  const [variants, setVariants] = useState([]);
  const [visuals, setVisuals] = useState([]);
  const [calculations, setCalculations] = useState([]);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    if (!inquiryId) return;
    setError('');
    try {
      const [v, a, c] = await Promise.all([
        base44.entities.OfferVariant.filter({ inquiry_id: inquiryId }),
        base44.entities.VisualizationAsset.filter({ source_inquiry_id: inquiryId }),
        base44.entities.NozzleCalculation.filter({ inquiry_id: inquiryId }),
      ]);
      setVariants((v || []).sort((x, y) => num(x.sort_order) - num(y.sort_order)));
      setVisuals((a || []).sort((x, y) => num(x.sort_order) - num(y.sort_order)));
      setCalculations(c || []);
    } catch (e) {
      setError(e?.message || 'Varianty se nepodařilo načíst.');
    }
  };

  useEffect(() => { load(); }, [inquiryId]);

  const visualsByKey = useMemo(() => visuals.reduce((map, item) => {
    const key = item.offer_variant_key || 'unassigned';
    (map[key] ||= []).push(item);
    return map;
  }, {}), [visuals]);
  const calcByVariant = useMemo(() => calculations.reduce((map, item) => {
    if (item.offer_variant_id) map[item.offer_variant_id] = item;
    else if (item.variant_key) map[item.variant_key] = item;
    return map;
  }, {}), [calculations]);

  const updateVisual = async (visual, patch) => {
    setBusy(`visual-${visual.id}`); setError('');
    try {
      const updated = await base44.entities.VisualizationAsset.update(visual.id, patch);
      setVisuals((items) => items.map((item) => item.id === visual.id ? { ...item, ...updated, ...patch } : item));
    } catch (e) { setError(e?.message || 'Vizualizaci se nepodařilo upravit.'); }
    finally { setBusy(''); }
  };

  const changeCalc = (variant, field, value) => {
    const existing = calcByVariant[variant.id] || calcByVariant[variant.variant_key] || { inquiry_id: inquiryId, offer_variant_id: variant.id, variant_key: variant.variant_key, product_slug: variant.product_slug, product_name: variant.product_name, product_quantity: variant.quantity, zone_count: 1, calculation_status: 'draft', approved_for_offer: false };
    const next = { ...existing, [field]: value };
    if (field === 'nozzles_per_product' || field === 'product_quantity') next.total_nozzles = num(next.nozzles_per_product) * num(next.product_quantity || variant.quantity);
    if (field === 'flow_per_nozzle_l_min' || field === 'nozzles_per_product' || field === 'product_quantity') next.total_flow_l_min = num(next.flow_per_nozzle_l_min) * num(next.total_nozzles || (num(next.nozzles_per_product) * num(next.product_quantity || variant.quantity)));
    setCalculations((items) => {
      const key = existing.id || `new-${variant.id}`;
      const found = items.some((item) => (item.id || `new-${item.offer_variant_id}`) === key);
      return found ? items.map((item) => (item.id || `new-${item.offer_variant_id}`) === key ? next : item) : [...items, next];
    });
  };

  const saveCalc = async (variant, approve = false) => {
    const calc = calcByVariant[variant.id] || calcByVariant[variant.variant_key];
    if (!calc) return;
    setBusy(`calc-${variant.id}`); setError('');
    try {
      const patch = {
        ...calc,
        product_quantity: num(calc.product_quantity || variant.quantity),
        nozzles_per_product: num(calc.nozzles_per_product),
        total_nozzles: num(calc.nozzles_per_product) * num(calc.product_quantity || variant.quantity),
        total_flow_l_min: num(calc.flow_per_nozzle_l_min) * num(calc.nozzles_per_product) * num(calc.product_quantity || variant.quantity),
        calculation_status: approve ? 'approved' : (calc.calculation_status === 'approved' ? 'reviewed' : 'calculated'),
        approved_for_offer: approve,
      };
      const saved = calc.id ? await base44.entities.NozzleCalculation.update(calc.id, patch) : await base44.entities.NozzleCalculation.create(patch);
      setCalculations((items) => items.map((item) => item === calc || item.id === calc.id ? { ...patch, ...saved } : item));
    } catch (e) { setError(e?.message || 'Výpočet trysek se nepodařilo uložit.'); }
    finally { setBusy(''); }
  };

  if (!variants.length && !visuals.length && !calculations.length) return null;

  return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-secondary">Varianty · vizualizace · trysky</p><h3 className="mt-1 font-heading text-xl text-foreground">Technická kontrola nabídky</h3><p className="mt-1 text-xs text-muted-foreground">Prezentace má používat jen schválené vizualizace a schválený výpočet trysek. Hodnoty trysek se nikdy nedopočítávají AI bez zdrojových dat.</p></div>
      {onRegenerate && <button type="button" onClick={onRegenerate} disabled={regenerateBusy} className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700"><RefreshCw size={14}/>{regenerateBusy ? 'Generuji…' : 'Regenerovat varianty'}</button>}
    </div>
    {error && <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
    <div className="mt-5 space-y-5">{variants.map((variant) => {
      const variantVisuals = visualsByKey[variant.variant_key] || [];
      const calc = calcByVariant[variant.id] || calcByVariant[variant.variant_key] || {};
      return <article key={variant.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><strong className="text-sm text-slate-900">{variant.variant_name}</strong><p className="mt-1 text-xs text-slate-500">{variant.quantity} ks · {variant.product_name} · {variant.variant_key}</p></div><span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold text-slate-600">{statusLabel(variant.status)}</span></div>
        {variantVisuals.length > 0 && <div className="mt-4 grid gap-3 sm:grid-cols-2">{variantVisuals.map((visual) => <div key={visual.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white"><img src={visual.image_url} alt={visual.title} className="h-44 w-full object-cover"/><div className="p-3"><p className="text-xs font-semibold text-slate-700">{visual.title}</p><p className="mt-1 text-[10px] text-slate-500">{visual.quantity} ks · {visual.environment} · {statusLabel(visual.approval_status)}</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" disabled={busy === `visual-${visual.id}`} onClick={() => updateVisual(visual, { approval_status: 'approved', approved_for_presentation: true })} className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-[10px] font-bold text-white"><CheckCircle2 size={12}/>Schválit</button><button type="button" disabled={busy === `visual-${visual.id}`} onClick={() => updateVisual(visual, { approval_status: 'rejected', approved_for_presentation: false })} className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-600"><XCircle size={12}/>Nepoužít</button></div></div></div>)}</div>}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold text-slate-800">Výpočet mlžných trysek</p><p className="mt-1 text-[10px] text-slate-500">Pro tuto variantu · {variant.quantity} ks produktu</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${calc.approved_for_offer ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{calc.approved_for_offer ? 'Schváleno do nabídky' : 'Čeká na kontrolu'}</span></div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-[10px] text-slate-500">Trysek / produkt<input type="number" min="0" value={calc.nozzles_per_product ?? ''} onChange={(e) => changeCalc(variant, 'nozzles_per_product', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"/></label>
            <label className="text-[10px] text-slate-500">Průtok 1 trysky l/min<input type="number" step="0.001" min="0" value={calc.flow_per_nozzle_l_min ?? ''} onChange={(e) => changeCalc(variant, 'flow_per_nozzle_l_min', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"/></label>
            <label className="text-[10px] text-slate-500">Pracovní tlak bar<input type="number" step="0.1" min="0" value={calc.working_pressure_bar ?? ''} onChange={(e) => changeCalc(variant, 'working_pressure_bar', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"/></label>
            <label className="text-[10px] text-slate-500">Dostupný tlak bar<input type="number" step="0.1" min="0" value={calc.available_pressure_bar ?? ''} onChange={(e) => changeCalc(variant, 'available_pressure_bar', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"/></label>
            <label className="text-[10px] text-slate-500">Typ trysky<input value={calc.nozzle_type ?? ''} onChange={(e) => changeCalc(variant, 'nozzle_type', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"/></label>
            <label className="text-[10px] text-slate-500">Průměr přívodu mm<input type="number" min="0" value={calc.supply_pipe_diameter_mm ?? ''} onChange={(e) => changeCalc(variant, 'supply_pipe_diameter_mm', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"/></label>
            <label className="text-[10px] text-slate-500">Počet zón<input type="number" min="1" value={calc.zone_count ?? 1} onChange={(e) => changeCalc(variant, 'zone_count', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"/></label>
            <label className="text-[10px] text-slate-500">Zdrojová tabulka / Sheet URL<input value={calc.source_table_url ?? ''} onChange={(e) => changeCalc(variant, 'source_table_url', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"/></label>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2"><div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">Celkem trysek: <strong className="text-slate-900">{num(calc.nozzles_per_product) * num(calc.product_quantity || variant.quantity)}</strong></div><div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">Celkový průtok: <strong className="text-slate-900">{(num(calc.flow_per_nozzle_l_min) * num(calc.nozzles_per_product) * num(calc.product_quantity || variant.quantity)).toLocaleString('cs-CZ', { maximumFractionDigits: 3 })} l/min</strong></div></div>
          <div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => saveCalc(variant, false)} disabled={busy === `calc-${variant.id}`} className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-2 text-[10px] font-semibold text-slate-700"><Save size={12}/>Uložit výpočet</button><button type="button" onClick={() => saveCalc(variant, true)} disabled={busy === `calc-${variant.id}` || !num(calc.nozzles_per_product)} className="inline-flex items-center gap-1 rounded-full bg-[#0b4860] px-3 py-2 text-[10px] font-bold text-white"><CheckCircle2 size={12}/>Schválit do nabídky</button></div>
        </div>
      </article>;
    })}</div>
  </section>;
}
