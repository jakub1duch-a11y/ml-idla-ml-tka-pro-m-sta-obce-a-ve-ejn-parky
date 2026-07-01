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
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600 tracking-widest uppercase mb-4">
            <Trophy size={12} /> Výhry 25 000 Kč
          </div>
          <h2 className="font-heading font-light text-4xl lg:text-5xl text-slate-900 tracking-tight mb-3">
            Chcete mlhoviště<br />ve vašem prostoru?
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Kontaktujte nás a navrhnou řešení přesně pro váš prostor. Konzultace zdarma.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/kontakt"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all">
            Nezávazná poptávka <ArrowRight size={16} />
          </Link>
          <Link to="/jak-to-funguje"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-slate-900 text-sm font-medium rounded-full border border-slate-200 hover:bg-slate-100 transition-all">
            Kalkulačka nákladů
          </Link>
        </div>
      </div>
    </section>
  );
}