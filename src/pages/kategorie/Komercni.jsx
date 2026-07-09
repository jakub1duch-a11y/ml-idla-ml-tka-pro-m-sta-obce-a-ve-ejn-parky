import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Factory, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import CategoryInquiryForm from '@/components/kategorie/CategoryInquiryForm';

const USE_CASES = [
  { emoji: '🍽️', title: 'Terasy restaurací a kaváren', desc: 'Zákazníci zůstanou déle a objednají víc. Příjemná terasa i v letních vedrech.' },
  { emoji: '🛍️', title: 'Nákupní centra', desc: 'Ochlazení vstupních zón, food courtů a venkovních průchodů.' },
  { emoji: '🎪', title: 'Výstavy a showroomy', desc: 'Mlžné prvky jako součást prezentace — design i chlad.' },
  { emoji: '🏭', title: 'Výrobní a průmyslové haly', desc: 'Ochlazení pracovišť, zvýšení produktivity a bezpečnosti práce při vysokých teplotách.' },
];

export default function Komercni() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSEO(SEO_PAGES.komercni);
    base44.entities.Product.list().catch(() => []).then(p => {
      setProducts((p || []).slice(0, 6));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
              <Factory size={18} className="text-slate-900" />
            </div>
            <p className="text-xs font-mono tracking-widest uppercase text-slate-500">Komerční a industriální prostory</p>
          </div>
          <h1 className="font-heading text-4xl lg:text-6xl text-slate-900 mb-6" style={{ fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
            Chlad, který zvyšuje<br /><span style={{ fontStyle: 'italic' }}>výkon i tržby.</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed font-light mb-8">
            Na terase restaurace, ve výrobní hale i v nákupním centru — mlžná technologie HolmTec zvyšuje komfort zákazníků i pracovníků. Ochlazení až o 9 °C bez klimatizace, minimální spotřeba energie.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="#poptavka" className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all">
              Nezávazná konzultace <ArrowRight size={15} />
            </a>
            <a href="tel:+420774700390" className="inline-flex items-center gap-2 px-7 py-3.5 border border-slate-300 text-slate-900 text-sm rounded-full hover:bg-slate-100 transition-all">
              Zavolat (+420774700390)
            </a>
          </div>
        </motion.div>
      </div>

      <section className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {USE_CASES.map((u, i) => (
              <motion.div key={u.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="p-6 rounded-2xl bg-white border border-slate-200">
                <span className="text-2xl mb-3 block">{u.emoji}</span>
                <h3 className="text-slate-900 font-medium text-sm mb-2">{u.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-light">{u.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { val: '+34 %', label: 'Nárůst tržeb terasy' },
            { val: '+2,4 h', label: 'Delší pobyt hosta' },
            { val: '4–6 týdnů', label: 'Prodloužení sezóny' },
          ].map(s => (
            <div key={s.label} className="p-6 rounded-2xl bg-white border border-slate-200 text-center">
              <p className="font-heading text-2xl text-slate-900 mb-1" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>{s.val}</p>
              <p className="text-xs font-mono text-slate-400 tracking-widest uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Video */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden bg-slate-900">
        <video src="https://media.base44.com/videos/public/69d723859ec0e3321c6b8bb6/a155bfef6_mlzisteprokomercniprostory.mp4"
          className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-slate-900/30" />
        <div className="relative h-full flex items-end">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-7xl mx-auto px-6 lg:px-10 pb-14 w-full max-w-2xl">
            <p className="text-xs font-mono tracking-widest uppercase text-white/60 mb-4">Mlžiště pro komerční prostory</p>
            <h2 className="text-white text-3xl md:text-4xl mb-4" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
              Terasa, kde<br /><span style={{ fontStyle: 'italic' }}>hosté zůstávají.</span>
            </h2>
            <p className="text-white/70 leading-relaxed font-light max-w-xl">
              Mlžný systém na terase prodlouží sezónu o týdny a udrží příjemné mikroklima i v největším horku.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Produkty</p>
        <h2 className="text-slate-900 text-3xl mb-8" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>Vhodné modely.</h2>
        {loading ? (
          <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-slate-300" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {products.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Link to={`/produkt/${p.slug}`} className="group block bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-sm transition-all">
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-slate-900 font-medium">{p.name}</p>
                      {p.short_description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{p.short_description}</p>}
                    </div>
                    <ArrowRight size={15} className="text-slate-300 group-hover:text-slate-900 transition-colors shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section id="poptavka" className="max-w-7xl mx-auto px-6 lg:px-10 pb-20 scroll-mt-24">
        <div className="p-10 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-slate-900 text-2xl mb-2" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>Připravíme nabídku pro váš provoz.</h3>
            <p className="text-slate-500 text-sm mb-6">Konzultace a 3D vizualizace zdarma · Odpovídáme do 24 h</p>
            <Link to="/reference" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-900 text-sm rounded-full hover:bg-slate-100 transition-all">
              Reference realizací <ArrowRight size={14} />
            </Link>
          </div>
          <CategoryInquiryForm category="Komerční prostory" projectScope="industrial" />
        </div>
      </section>
    </div>
  );
}