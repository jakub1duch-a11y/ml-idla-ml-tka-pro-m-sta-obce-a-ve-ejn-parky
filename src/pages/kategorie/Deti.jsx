import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Baby, Loader, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import CategoryInquiryForm from '@/components/kategorie/CategoryInquiryForm';

const USE_CASES = [
  { emoji: '🏫', title: 'Základní školy', desc: 'Ochlazení školních dvorů a venkovních areálů během horkých dnů, bezpečné pro provoz o přestávkách.' },
  { emoji: '🧸', title: 'Mateřské školky', desc: 'Jemná mlha bez tlakového rizika, potravinářská nerez a materiály certifikované pro dětské prostory.' },
  { emoji: '🛝', title: 'Dětská hřiště', desc: 'Interaktivní mlžné prvky, které dětem přinášejí radost a rodičům klid — bez chemie, bez rizika uklouznutí.' },
  { emoji: '🎠', title: 'Zábavní centra', desc: 'Mlžné instalace jako atrakce v dětských zábavních a volnočasových centrech.' },
];

const SAFETY = [
  'Potravinářská nerezová ocel AISI 316L',
  'Nízkotlaká mlha bez rizika uklouznutí',
  'Žádná chemie ani přísady ve vodě',
  'Certifikované materiály pro veřejné prostory',
];

export default function Deti() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSEO(SEO_PAGES.deti);
    base44.entities.Product.list().catch(() => []).then(p => {
      setProducts((p || []).slice(0, 6));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[80vh] min-h-[560px] w-full overflow-hidden bg-slate-900">
        <video src="https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/e557b652c_generated_video.mp4"
          className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-slate-900/20" />
        <div className="relative h-full flex items-end">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-6 lg:px-10 pb-16 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Baby size={18} className="text-white" />
              </div>
              <p className="text-xs font-mono tracking-widest uppercase text-white/70">Školy, školky a děti</p>
            </div>
            <h1 className="font-heading text-4xl lg:text-6xl text-white mb-6" style={{ fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
              Bezpečný chlad<br /><span style={{ fontStyle: 'italic' }}>pro dětskou radost.</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl leading-relaxed font-light mb-8">
              Pro školy, školky a dětská hřiště navrhujeme mlžné systémy, které jsou bezpečné, jemné a bez chemie. Ochlazení až o 9 °C bez rizika uklouznutí — děti si mlhu užijí, rodiče i pedagogové budou mít klid.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#poptavka" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-slate-100 transition-all">
                Nezávazná konzultace <ArrowRight size={15} />
              </a>
              <a href="tel:+420774700390" className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/30 text-white text-sm rounded-full hover:bg-white/10 transition-all">
                Zavolat (+420774700390)
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-mono tracking-widest uppercase text-slate-500 mb-4">Bezpečnost na prvním místě</p>
              <h2 className="text-slate-900 text-3xl mb-6" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
                Navrženo pro<br /><span style={{ fontStyle: 'italic' }}>ty nejmenší.</span>
              </h2>
              <ul className="space-y-3">
                {SAFETY.map(s => (
                  <li key={s} className="flex items-start gap-3 text-sm text-slate-600 font-light">
                    <ShieldCheck size={15} className="text-slate-900 shrink-0 mt-0.5" />{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {USE_CASES.map((u, i) => (
                <motion.div key={u.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="p-5 rounded-2xl bg-white border border-slate-200 sm:col-span-1 lg:col-span-2">
                  <span className="text-2xl mb-2 block">{u.emoji}</span>
                  <h3 className="text-slate-900 font-medium text-sm mb-1.5">{u.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">{u.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Radost na fotkách</p>
        <h2 className="text-slate-900 text-3xl mb-8" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>Děti u mlžítka.</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'https://media.base44.com/images/public/69d723859ec0e3321c6b8bb6/d851d598c_mlznehriste-mlzitkohvezda.jpg',
            'https://media.base44.com/images/public/69d723859ec0e3321c6b8bb6/503ff73d9_mlznehriste-kopie.jpeg',
            'https://media.base44.com/images/public/69d723859ec0e3321c6b8bb6/03417fa65_mlznehriste.jpeg',
            'https://media.base44.com/images/public/69d723859ec0e3321c6b8bb6/94d1e1f92_Mlzitko-pro-deti-na-hadici-kvet-VDMA.webp',
          ].map((src, i) => (
            <motion.div key={src} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="aspect-square rounded-2xl overflow-hidden group">
              <img src={src} alt="Děti u mlžítka" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Vhodné modely</p>
        <h2 className="text-slate-900 text-3xl mb-8" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>Pro školy a hřiště.</h2>
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
            <h3 className="text-slate-900 text-2xl mb-2" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>Připravíme řešení pro vaši školu či hřiště.</h3>
            <p className="text-slate-500 text-sm mb-6">Konzultace a návrh zdarma · Odpovídáme do 24 h</p>
            <Link to="/reference" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-900 text-sm rounded-full hover:bg-slate-100 transition-all">
              Reference realizací <ArrowRight size={14} />
            </Link>
          </div>
          <CategoryInquiryForm category="Školy, školky a děti" projectScope="urban" />
        </div>
      </section>
    </div>
  );
}