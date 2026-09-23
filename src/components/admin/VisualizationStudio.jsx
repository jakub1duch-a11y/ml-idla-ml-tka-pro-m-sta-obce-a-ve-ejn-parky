import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, FolderOpen, Image, Loader, Save, ShieldCheck, Sparkles, Trash2, Video, Wand2, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { generateHiggsfieldProductMotion } from '@/lib/higgsfieldMotion';
import {
  buildProductVisualizationGuard,
  CONFIGURATION_PRESETS,
  getAllowedEnvironmentValues,
  getMasterReference,
  getProductReferenceImages,
  VISUAL_ENVIRONMENTS,
} from '@/lib/productVisualizationRules';

const ASPECT_OPTIONS = [
  { value: '16:9', label: '16:9 · Na šířku' },
  { value: '9:16', label: '9:16 · Na výšku' },
  { value: '1:1', label: '1:1 · Čtverec' },
];

const PROMPT_PRESETS = [
  { label: 'Lidé a stín', text: 'Přirozený letní den, několik lidí pro měřítko, stín stromů nebo architektury, čistá profesionální architektonická fotografie.' },
  { label: 'Horké odpoledne', text: 'Horké letní odpoledne, ostré přirozené světlo, jemná vodní mlha dobře viditelná proti pozadí, realistická evropská scéna.' },
  { label: 'Večerní atmosféra', text: 'Teplé podvečerní světlo, kultivovaný veřejný prostor, decentní odrazy na nerezu, jemná mlha bez dramatického kouřového efektu.' },
];

