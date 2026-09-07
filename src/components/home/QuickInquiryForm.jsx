import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackInquirySubmitted } from '@/lib/ga4';

const SPACE_TYPES = [
  { value: 'mesto_obec', label: 'Město / obec / náměstí' },
  { value: 'park_hriste', label: 'Park / hřiště' },
  { value: 'skola_skolka', label: 'Škola / školka' },
  { value: 'zahrada_terasa', label: 'Zahrada / terasa' },
  { value: 'hotel_restaurace', label: 'Hotel / restaurace / gastro' },
  { value: 'event', label: 'Event / pronájem' },
  { value: 'jine', label: 'Jiné' },
];

export default function QuickInquiryForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ jmeno: '', kontakt: '', prostor: '', zprava: '', gdpr: false });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.jmeno || !form.kontakt || !form.zprava || !form.gdpr) return;
    setSending(true);
    try {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.kontakt.trim());
      const payload = {
        jmeno: form.jmeno,
        zprava: form.zprava,
        service_type: 'homepage_quick',
        status: 'nova',
      };
      if (isEmail) payload.email = form.kontakt.trim();
      else payload.telefon = form.kontakt.trim();
      if (!isEmail) payload.email = '';

      await base44.entities.Poptavka.create(payload);
      trackInquirySubmitted('homepage_quick', '', '');
      navigate('/dekujeme?zdroj=homepage');
    } catch (err) {
      console.warn('Quick inquiry failed', err);
    } finally {
      setSending(false);
    }
  };

  const inputCls = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#0b4860]';

  return (
    <section className="py-16 sm:py-20 bg-[#0a1628] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,211,238,.08),transparent_50%)]" />
      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
          <p className="font-mono tracking-widest uppercase text-cyan-300 mb-2 text-xs">NEZÁVAZNÁ POPTÁVKA</p>
          <h2 className="font-heading font-medium tracking-tight text-[clamp(1.75rem,5vw,2.5rem)]">
            Navrhneme řešení na míru
          </h2>
          <p className="mt-3 text-sm text-white/60 max-w-lg mx-auto">
            Stačí pár údajů — ozveme se do 24 hodin s návrhem a vizualizací.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={submit}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Jméno *"
              value={form.jmeno}
              onChange={(e) => setForm({ ...form, jmeno: e.target.value })}
              className={inputCls + ' border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-cyan/50'}
            />
            <input
              type="text"
              required
              placeholder="E-mail nebo telefon *"
              value={form.kontakt}
              onChange={(e) => setForm({ ...form, kontakt: e.target.value })}
              className={inputCls + ' border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-cyan/50'}
            />
          </div>
          <select
            required
            value={form.prostor}
            onChange={(e) => setForm({ ...form, prostor: e.target.value })}
            className={inputCls + ' border-white/15 bg-white/5 text-white focus:border-cyan/50'}
          >
            <option value="" className="text-slate-900">Vyberte typ prostoru *</option>
            {SPACE_TYPES.map((t) => <option key={t.value} value={t.value} className="text-slate-900">{t.label}</option>)}
          </select>
          <textarea
            required
            rows={3}
            placeholder="Popište prostor a co potřebujete ochladit *"
            value={form.zprava}
            onChange={(e) => setForm({ ...form, zprava: e.target.value })}
            className={inputCls + ' border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-cyan/50 resize-none'}
          />
          <label className="flex items-start gap-3 text-xs text-white/50 leading-relaxed cursor-pointer">
            <input
              type="checkbox"
              required
              checked={form.gdpr}
              onChange={(e) => setForm({ ...form, gdpr: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5"
            />
            <span>Souhlasím se zpracáním osobních údajů pro účely vyřízení poptávky dle <a href="/gdpr" className="text-cyan-300 hover:underline">zásad ochrany osobních údajů</a>.</span>
          </label>
          <button
            type="submit"
            disabled={sending}
            className="btn-metallic-mist inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#61d5e5] px-7 py-3.5 text-sm font-bold text-[#082934] transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {sending ? <Loader size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            {sending ? 'Odesílám…' : 'Odeslat poptávku'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}