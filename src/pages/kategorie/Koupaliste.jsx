import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Waves, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import CategoryInquiryForm from '@/components/kategorie/CategoryInquiryForm';
import B2BPortfolioNavigation from '@/components/kategorie/B2BPortfolioNavigation';

const USE_CASES = [
  { emoji: '🏊', title: 'Koupaliště a aquaparky', desc: 'Ochlazení relaxačních zón, stínových koutů a vstupních prostor.' },
  { emoji: '🏖️', title: 'Přírodní pláže', desc: 'Přenosné mlžné prvky pro letní sezónu. Rychlá instalace, bez stavebního povolení.' },
  { emoji: '🏕️', title: 'Kempy a rekreační střediska', desc: 'Komfort pro hosty v létě bez nutnosti klimatizace.' },
  { emoji: '🌊', title: 'Okolí bazénů', desc: 'Dekorativní mlžné sloupy, které osvěží posezení u vody.' },
];

export default function Koupaliste() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSEO(SEO_PAGES.koupaliste);
    base44.entities.Product.list().catch(() => []).then(p => {
      setProducts((p || []).slice(0, 6));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[80vh] min-h-[560px] w-full overflow-hidden bg-slate-900">
        <video src="https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/9eb62596b_generated_video.mp4"
          className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-slate-900/20" />
        <div className="relative h-full flex items-end">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-6 lg:px-10 pb-16 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Waves size={18} className="text-white" />
              </div>
              <p className="text-xs font-mono tracking-widest uppercase text-white/70">Koupaliště, aquaparky & kempy</p>
            </div>
            <h1 className="font-heading text-4xl lg:text-6xl text-white mb-6" style={{ fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
              Chlad i tam,<br /><span style={{ fontStyle: 'italic' }}>kde je voda všude.</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl leading-relaxed font-light mb-8">
              I u vody může být horko. Naše mlžítka vytvářejí příjemné mikroklima v relaxačních zónách koupališť, aquaparků a kempů. Oceníte je jako dekorativní i funkční prvky — bez nutnosti vodního zdroje u každého kusu, jen přívod z vodovodního řadu.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#poptavka" className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
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

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Tematický design</p>
        <h2 className="text-slate-900 text-3xl mb-8" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
          Zážitek, kvůli kterému<br /><span style={{ fontStyle: 'italic' }}>se návštěvníci vrátí.</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            'https://media.base44.com/images/public/69d723859ec0e3321c6b8bb6/284079174_mlzitk-hvezdaauzovka.jpeg',
            'https://media.base44.com/images/public/69d723859ec0e3321c6b8bb6/503ff73d9_mlznehriste-kopie.jpeg',
            'https://media.base44.com/images/public/69d723859ec0e3321c6b8bb6/910eb2c63_bendymlzitko-steblo.jpeg',
            'https://media.base44.com/images/public/69d723859ec0e3321c6b8bb6/d851d598c_mlznehriste-mlzitkohvezda.jpg',
          ].map((src, i) => (
            <motion.div key={src} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="aspect-square rounded-2xl overflow-hidden group">
              <img src={src} alt="Mlžítko v ZOO / koupališti" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
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
            <h3 className="text-slate-900 text-2xl mb-2" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>Připravíme nabídku pro váš areál.</h3>
            <p className="text-slate-500 text-sm mb-6">Konzultace zdarma · Odpovídáme do 24 h</p>
            <Link to="/reference" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-900 text-sm rounded-full hover:bg-slate-100 transition-all">
              Reference realizací <ArrowRight size={14} />
            </Link>
          </div>
          <CategoryInquiryForm category="Koupaliště & aquaparky" projectScope="urban" />
        </div>
      </section>
      <B2BPortfolioNavigation current="Koupaliště & aquaparky" />
    </div>
  );
}