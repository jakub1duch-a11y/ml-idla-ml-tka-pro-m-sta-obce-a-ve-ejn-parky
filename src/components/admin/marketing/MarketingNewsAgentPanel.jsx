import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, FileText, Image, Loader2, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const LABEL = { visualization: 'Stories · Instagram → Facebook při aktivním sdílení', realization: 'Realizace · Instagram feed + koncept blogu', product: 'Nový produkt · Instagram feed + koncept blogu' };

export default function MarketingNewsAgentPanel({ onCreated }) {
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  async function scan(create = false) {
    setBusy(create ? 'create' : 'scan');
    setError('');
    try {
      const response = await base44.functions.invoke('scanMarketingNews', {
        dryRun: !create, confirmed: create, days: 14, maxItems: 10
      });
      const data = response?.data || {};
      if (data.error) throw new Error(data.error);
      setResult(data);
      if (create && typeof onCreated === 'function') onCreated();
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Kontrola novinek selhala.');
    } finally { setBusy(''); }
  }

  return <section className="rounded-2xl border border-cyan/20 bg-gradient-to-br from-cyan/[.09] via-white/[.025] to-transparent p-4 sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-cyan"><Sparkles size={16} /><span className="font-mono text-[10px] font-semibold uppercase tracking-[.2em]">Marketingový agent · řízení novinek</span></div>
        <h3 className="mt-2 text-lg font-semibold text-white">Z jedné novinky správný typ obsahu</h3>
        <p className="mt-2 text-sm leading-6 text-white/55">Nová schválená vizualizace znamená pouze Stories. Nová zveřejněná reference nebo nový ověřený produkt znamená příspěvek na Instagram a nepublikovaný profesionální článek do blogu.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => scan(false)} disabled={Boolean(busy)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-white hover:border-cyan/40 disabled:opacity-40">
          {busy === 'scan' ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Zkontrolovat novinky
        </button>
        <button type="button" disabled={Boolean(busy) || !result?.dryRun || !result?.preview?.length}
          onClick={() => { if (window.confirm('Založit pouze koncepty pro zobrazené novinky? Nic se nezveřejní.')) scan(true); }}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-cyan px-4 py-2 text-xs font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-30">
          {busy === 'create' ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />} Vytvořit koncepty
        </button>
      </div>
    </div>
    <div className="mt-4 grid gap-2 sm:grid-cols-3">
      <div className="rounded-xl border border-white/10 bg-black/10 p-3"><p className="flex items-center gap-2 text-xs font-semibold text-white/80"><Image size={14} className="text-cyan"/> Nová vizualizace</p><p className="mt-1 text-xs text-white/40">Schválený render → Stories 9:16. Bez blogu a feedu.</p></div>
      <div className="rounded-xl border border-white/10 bg-black/10 p-3"><p className="flex items-center gap-2 text-xs font-semibold text-white/80"><CheckCircle2 size={14} className="text-cyan"/> Nová reference</p><p className="mt-1 text-xs text-white/40">Publikovaná realizace → feed + návrh článku.</p></div>
      <div className="rounded-xl border border-white/10 bg-black/10 p-3"><p className="flex items-center gap-2 text-xs font-semibold text-white/80"><ShieldCheck size={14} className="text-cyan"/> Nový produkt</p><p className="mt-1 text-xs text-white/40">Ověřená MASTER reference → feed + návrh článku.</p></div>
    </div>
    <p className="mt-3 text-xs leading-5 text-white/45">Canva: převzít schválenou fotografii a vizuální zadání z konceptu, použít Brand Kit Mlžidla.cz, bez vodoznaků a bez změn geometrie produktu. Facebook: využít pouze ověřené křížové sdílení z Instagramu; žádný duplicitní post.</p>
    <p className="mt-2 flex items-center gap-2 text-xs text-amber-200/80"><AlertTriangle size={13}/> Křížové sdílení přes Instagram API není automaticky garantováno nastavením účtů; ověřit testem u každého formátu. Veškerá publikace vyžaduje lidské schválení.</p>
    {error && <p role="alert" className="mt-3 rounded-lg border border-red-300/20 bg-red-500/10 p-3 text-xs text-red-200">{error}</p>}
    {result && <div className="mt-4 rounded-xl border border-white/10 bg-black/15 p-3" aria-live="polite">
      {result.dryRun ? <p className="text-xs font-medium text-white/75">Nalezeno {result.found || 0} novinek za 14 dní. Náhled obsahuje maximálně 10 položek.</p> : <p className="text-xs font-medium text-emerald-300">Vytvořeno {result.created?.length || 0} konceptů. Nezveřejněno nic na sociálních sítích ani na webu.</p>}
      {result.dryRun && (result.preview || []).map(item => <div key={item.key} className="flex items-center gap-3 border-b border-white/5 py-2 last:border-b-0">
        {item.imageUrl ? <img src={item.imageUrl} alt="" className="h-12 w-12 rounded-lg object-cover"/> : <div className="h-12 w-12 rounded-lg bg-white/5" />}
        <div className="min-w-0"><p className="truncate text-xs font-medium text-white/80">{item.title}</p><p className="text-[11px] text-white/40">{LABEL[item.kind] || item.kind}</p></div>
      </div>)}
      {!!result.errors?.length && <p className="mt-2 text-xs text-amber-200">Některé koncepty nebylo možné vytvořit. Zkontrolujte podrobnosti v logu funkce.</p>}
    </div>}
  </section>;
}