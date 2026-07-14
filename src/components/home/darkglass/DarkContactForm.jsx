import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import DarkFeatureBadges from '@/components/home/darkglass/DarkFeatureBadges';

export default function DarkContactForm() {
  const [form, setForm] = useState({ jmeno: '', email: '', telefon: '', zprava: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await base44.entities.ContactInquiry.create({
        name: form.jmeno,
        email: form.email,
        message: form.zprava || 'Poptávka mlžného systému pro město',
        description: form.telefon ? `Telefon: ${form.telefon}` : undefined,
        project_scope: 'urban'
      });
      setStatus('sent');
      setForm({ jmeno: '', email: '', telefon: '', zprava: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
      className="p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
      <h2 className="font-heading font-bold text-xl text-white uppercase tracking-tight mb-5">Poptejte systém pro vaše město</h2>
      <DarkFeatureBadges />
      <h3 className="font-heading font-bold text-base text-white uppercase tracking-tight mt-7 mb-4">Kontaktní formulář</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input required name="jmeno" value={form.jmeno} onChange={handleChange} placeholder="Jméno a příjmení"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-cyan" />
        <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="E-mail"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-cyan" />
        <input name="telefon" value={form.telefon} onChange={handleChange} placeholder="Telefon"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-cyan" />
        <textarea name="zprava" value={form.zprava} onChange={handleChange} placeholder="Zpráva" rows={4}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-cyan resize-none" />
        <button type="submit" disabled={status === 'sending'}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-cyan text-slate-950 text-sm font-bold rounded-full hover:bg-cyan/90 transition-colors disabled:opacity-60">
          {status === 'sending' && <Loader size={15} className="animate-spin" />}
          {status === 'sending' ? 'Odesílám…' : 'Odeslat'}
        </button>
        {status === 'sent' && <p className="text-xs text-cyan text-center">Děkujeme, poptávku jsme přijali.</p>}
        {status === 'error' && <p className="text-xs text-red-400 text-center">Něco se nepovedlo, zkuste to prosím znovu.</p>}
      </form>
    </motion.div>
  );
}