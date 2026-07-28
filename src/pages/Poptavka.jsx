import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader, Phone, Mail, MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackContactFormSubmit, trackInquirySubmitted } from '@/lib/ga4';
import { setSEO, SEO_PAGES } from '@/lib/seo';

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
  'w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:border-slate-400 focus:outline-none transition-all';

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
  const navigate = useNavigate();

  useEffect(() => { setSEO(SEO_PAGES.poptavka); }, []);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await base44.entities.Poptavka.create({ ...form, status: 'nova' });
      trackContactFormSubmit('poptavka', form.produkt);
      trackInquirySubmitted('poptavka', form.produkt);
      navigate('/dekujeme?zdroj=poptavka');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-28">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Nezávazná poptávka</p>
          <h1 className="font-heading font-light text-4xl lg:text-6xl text-slate-900 tracking-tight mb-3">
            Kontaktujte nás
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
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
              { icon: MapPin, label: 'Adresa', value: '541 02 Trutnov, Horní staré město 698, Česká republika', href: null },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 border border-slate-200">
                  <item.icon size={20} className="text-slate-700" />
                </div>
                <div>
                  <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-1">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-slate-900 font-medium hover:text-slate-600 transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-slate-900 font-medium">{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-mono text-slate-500 tracking-widest uppercase mb-2">Proč HolmTec</p>
              <ul className="space-y-1.5 text-xs text-slate-500 leading-relaxed">
                <li>→ Zakázková výroba mlžítek z nerezové oceli 304 / 316L</li>
                <li>→ Konzultace a 3D vizualizace mlžítka zdarma</li>
                <li>→ Odpovídáme do 24 hodin</li>
                <li>→ Záruka na konstrukci</li>
                <li>→ Mlžítka vyráběné v ČR</li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-1.5">Jméno a příjmení *</label>
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
                    <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-1.5">Email *</label>
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
                    <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-1.5">Telefon</label>
                    <input
                      type="tel"
                      placeholder="+420 000 000 000"
                      value={form.telefon}
                      onChange={set('telefon')}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-1.5">Firma / organizace</label>
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
                  <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-1.5">Zájem o produkt</label>
                  <select
                    value={form.produkt}
                    onChange={set('produkt')}
                    className={inputCls + ' cursor-pointer'}
                  >
                    <option value="">Vyberte produkt (mlžítko)...</option>
                    {PRODUKTY.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-1.5">Zpráva / poptávka *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Popište váš mlžný projekt — místo instalace, rozměry prostoru, přibližný počet kusů mlžítek..."
                    value={form.zprava}
                    onChange={set('zprava')}
                    className={inputCls + ' resize-none'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-metallic-mist w-full py-4 text-sm font-bold justify-center disabled:opacity-50"
                >
                  {sending ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <>Odeslat poptávku <ArrowRight size={16} /></>
                  )}
                </button>

                <p className="text-xs text-slate-400 text-center font-mono">
                  Odesláním souhlasíte se zpracováním osobních údajů.
                </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}