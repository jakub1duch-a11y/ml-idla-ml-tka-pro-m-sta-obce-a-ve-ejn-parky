import React, { useEffect, useMemo, useState } from 'react';
import { Image, Video, Loader, Sparkles, Save, Trash2, FolderOpen, Wand2, CheckCircle2, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const ASPECT_OPTIONS = [
  { value: '16:9', label: '16:9 · Na šířku', generate: '16:9' },
  { value: '9:16', label: '9:16 · Na výšku', generate: '9:16' },
  { value: '4:3', label: '4:3 · Klasický', generate: '16:9' },
  { value: '1:1', label: '1:1 · Čtverec', generate: '1:1' },
];

const PROMPT_PRESETS = [
  { label: 'Veřejné náměstí', text: 'Ultrarealistická fotografie moderního nerezového mlžítka na zastíněném městském náměstí, jemná vodní mlha se šíří vzduchem, lidé procházejí kolem, teplé odpolední světlo, architektonická fotografie, vysoké rozlišení' },
  { label: 'Park / zahrada', text: 'Ultrarealistická fotografie nerezového mlžítka v zelené zahradě, jemná mlha nad trávníkem, sluneční paprsky procházejí mlhou, klidná atmosféra, profesionální produktová fotografie' },
  { label: 'Terasa restaurace', text: 'Ultrarealistická fotografie nerezového mlžného oblaku nad terasou restaurace, hosté u stolů, jemná mlha ochlazuje vzduch, letní večer, teplé světlo, architektonická fotografie' },
  { label: 'Detail trysek', text: 'Detailní makro fotografie nerezových mlžných trysek, jemné kapky vody se odpařují, kontrastní osvětlení, technická produktová fotografie, vysoké rozlišení' },
];

export default function VisualizationStudio({ products, onVisualizationsChange }) {
  const [mode, setMode] = useState('image');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [prompt, setPrompt] = useState('');
  const [aspect, setAspect] = useState('16:9');
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

  const loadGallery = async () => {
    if (!selectedProduct) { setGallery([]); return; }
    setLoadingGallery(true);
    try {
      const filter = { product_slug: selectedProductObj?.slug, selected_for_offer: true };
      const items = await base44.entities.VisualizationAsset.filter(filter).catch(() => []);
      setGallery(items || []);
      onVisualizationsChange?.(items || []);
    } catch {
      setGallery([]);
    } finally {
      setLoadingGallery(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, [selectedProduct]);

  const generate = async () => {
    if (!prompt.trim()) { setError('Zadejte popis vizualizace.'); return; }
    setError(''); setBusy(true); setResult(null);
    try {
      if (mode === 'image') {
        const res = await base44.integrations.Core.GenerateImage({
          prompt: `${prompt}. Produkt: ${selectedProductObj?.name || 'mlžítko'}. Minimalistický nerezový design, jemná vodní mlha.`,
        });
        setResult({ type: 'image', url: res.url });
      } else {
        const videoRes = await base44.integrations.Core.GenerateVideo({
          prompt: `${prompt}. Produkt: ${selectedProductObj?.name || 'mlžítko'}. Jemná vodní mlha v pohybu, klidný kamerový záběr.`,
          aspect_ratio: aspect.includes('9:16') ? '9:16' : '16:9',
          generate_audio: false,
        });
        setResult({ type: 'video', url: videoRes.url });
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Generování selhalo.');
    } finally {
      setBusy(false);
    }
  };

  const saveVisualization = async () => {
    if (!result?.url || !selectedProduct) return;
    setSaving(true); setError('');
    try {
      const saved = await base44.entities.VisualizationAsset.create({
        source_inquiry_id: '',
        source_product_id: selectedProduct,
        product_slug: selectedProductObj?.slug,
        image_url: result.url,
        prompt: prompt,
        is_primary_for_variant: gallery.length === 0,
        approved_for_presentation: true,
        title: `${selectedProductObj?.name || 'Vizualizace'} — ${mode === 'video' ? 'video' : 'AI vizualizace'}`,
      });
      setGallery((g) => [saved, ...g]);
      setResult(null);
      setPrompt('');
      onVisualizationsChange?.([saved, ...gallery]);
    } catch (err) {
      setError(err?.message || 'Uložení selhalo.');
    } finally {
      setSaving(false);
    }
  };

  const deleteVisualization = async (id) => {
    try {
      await base44.entities.VisualizationAsset.delete(id);
      setGallery((g) => g.filter((v) => v.id !== id));
      onVisualizationsChange?.(gallery.filter((v) => v.id !== id));
    } catch {}
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
          <Sparkles size={18} />
        </div>
        <div>
          <h3 className="text-white text-base font-semibold">AI Vizualizační studio</h3>
          <p className="text-white/40 text-xs mt-0.5">Generujte vysoce realistické fotografie a videa, organizovaná podle produktu</p>
        </div>
      </div>

      {/* Mode switch */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('image')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'image' ? 'bg-cyan text-ink' : 'border border-white/10 text-white/50 hover:text-white'}`}
        >
          <Image size={15} /> Fotografie
        </button>
        <button
          onClick={() => setMode('video')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'video' ? 'bg-cyan text-ink' : 'border border-white/10 text-white/50 hover:text-white'}`}
        >
          <Video size={15} /> Video
        </button>
      </div>

      {/* Product selector */}
      <div className="space-y-4">
        <div>
          <label className="text-xs text-white/40 font-mono uppercase tracking-wider mb-1.5 block">Produkt</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-cyan/40"
          >
            <option value="" className="bg-[#0d1117]">— Vybrat produkt —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#0d1117]">{p.name}</option>
            ))}
          </select>
        </div>

        {/* Prompt presets */}
        <div>
          <label className="text-xs text-white/40 font-mono uppercase tracking-wider mb-1.5 block">Šablony popisu</label>
          <div className="flex flex-wrap gap-2">
            {PROMPT_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setPrompt(preset.text)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border border-white/10 text-white/50 hover:text-cyan hover:border-cyan/30 transition-all"
              >
                <Wand2 size={11} /> {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt input */}
        <div>
          <label className="text-xs text-white/40 font-mono uppercase tracking-wider mb-1.5 block">Popis vizualizace</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="Popište scénu, prostředí, osvětlení a atmosféru..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-cyan/40 resize-none"
          />
        </div>

        {/* Aspect ratio for video */}
        {mode === 'video' && (
          <div>
            <label className="text-xs text-white/40 font-mono uppercase tracking-wider mb-1.5 block">Poměr stran</label>
            <div className="flex flex-wrap gap-2">
              {ASPECT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setAspect(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${aspect === opt.value ? 'bg-cyan/20 text-cyan border border-cyan/30' : 'border border-white/10 text-white/40 hover:text-white/70'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={generate}
          disabled={busy || !prompt.trim()}
          className="inline-flex items-center gap-2 bg-cyan text-ink px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-cyan/90 disabled:opacity-40 transition-all"
        >
          {busy ? <Loader size={15} className="animate-spin" /> : <Sparkles size={15} />}
          {busy ? 'Generuji…' : mode === 'image' ? 'Generovat fotografii' : 'Generovat video'}
        </button>

        {error && (
          <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-lg px-3 py-2">
            <X size={12} /> {error}
          </div>
        )}

        {/* Result preview */}
        {result && (
          <div className="rounded-xl border border-cyan/20 bg-cyan/5 p-3">
            <p className="text-xs text-cyan font-mono uppercase tracking-wider mb-2">Náhled výsledku</p>
            {result.type === 'image' ? (
              <img src={result.url} alt="AI vizualizace" className="w-full rounded-lg" />
            ) : (
              <video src={result.url} controls className="w-full rounded-lg" />
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={saveVisualization}
                disabled={saving || !selectedProduct}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 disabled:opacity-40 transition-all"
              >
                {saving ? <Loader size={13} className="animate-spin" /> : <Save size={13} />}
                {saving ? 'Ukládám…' : 'Uložit k produktu'}
              </button>
              <button
                onClick={() => setResult(null)}
                className="inline-flex items-center gap-2 border border-white/15 text-white/50 px-4 py-2 rounded-lg text-xs font-medium hover:text-white transition-all"
              >
                Zahodit
              </button>
            </div>
            {!selectedProduct && (
              <p className="text-[10px] text-amber-400 mt-2">Pro uložení vyberte produkt.</p>
            )}
          </div>
        )}
      </div>

      {/* Gallery by product */}
      {selectedProduct && (
        <div className="mt-6 border-t border-white/8 pt-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-white/40 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <FolderOpen size={12} /> Uložené vizualizace — {selectedProductObj?.name}
            </p>
            <span className="text-xs text-white/30 font-mono">{gallery.length} ks</span>
          </div>
          {loadingGallery ? (
            <div className="flex justify-center py-6"><Loader size={18} className="animate-spin text-cyan/40" /></div>
          ) : gallery.length === 0 ? (
            <p className="text-center text-white/25 text-xs py-6">Zatím nebyly uloženy žádné vizualizace pro tento produkt.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {gallery.map((viz) => (
                <div key={viz.id} className="group relative rounded-lg overflow-hidden border border-white/8 bg-white/5">
                  {viz.image_url?.match(/\.(mp4|webm|mov)/i) ? (
                    <video src={viz.image_url} className="w-full aspect-square object-cover" muted />
                  ) : (
                    <img src={viz.image_url} alt={viz.title || 'Vizualizace'} className="w-full aspect-square object-cover" />
                  )}
                  <button
                    onClick={() => deleteVisualization(viz.id)}
                    className="absolute top-1.5 right-1.5 h-7 w-7 rounded-lg bg-rose-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    title="Smazat"
                  >
                    <Trash2 size={12} />
                  </button>
                  {viz.is_primary_for_variant && (
                    <span className="absolute top-1.5 left-1.5 rounded-full bg-cyan text-ink px-2 py-0.5 text-[9px] font-mono font-bold">HLAVNÍ</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}