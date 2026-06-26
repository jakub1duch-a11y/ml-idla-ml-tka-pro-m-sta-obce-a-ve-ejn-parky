import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Send, CheckCircle } from 'lucide-react';

const scopeOptions = [
  { value: 'urban', label: 'Veřejný prostor' },
  { value: 'industrial', label: 'Průmyslový provoz' },
  { value: 'private', label: 'Rezidenční / Soukromé' },
  { value: 'event', label: 'Event / Gastronomie' },
];

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', project_scope: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      await base44.entities.ContactInquiry.create(form);
      setSent(true);
    } catch (err) {
      setError('Nepodařilo se odeslat zprávu. Zkuste to prosím znovu.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <section id="kontakt" className="py-24 lg:py-32 bg-tectonic">
        <div className="max-w-3xl mx-auto px-6 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle size={48} className="text-hydro mx-auto mb-6" />
            <h2 className="text-3xl font-heading font-light text-white mb-4">Děkujeme za poptávku</h2>
            <p className="text-white/60">Ozveme se vám do 24 hodin s návrhem řešení pro váš projekt.</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="kontakt" className="py-24 lg:py-32 bg-tectonic">
      <div className="max-w-4xl mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-hydro text-sm font-mono tracking-widest uppercase mb-3">Konzultace</p>
          <h2 className="text-3xl lg:text-5xl font-heading font-light text-white tracking-tight mb-4">
            Popište váš termální problém
          </h2>
          <p className="text-white/40 text-base mb-12 max-w-xl">
            Každý projekt začíná rozhovorem. Řekněte nám o svém prostoru a my navrhneme optimální řešení.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-widest mb-3">Jméno</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-transparent border-b border-white/20 text-white py-3 focus:border-hydro outline-none transition-colors placeholder:text-white/20"
                  placeholder="Jan Novák"
                />
              </div>
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-widest mb-3">E-mail</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-transparent border-b border-white/20 text-white py-3 focus:border-hydro outline-none transition-colors placeholder:text-white/20"
                  placeholder="jan@firma.cz"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/40 text-xs uppercase tracking-widest mb-3">Rozsah projektu</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {scopeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, project_scope: opt.value })}
                    className={`px-4 py-3 border text-sm transition-all ${
                      form.project_scope === opt.value
                        ? 'border-hydro bg-hydro/10 text-hydro'
                        : 'border-white/20 text-white/60 hover:border-white/40'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white/40 text-xs uppercase tracking-widest mb-3">
                Popište termální výzvu
              </label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-transparent border-b border-white/20 text-white py-3 focus:border-hydro outline-none transition-colors resize-none placeholder:text-white/20"
                placeholder="Popište váš prostor, rozměry, požadavky na chlazení..."
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-3 px-10 py-4 bg-hydro text-white text-sm font-medium tracking-wider uppercase hover:bg-hydro/90 transition-all disabled:opacity-50"
            >
              {sending ? 'Odesílám...' : 'Odeslat poptávku'}
              <Send size={16} />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}