export default function VisualizationStudio({ products = [], onVisualizationsChange }) {
  const [mode, setMode] = useState('image');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [prompt, setPrompt] = useState('');
  const [aspect, setAspect] = useState('16:9');
  const [environment, setEnvironment] = useState('namesti');
  const [configuration, setConfiguration] = useState('single');
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [gallery, setGallery] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedProductObj = useMemo(
    () => products.find((p) => p.id === selectedProduct),
    [products, selectedProduct]
  );

  const masterReference = useMemo(() => getMasterReference(selectedProductObj || {}), [selectedProductObj]);
  const masterVerified = Boolean(selectedProductObj?.visual_master_verified || selectedProductObj?.hero_visual_verified);
  const higgsfieldReady = Boolean(selectedProductObj?.visual_master_verified && selectedProductObj?.visual_master_reference_url);
  const allowedEnvironments = useMemo(() => getAllowedEnvironmentValues(selectedProductObj || {}), [selectedProductObj]);

  useEffect(() => {
    if (selectedProductObj && !allowedEnvironments.includes(environment)) {
      setEnvironment(allowedEnvironments[0] || 'namesti');
    }
  }, [selectedProductObj, allowedEnvironments, environment]);

  const loadGallery = async () => {
    if (!selectedProductObj?.slug) { setGallery([]); return; }
    setLoadingGallery(true);
    try {
      const items = await base44.entities.VisualizationAsset.filter({ product_slug: selectedProductObj.slug }).catch(() => []);
      const sorted = [...(items || [])].sort((a, b) => String(b.created_date || '').localeCompare(String(a.created_date || '')));
      setGallery(sorted);
      onVisualizationsChange?.(sorted);
    } catch {
      setGallery([]);
    } finally {
      setLoadingGallery(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, [selectedProductObj?.slug]);

  const applyConfiguration = (value) => {
    setConfiguration(value);
    const preset = CONFIGURATION_PRESETS.find((item) => item.value === value);
    if (preset) setQuantity(preset.quantity);
  };

  const generate = async () => {
    if (!selectedProductObj) { setError('Nejdříve vyberte konkrétní produkt.'); return; }
    if (!masterReference) { setError('Produkt nemá hlavní produktovou fotografii. Generování je zablokované.'); return; }
    setError('');
    setBusy(true);
    setResult(null);

    try {
      const guard = buildProductVisualizationGuard(selectedProductObj, { environment, configuration, quantity });
      const references = getProductReferenceImages(selectedProductObj, 5);
      const scene = prompt.trim() || 'Čistá fotorealistická architektonická fotografie bez textu a bez grafických overlayů.';
      const fullPrompt = `Vytvoř fotorealistickou vizualizaci produktu MLŽIDLA® v reálném prostoru.

${guard.prompt}

DOPLŇUJÍCÍ SCÉNICKÉ ZADÁNÍ: ${scene}

KOMPOZICE: výrobek musí být celý čitelný a kontrolovatelný, nesmí být oříznuta důležitá část, tryska ani patka. Lidé mohou být pouze přirozeným měřítkem. Žádné falešné logo, žádný text v obraze, žádný stockový nebo sci-fi vzhled. Nerez musí působit fyzicky věrohodně a respektovat světlo scény.`;

      if (mode === 'image') {
        const res = await base44.integrations.Core.GenerateImage({
          prompt: fullPrompt,
          existing_image_urls: references,
        });
        if (!res?.url) throw new Error('Generátor nevrátil obrázek.');
        setResult({ type: 'image', url: res.url, fullPrompt, references, guard });
      } else {
        if (!higgsfieldReady) {
          throw new Error('Higgsfield video vyžaduje ověřenou visual_master_reference_url.');
        }
        const videoRes = await generateHiggsfieldProductMotion({
          productSlug: selectedProductObj.slug,
          prompt: `${scene} Kamera se pohybuje pomalu a klidně; produkt zůstává po celou dobu geometricky identický s MASTER referencí.`,
          duration: 5,
          resolution: '720p',
          aspectRatio: aspect,
        });
        const videoPayload = videoRes?.result || videoRes;
        const videoUrl = typeof videoPayload?.video === 'string'
          ? videoPayload.video
          : videoPayload?.video?.url || videoPayload?.url || videoPayload?.output?.url || '';
        if (!videoUrl) throw new Error('Higgsfield nevrátil URL videa.');
        setResult({ type: 'video', url: videoUrl, fullPrompt, references, guard, provider: 'Higgsfield' });
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Generování selhalo.');
    } finally {
      setBusy(false);
    }
  };

  const saveVisualization = async () => {
    if (!result?.url || !selectedProductObj) return;
    setSaving(true);
    setError('');
    try {
      const saved = await base44.entities.VisualizationAsset.create({
        title: `${selectedProductObj.name} — ${result.type === 'video' ? 'AI video' : 'AI vizualizace'} · ${configuration.toUpperCase()}`,
        image_url: result.url,
        product_slug: selectedProductObj.slug,
        product_name: selectedProductObj.name,
        configuration,
        quantity: Math.max(1, Number(quantity || 1)),
        environment,
        scene_description: prompt.trim() || VISUAL_ENVIRONMENTS.find((item) => item.value === environment)?.label || environment,
        generation_prompt: result.fullPrompt,
        reference_image_urls: result.references,
        material: selectedProductObj.material || '',
        is_master_geometry_locked: true,
        approval_status: 'needs_review',
        approved_for_presentation: false,
        is_primary_for_variant: false,
        notes: result.guard?.verified
          ? 'MASTER reference je ověřená. Výsledek přesto vyžaduje vizuální porovnání geometrie před schválením.'
          : 'MASTER reference není potvrzená. Výstup je návrhový koncept a nesmí být automaticky použit v klientské prezentaci.',
      });
      const next = [saved, ...gallery];
      setGallery(next);
      setResult(null);
      onVisualizationsChange?.(next);
    } catch (err) {
      setError(err?.message || 'Uložení selhalo.');
    } finally {
      setSaving(false);
    }
  };

  const deleteVisualization = async (id) => {
    try {
      await base44.entities.VisualizationAsset.delete(id);
      const next = gallery.filter((v) => v.id !== id);
      setGallery(next);
      onVisualizationsChange?.(next);
    } catch {}
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan/10 text-cyan"><Sparkles size={18} /></div>
        <div>
          <h3 className="text-base font-semibold text-white">AI Vizualizační studio · PRODUCT LOCK</h3>
          <p className="mt-0.5 max-w-3xl text-xs leading-5 text-white/40">Měňte prostředí, světlo, mlhu, lidi, kompozici a počet identických kusů. Geometrie produktu je uzamčená hlavní produktovou fotografií.</p>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <button onClick={() => setMode('image')} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${mode === 'image' ? 'bg-cyan text-ink' : 'border border-white/10 text-white/50 hover:text-white'}`}><Image size={15}/> Fotografie</button>
        <button onClick={() => setMode('video')} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${mode === 'video' ? 'bg-cyan text-ink' : 'border border-white/10 text-white/50 hover:text-white'}`}><Video size={15}/> Video</button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-white/40">Produkt</label>
          <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan/40">
            <option value="" className="bg-[#0d1117]">— Vybrat produkt —</option>
            {products.filter((p) => p?.slug && !p.slug.startsWith('archived-') && p.slug !== 'mlzici-tryska').map((p) => <option key={p.id} value={p.id} className="bg-[#0d1117]">{p.name}</option>)}
          </select>
        </div>

        {selectedProductObj && (
          <div className={`grid gap-3 rounded-xl border p-3 sm:grid-cols-[96px_1fr] ${masterVerified ? 'border-emerald-400/20 bg-emerald-400/5' : 'border-amber-400/20 bg-amber-400/5'}`}>
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-black/20">
              {masterReference ? <img src={masterReference} alt={`MASTER ${selectedProductObj.name}`} className="h-full w-full object-contain"/> : null}
            </div>
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold text-white">{masterVerified ? <ShieldCheck size={14} className="text-emerald-300"/> : <AlertTriangle size={14} className="text-amber-300"/>} MASTER reference · {masterVerified ? 'ověřená' : 'vyžaduje ověření'}</p>
              <p className="mt-1 text-[11px] leading-5 text-white/45">{selectedProductObj.visual_geometry_lock || 'Geometrie se řídí hlavní produktovou fotografií. Produkt nesmí být redesignován.'}</p>
              {!masterVerified && <p className="mt-1 text-[10px] font-semibold text-amber-200/80">Vygenerované výstupy zůstanou ve stavu „k ověření“ a nepovolí se automaticky do nabídky.</p>}
            </div>
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-3">
          <label className="text-xs text-white/40">Prostředí
            <select value={environment} onChange={(e) => setEnvironment(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-[#111820] px-3 py-2.5 text-sm text-white">
              {VISUAL_ENVIRONMENTS.filter((item) => allowedEnvironments.includes(item.value)).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
          <label className="text-xs text-white/40">Rozmístění
            <select value={configuration} onChange={(e) => applyConfiguration(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-[#111820] px-3 py-2.5 text-sm text-white">
              {CONFIGURATION_PRESETS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
          <label className="text-xs text-white/40">Počet identických kusů
            <input type="number" min="1" max="20" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white"/>
          </label>
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-white/40">Scénické presety</label>
          <div className="flex flex-wrap gap-2">{PROMPT_PRESETS.map((preset) => <button key={preset.label} onClick={() => setPrompt(preset.text)} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 font-mono text-xs text-white/50 transition-all hover:border-cyan/30 hover:text-cyan"><Wand2 size={11}/> {preset.label}</button>)}</div>
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-white/40">Doplňující scéna</label>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} placeholder="Volitelně doplňte styl prostoru, lidi, světlo, kompozici nebo atmosféru. Konstrukci produktu sem neměňte." className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-cyan/40"/>
        </div>

        {mode === 'video' && <div><label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-white/40">Poměr stran</label><div className="flex flex-wrap gap-2">{ASPECT_OPTIONS.map((opt) => <button key={opt.value} onClick={() => setAspect(opt.value)} className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-all ${aspect === opt.value ? 'border border-cyan/30 bg-cyan/20 text-cyan' : 'border border-white/10 text-white/40 hover:text-white/70'}`}>{opt.label}</button>)}</div></div>}

        <button onClick={generate} disabled={busy || !selectedProductObj || !masterReference} className="inline-flex items-center gap-2 rounded-xl bg-cyan px-5 py-2.5 text-sm font-bold text-ink transition-all hover:bg-cyan/90 disabled:opacity-40">
          {busy ? <Loader size={15} className="animate-spin"/> : <Sparkles size={15}/>}
          {busy ? 'Generuji s PRODUCT LOCK…' : mode === 'image' ? 'Generovat přesnou vizualizaci' : 'Generovat video · Higgsfield'}
        </button>

        {error && <div className="flex items-center gap-2 rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs text-rose-400"><X size={12}/> {error}</div>}

        {result && (
          <div className="rounded-xl border border-cyan/20 bg-cyan/5 p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="font-mono text-xs uppercase tracking-wider text-cyan">Náhled výsledku</p>
              <span className={`rounded-full px-2 py-1 text-[9px] font-bold ${result.guard?.verified ? 'bg-emerald-400/10 text-emerald-300' : 'bg-amber-400/10 text-amber-300'}`}>{result.guard?.verified ? 'MASTER OVĚŘEN · KONTROLA POVINNÁ' : 'MASTER NEOVĚŘEN · KONCEPT'}</span>
            </div>
            {result.type === 'image' ? <img src={result.url} alt="AI vizualizace" className="w-full rounded-lg"/> : <video src={result.url} controls className="w-full rounded-lg"/>}
            <div className="mt-3 flex gap-2">
              <button onClick={saveVisualization} disabled={saving || !selectedProductObj} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-700 disabled:opacity-40">{saving ? <Loader size={13} className="animate-spin"/> : <Save size={13}/>} {saving ? 'Ukládám…' : 'Uložit k produktu · k ověření'}</button>
              <button onClick={() => setResult(null)} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-xs font-medium text-white/50 transition-all hover:text-white">Zahodit</button>
            </div>
          </div>
        )}
      </div>

      {selectedProductObj && (
        <div className="mt-6 border-t border-white/8 pt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-white/40"><FolderOpen size={12}/> Uložené vizualizace — {selectedProductObj.name}</p>
            <span className="font-mono text-xs text-white/30">{gallery.length} ks</span>
          </div>
          {loadingGallery ? <div className="flex justify-center py-6"><Loader size={18} className="animate-spin text-cyan/40"/></div> : gallery.length === 0 ? <p className="py-6 text-center text-xs text-white/25">Zatím nebyly uloženy žádné vizualizace pro tento produkt.</p> : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {gallery.map((viz) => (
                <div key={viz.id} className="group relative overflow-hidden rounded-lg border border-white/8 bg-white/5">
                  {viz.image_url?.match(/\.(mp4|webm|mov)(\?|$)/i) ? <video src={viz.image_url} className="aspect-square w-full object-cover" muted/> : <img src={viz.image_url} alt={viz.title || 'Vizualizace'} className="aspect-square w-full object-cover"/>}
                  <button onClick={() => deleteVisualization(viz.id)} className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/80 text-white opacity-0 transition-opacity group-hover:opacity-100" title="Smazat"><Trash2 size={12}/></button>
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-2 py-1.5">
                    <span className="text-[9px] text-white/80">{viz.configuration || 'single'} · {viz.quantity || 1} ks</span>
                    {viz.approval_status === 'approved' ? <span className="flex items-center gap-1 text-[9px] text-emerald-300"><CheckCircle2 size={9}/> schváleno</span> : <span className="text-[9px] text-amber-300">k ověření</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
