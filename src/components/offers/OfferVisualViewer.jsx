import React, { useEffect, useMemo, useState } from 'react';
import { Edit3, Send, Download, Printer, ChevronLeft, ChevronRight, Shield, Loader2, Sparkles, LayoutGrid, Square, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import OfferSendDialog from './OfferSendDialog';
import { CoverPage, SolutionPage, TechPage } from './OfferPagesA';
import { PlacementPage, SmartPage, PricePage, DarkHeroPage, PhotoHeroPage, RecapPage } from './OfferPagesB';
import './offerPages.css';

const PAGES = [
  ['Titulní strana', CoverPage], ['Řešení', SolutionPage], ['Technické informace', TechPage],
  ['Návrh umístění', PlacementPage], ['Automatizace / SUPLA', SmartPage], ['Cenová nabídka', PricePage],
  ['Produkt', DarkHeroPage], ['Vizualizace', PhotoHeroPage], ['Rekapitulace a podmínky', RecapPage],
];

export default function OfferVisualViewer({ prepared, selected, selectedProduct, onRegenerate, onSend, busy }) {
  const [page, setPage] = useState(0);
  const [mode, setMode] = useState('single');
  const [editing, setEditing] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [lines, setLines] = useState([]);
  const [sceneAssets, setSceneAssets] = useState([]);
  const [content, setContent] = useState(() => ({
    presentation_title: prepared?.clientContent?.presentation_title || '',
    project_goal: prepared?.clientContent?.project_goal || '',
    solution_summary: prepared?.clientContent?.solution_summary || '',
    benefits: Array.isArray(prepared?.clientContent?.benefits) ? prepared.clientContent.benefits : [],
    next_step: prepared?.clientContent?.next_step || '',
  }));

  const orderId = prepared?.projectOrder?.id;
  useEffect(() => {
    if (!orderId) return;
    base44.entities.OfferVariant.filter({ project_order_id: orderId }, { sort: 'sort_order', limit: 1 })
      .then((r) => setLines((r?.items || r || [])[0]?.line_items || [])).catch(() => setLines([]));
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;
    base44.entities.OfferAsset.filter({ project_order_id: orderId, asset_type: 'generated_visualization', file_name: { $regex: 'scene-' } }, { sort: '-created_date', limit: 5 }).then(({ items }) => setSceneAssets(items.reverse().map(a => ({ url: a.file_url, title: a.title, caption: a.description }))));
  }, [orderId, prepared?.quote]);

  const ctx = useMemo(() => {
    const product = selectedProduct || null;
    const productName = product?.name || prepared?.projectOrder?.product_name || 'Mlžítko';
    const scenes = prepared?.quote?.scenes?.length ? prepared.quote.scenes : sceneAssets;
    const viz = scenes.length ? scenes.map(s => s.url) : prepared?.visualizationUrls || [];
    const gallery = [product?.image_url, ...(product?.gallery_urls || [])].filter(Boolean);
    const total = Number(prepared?.projectOrder?.total_price || prepared?.quote?.final_total || 0);
    const clientName = selected?.name || selected?.jmeno || '—';
    const clientCompany = selected?.firma || selected?.company || '';
    return {
      product, productName, viz, gallery, total, clientName, clientCompany, scenes,
      sourcePhotos: selected?.attachment_urls || [], suplaPrice: prepared?.quote?.smart_pricing?.complete_supla_ex_vat || 0,
      forWhom: clientCompany || clientName,
      pick: (i) => viz[i] || viz[0] || gallery[0] || '',
      benefits: content.benefits.filter(Boolean), goal: content.project_goal, solution: content.solution_summary,
      lines: prepared?.quote?.lines?.length ? prepared.quote.lines : lines.length ? lines : [{ label: productName, quantity: 1, unit: 'ks', total }],
      smart: prepared?.projectOrder?.smart_control_included !== false,
      quoteNumber: prepared?.quoteNumber,
      validUntil: prepared?.validUntil ? new Date(prepared.validUntil).toLocaleDateString('cs-CZ') : '—',
      today: new Date().toLocaleDateString('cs-CZ'),
    };
  }, [prepared, selected, selectedProduct, content, lines, sceneAssets]);

  const visible = PAGES;
  const safePage = Math.min(page, visible.length - 1);
  const set = (f) => (e) => setContent((c) => ({ ...c, [f]: e.target.value }));
  const regenerate = () => { onRegenerate?.({ clientContent: { ...content, benefits: content.benefits.filter(Boolean) } }); setEditing(false); };
  const print = () => { setMode('all'); setTimeout(() => window.print(), 400); };

  const downloadPdf = () => {
    if (!prepared?.quote?.pdf_base64) return;
    const bytes = Uint8Array.from(atob(prepared.quote.pdf_base64), (ch) => ch.charCodeAt(0));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    a.download = `${prepared.quoteNumber || 'nabidka'}.pdf`;
    a.click();
  };

  const btn = 'inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40';
  const inp = 'mt-1 w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm text-slate-800';

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
      <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
        <Shield size={16} className="mt-0.5 shrink-0" />
        <span><b>Bezpečnostní brána:</b> nabídka je koncept a nikdy se neodesílá automaticky. Odeslání probíhá až po vašem ručním potvrzení.</span>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Nabídka {prepared?.quoteNumber || ''} · {prepared?.quote?.page_count || (visible.length + Math.max(0, Math.ceil(ctx.viz.length / 2) - 1))} stran A4</span>
        <div className="ml-auto flex gap-2">
          <button onClick={() => setMode(mode === 'single' ? 'all' : 'single')} className={btn}>{mode === 'single' ? <><LayoutGrid size={14} /> Všechny strany</> : <><Square size={14} /> Listovat</>}</button>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setEditing(!editing)} className={btn}><Edit3 size={14} /> {editing ? 'Zavřít úpravy' : 'Upravit nabídku'}</button>
        <button onClick={print} className={btn}><Printer size={14} /> Tisk / uložit jako PDF</button>
        <button onClick={downloadPdf} disabled={!prepared?.quote?.pdf_base64} className={btn}><Download size={14} /> Stáhnout PDF</button>
        {prepared?.quoteDriveUrl && <a href={prepared.quoteDriveUrl} target="_blank" rel="noreferrer" className={btn}><FileText size={14} /> PDF na disku</a>}
        <button onClick={() => setSendOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-[#4f6b2e] px-5 py-2.5 text-xs font-bold text-white hover:opacity-90"><Send size={14} /> Odeslat klientovi</button>
      </div>

      {editing && (
        <div className="mb-5 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <label className="text-xs font-semibold text-slate-500">Shrnutí zadání<textarea rows={3} value={content.project_goal} onChange={set('project_goal')} className={inp} /></label>
          <label className="text-xs font-semibold text-slate-500">Koncept řešení<textarea rows={3} value={content.solution_summary} onChange={set('solution_summary')} className={inp} /></label>
          <label className="text-xs font-semibold text-slate-500">Přínosy (jeden na řádek, max. 5)
            <textarea rows={5} value={content.benefits.join('\n')} onChange={(e) => setContent((c) => ({ ...c, benefits: e.target.value.split('\n') }))} className={inp} />
          </label>
          <button onClick={regenerate} disabled={busy} className="inline-flex w-fit items-center gap-2 rounded-full bg-[#4f6b2e] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50">
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Uložit a přegenerovat PDF
          </button>
        </div>
      )}

      {mode === 'single' && (
        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => setPage(Math.max(0, safePage - 1))} disabled={safePage === 0} className={btn}><ChevronLeft size={14} /> Předchozí</button>
          <span className="text-xs font-semibold text-slate-600">{visible[safePage][0]} · {safePage + 1}/{visible.length}</span>
          <button onClick={() => setPage(Math.min(visible.length - 1, safePage + 1))} disabled={safePage === visible.length - 1} className={btn}>Další <ChevronRight size={14} /></button>
        </div>
      )}

      <div className="offer-print-root mx-auto max-w-[794px] space-y-6">
        {(mode === 'all' ? visible : [visible[safePage]]).map(([label, Page]) => (
          <div key={label} className="overflow-hidden rounded-lg border border-slate-200 shadow-md"><Page c={ctx} /></div>
        ))}
      </div>

      <OfferSendDialog
        key={sendOpen ? 'open' : 'closed'} open={sendOpen} onClose={() => setSendOpen(false)} prepared={prepared}
        clientName={ctx.clientName} clientEmail={selected?.email} productName={ctx.productName} validUntil={ctx.validUntil} onSent={onSend}
      />
    </div>
  );
}