import React, { useState } from 'react';
import { ArrowRight, Check, Loader, Mail, Phone } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TYPES = [
  { value: 'architekt', label: 'Architekt / projektant' },
  { value: 'mesto', label: 'Město / obec' },
  { value: 'realizacni', label: 'Realizační firma' },
  { value: 'zahradni', label: 'Zahradní studio' },
  { value: 'jiny', label: 'Jiné' },
];

export default function SpoluPartnerForm() {
  const [form, setForm] = useState({ name: '', email: '', partner_type: 'architekt', message: '' });
  const [state, setState] = useState('idle');

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setState('sending');
    const typeLabel = TYPES.find((t) => t.value === form.partner_type)?.label;
    await base44.entities.ContactInquiry.create({
      name: form.name,
      email: form.email,
      service_type: `partnerstvi-${form.partner_type}`,
      message: `Zájem o partnerskou spolupráci (${typeLabel}).\n\n${form.message}`,
    });
    setState('done');
  };

  if (state === 'done') return (
    <section id="partnerska-poptavka" className="py-20">
      <div className="mx-auto max-w-xl px-6 text-center" data-reveal>
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-50 text-cyan-600"><Check size={24} /></div>
        <h2 className="font-heading text-3xl font-light text-slate-900">Děkujeme, máme to</h2>
        <p className="mt-4 font-light leading-relaxed text-slate-500">Ozveme se do jednoho pracovního dne s partnerskými podmínkami a podklady k vašemu projektu.</p>
      </div>
    </section>
  );

  return (
    <section id="partnerska-poptavka" className="border-t border-slate-200 bg-slate-900 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:px-10">
        <div data-reveal>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan-300">Kontakt</p>
          <h2 className="font-heading text-3xl font-light tracking-tight text-white lg:text-4xl">Zahájit partnerskou spolupráci</h2>
          <p className="mt-4 max-w-md font-light leading-relaxed text-white/60">
            Napište nám, v jaké roli vstupujete do projektu. Pošleme partnerské podmínky, technické podklady a návrh dalšího kroku.
          </p>
          <div className="mt-8 space-y-3 text-sm font-light text-white/70">
            <a href="tel:+420774700390" className="flex items-center gap-3 hover:text-white"><Phone size={15} className="text-cyan-300" /> +420 774 700 390</a>
            <a href="mailto:obchod1@holmtec.cz" className="flex items-center gap-3 hover:text-white"><Mail size={15} className="text-cyan-300" /> obchod1@holmtec.cz</a>
          </div>
        </div>

        <form onSubmit={submit} data-reveal className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-white/40">Jméno a firma *</span>
              <input required value={form.name} onChange={set('name')}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-cyan-400/50 focus:outline-none" placeholder="Jan Novák, Studio ABC" />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-white/40">E-mail *</span>
              <input required type="email" value={form.email} onChange={set('email')}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-cyan-400/50 focus:outline-none" placeholder="jan@studio.cz" />
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-white/40">Typ partnera</span>
            <select value={form.partner_type} onChange={set('partner_type')}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white focus:border-cyan-400/50 focus:outline-none">
              {TYPES.map((t) => <option key={t.value} value={t.value} className="bg-slate-900">{t.label}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-white/40">Projekt a co potřebujete</span>
            <textarea rows={4} value={form.message} onChange={set('message')}
              className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-cyan-400/50 focus:outline-none"
              placeholder="Např. revitalizace náměstí, hledáme mlžnou bránu + podklady pro projekt…" />
          </label>
          <button type="submit" disabled={state === 'sending'} className="btn-metallic-mist w-full justify-center px-6 py-3.5 text-sm font-bold disabled:opacity-60">
            {state === 'sending' ? <><Loader size={15} className="animate-spin" /> Odesílám…</> : <>Odeslat a získat podmínky <ArrowRight size={15} /></>}
          </button>
          <p className="text-[11px] font-light text-white/35">Odesláním souhlasíte se zpracováním údajů pro účely vyřízení poptávky.</p>
        </form>
      </div>
    </section>
  );
}