import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ClipboardCheck, ExternalLink, Loader2, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const INPUT = 'w-full rounded-xl border border-white/15 bg-[#101923] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan/50';

export default function BrandOfferPreflight({ products = [] }) {
  const candidates = useMemo(() => products.filter((p) => p?.id && p?.variants?.length), [products]);
  const [productId, setProductId] = useState('');
  const [variant, setVariant] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const product = candidates.find((p) => p.id === productId);
  const variants = product?.variants || [];

  const selectProduct = (id) => { setProductId(id); setVariant(''); setResult(null); setError(''); };
  const verify = async () => {
    setLoading(true); setError(''); setResult(null);
    try {
      const response = await base44.functions.invoke('getBrandOfferPreflight', { product_id: productId, variant });
      setResult(response?.data || null);
    } catch (e) {
      setError(e?.response?.data?.error || 'Nelze ověřit aktuální ceník nebo podklady. Nabídku nevytvářejte.');
    } finally { setLoading(false); }
  };
  const czk = (v) => typeof v === 'number'
    ? new Intl.NumberFormat('cs-CZ', { style:'currency', currency:'CZK', maximumFractionDigits:2 }).format(v)
    : 'Neověřeno';

  return (
    <section className="rounded-2xl border border-cyan/20 bg-white/[.025] p-4 sm:p-5" aria-labelledby="offer-preflight-title">
      <div className="flex items-center gap-2 text-cyan"><ShieldCheck size={15}/><p className="font-mono text-[10px] uppercase tracking-[.2em]">Superpowers · Canva / ověření nabídky</p></div>
      <h3 id="offer-preflight-title" className="mt-2 text-lg font-semibold text-white">Kontrola produktu před vytvořením nabídky</h3>
      <p className="mt-1 max-w-3xl text-sm leading-6 text-white/50">Porovná přesnou variantu s veřejnou cenou v Kalkulaci mlžítka 2026 a ověří MASTER fotografii. Neodesílá zprávy ani nezakládá nabídky bez schválení. Partnerské ceny se nečtou.</p>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="block text-xs text-white/65">Produkt
          <select className={`${INPUT} mt-1`} value={productId} onChange={(e)=>selectProduct(e.target.value)}>
            <option value="">Vyberte produkt</option>
            {candidates.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        <label className="block text-xs text-white/65">Přesná varianta
          <select className={`${INPUT} mt-1`} value={variant} disabled={!product} onChange={(e)=>{setVariant(e.target.value);setResult(null);setError('');}}>
            <option value="">Vyberte variantu</option>
            {variants.map((v,i)=><option value={v.name} key={`${v.name}-${i}`}>{v.name}</option>)}
          </select>
        </label>
        <button type="button" onClick={verify} disabled={!productId || !variant || loading}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan px-4 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">
          {loading ? <Loader2 size={15} className="animate-spin"/> : <ClipboardCheck size={15}/>} Ověřit podklady
        </button>
      </div>

      {error && <p role="alert" className="mt-4 flex gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-xs text-amber-100"><AlertTriangle size={15} className="shrink-0"/>{error}</p>}
      {result && <div className="mt-4 rounded-xl border border-white/10 bg-[#0a1420] p-4">
        <div className="flex items-start gap-3">{result.ready_for_canva ? <CheckCircle2 size={17} className="text-emerald-300"/> : <AlertTriangle size={17} className="text-amber-300"/>}
          <div>
            <p className="text-sm font-semibold text-white">{result.ready_for_canva ? 'Ověřené vstupy pro pracovní návrh v Canvě' : 'Vytvoření nabídky je pozastaveno'}</p>
            <p className="mt-1 text-xs text-white/45">{result.product?.variant} · cena bez DPH: {czk(result.product?.price_ex_vat)} · s DPH: {czk(result.product?.price_inc_vat)}</p>
          </div>
        </div>
        {!!result.blockers?.length && <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-amber-200">{result.blockers.map((blocker,i)=><li key={i}>{blocker}</li>)}</ul>}
        <p className="mt-3 text-xs text-white/45">SUPLA: samostatný produktový list je povinný; cenu balíčku a šachtový rozvaděč ověřit podle konfigurace. E-mail: pouze koncept.</p>
        {result.ready_for_canva && <div className="mt-4 flex flex-wrap gap-3">
          <a className="inline-flex items-center gap-2 rounded-full border border-cyan/30 px-4 py-2 text-xs font-semibold text-cyan"
            target="_blank" rel="noopener noreferrer" href="https://www.canva.com/brand/brand-templates/EAHZTN-hiGc">
            Otevřít originální šablonu v Canvě <ExternalLink size={12}/>
          </a>
          <a className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-white/65"
            target="_blank" rel="noopener noreferrer" href="https://drive.google.com/drive/folders/1KJqen97HpD9yAmo7yMBpaFZI8iqk0mdE">
            Produktový katalog na MLŽNÉM DISKU <ExternalLink size={12}/>
          </a>
        </div>}
      </div>}
    </section>
  );
}
