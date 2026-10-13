import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { trackContactFormSubmit } from '@/lib/ga4';
import GateExperience from '@/components/gate70/GateExperience';

export default function Gate70() {
  return <GateExperience renderForm={(variant) => <Gate70ContactForm initialVariant={variant} />} />;
}

function Gate70ContactForm({ initialVariant }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', variant: initialVariant, message: '' });
  useEffect(() => { setForm((current) => ({ ...current, variant: initialVariant })); }, [initialVariant]);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const { base44: b44 } = await import('@/api/base44Client');
      const created = await b44.entities.ContactInquiry.create({
        name: form.name,
        email: form.email,
        message: `[${form.variant}] ${form.message || 'Zájem o produkt GATE70'}`,
        description: form.phone ? `Tel: ${form.phone}` : ''
      });
      trackContactFormSubmit('produkt-gate70', form.variant, created?.id || '');
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  if (sent) return (
    <div className="text-center py-10">
      <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4">
        <span className="text-slate-900 text-xl">✓</span>
      </div>
      <p className="text-slate-900 font-light text-lg">Poptávka odeslána.</p>
      <p className="text-slate-400 text-sm mt-1">Odpovídáme do 24 h.</p>
    </div>);


  return (
    <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Jméno *</label>
          <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
          placeholder="Jan Novák" />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Email *</label>
          <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
          placeholder="jan@firma.cz" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Telefon</label>
          <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
          placeholder="+420 000 000 000" />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Varianta</label>
          <select value={form.variant} onChange={(e) => setForm((f) => ({ ...f, variant: e.target.value }))}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-slate-400 transition-colors">
            <option value="GATE70-U">GATE70-U (rovná)</option>
            <option value="GATE70-V">GATE70-V (lomený oblouk)</option>
            <option value="Obě varianty">Obě varianty — nerozhodnutý</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Projekt / zpráva</label>
        <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={4}
        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors resize-none"
        placeholder="Kde plánujete instalaci, přibližné rozměry, počet kusů..." />
      </div>
      <button type="submit" disabled={sending}
      className="w-full py-4 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
        {sending ? <span className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" /> : <>Odeslat poptávku na GATE70 <ArrowRight size={16} /></>}
      </button>
    </form>);

}