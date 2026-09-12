import React, { useState } from 'react';
import { Loader, Sparkles, ImageIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import MarketingPostPreview from './MarketingPostPreview';

const inputCls = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none transition-all";
const BRAND_LOGO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4b2ec32a3_mlzidla_logo_bez_pozadi.png';
const BRAND_REFERENCE_URL = '/media/optimized/3865c06a7_ana.webp';

export default function ContentPlanForm({ onCreated }) {
  const [form, setForm] = useState({ title: '', platform: 'instagram', caption: '', image_url: '', scheduled_date: '' });
  const [productFocus, setProductFocus] = useState('');
  const [generatingText, setGeneratingText] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiUsed, setAiUsed] = useState(false);

  const generateCaption = async () => {
    if (!form.title) return;
    setGeneratingText(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Jsi seniorní creative director značky MLŽIDLA® pro Instagram @mlzidla. Vytvoř profesionální český reklamní caption k tématu: "${form.title}". Cílová skupina: architekti, města, obce, hotely a prémiová gastronomie. Struktura: silný scroll-stopping hook; 2–3 konkrétní přínosy (ochlazení prostoru, nerezová odolnost, nízká spotřeba, instalace bez čerpadla podle kontextu); krátký důkaz nebo scénář využití; jasná výzva k návštěvě https://mlzidla.cz a hlavní CTA k nezávazné poptávce na https://mlzidla.cz/poptavka. Tón prémiový, věcný a sebevědomý, bez prázdných superlativů. Použij přirozené odstavce a zakonči 5–7 relevantními hashtagy včetně #mlzidla, #ochlazenimesta a #mestskaarchitektura.`, 
      });
      const caption = typeof res === 'string' ? res : JSON.stringify(res, null, 2);
      setForm((f) => ({ ...f, caption }));
      setAiUsed(true);
    } finally {
      setGeneratingText(false);
    }
  };

  const generateImage = async () => {
    if (!form.title) return;
    setGeneratingImage(true);
    try {
      const generateImageParams = /** @type {import('@base44/sdk').GenerateImageParams & { existing_image_urls?: string[] }} */ ({
        prompt: `Prémiový Instagram vizuál pro MLŽIDLA.cz k tématu: ${form.title}. Zvolený produkt: ${productFocus || 'urči podle tématu'}. Zachovej skutečnou geometrii, proporce, počet ramen a trubek, umístění trysek, AISI 316L, patku a ukotvení podle schválené reference. Nevymýšlej nové prvky ani varianty. Umísti produkt do moderního českého městského prostoru s lidmi pro měřítko a jemnou realistickou mlhou 50–100 μm. Použij Deep Steel #0D2D38, Ocean Teal #0E5B67, Mist Aqua #61D5E5, tlumenou přírodní zelenou #6F8F72 a bílou. Zelená má evokovat stromy, stín a úlevu ve veřejném prostoru, ne neověřené ekologické tvrzení. Zachovej přirozené světlo, kontakt se zemí a bezpečný prostor pro přesný nadpis a logo. Negeneruj dlouhé texty ani falešné logo; typografii vloží administrace. Portrétní kompozice 4:5 pro Instagram carousel.`,
        existing_image_urls: [BRAND_LOGO_URL, BRAND_REFERENCE_URL],
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
    });
    setForm({ title: '', platform: 'instagram', caption: '', image_url: '', scheduled_date: '' });
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
        <select value={productFocus} onChange={(e) => setProductFocus(e.target.value)} className={inputCls} aria-label="Produkt pro vizuál">
          <option value="">Produkt podle tématu</option>
          <option value="LINEA kulaté">LINEA kulaté</option>
          <option value="OSTŘEV">OSTŘEV</option>
          <option value="MRKEV">MRKEV</option>
          <option value="BENDY">BENDY</option>
          <option value="BRÁNA GATE">BRÁNA GATE</option>
        </select>
        <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className={inputCls}>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="google_ads">Google Ads</option>
          <option value="blog">Blog</option>
        </select>
      </div>

      <p className="-mt-2 text-[11px] leading-5 text-white/35">Výběr produktu řídí vizuální prompt. AI musí zachovat reálné proporce, trysky, patku i materiál podle reference.</p>

      <div className="flex gap-2">
        <button type="button" onClick={generateCaption} disabled={generatingText || !form.title}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border border-cyan/30 text-cyan hover:bg-cyan/10 transition-all disabled:opacity-40">
          {generatingText ? <Loader size={12} className="animate-spin" /> : <Sparkles size={12} />} Vytvořit reklamní text
        </button>
        <button type="button" onClick={generateImage} disabled={generatingImage || !form.title}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border border-cyan/30 text-cyan hover:bg-cyan/10 transition-all disabled:opacity-40">
          {generatingImage ? <Loader size={12} className="animate-spin" /> : <ImageIcon size={12} />} Vytvořit reklamní vizuál
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