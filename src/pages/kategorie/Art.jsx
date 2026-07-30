import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import CategoryInquiryForm from '@/components/kategorie/CategoryInquiryForm';
import B2BPortfolioNavigation from '@/components/kategorie/B2BPortfolioNavigation';

const USE_CASES = [
{ emoji: '🎨', title: 'Umělecké instalace', desc: 'Mlžná skulptura jako samostatné umělecké dílo — tvar, světlo a mlha v jednom celku.' },
{ emoji: '🏛️', title: 'Galerie a výstavy', desc: 'Interaktivní exponát, který propojuje design, technologii a smyslový zážitek návštěvníků.' },
{ emoji: '✨', title: 'Site-specific projekty', desc: 'Zakázkové řešení navržené přesně pro konkrétní místo, koncept a příběh.' },
{ emoji: '🌫️', title: 'Světelné a mlžné show', desc: 'Kombinace mlhy, světla a zvuku pro výjimečné veřejné a firemní akce.' }];


export default function Art() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSEO(SEO_PAGES.art);
    base44.entities.Product.list().catch(() => []).then((p) => {
      setProducts((p || []).slice(0, 6));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[80vh] min-h-[560px] w-full overflow-hidden bg-slate-900">
        <video src="https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/94c2b5f74_instalace-mlzitka-mrak.MOV"
        className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-slate-900/20" />
        <div className="relative h-full flex items-end">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-6 lg:px-10 pb-16 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <p className="text-xs font-mono tracking-widest uppercase text-white/70">Art instalace na míru</p>
            </div>
            <h1 className="font-heading text-4xl lg:text-6xl text-white mb-6" style={{ fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
              Mlha jako<br /><span style={{ fontStyle: 'italic' }}>umělecké médium.</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl leading-relaxed font-light mb-8">
              Pro galerie, veřejné instalace a site-specific projekty navrhujeme zcela zakázková mlžná díla. Tvar, materiál i chování mlhy přizpůsobíme vaší umělecké vizi — od skici až po realizaci z nerezové oceli.
            </p>
            <Link to="/poptavka" className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
              Konzultovat záměr <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {USE_CASES.map((u, i) =>
            <motion.div key={u.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
            className="p-6 rounded-2xl bg-white border border-slate-200">
                <span className="text-2xl mb-3 block">{u.emoji}</span>
                <h3 className="text-slate-900 font-medium text-sm mb-2">{u.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-light">{u.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Inspirace pro zakázkové projekty</p>
        <h2 className="text-slate-900 text-3xl mb-8" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>Naše skulptury.</h2>
        {loading ?
        <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-slate-300" /></div> :

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {products.map((p, i) =>
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
          )}
          </div>
        }
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="p-10 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-slate-900 text-2xl mb-2" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>Máte umělecký záměr pro mlžnou instalaci?</h3>
            <p className="text-slate-500 text-sm mb-6">Konzultace konceptu zdarma · Odpovídáme do 24 h</p>
            <Link to="/reference" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-900 text-sm rounded-full hover:bg-slate-100 transition-all">
              Reference realizací <ArrowRight size={14} />
            </Link>
          </div>
          <CategoryInquiryForm category="Art instalace" projectScope="private" />
        </div>
      </section>
      <B2BPortfolioNavigation current="Art instalace na míru" />
    </div>);

}