import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { CheckCircle } from 'lucide-react';

const prostoryOptions = ['Park / veřejné prostranství', 'Náměstí / pěší zóna', 'Koupaliště / bazén', 'Dětské hřiště / škola', 'Festival / akce', 'Průmysl / zemědělství', 'Soukromá zahrada / terasa', 'Jiné'];
const produktyOptions = ['MRAK — Organické křivky', 'LINEA EL70 — Minimalistická čistota', 'GATE_60 — Mlžná brána', 'Kids Edition — Dětská hřiště', 'Smart Control — Aplikace & řízení', 'Volavka — Soukromé zahrady', 'Mlhoviště START (3×3 m)', 'Mlhoviště PARK (6×6 m)', 'Mlhoviště ARENA (12×8 m)', 'Jiné / nevím'];

export default function ContactSection({ product = '' }) {
  const [form, setForm] = useState({ name: '', email: '', project_scope: '', message: product ? `Zájem o: ${product}` : '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await base44.entities.ContactInquiry.create(form);
      setSent(true);
    } catch {
      setError('Nepodařilo se odeslat. Zkuste to prosím znovu nebo nás kontaktujte přímo.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <section id="kontakt" className="py-24 bg-fog">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <CheckCircle size={40} className="text-hydro mx-auto mb-5" />
          <h2 className="font-heading text-3xl font-light text-ink">Poptávka odeslána</h2>
          <p className="text-ink/50 mt-3">Ing. Radek Meduna vám odpoví do 24 hodin s nezávaznou nabídkou na míru.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="kontakt" className="py-24 lg:py-32 bg-fog">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-mono text-[9px] tracking-widest uppercase text-ink/30 mb-3">Poptávka</p>
            <h2 className="font-heading font-light text-4xl lg:text-5xl text-ink tracking-tight leading-tight">
              Ozvěte se nám.
            </h2>
            <p className="mt-5 text-ink/50 text-sm leading-relaxed">
              Rádi připravíme nezávaznou nabídku na míru. Každé místo si zaslouží komfort.
            </p>
            <div className="mt-10 space-y-4 text-sm">
              <div>
                <p className="font-mono text-[9px] tracking-widest uppercase text-ink/30 mb-1">Kontaktní osoba</p>
                <p className="text-ink font-medium">Ing. Radek Meduna</p>
              </div>
              <div>
                <a href="tel:+420774700390" className="text-hydro hover:underline">+420 774 700 390</a>
              </div>
              <div>
                <a href="mailto:obchod1@holmtec.cz" className="text-hydro hover:underline">obchod1@holmtec.cz</a>
              </div>
              <p className="text-ink/40">Trutnov, Česká republika</p>
            </div>
          </motion.div>

          <motion.form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block font-mono text-[9px] tracking-widest uppercase text-ink/40 mb-2">Jméno *</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white border border-steel px-4 py-3 text-sm focus:border-ink outline-none" placeholder="Jan Novák" />
              </div>
              <div>
                <label className="block font-mono text-[9px] tracking-widest uppercase text-ink/40 mb-2">E-mail *</label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white border border-steel px-4 py-3 text-sm focus:border-ink outline-none" placeholder="jan@firma.cz" />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[9px] tracking-widest uppercase text-ink/40 mb-2">Typ prostoru</label>
              <select value={form.project_scope} onChange={e => setForm({ ...form, project_scope: e.target.value })}
                className="w-full bg-white border border-steel px-4 py-3 text-sm focus:border-ink outline-none text-ink/70">
                <option value="">Vyberte typ</option>
                {prostoryOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-mono text-[9px] tracking-widest uppercase text-ink/40 mb-2">Zpráva</label>
              <textarea rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full bg-white border border-steel px-4 py-3 text-sm focus:border-ink outline-none resize-none"
                placeholder="Popište váš projekt, prostor nebo dotaz..." />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" disabled={sending}
              className="px-10 py-4 bg-ink text-white text-xs font-mono tracking-widest uppercase hover:bg-ink/80 transition-all disabled:opacity-50">
              {sending ? 'Odesílám...' : 'Odeslat poptávku'}
            </button>
            <p className="text-xs text-ink/30">Poptávka je zcela nezávazná. Odpovíme do 24 hodin.</p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}