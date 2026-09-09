import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { trackFunnelStep } from '@/lib/ga4';
import { Loader2, CheckCircle2 } from 'lucide-react';

const SPACE_TYPES = [
  'Náměstí / centrum města',
  'Park / promenáda',
  'Sportoviště / koupaliště',
  'ZOO / areál',
  'Škola / MŠ',
  'Domov seniorů',
  'Jiný veřejný prostor',
];

export default function HomeInquiryForm() {
  const [form, setForm] = useState({ jmeno: '', email: '', telefon: '', typ_prostoru: '', zprava: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await base44.entities.Poptavka.create({
        jmeno: form.jmeno,
        email: form.email,
        telefon: form.telefon,
        service_type: form.typ_prostoru,
        zprava: form.zprava,
      });
      trackFunnelStep('home', 'inquiry_submit', 'Homepage form');
      setSent(true);
    } catch (err) {
      setError(err?.message || 'Odeslání se nezdařilo.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-2xl px-6 text-center lg:px-10">
          <CheckCircle2 size={40} className="mx-auto text-[#0B5EA8]" />
          <h2 className="mt-5 font-heading text-2xl text-[#0D2F4F] lg:text-3xl">Děkujeme za poptávku.</h2>
          <p className="mt-4 text-sm leading-relaxed text-[#0D2F4F]/60">
            Ozveme se do jednoho pracovního dne s návrhem dalšího postupu.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Poptat řešení</p>
        <h2 className="mt-4 font-heading text-3xl leading-tight text-[#0D2F4F] lg:text-4xl">
          Popište prostor a my připravíme návrh.
        </h2>
        <form onSubmit={submit} className="mt-10 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wide text-[#0D2F4F]/60">Jméno *</label>
              <input
                required value={form.jmeno} onChange={(e) => setForm({ ...form, jmeno: e.target.value })}
                className="w-full border border-[#EAF5FB] bg-white px-4 py-3 text-sm text-[#0D2F4F] outline-none focus:border-[#0B5EA8]"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wide text-[#0D2F4F]/60">E-mail nebo telefon *</label>
              <input
                required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-[#EAF5FB] bg-white px-4 py-3 text-sm text-[#0D2F4F] outline-none focus:border-[#0B5EA8]"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wide text-[#0D2F4F]/60">Typ prostoru</label>
            <select
              value={form.typ_prostoru} onChange={(e) => setForm({ ...form, typ_prostoru: e.target.value })}
              className="w-full border border-[#EAF5FB] bg-white px-4 py-3 text-sm text-[#0D2F4F] outline-none focus:border-[#0B5EA8]"
            >
              <option value="">Vyberte…</option>
              {SPACE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wide text-[#0D2F4F]/60">Zpráva *</label>
            <textarea
              required value={form.zprava} onChange={(e) => setForm({ ...form, zprava: e.target.value })}
              rows={4}
              placeholder="Lokalita, přibližná plocha, co chcete zlepšit…"
              className="w-full border border-[#EAF5FB] bg-white px-4 py-3 text-sm text-[#0D2F4F] outline-none focus:border-[#0B5EA8]"
            />
          </div>
          <label className="flex items-start gap-2.5 text-xs text-[#0D2F4F]/55">
            <input type="checkbox" required className="mt-0.5 accent-[#0B5EA8]" />
            <span>Souhlasím se zpracováním osobních údajů dle GDPR pro účely odpovědi na tuto poptávku.</span>
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit" disabled={sending}
            className="inline-flex items-center gap-2 bg-[#0B5EA8] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#094d8a] disabled:opacity-50"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : null}
            Odeslat poptávku
          </button>
        </form>
      </div>
    </section>
  );
}