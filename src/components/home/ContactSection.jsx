import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { ArrowRight } from 'lucide-react';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await base44.entities.ContactInquiry.create({ ...form, status: 'new' });
      setSent(true);
    } catch (err) {



      // error
    } finally {setSending(false);}};

  return (
    <section className="bg-[hsl(var(--card))] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="mb-10 text-center sm:mb-12">
          

          
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="mb-3 font-heading text-[clamp(2rem,9vw,2.75rem)] font-light leading-[1.08] tracking-[-0.035em] text-slate-900 lg:text-5xl">
            Popište nám prostor.<br />Navrhneme řešení.
          </motion.h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Projdeme váš záměr, provozní podmínky i architekturu místa a doporučíme, co bude fungovat nejlépe.
          </p>
        </motion.div>

        <div className="mx-auto flex max-w-md flex-col justify-center gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4">
          <Link to="/kontakt"
          className="btn-metallic-mist inline-flex min-h-12 w-full items-center justify-center px-7 py-3.5 text-sm font-bold sm:w-auto">
            Popsat projekt <ArrowRight size={16} />
          </Link>
          <Link to="/kalkulacka"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-medium text-slate-900 transition-all hover:bg-slate-100 sm:w-auto">
            Kalkulačka nákladů
          </Link>
        </div>
      </div>
    </section>);

}