import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Tent, CheckCircle, Loader, Phone, Mail } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO, SEO_PAGES } from '@/lib/seo';

const USE_CASES = [
  { emoji: '🎶', title: 'Hudební festivaly', desc: 'Ochlazení před stage i v chill-out zónách. Stane se součástí vizuálního konceptu akce.' },
  { emoji: '🌞', title: 'Letní terasy', desc: 'Sezónní instalace pro restaurace a food festivaly — pronájem nebo koupě.' },
  { emoji: '🏅', title: 'Sportovní akce', desc: 'Ochlazení zázemí, trhu a diváckých zón při venkovních sportovních událostech.' },
  { emoji: '🎪', title: 'Veletrhy a výstavy', desc: 'Mobilní mlžné prvky jako atrakce stánku nebo designový prvek expozice.' },
];

const RENTAL_BENEFITS = [
  'Dodání a odvoz v ceně pronájmu',
  'Montáž a demontáž naším týmem',
  'Technická podpora po dobu akce',
  'Flexibilní délka pronájmu (1 den – celá sezóna)',
  'Pojištění instalace zahrnuto',
];

export default function Eventy() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSEO(SEO_PAGES.eventy);
    base44.entities.Product.list().catch(() => []).then(p => {
      setProducts((p || []).slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-ink pt-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-400/10 border border-rose-400/20 flex items-center justify-center">
              <Tent size={18} className="text-rose-400" />
            </div>
            <p className="text-xs font-mono tracking-widest uppercase text-rose-400">Eventy & festivaly</p>
          </div>
          <h1 className="font-heading text-4xl lg:text-6xl text-white mb-6" style={{ fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
            Mlžítko, které se<br /><span style={{ fontStyle: 'italic' }}>stane hvězdou akce.</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl leading-relaxed font-light mb-8">
            Pronajměte si nebo kupte mobilní mlžné prvky pro festivaly, letní terasy a krátkodobé akce. Rychlá instalace, nezaměnitelná vizuální identita a ochlazení návštěvníků — v jednom balíčku.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/poptavka" className="inline-flex items-center gap-2 px-7 py-3.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25">
              Poptávka pronájmu <ArrowRight size={15} />
            </Link>
            <a href="tel:+420774700390" className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white text-sm rounded-full hover:bg-white/10 transition-all">
              <Phone size={14} /> +420 774 700 390
            </a>
          </div>
        </motion.div>
      </div>

      {/* Pronájem výhody */}
      <section className="bg-surface border-y border-white/8 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-mono tracking-widest uppercase text-rose-400 mb-4">Pronájem na akci</p>
              <h2 className="text-white text-3xl mb-6" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
                Stará se o vás<br /><span style={{ fontStyle: 'italic' }}>náš tým.</span>
              </h2>
              <ul className="space-y-3">
                {RENTAL_BENEFITS.map(b => (
                  <li key={b} className="flex items-start gap-3 text-sm text-white/60 font-light">
                    <CheckCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />{b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: '1 den', label: 'Min. pronájem' },
                { val: '<4 hod', label: 'Instalace' },
                { val: '−9 °C', label: 'Ochlazení' },
                { val: '24/7', label: 'Podpora na akci' },
              ].map(s => (
                <div key={s.label} className="p-6 rounded-2xl bg-card_bg border border-white/10 text-center">
                  <p className="font-heading text-2xl text-cyan mb-1" style={{ fontWeight: 800 }}>{s.val}</p>
                  <p className="text-xs font-mono text-white/35 tracking-widest uppercase">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {USE_CASES.map((u, i) => (
            <motion.div key={u.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="p-6 rounded-2xl bg-card_bg border border-white/10">
              <span className="text-2xl mb-3 block">{u.emoji}</span>
              <h3 className="text-white font-medium text-sm mb-2">{u.title}</h3>
              <p className="text-xs text-white/45 leading-relaxed font-light">{u.desc}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-xs font-mono tracking-widest uppercase text-white/40 mb-3">Vhodné modely k pronájmu / zakoupení</p>
        <h2 className="text-white text-3xl mb-8" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>Mobilní kolekce.</h2>
        {loading ? (
          <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-cyan/40" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {products.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Link to={`/produkt/${p.slug}`} className="group block bg-card_bg rounded-2xl overflow-hidden border border-white/10 hover:border-rose-400/40 transition-all">
                  <div className="aspect-[4/3] overflow-hidden bg-white/5">
                    {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{p.name}</p>
                      {p.short_description && <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{p.short_description}</p>}
                    </div>
                    <ArrowRight size={15} className="text-white/30 group-hover:text-rose-400 transition-colors shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="p-10 rounded-2xl bg-rose-400/5 border border-rose-400/20 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-white text-2xl mb-2" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>Termín se blíží? Napište nám hned.</h3>
            <div className="flex flex-col sm:flex-row gap-4 mt-3 text-sm font-mono text-white/50">
              <a href="tel:+420774700390" className="flex items-center gap-2 hover:text-cyan transition-colors"><Phone size={13} className="text-cyan" /> +420 774 700 390</a>
              <a href="mailto:obchod1@holmtec.cz" className="flex items-center gap-2 hover:text-cyan transition-colors"><Mail size={13} className="text-cyan" /> obchod1@holmtec.cz</a>
            </div>
          </div>
          <Link to="/poptavka" className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-rose-400 text-ink text-sm font-bold rounded-full hover:bg-rose-300 transition-all whitespace-nowrap">
            Poptávka pronájmu <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}