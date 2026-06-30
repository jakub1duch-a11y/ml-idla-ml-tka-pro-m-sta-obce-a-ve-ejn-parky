import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, CheckCircle, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const BENEFITS = [
  'Ochlazení okolního vzduchu až o 9 °C',
  'Bez chemie — bezpečné pro zdraví i životní prostředí',
  'Smart řízení dle teploty a pohybu',
  'Dotačně podporovatelné jako zelená infrastruktura',
  'Zakázková výroba dle identity místa',
  'Záruka 5 let, servis po celé ČR a SR',
];

const USE_CASES = [
  { emoji: '🏛️', title: 'Náměstí a pěší zóny', desc: 'Dominantní mlžné prvky, které ochladí stovky procházejících a stávají se ikonou místa.' },
  { emoji: '🚌', title: 'Zastávky MHD', desc: 'Kompaktní mlžné stojany u čekáren snižují pocit tepla při čekání na spoj.' },
  { emoji: '🌳', title: 'Revitalizace prostranství', desc: 'Mlžné sochy jako součást nového urbanistického konceptu — funkce i estetika v jednom.' },
  { emoji: '🏃', title: 'Sportovní areály', desc: 'Ochlazení tribun, hřišť a běžeckých zón pro komfort sportovců i diváků.' },
];

export default function MestaObce() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Product.list().catch(() => []).then(p => {
      setProducts((p || []).slice(0, 6));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-ink pt-28">

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
              <Building2 size={18} className="text-cyan" />
            </div>
            <p className="text-xs font-mono tracking-widest uppercase text-cyan">Mlžítka pro Města a Obce</p>
          </div>
          <h1 className="font-heading text-4xl lg:text-6xl text-white mb-6" style={{ fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
            Bojujete v létě<br /><span style={{ fontStyle: 'italic' }}>s tepelnými ostrovy?</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl leading-relaxed font-light mb-8">
            Naše mlžítka efektivně ochlazují vzduch na náměstích, v parcích a podél pěších zón až o 9 °C. Stávají se oblíbenými místy setkávání a zároveň symbolem moderní a starostlivé správy města. Bez chemie, s minimální spotřebou vody a možností dotačního financování.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/poptavka" className="inline-flex items-center gap-2 px-7 py-3.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25">
              Nezávazná konzultace <ArrowRight size={15} />
            </Link>
            <a href="mailto:obchod1@holmtec.cz?subject=Dotaz - Města a obce" className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white text-sm rounded-full hover:bg-white/10 transition-all">
              Napsat přímo
            </a>
          </div>
        </motion.div>
      </div>

      {/* Výhody */}
      <section className="bg-surface border-y border-white/8 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-mono tracking-widest uppercase text-white/40 mb-4">Proč HolmTec pro obce</p>
              <h2 className="text-white text-3xl mb-8" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
                Řešení, které<br /><span style={{ fontStyle: 'italic' }}>funguje a vydrží.</span>
              </h2>
              <ul className="space-y-3">
                {BENEFITS.map(b => (
                  <li key={b} className="flex items-start gap-3 text-sm text-white/60 font-light">
                    <CheckCircle size={15} className="text-cyan shrink-0 mt-0.5" />{b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: '9 °C', label: 'Max. ochlazení' },
                { val: '120+', label: 'Realizací' },
                { val: '5 let', label: 'Záruka' },
                { val: '0%', label: 'Chemie' },
              ].map(s => (
                <div key={s.label} className="p-6 rounded-2xl bg-card_bg border border-white/10 text-center">
                  <p className="font-heading text-3xl text-cyan mb-1" style={{ fontWeight: 800, letterSpacing: '-0.04em' }}>{s.val}</p>
                  <p className="text-xs font-mono text-white/35 tracking-widest uppercase">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Kde se hodí */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <p className="text-xs font-mono tracking-widest uppercase text-white/40 mb-4">Kde mlžítka instalujeme</p>
        <h2 className="text-white text-3xl mb-10" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
          Typická místa<br /><span style={{ fontStyle: 'italic' }}>ve vaší obci.</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {USE_CASES.map((u, i) => (
            <motion.div key={u.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="p-6 rounded-2xl bg-card_bg border border-white/10">
              <span className="text-2xl mb-3 block">{u.emoji}</span>
              <h3 className="text-white font-medium text-sm mb-2">{u.title}</h3>
              <p className="text-xs text-white/45 leading-relaxed font-light">{u.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Produkty */}
      <section className="bg-surface border-y border-white/8 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-xs font-mono tracking-widest uppercase text-white/40 mb-3">Doporučené produkty</p>
          <h2 className="text-white text-3xl mb-10" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>Vhodné modely pro obce.</h2>
          {loading ? (
            <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-cyan/40" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {products.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                  <Link to={`/produkt/${p.slug}`} className="group block bg-card_bg rounded-2xl overflow-hidden border border-white/10 hover:border-cyan/40 transition-all">
                    <div className="aspect-[4/3] overflow-hidden bg-white/5">
                      {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                    </div>
                    <div className="p-5 flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{p.name}</p>
                        {p.short_description && <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{p.short_description}</p>}
                      </div>
                      <ArrowRight size={15} className="text-white/30 group-hover:text-cyan transition-colors shrink-0" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
          <div className="mt-8 text-center">
            <Link to="/kolekce" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors font-mono">
              Zobrazit celý katalog <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="p-10 rounded-2xl bg-cyan/5 border border-cyan/20 text-center">
          <h3 className="text-white text-2xl mb-2" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>Připravíme nabídku pro vaši obec.</h3>
          <p className="text-white/50 text-sm mb-6">Konzultace zdarma · 3D vizualizace do 48 h · Pomoc s dotační žádostí</p>
          <Link to="/poptavka" className="inline-flex items-center gap-2 px-8 py-4 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25">
            Nezávazná poptávka <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}