import React, { useEffect, useState } from 'react';
import { Loader, Sparkles, Wand2, X, Lightbulb } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { VISUAL_KINDS, buildBrandPrompt, kindById } from '@/lib/brandVisualPrompts';
import BrandVisualResult from './BrandVisualResult';
import BrandVisualLibrary from './BrandVisualLibrary';

export default function BrandIconStudio() {
  const [products, setProducts] = useState([]);
  const [kind, setKind] = useState('line-icon');
  const [subject, setSubject] = useState('');
  const [productId, setProductId] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [ideasBusy, setIdeasBusy] = useState(false);
  const [library, setLibrary] = useState([]);
  const [loadingLibrary, setLoadingLibrary] = useState(true);

  const product = products.find((p) => p.id === productId);

  const loadLibrary = async () => {
    setLoadingLibrary(true);
    const items = await base44.entities.MediaFile.filter({ media_group: 'brand-visuals' }, '-created_date', 60).catch(() => []);
    setLibrary(items || []);
    setLoadingLibrary(false);
  };

  useEffect(() => {
    base44.entities.Product.list('name', 100).then((p) => setProducts(p || [])).catch(() => setProducts([]));
    loadLibrary();
  }, []);

  const suggestIdeas = async () => {
    setIdeasBusy(true); setError('');
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Jsi art director značky MLŽIDLA® (nerezová mlžítka a mlžné brány pro města, architekturu a zahrady). Vizuální styl: čistý, minimalistický, architektonický, tenké linie, paleta námořní modrá / ocelová modrá / signální cyan.
Navrhni 6 konkrétních námětů pro typ vizuálu "${kindById(kind).label}"${product ? ` v kontextu produktu ${product.name}` : ''}${subject ? ` k tématu: ${subject}` : ''}.
Každý námět je jedna krátká česká fráze (max 8 slov) popisující, co má být zobrazeno — žádné barvy ani styl, ty jsou dané.`,
        response_json_schema: { type: 'object', properties: { ideas: { type: 'array', items: { type: 'string' } } }, required: ['ideas'] },
      });
      setIdeas(res?.ideas?.slice(0, 6) || []);
    } catch (err) {
      setError(err?.message || 'Návrhy se nepodařilo získat.');
    } finally {
      setIdeasBusy(false);
    }
  };

  const generate = async () => {
    if (!subject.trim()) { setError('Napište, co má prvek zobrazovat.'); return; }
    setError(''); setBusy(true); setResult(null);
    try {
      const prompt = buildBrandPrompt({ kindId: kind, subject: subject.trim(), productName: product?.name });
      const res = await base44.integrations.Core.GenerateImage({ prompt });
      setResult({ url: res.url, prompt });
    } catch (err) {
      setError(err?.message || 'Generování selhalo.');
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (!result?.url) return;
    setSaving(true); setError('');
    try {
      const safe = subject.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
      const saved = await base44.entities.MediaFile.create({
        file_url: result.url,
        file_name: `mlzidla-${kind}-${safe || 'prvek'}.png`,
        file_type: 'image/png',
        media_group: 'brand-visuals',
        media_role: kind,
        product_slug: product?.slug || '',
        sort_order: 0,
      });
      setLibrary((l) => [saved, ...l]);
      setResult(null);
    } catch (err) {
      setError(err?.message || 'Uložení selhalo.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    await base44.entities.MediaFile.delete(id).catch(() => {});
    setLibrary((l) => l.filter((i) => i.id !== id));
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/10 text-cyan"><Sparkles size={20} /></div>
        <div>
          <h2 className="text-white text-lg font-semibold">AI studio ikon a vizuálních prvků</h2>
          <p className="text-white/40 text-xs mt-0.5">Každý výstup je uzamčen na paletu a styl vizuální identity MLŽIDLA® a lze ho přiřadit k produktu v katalogu.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-5">
        <div>
          <label className="text-xs text-white/40 font-mono uppercase tracking-wider mb-2 block">Typ prvku</label>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {VISUAL_KINDS.map((k) => (
              <button key={k.id} onClick={() => setKind(k.id)}
                className={`text-left px-4 py-3 rounded-xl border transition-all ${kind === k.id ? 'border-cyan/40 bg-cyan/10' : 'border-white/10 bg-white/5 hover:border-white/25'}`}>
                <p className={`text-sm font-medium ${kind === k.id ? 'text-cyan' : 'text-white/80'}`}>{k.label}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{k.hint}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs text-white/40 font-mono uppercase tracking-wider mb-1.5 block">Produkt v katalogu (nepovinné)</label>
            <select value={productId} onChange={(e) => setProductId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-cyan/40">
              <option value="" className="bg-[#0d1117]">— Obecný prvek —</option>
              {products.map((p) => <option key={p.id} value={p.id} className="bg-[#0d1117]">{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-white/40 font-mono uppercase tracking-wider mb-1.5 block">Co má prvek zobrazovat</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)}
              placeholder="např. kapka vody nad mlžným obloukem"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-cyan/40" />
          </div>
        </div>

        <div>
          <button onClick={suggestIdeas} disabled={ideasBusy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-white/15 text-white/60 hover:text-cyan hover:border-cyan/30 disabled:opacity-40 transition-all">
            {ideasBusy ? <Loader size={13} className="animate-spin" /> : <Lightbulb size={13} />}
            {ideasBusy ? 'Hledám náměty…' : 'Nech asistenta navrhnout náměty'}
          </button>
          {ideas.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {ideas.map((idea) => (
                <button key={idea} onClick={() => setSubject(idea)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-white/10 text-white/60 hover:text-cyan hover:border-cyan/30 transition-all">
                  <Wand2 size={11} /> {idea}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={generate} disabled={busy || !subject.trim()}
          className="inline-flex items-center gap-2 bg-cyan text-ink px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-cyan/90 disabled:opacity-40 transition-all">
          {busy ? <Loader size={15} className="animate-spin" /> : <Sparkles size={15} />}
          {busy ? 'Generuji…' : 'Generovat prvek'}
        </button>

        {error && (
          <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-lg px-3 py-2">
            <X size={12} /> {error}
          </div>
        )}

        {result && (
          <BrandVisualResult url={result.url} saving={saving} productName={product?.name}
            onSave={save} onRegenerate={generate} onDiscard={() => setResult(null)} />
        )}

        <BrandVisualLibrary items={library} loading={loadingLibrary} onDelete={remove} />
      </div>
    </div>
  );
}