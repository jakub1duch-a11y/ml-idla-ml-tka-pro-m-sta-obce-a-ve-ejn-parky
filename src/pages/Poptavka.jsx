import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader, Phone, Mail, MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const PRODUKTY = [
  'OSTEV (mlžný strom)',
  'MRAK',
  'AURA (kruh)',
  'VOLAVKA',
  'KIDS (hřiště)',
  'GATE 60 (brána)',
  'LINEA EL70',
  'START (terasa)',
  'PARK',
  'ARENA',
  'Jiný / nevím',
];

const inputCls =
  'w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none transition-all';

export default function Poptavka() {
  const [form, setForm] = useState({
    jmeno: '',
    email: '',
    telefon: '',
    firma: '',
    produkt: '',
    zprava: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await base44.entities.Poptavka.create({ ...form, status: 'nova' });
      await base44.functions.invoke('sendPoptavkaNotification', form).catch(() => {});
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
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-4">NEZÁVAZNÁ POPTÁVKA</p>
          <h1 className="font-heading font-black text-4xl lg:text-6xl text-white tracking-tight mb-3">
            Kontaktujte nás
          </h1>
          <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
            Vyplňte formulář a ozveme se vám do 24 hodin s nabídkou na míru.
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Sidebar info */}
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: Phone, label: 'Telefon', value: '+420 774 700 390', href: 'tel:+420774700390' },
              { icon: Mail, label: 'Email', value: 'obchod1@holmtec.cz', href: 'mailto:obchod1@holmtec.cz' },
              { icon: MapPin, label: 'Adresa', value: 'Trutnov, Česká republika', href: null },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-2xl bg-card_bg border border-white/10 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center flex-shrink-0 border border-cyan/20">
                  <item.icon size={20} className="text-cyan" />
                </div>
                <div>
                  <p className="text-xs font-mono text-white/40 tracking-widest uppercase mb-1">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-white font-medium hover:text-cyan transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-white font-medium">{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            <div className="p-5 rounded-2xl bg-cyan/5 border border-cyan/20">
              <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-2">Proč HolmTec</p>
              <ul className="space-y-1.5 text-xs text-white/50 leading-relaxed">
                <li>→ Zakázková výroba z AISI 304 / 316L</li>
                <li>→ Konzultace a 3D vizualizace zdarma</li>
                <li>→ Odpovídáme do 24 hodin</li>
                <li>→ Záruka 5 let na konstrukci</li>
                <li>→ Instalace a servis po celé ČR</li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {sent ? (
              <div className="h-full flex items-center justify-center p-16 rounded-2xl bg-card_bg border border-cyan/30 text-center">
                <div>
                  <div className="w-16 h-16 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-4 border border-cyan/20">
                    <span className="text-3xl text-cyan">✓</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Děkujeme za poptávku!</h3>
                  <p className="text-white/50 mb-4">Ozveme se Vám co nejdříve.</p>
                  <p className="text-white/35 text-xs font-mono leading-relaxed">
                    tel. +420 774 700 390<br />
                    <a href="https://www.mlzidla.cz" target="_blank" rel="noopener noreferrer" className="hover:text-cyan transition-colors">www.mlzidla.cz</a>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-card_bg border border-white/10 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-white/40 tracking-widest uppercase mb-1.5">Jméno a příjmení *</label>
                    <input
                      required
                      type="text"
                      placeholder="Jan Novák"
                      value={form.jmeno}
                      onChange={set('jmeno')}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/40 tracking-widest uppercase mb-1.5">Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="jan@firma.cz"
                      value={form.email}
                      onChange={set('email')}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-white/40 tracking-widest uppercase mb-1.5">Telefon</label>
                    <input
                      type="tel"
                      placeholder="+420 000 000 000"
                      value={form.telefon}
                      onChange={set('telefon')}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/40 tracking-widest uppercase mb-1.5">Firma / organizace</label>
                    <input
                      type="text"
                      placeholder="Název firmy"
                      value={form.firma}
                      onChange={set('firma')}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/40 tracking-widest uppercase mb-1.5">Zájem o produkt</label>
                  <select
                    value={form.produkt}
                    onChange={set('produkt')}
                    className={inputCls + ' cursor-pointer'}
                  >
                    <option value="" className="bg-surface text-white/50">Vyberte produkt...</option>
                    {PRODUKTY.map((p) => (
                      <option key={p} value={p} className="bg-surface text-white">{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/40 tracking-widest uppercase mb-1.5">Zpráva / poptávka *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Popište váš projekt — místo instalace, rozměry prostoru, přibližný počet kusů..."
                    value={form.zprava}
                    onChange={set('zprava')}
                    className={inputCls + ' resize-none'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan/25"
                >
                  {sending ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <>Odeslat poptávku <ArrowRight size={16} /></>
                  )}
                </button>

                <p className="text-xs text-white/25 text-center font-mono">
                  Odesláním souhlasíte se zpracováním osobních údajů.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}