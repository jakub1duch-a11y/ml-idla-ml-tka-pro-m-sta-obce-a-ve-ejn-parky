import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader, CheckCircle, ArrowRight } from 'lucide-react';
import { trackContactFormSubmit, trackFunnelStep } from '@/lib/ga4';

export default function CategoryInquiryForm({ category, projectScope = 'urban', analyticsSegment = projectScope }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', organization: '', location: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const created = await base44.entities.ContactInquiry.create({
        name: form.name,
        email: form.email,
        project_scope: projectScope,
        service_type: `segment:${category}`,
        description: [
          form.organization ? `Organizace: ${form.organization}` : '',
          form.location ? `Lokalita: ${form.location}` : '',
          form.phone ? `Telefon: ${form.phone}` : '',
        ].filter(Boolean).join(' | '),
        message: `[${category}] ${form.message}`,
        status: 'new',
      });
      trackContactFormSubmit(`kategorie:${projectScope}`, category, created?.id || '');
      trackFunnelStep(analyticsSegment, 'lead_submit', category);
      setStatus('sent');
    } catch (_) {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="text-center py-6">
        <CheckCircle size={26} className="text-slate-900 mx-auto mb-3" />
        <p className="text-slate-900 font-medium">Děkujeme za poptávku!</p>
        <p className="text-slate-500 text-sm mt-1">Ozveme se vám do 24 hodin.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left" aria-label={`Poptávka — ${category}`}>
      <input required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Jméno a příjmení" className="px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-slate-900 bg-white" />
      <input required type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Pracovní e-mail" className="px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-slate-900 bg-white" />
      <input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })}
        placeholder="Město / obec / firma / ateliér" className="px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-slate-900 bg-white" />
      <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
        placeholder="Lokalita projektu" className="px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-slate-900 bg-white" />
      <input type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="Telefon (nepovinné)" className="px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-slate-900 bg-white sm:col-span-2" />
      <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="Co řešíte? Stačí typ prostoru, přibližná plocha a fáze projektu." rows={3} className="px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-slate-900 bg-white sm:col-span-2 resize-none" />
      {status === 'error' ? <p className="sm:col-span-2 text-sm text-red-700">Poptávku se nepodařilo odeslat. Zkuste to prosím znovu nebo nás kontaktujte telefonicky.</p> : null}
      <button type="submit" disabled={status === 'sending'}
        className="btn-inquiry-pulse sm:col-span-2 justify-center rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground disabled:opacity-60">
        {status === 'sending' ? <Loader size={16} className="animate-spin" /> : <>Odeslat nezávaznou poptávku <ArrowRight size={15} /></>}
      </button>
      <p className="sm:col-span-2 text-[11px] leading-relaxed text-slate-400">Odesláním získáme podklady pro první technické doporučení. Nejde o závaznou objednávku.</p>
    </form>
  );
}