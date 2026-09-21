import React, { useEffect, useMemo, useState } from 'react';
import { Loader, Sparkles, ImageIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import MarketingPostPreview from './MarketingPostPreview';
import {
  MARKETING_CHANNELS,
  MARKETING_GENERATION_SKILL,
  MARKETING_VISUAL_MODES,
  buildMarketingCaptionPrompt,
  buildMarketingVisualizationPrompt,
  getMarketingChannel,
  getMarketingReferences,
} from '@/lib/mlzidlaMarketingGenerationSkill';
import { getMasterReference } from '@/lib/productVisualizationRules';

const inputCls = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none transition-all";

export default function ContentPlanForm({ onCreated }) {
  const [form, setForm] = useState({ title: '', platform: 'instagram_feed', caption: '', image_url: '', scheduled_date: '' });
  const [products, setProducts] = useState([]);
  const [productFocus, setProductFocus] = useState('');
  const [visualMode, setVisualMode] = useState('product_in_space');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    base44.entities.Product.list('name', 250).then((rows) => {
      if (active) setProducts((rows || []).filter((product) => product?.is_archived !== true));
    }).catch(() => { if (active) setProducts([]); });
    return () => { active = false; };
  }, []);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productFocus || product.slug === productFocus),
    [products, productFocus],
  );
  const selectedMaster = selectedProduct ? getMasterReference(selectedProduct) : '';
  const selectedReferences = selectedProduct ? getMarketingReferences(selectedProduct) : [];
  const channel = getMarketingChannel(form.platform);
  const [generatingText, setGeneratingText] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiUsed, setAiUsed] = useState(false);

  const generateCaption = async () => {
    if (!form.title || !selectedProduct) {
      setError('Nejprve vyber konkrétní produkt MLŽIDLA.');
      return;
    }
    setError('');
    setGeneratingText(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `${buildMarketingCaptionPrompt({ product: selectedProduct, channel: form.platform, visualMode, captionGoal: form.title })}\n\nVytvoř český caption k tématu: "${form.title}". Cílová skupina: architekti, města, obce, hotely a prémiová gastronomie. Přidej 5–7 relevantních hashtagů včetně #mlzidla. Neopakuj neověřené technické hodnoty.`,
        model: 'gemini_3_flash',
      });
      const caption = typeof res === 'string' ? res : JSON.stringify(res, null, 2);
      setForm((f) => ({ ...f, caption }));
      setAiUsed(true);
    } finally {
      setGeneratingText(false);
    }
  };

  const generateImage = async () => {
    if (!form.title || !selectedProduct) {
      setError('Vyber produkt před generováním vizuálu.');
      return;
    }
    if (!selectedMaster || selectedReferences.length === 0) {
      setError('Produkt nemá MASTER referenci. Vizuál nelze bezpečně generovat.');
      return;
    }
    setError('');
    setGeneratingImage(true);
    try {
      const generateImageParams = /** @type {import('@base44/sdk').GenerateImageParams & { existing_image_urls?: string[] }} */ ({
        prompt: buildMarketingVisualizationPrompt({ product: selectedProduct, channel: form.platform, visualMode, topic: form.title }),
        existing_image_urls: selectedReferences,
      });
      const res = await base44.integrations.Core.GenerateImage(generateImageParams);
      setForm((f) => ({ ...f, image_url: res.url }));
      setAiUsed(true);
      try {
        await base44.functions.invoke('archiveGeneratedMediaToDrive', {
          fileUrl: res.url,
          fileName: `marketing-${form.title || 'mlzidla'}-${Date.now()}.png`,
          mediaRole: 'marketing',
        });
      } catch (archiveError) {
        console.warn('Automatická archivace marketingového vizuálu na MLŽIDLA Disk se nezdařila', archiveError);
      }
    } finally {
      setGeneratingImage(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.MarketingPost.create({
      ...form,
      status: form.scheduled_date ? 'scheduled' : 'draft',
      ai_generated: aiUsed,
      product_id: selectedProduct?.id || '',
      product_slug: selectedProduct?.slug || '',
      product_name: selectedProduct?.name || '',
      visual_rule_version: MARKETING_GENERATION_SKILL.version,
      visual_channel: form.platform,
      visual_mode: visualMode,
      product_master_reference_url: selectedMaster,
    });
    setForm({ title: '', platform: 'instagram_feed', caption: '', image_url: '', scheduled_date: '' });
    setProductFocus('');
    setVisualMode('product_in_space');
    setError('');
    setAiUsed(false);
    setSaving(false);
    onCreated();
  };

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-2xl border border-white/8 bg-white/3 p-5 xl:grid-cols-[1fr_420px]">
      <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">Video workflow</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {['01 · Výběr záběrů', '02 · Střih videa', '03 · Zvuk + hudba', '04 · Export + web'].map((step) => (
            <div key={step} className="rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-xs text-white/70">{step}</div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-white/40">Střih videa je samostatný povinný krok před publikací: krátké dynamické záběry, rytmické hard-cuty, titulky pouze na klíčových místech a finální kontrola zvuku.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input required placeholder="Název příspěvku *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
        <select value={productFocus} onChange={(e) => setProductFocus(e.target.value)} className={inputCls} aria-label="Produkt pro vizuál" required>
          <option value="">Vyber konkrétní produkt</option>
          {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
        </select>
        <select value={visualMode} onChange={(e) => setVisualMode(e.target.value)} className={inputCls} aria-label="Typ vizuálu">
          {MARKETING_VISUAL_MODES.map((mode) => <option key={mode.value} value={mode.value}>{mode.label}</option>)}
        </select>
        <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className={inputCls}>
          {Object.entries(MARKETING_CHANNELS).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}
        </select>
      </div>

      <div className="-mt-2 rounded-xl border border-cyan/15 bg-cyan/5 p-3 text-[11px] leading-5 text-white/55">
        <p className="font-mono uppercase tracking-[.14em] text-cyan">Přesný produktový režim · {MARKETING_GENERATION_SKILL.version}</p>
        <p className="mt-1">{selectedProduct ? `${selectedProduct.name} · ${channel.format} · ${channel.aspectRatio}` : 'Vyber produkt s MASTER referencí.'} Geometrie, proporce, trysky a základna se řídí pouze referencí.</p>
      </div>
      {error && <p role="alert" className="rounded-lg border border-red-300/20 bg-red-300/10 px-3 py-2 text-xs text-red-100">{error}</p>}

      <div className="flex gap-2">
        <button type="button" onClick={generateCaption} disabled={generatingText || !form.title}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border border-cyan/30 text-cyan hover:bg-cyan/10 transition-all disabled:opacity-40">
          {generatingText ? <Loader size={12} className="animate-spin" /> : <Sparkles size={12} />} Vytvořit reklamní text
        </button>
        <button type="button" onClick={generateImage} disabled={generatingImage || !form.title}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border border-cyan/30 text-cyan hover:bg-cyan/10 transition-all disabled:opacity-40">
          {generatingImage ? <Loader size={12} className="animate-spin" /> : <ImageIcon size={12} />} Vytvořit vizuál / fotogalerii
        </button>
      </div>

      <textarea rows={3} placeholder="Text příspěvku / popisek" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className={inputCls + ' resize-none'} />

      {form.image_url && (
        <img src={form.image_url} alt="Náhled" className="w-32 h-32 object-cover rounded-lg border border-white/10" />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input type="datetime-local" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} className={inputCls} />
        <button type="submit" disabled={saving}
          className="px-5 py-3 rounded-xl bg-cyan text-ink text-sm font-medium hover:bg-cyan/90 transition-all disabled:opacity-50">
          {saving ? 'Ukládám...' : 'Uložit do plánu'}
        </button>
      </div>
      </div>
      <div className="xl:sticky xl:top-4 xl:self-start">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/30">Náhled výstupu</p>
        <MarketingPostPreview post={form} />
      </div>
    </form>
  );
}