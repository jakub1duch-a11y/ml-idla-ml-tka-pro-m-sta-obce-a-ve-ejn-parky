import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

const contactInfo = [
  { icon: Phone, label: 'Telefon', value: '+420 774 700 390', href: 'tel:+420774700390' },
  { icon: Mail, label: 'Email', value: 'obchod1@holmtec.cz', href: 'mailto:obchod1@holmtec.cz' },
  { icon: MapPin, label: 'Adresa', value: 'Trutnov, Česká republika', href: null },
];

export default function Kontakt() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', product_interest: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await base44.entities.ContactInquiry.create({
        name: form.name,
        email: form.email,
        message: `[Zájem o produkt: ${form.product_interest}] [Firma: ${form.company}] [Tel: ${form.phone}] ${form.message}`,
        status: 'new',
      });
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink pt-28">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-4">KONTAKT</p>
          <h1 className="font-heading font-black text-4xl lg:text-6xl text-white tracking-tight mb-3">
            Jak vám<br /><span className="text-cyan">můžeme pomoci?</span>
          </h1>
          <p className="text-white/50 max-w-lg mx-auto">
            Hardware, software, Smart WiFi, Záruka — všechna jedna místě.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((item) => (
              <motion.div key={item.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-2xl bg-card_bg border border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center flex-shrink-0 border border-cyan/20">
                  <item.icon size={20} className="text-cyan" />
                </div>
                <div>
                  <p className="text-xs font-mono text-white/40 tracking-widest uppercase mb-1">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-white font-medium hover:text-cyan transition-colors">{item.value}</a>
                  ) : (
                    <p className="text-white font-medium">{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
            {sent ? (
              <div className="h-full flex items-center justify-center p-12 rounded-2xl bg-card_bg border border-cyan/30 text-center">
                <div>
                  <div className="w-16 h-16 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-4 border border-cyan/20">
                    <span className="text-3xl">✓</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Poptávka odeslána!</h3>
                  <p className="text-white/50">Ozveme se vám do 24 hodin.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-card_bg border border-white/10 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input type="text" required placeholder="Jméno a příjmení *"
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <input type="email" required placeholder="Email *"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="tel" placeholder="Telefon"
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none transition-all" />
                  <input type="text" placeholder="Firma"
                    value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none transition-all" />
                </div>
                <input type="text" placeholder="O jaký produkt máte zájem?"
                  value={form.product_interest} onChange={e => setForm({ ...form, product_interest: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none transition-all" />
                <textarea required rows={4} placeholder="Váš vzkaz... *"
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none transition-all resize-none" />
                <button type="submit" disabled={sending}
                  className="w-full py-4 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan/25">
                  {sending ? 'Odesílám...' : <>Odeslat poptávku <ArrowRight size={16} /></>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}