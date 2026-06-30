import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Trees, CheckCircle, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const USE_CASES = [
  { emoji: '🏰', title: 'Zámecké parky', desc: 'Decentní estetika, organické tvary z nerezu — zapadnou do historické zeleně.' },
  { emoji: '🌆', title: 'Městská zeleň', desc: 'Osvěžení parků, alejí a relaxačních zón v centru města.' },
  { emoji: '🧒', title: 'Dětská hřiště', desc: 'Potravinářská nerez, bez chemie. Bezpečné pro nejmenší. Interaktivní tvary.' },
  { emoji: '⚽', title: 'Sportovní areály', desc: 'Ochlazení tribun, hřišť a běžeckých okruhů.' },
];

export default function ParkyHriste() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Product.list().catch(() => []).then(p => {
      setProducts((p || []).slice(0, 6));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-ink pt-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
              <Trees size={18} className="text-emerald-400" />
            </div>
            <p className="text-xs font-mono tracking-widest uppercase text-emerald-400">Parky a hřiště</p>
          </div>
          <h1 className="font-heading text-4xl lg:text-6xl text-white mb-6" style={{ fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
            Příroda v nerezu.<br /><span style={{ fontStyle: 'italic' }}>Chlad v parku.</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl leading-relaxed font-light mb-8">
            Mlžítka pro parky a hřiště jsou navržena tak, aby splynula s přírodním prostředím. Organické tvary inspirované stromy, mraky nebo rostlinami — z potravinářské nerezové oceli bez chemie. Ideální pro dětská hřiště, zámecké parky i městskou zeleň.
          </p>
          <Link to="/poptavka" className="inline-flex items-center gap-2 px-7 py-3.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25">
            Nezávazná konzultace <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>

      <section className="bg-surface border-y border-white/8 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
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
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="mb-8 p-6 rounded-2xl bg-emerald-400/5 border border-emerald-400/20">
          <p className="text-emerald-400 font-medium text-sm mb-2">✓ Bezpečnost pro děti</p>
          <p className="text-white/55 text-sm leading-relaxed">Veškeré naše produkty pro dětská hřiště jsou vyrobeny z potravinářské nerezové oceli AISI 304/316L bez chemických přísad. Mikrotrysky rozptylují kapičky 10–50 μm, které se okamžitě odpařují — žádné mokré povrchy ani louže. Splňujeme normy pro dětská hřiště.</p>
        </div>

        <p className="text-xs font-mono tracking-widest uppercase text-white/40 mb-3">Doporučené produkty</p>
        <h2 className="text-white text-3xl mb-8" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>Vhodné modely pro parky.</h2>
        {loading ? (
          <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-cyan/40" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {products.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Link to={`/produkt/${p.slug}`} className="group block bg-card_bg rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-400/40 transition-all">
                  <div className="aspect-[4/3] overflow-hidden bg-white/5">
                    {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{p.name}</p>
                      {p.short_description && <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{p.short_description}</p>}
                    </div>
                    <ArrowRight size={15} className="text-white/30 group-hover:text-emerald-400 transition-colors shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="p-10 rounded-2xl bg-cyan/5 border border-cyan/20 text-center">
          <h3 className="text-white text-2xl mb-2" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>Navrhneme mlžítko pro váš park.</h3>
          <p className="text-white/50 text-sm mb-6">Konzultace a 3D vizualizace zdarma · Odpovídáme do 24 h</p>
          <Link to="/poptavka" className="inline-flex items-center gap-2 px-8 py-4 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25">
            Nezávazná poptávka <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}