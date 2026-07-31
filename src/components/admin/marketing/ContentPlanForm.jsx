import React, { useState } from 'react';
import { Loader, Sparkles, ImageIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const inputCls = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none transition-all";

export default function ContentPlanForm({ onCreated }) {
  const [form, setForm] = useState({ title: '', platform: 'instagram', caption: '', image_url: '', scheduled_date: '' });
  const [generatingText, setGeneratingText] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiUsed, setAiUsed] = useState(false);

  const generateCaption = async () => {
    if (!form.title) return;
    setGeneratingText(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Jsi seniorní creative director značky MLŽIDLA® pro Instagram @mlzidla. Vytvoř profesionální český reklamní caption k tématu: "${form.title}". Cílová skupina: architekti, města, obce, hotely a prémiová gastronomie. Struktura: silný scroll-stopping hook; 2–3 konkrétní přínosy (ochlazení prostoru, nerezová odolnost, nízká spotřeba, instalace bez čerpadla podle kontextu); krátký důkaz nebo scénář využití; jasná výzva k nezávazné poptávce na mlzidla.cz/poptavka. Tón prémiový, věcný a sebevědomý, bez prázdných superlativů. Použij přirozené odstavce a zakonči 5–7 relevantními hashtagy včetně #mlzidla, #ochlazenimesta a #mestskaarchitektura.`, 
      });
      setForm((f) => ({ ...f, caption: res }));
      setAiUsed(true);
    } finally {
      setGeneratingText(false);
    }
  };

  const generateImage = async () => {
    if (!form.title) return;
    setGeneratingImage(true);
    try {
      const res = await base44.integrations.Core.GenerateImage({
        prompt: `Prémiový Instagram reklamní vizuál pro českou značku MLŽIDLA®: nerezové mlžítko integrované do moderního evropského veřejného prostoru, jemná ultra-fine vodní mlha, lidé přirozeně zažívající úlevu od horka, čistá architektura, Apple a DJI cinematic estetika, zlatá hodina, realistická nerezová ocel, vysoký dynamický rozsah, profesionální produktová fotografie, čistá kompozice s volným místem pro text, bez logotypů a bez generovaného textu. Kontext kampaně: ${form.title}. Čtvercová kompozice pro Instagram feed.`, 
      });
      setForm((f) => ({ ...f, image_url: res.url }));
      setAiUsed(true);
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
    <form onSubmit={submit} className="p-5 rounded-xl bg-white/3 border border-white/8 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input required placeholder="Název příspěvku *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
        <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className={inputCls}>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="google_ads">Google Ads</option>
          <option value="blog">Blog</option>
        </select>
      </div>

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
    </form>
  );
}