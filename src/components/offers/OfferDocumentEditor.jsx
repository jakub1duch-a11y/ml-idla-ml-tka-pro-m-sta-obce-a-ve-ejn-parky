import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Download, ExternalLink, FileText, Loader2, RefreshCw, Sparkles } from 'lucide-react';

const money = (value) => new Intl.NumberFormat('cs-CZ').format(Number(value || 0));

function pdfBlobUrl(base64) {
  if (!base64) return '';
  try {
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    return URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  } catch (_) {
    return '';
  }
}

function DocumentPreview({ content, finalTotal, validUntil, quoteNumber, clientLine, audienceLabel }) {
  return (
    <div className="mx-auto w-full max-w-md overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div className="h-1.5 bg-cyan-400" />
      <div className="flex items-end justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <div className="text-base font-extrabold tracking-wide text-[#0d2d38]">MLŽIDLA® <span className="text-[10px] font-semibold text-slate-400">by HolmTec</span></div>
          <div className="mt-1 text-[9px] uppercase tracking-[.16em] text-cyan-700">Projektový návrh · cenová nabídka</div>
        </div>
        <div className="text-right text-[9px] uppercase tracking-[.12em] text-slate-400">Architektonické mlžení</div>
      </div>
      <div className="px-5 py-5">
        <p className="text-[9px] uppercase tracking-[.14em] text-cyan-700">Název nabídky</p>
        <p className="mt-1 text-sm font-bold text-slate-900">{content.presentation_title || '—'}</p>
        <p className="mt-1 text-[10px] text-slate-400">{clientLine} · {audienceLabel}</p>

        <div className="mt-4">
          <p className="text-[9px] uppercase tracking-[.12em] text-cyan-700">Shrnutí zadání</p>
          <p className="mt-1 whitespace-pre-line text-xs leading-5 text-slate-600">{content.project_goal || '—'}</p>
        </div>

        <div className="mt-4">
          <p className="text-[9px] uppercase tracking-[.12em] text-cyan-700">Koncept řešení</p>
          <p className="mt-1 whitespace-pre-line text-xs leading-5 text-slate-600">{content.solution_summary || '—'}</p>
        </div>

        {Array.isArray(content.benefits) && content.benefits.filter(Boolean).length > 0 && (
          <div className="mt-4">
            <p className="text-[9px] uppercase tracking-[.12em] text-cyan-700">Přínosy</p>
            <ul className="mt-1 space-y-1">
              {content.benefits.filter(Boolean).map((b, i) => (
                <li key={i} className="flex gap-2 text-xs leading-5 text-slate-600"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-400" />{b}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50/60 p-3">
          <p className="text-[9px] uppercase tracking-[.14em] text-cyan-700">Investice</p>
          <p className="mt-1 text-lg font-bold text-[#0d2d38]">{finalTotal > 0 ? `${money(finalTotal)} Kč` : 'dle konfigurace'}</p>
          <p className="text-[10px] text-slate-500">bez DPH · s DPH {money(Math.round(finalTotal * 1.21))} Kč</p>
          <p className="mt-1 text-[10px] text-slate-400">Nabídka {quoteNumber || '—'} · platnost do {validUntil}</p>
        </div>

        <div className="mt-4">
          <p className="text-[9px] uppercase tracking-[.12em] text-cyan-700">Další krok</p>
          <p className="mt-1 whitespace-pre-line text-xs leading-5 text-slate-600">{content.next_step || '—'}</p>
        </div>
      </div>
    </div>
  );
}

export default function OfferDocumentEditor({ prepared, selected, selectedProduct, audiences, busy, onRegenerate, downloadPreparedPdf }) {
  const [content, setContent] = useState(() => ({
    presentation_title: prepared?.clientContent?.presentation_title || `${selectedProduct?.name || ''} — návrh řešení`,
    project_goal: prepared?.clientContent?.project_goal || '',
    solution_summary: prepared?.clientContent?.solution_summary || selectedProduct?.short_description || '',
    benefits: Array.isArray(prepared?.clientContent?.benefits) ? prepared?.clientContent.benefits : [],
    next_step: prepared?.clientContent?.next_step || 'Po odsouhlasení konceptu upřesníme technické návaznosti a finální rozsah realizace.',
  }));
  const [basePrice, setBasePrice] = useState(Number(prepared?.quote?.final_total ? 0 : 0));
  const [priceInput, setPriceInput] = useState(() => {
    const fromPrepared = Number(prepared?.quote?.final_total || 0);
    return fromPrepared > 0 ? fromPrepared : 0;
  });
  const [installation, setInstallation] = useState(0);
  const [audienceVariant, setAudienceVariant] = useState(prepared?.projectOrder?.presentation_variant || 'city_public');
  const [view, setView] = useState('pdf');

  // Sync local state when a new offer is prepared / regenerated.
  useEffect(() => {
    setContent({
      presentation_title: prepared?.clientContent?.presentation_title || `${selectedProduct?.name || ''} — návrh řešení`,
      project_goal: prepared?.clientContent?.project_goal || '',
      solution_summary: prepared?.clientContent?.solution_summary || selectedProduct?.short_description || '',
      benefits: Array.isArray(prepared?.clientContent?.benefits) ? prepared?.clientContent.benefits : [],
      next_step: prepared?.clientContent?.next_step || 'Po odsouhlasení konceptu upřesníme technické návaznosti a finální rozsah realizace.',
    });
    const ft = Number(prepared?.quote?.final_total || 0);
    setPriceInput(ft > 0 ? ft : 0);
    setInstallation(0);
    setAudienceVariant(prepared?.projectOrder?.presentation_variant || 'city_public');
  }, [prepared]);

  const pdfUrl = useMemo(() => pdfBlobUrl(prepared?.quote?.pdf_base64), [prepared?.quote?.pdf_base64]);
  useEffect(() => () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); }, [pdfUrl]);

  const finalTotal = Math.round(Number(priceInput || 0));
  const validUntilText = prepared?.validUntil ? new Date(prepared.validUntil).toLocaleDateString('cs-CZ') : '—';
  const clientLine = [selected?.firma || selected?.company, selected?.name].filter(Boolean).join(' · ') || 'Projekt klienta';
  const audienceLabel = audiences?.find((a) => a.value === audienceVariant)?.label || audienceVariant;

  const update = (field) => (e) => setContent((c) => ({ ...c, [field]: e.target.value }));
  const updateBenefit = (i, value) => setContent((c) => { const next = [...(c.benefits || [])]; next[i] = value; return { ...c, benefits: next }; });
  const addBenefit = () => setContent((c) => ({ ...c, benefits: [...(c.benefits || []), ''] }));
  const removeBenefit = (i) => setContent((c) => ({ ...c, benefits: (c.benefits || []).filter((_, idx) => idx !== i) }));

  const regenerate = () => {
    if (!onRegenerate) return;
    onRegenerate({
      clientContent: { ...content, benefits: (content.benefits || []).map((b) => String(b || '').trim()).filter(Boolean) },
      basePrice: Number(priceInput || 0),
      installation: 0,
      audienceVariant,
    });
  };

  const inputCls = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400';
  const labelCls = 'text-[10px] font-semibold uppercase tracking-wider text-slate-400';

  return (
    <div className="mt-6 rounded-2xl border border-cyan-300 bg-cyan-50/40 p-5 sm:p-6">
      <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        <strong>Nabídka je připravená ke kontrole.</strong> Texty i cenu můžete ručně doladit v editoru vlevo; po úpravě klikněte na „Přegenerovat PDF“. Klientovi se odešle až po vašem schválení dole.
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* EDITOR */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-800">Editor nabídky</p>
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200">{prepared?.quoteNumber || '—'}</span>
          </div>

          <div>
            <label className={labelCls}>Název nabídky</label>
            <input value={content.presentation_title} onChange={update('presentation_title')} className={`${inputCls} mt-1`} />
          </div>

          <div>
            <label className={labelCls}>Shrnutí zadání / projektový cíl</label>
            <textarea value={content.project_goal} onChange={update('project_goal')} rows={4} className={`${inputCls} mt-1 resize-none`} />
          </div>

          <div>
            <label className={labelCls}>Koncept řešení</label>
            <textarea value={content.solution_summary} onChange={update('solution_summary')} rows={4} className={`${inputCls} mt-1 resize-none`} />
          </div>

          <div>
            <label className={labelCls}>Přínosy</label>
            <div className="mt-1 space-y-2">
              {(content.benefits || []).map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={b} onChange={(e) => updateBenefit(i, e.target.value)} className={inputCls} placeholder={`Přínos ${i + 1}`} />
                  <button type="button" onClick={() => removeBenefit(i)} className="shrink-0 rounded-lg border border-slate-200 px-2 py-2 text-[10px] font-semibold text-slate-500 hover:border-rose-300 hover:text-rose-600">×</button>
                </div>
              ))}
              <button type="button" onClick={addBenefit} className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-[11px] font-semibold text-slate-500 hover:border-cyan-400 hover:text-cyan-700">+ Přidat přínos</button>
            </div>
          </div>

          <div>
            <label className={labelCls}>Další krok</label>
            <textarea value={content.next_step} onChange={update('next_step')} rows={2} className={`${inputCls} mt-1 resize-none`} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Cena projektu bez DPH (Kč)</label>
              <input type="number" min="0" value={priceInput} onChange={(e) => setPriceInput(Number(e.target.value) || 0)} className={`${inputCls} mt-1`} />
              <p className="mt-1 text-[10px] text-slate-400">s DPH {money(Math.round(Number(priceInput || 0) * 1.21))} Kč</p>
            </div>
            <div>
              <label className={labelCls}>Typ prezentace</label>
              <select value={audienceVariant} onChange={(e) => setAudienceVariant(e.target.value)} className={`${inputCls} mt-1`}>
                {(audiences || []).map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>
          </div>

          <button type="button" onClick={regenerate} disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-[#0e5b67] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0b4b56] disabled:opacity-50">
            {busy ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />} {busy ? 'Přegeneruji PDF…' : 'Přegenerovat PDF s úpravami'}
          </button>
        </div>

        {/* NÁHLED */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-800">Náhled finálního dokumentu</p>
            <div className="inline-flex rounded-full border border-slate-200 bg-white p-0.5 text-[10px] font-semibold">
              <button type="button" onClick={() => setView('pdf')} className={`rounded-full px-3 py-1 ${view === 'pdf' ? 'bg-[#0e5b67] text-white' : 'text-slate-500'}`}>PDF</button>
              <button type="button" onClick={() => setView('mock')} className={`rounded-full px-3 py-1 ${view === 'mock' ? 'bg-[#0e5b67] text-white' : 'text-slate-500'}`}>Návrh</button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {view === 'pdf' ? (
              pdfUrl ? (
                <iframe title="Náhled PDF nabídky" src={pdfUrl} className="h-[520px] w-full bg-slate-200" />
              ) : (
                <div className="flex h-[520px] flex-col items-center justify-center gap-3 px-6 text-center">
                  <FileText size={28} className="text-slate-400" />
                  <p className="text-sm text-slate-500">PDF zatím není vygenerované.</p>
                  <p className="text-xs text-slate-400">Klikněte na „Přegenerovat PDF s úpravami“.</p>
                </div>
              )
            ) : (
              <div className="max-h-[520px] overflow-y-auto p-4">
                <DocumentPreview content={content} finalTotal={finalTotal} validUntil={validUntilText} quoteNumber={prepared?.quoteNumber} clientLine={clientLine} audienceLabel={audienceLabel} />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {prepared?.quoteDriveUrl ? (
              <a href={prepared.quoteDriveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800"><FileText size={13}/> PDF nabídka <ExternalLink size={12}/></a>
            ) : prepared?.quote?.pdf_base64 ? (
              <button type="button" onClick={downloadPreparedPdf} className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800"><Download size={13}/> Stáhnout PDF</button>
            ) : null}
            {prepared?.presentation?.presentation_url && <a href={prepared.presentation.presentation_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800"><FileText size={13}/> Prezentace <ExternalLink size={12}/></a>}
            {prepared?.presentation?.presentation_pdf_url && <a href={prepared.presentation.presentation_pdf_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800"><FileText size={13}/> PDF prezentace <ExternalLink size={12}/></a>}
          </div>

          {prepared?.variantPricing?.length > 0 && (
            <div className="rounded-xl border border-cyan-100 bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Varianty nacenení</p>
              <div className="mt-2 space-y-2">
                {prepared.variantPricing.map((v, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2">
                    <div><p className="text-xs font-semibold text-slate-800">{v.label}</p><p className="text-[10px] text-slate-500">{v.quantity} ks · {v.unit_price > 0 ? `${money(v.unit_price)} Kč / ks` : 'jednotková cena k doplnění'}</p></div>
                    <strong className="text-sm text-[#0e5b67]">{Number(v.price) > 0 ? `${money(v.price)} Kč bez DPH` : 'K nacenení'}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {prepared?.visualizationUrls?.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {prepared.visualizationUrls.slice(0, 4).map((url) => (
                <div key={url} className="overflow-hidden rounded-lg border border-slate-200"><img src={url} alt="Vizualizace" className="h-24 w-full object-cover" /></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}