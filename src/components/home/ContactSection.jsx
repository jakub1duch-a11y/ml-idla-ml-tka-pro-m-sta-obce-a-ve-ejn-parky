import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { ArrowRight, Trophy } from 'lucide-react';

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
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-mono text-yellow-400 tracking-widest uppercase mb-4">
            <Trophy size={12} /> Výhry 25 000 Kč
          </div>
          <h2 className="font-heading font-black text-4xl lg:text-5xl text-white tracking-tight mb-3">
            Chcete mlhoviště<br />ve vašem prostoru?
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Kontaktujte nás a navrhnou řešení přesně pro váš prostor. Konzultace zdarma.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/kontakt"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25">
            Nezávazná poptávka <ArrowRight size={16} />
          </Link>
          <Link to="/jak-to-funguje"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/5 text-white text-sm font-medium rounded-full border border-white/20 hover:bg-white/10 transition-all">
            Kalkulačka nákladů
          </Link>
        </div>
      </div>
    </section>
  );
}