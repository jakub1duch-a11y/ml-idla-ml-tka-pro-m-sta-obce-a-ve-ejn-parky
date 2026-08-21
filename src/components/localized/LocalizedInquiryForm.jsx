import React, { useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getLocalizedUi } from '@/lib/localized-ui';
import { trackInquirySubmitted } from '@/lib/ga4';

export default function LocalizedInquiryForm({ locale, routeKey, sourcePath }) {
  const ui = getLocalizedUi(locale);
  const copy = ui.form;
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '', consent: false });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim() || !form.consent) return;
    setSending(true);
    setError('');
    try {
      const created = await base44.entities.Poptavka.create({
        jmeno: form.name.trim(),
        email: form.email.trim(),
        telefon: form.phone.trim(),
        firma: form.company.trim(),
        produkt: `International web · ${routeKey}`,
        zprava: `[${locale.toUpperCase()} international web]\nSource: ${sourcePath}\n\n${form.message.trim()}\n\nPrivacy acknowledgement: yes`,
        status: 'nova',
      });
      trackInquirySubmitted(`international:${locale}`, routeKey, created?.id || '');
      setSent(true);
    } catch (_error) {
      setError(copy.error);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-7 sm:p-9">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white"><CheckCircle2 size={22}/></span>
        <h2 className="mt-6 font-heading text-3xl font-medium tracking-[-.03em] text-slate-950">{copy.successTitle}</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">{copy.successText}</p>
      </div>
    );
  }

  const inputClass = 'mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-secondary focus:ring-4 focus:ring-secondary/10';

  return (
    <section className="border-y border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:gap-16 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-secondary">{copy.formKicker || ui.formKicker}</p>
          <h2 className="mt-3 max-w-xl font-heading text-3xl font-medium leading-tight tracking-[-.035em] text-slate-950 sm:text-4xl">{copy.formTitle || ui.formTitle}</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">{copy.formText || ui.formText}</p>
        </div>

        <form onSubmit={submit} className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/[.04] sm:p-7 lg:p-9">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">{copy.fields.name}<input className={inputClass} value={form.name} onChange={update('name')} autoComplete="name" required /></label>
            <label className="text-sm font-semibold text-slate-700">{copy.fields.email}<input className={inputClass} value={form.email} onChange={update('email')} type="email" autoComplete="email" required /></label>
            <label className="text-sm font-semibold text-slate-700">{copy.fields.phone}<input className={inputClass} value={form.phone} onChange={update('phone')} type="tel" autoComplete="tel" required /></label>
            <label className="text-sm font-semibold text-slate-700">{copy.fields.company}<input className={inputClass} value={form.company} onChange={update('company')} autoComplete="organization" /></label>
          </div>
          <label className="mt-5 block text-sm font-semibold text-slate-700">{copy.fields.message}
            <textarea className={`${inputClass} min-h-36 resize-y`} value={form.message} onChange={update('message')} placeholder={copy.placeholders.message} required />
          </label>
          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-600">
            <input type="checkbox" checked={form.consent} onChange={update('consent')} required className="mt-0.5 h-4 w-4 shrink-0 accent-slate-950" />
            <span>{copy.consent} <a href="/gdpr" target="_blank" rel="noreferrer" className="font-semibold text-secondary underline decoration-secondary/30 underline-offset-2">{copy.privacy}</a>.</span>
          </label>
          {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={sending || !form.consent} className="btn-metallic-mist mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
            {sending ? <><Loader2 size={16} className="animate-spin" />{copy.sending}</> : <><Send size={16}/>{copy.submit}</>}
          </button>
        </form>
      </div>
    </section>
  );
}
