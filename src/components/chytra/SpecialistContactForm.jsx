import React, { useState } from 'react';
import { ArrowRight, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackContactFormSubmit, trackQuickInquiryClick } from '@/lib/ga4';

export default function SpecialistContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.phone.trim() && !form.email.trim()) {
      setError('Vyplňte prosím alespoň telefon nebo email.');
      return;
    }
    setError('');
    setSending(true);
    await base44.entities.ContactInquiry.create({
      name: form.name || 'Neuvedeno',
      email: form.email || 'neuvedeno@mlzidla.cz',
      message: `[Smart systém — poptávka kontaktu] Telefon: ${form.phone || 'neuvedeno'}`
    }).catch(() => {});
    trackQuickInquiryClick('Smart systém — specialista', 'smart_savings_form');
    trackContactFormSubmit('smart-specialista', 'Smart systém');
    setSent(true);
    setSending(false);
  };

  if (sent) return (
    <div className="text-center py-6">
      <p className="text-slate-900 font-medium">Děkujeme, ozveme se vám co nejdříve.</p>
    </div>);


  return (
    <form onSubmit={submit} className="space-y-4">
      <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        placeholder="Jméno nebo firma"
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-colors" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder="Telefon"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-colors" />
        <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="Email"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-colors" />
      </div>
      <p className="text-xs text-slate-400">Vyplňte alespoň telefon nebo email.</p>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button type="submit" disabled={sending}
        className="w-full py-4 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
        {sending ? <Loader size={16} className="animate-spin" /> : <>Zanechte nám kontakt <ArrowRight size={16} /></>}
      </button>
    </form>);

}