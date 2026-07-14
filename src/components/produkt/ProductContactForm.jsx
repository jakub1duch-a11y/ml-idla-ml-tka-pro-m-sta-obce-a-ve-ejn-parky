import React, { useState } from 'react';
import { ArrowRight, Loader, Info, Paperclip, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const ANCHORING_PHOTO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/44f2b5c20_moznostikotveni.webp';

const SMART_VARIANTS = [
{ value: 'none', label: 'Bez smart řízení', hint: 'Mlžítko bez automatizace, zapíná se ručně přímo na ventilu.' },
{ value: 'v1', label: 'Varianta 1 – Manuální Wi-Fi', hint: 'Zapnutí/vypnutí a plánování přes mobilní aplikaci, bez senzorů.' },
{ value: 'v2', label: 'Varianta 2 – Smart senzory', hint: 'Automatické spouštění dle teploty a vlhkosti vzduchu.' },
{ value: 'v3', label: 'Varianta 3 – Plná automatizace', hint: 'Senzory + vítr + plánovač + vzdálený dohled v aplikaci.' },
{ value: 'all', label: 'Všechny možnosti', hint: 'Zašleme přehled a porovnání všech variant řízení.' },
{ value: 'doporucit', label: 'Doporučit vhodné ovládání', hint: 'Necháte výběr na nás — do nabídky navrhneme optimální řízení dle vašeho projektu.' }];


export default function ProductContactForm({ productName }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', smartVariant: 'none', installationType: 'mobile' });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleFiles = async (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;
    setUploading(true);
    for (const file of selected) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file }).catch(() => ({ file_url: null }));
      if (file_url) setFiles((f) => [...f, { name: file.name, url: file_url }]);
    }
    setUploading(false);
  };

  const removeFile = (url) => setFiles((f) => f.filter((x) => x.url !== url));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    const smartLabel = SMART_VARIANTS.find((v) => v.value === form.smartVariant)?.label;
    const extras = [
    form.smartVariant !== 'none' && `Smart řízení: ${smartLabel}`,
    form.installationType === 'mobile' ? 'Instalace: Mobilní – zemní vrut (do 30 min)' : 'Instalace: Trvalé a stabilní – kotvení do betonu',
    files.length > 0 && `Přiložené soubory: ${files.map((f) => f.url).join(', ')}`].
    filter(Boolean).join(', ');
    await base44.entities.ContactInquiry.create({
      name: form.name,
      email: form.email,
      message: `[${productName}] ${form.message || 'Zájem o produkt'} | ${extras}`,
      description: form.phone ? `Tel: ${form.phone}` : ''
    }).catch(() => {});
    setSent(true);
    setSending(false);
    if (typeof window !== 'undefined' && window.trackHolmTec) {
      window.trackHolmTec('contact_form_submit', { product_name: productName, form_type: 'produkt' });
    }
  };

  if (sent) return (
    <div className="text-center py-8">
      <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
        <span className="text-emerald-600 text-xl">✓</span>
      </div>
      <p className="text-slate-900 font-medium text-lg">Poptávka odeslána.</p>
      <p className="text-slate-400 text-sm mt-1">Odpovídáme do 24 h.</p>
    </div>);

  return (
    <form onSubmit={submit} className="space-y-5 p-7 lg:p-8 rounded-3xl border-2 border-slate-900 shadow-xl bg-TRANSPARENT">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Jméno a příjmení *</label>
          <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm placeholder-slate-300 focus:outline-none focus:border-slate-900 transition-colors text-[hsl(var(--popover))]"
          placeholder="Jan Novák" />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Email *</label>
          <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
          placeholder="jan@firma.cz" />
        </div>
      </div>
      <div className="opacity-100">
        <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Telefon</label>
        <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
        placeholder="+420 000 000 000" />
      </div>

      {/* Doplňkové možnosti */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <p className="text-xs font-mono text-slate-400 tracking-widest uppercase">Doplňkové možnosti</p>
        <div className="group relative">
          <div className="flex items-center gap-1.5 mb-2">
            <p className="text-sm text-slate-700">Ovládání / řízení mlžítka</p>
            <Info size={12} className="text-slate-300 group-hover:text-slate-600 transition-colors cursor-help" />
          </div>
          <select value={form.smartVariant} onChange={(e) => setForm((f) => ({ ...f, smartVariant: e.target.value }))}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-slate-900 transition-colors">
            {SMART_VARIANTS.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
          </select>
          <div className="pointer-events-none absolute left-0 right-0 top-full mt-1.5 z-20 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
              <p className="text-[11px] text-white/70 leading-relaxed">
                {SMART_VARIANTS.find((v) => v.value === form.smartVariant)?.hint}
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-700 mb-2">Typ instalace</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className={`flex flex-col gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all ${form.installationType === 'mobile' ? 'border-slate-900 bg-white' : 'border-slate-200 bg-white/50'}`}>
              <span className="flex items-center gap-2">
                <input type="radio" name="installationType" checked={form.installationType === 'mobile'} onChange={() => setForm((f) => ({ ...f, installationType: 'mobile' }))}
                className="w-4 h-4 text-slate-900 focus:ring-slate-900" />
                <span className="text-sm font-medium text-slate-900">Mobilní</span>
              </span>
              <span className="text-xs text-slate-500 pl-6">Zemní vrut (instalace do 30 min)</span>
            </label>
            <label className={`flex flex-col gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all ${form.installationType === 'permanent' ? 'border-slate-900 bg-white' : 'border-slate-200 bg-white/50'}`}>
              <span className="flex items-center gap-2">
                <input type="radio" name="installationType" checked={form.installationType === 'permanent'} onChange={() => setForm((f) => ({ ...f, installationType: 'permanent' }))}
                className="w-4 h-4 text-slate-900 focus:ring-slate-900" />
                <span className="text-sm font-medium text-slate-900">Trvalé a stabilní</span>
              </span>
              <span className="text-xs text-slate-500 pl-6">Kotvení do betonu</span>
            </label>
          </div>
          <a href={ANCHORING_PHOTO_URL} target="_blank" rel="noopener noreferrer"
          className="inline-block text-xs text-slate-400 hover:text-slate-900 underline mt-2">
            Zobrazit náhled možností kotvení
          </a>
        </div>
      </div>

      <div className="text-[hsl(var(--popover))]">
        <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Popište váš projekt</label>
        <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={4}
        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-slate-900 transition-colors resize-none"
        placeholder="Kde plánujete instalaci, jaký prostor, přibližné rozměry..." />
      </div>

      <div>
        <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Soubory, fotky nebo projekt (pro přesnou cenu)</label>
        <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-slate-200 rounded-xl px-4 py-4 text-sm text-slate-500 cursor-pointer hover:border-slate-400 transition-colors">
          <Paperclip size={15} />
          {uploading ? 'Nahrávám...' : 'Přidat soubory / fotky projektu'}
          <input type="file" multiple accept="image/*,.pdf,.dwg" onChange={handleFiles} className="hidden" disabled={uploading} />
        </label>
        {files.length > 0 &&
        <div className="flex flex-wrap gap-2 mt-2">
          {files.map((f) => (
            <span key={f.url} className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs px-2.5 py-1.5 rounded-full">
              {f.name}
              <button type="button" onClick={() => removeFile(f.url)} className="text-slate-400 hover:text-slate-900"><X size={11} /></button>
            </span>
          ))}
        </div>}
      </div>

      <button type="submit" disabled={sending}
      className="w-full py-5 text-white rounded-full hover:bg-slate-800 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg normal-case font-normal text-sm bg-[#295189]">
        {sending ? <Loader size={18} className="animate-spin" /> : <>Poptat produkt zdarma <ArrowRight size={18} /></>}
      </button>
    </form>);

}