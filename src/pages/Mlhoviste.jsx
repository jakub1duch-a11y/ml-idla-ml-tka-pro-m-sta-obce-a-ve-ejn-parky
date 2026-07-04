import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Droplets, Sun } from 'lucide-react';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import MlzisteHero from '@/components/mlhoviste/MlzisteHero';
import ModuleCombinations from '@/components/mlhoviste/ModuleCombinations';

const features = [
  { icon: Droplets, title: 'Bez mokrého povrchu', desc: 'Kapky 10–50 μm se odpaří dřív, než dopadnou. Děti nesklouznou.' },
  { icon: Shield, title: 'Certifikované materiály', desc: 'Nerezová ocel 304/316L, potravinářský standard. Bezpečné mlžítka pro děti.' },
  { icon: Zap, title: 'Minimální spotřeba', desc: 'Pouze 6–10 l/h. Bez chemie, bez filtrů, mlžítka bez složité údržby.' },
  { icon: Sun, title: 'Celodenní provoz mlžítek', desc: 'Automatický start při 28 °C. Vypne se sám, když se ochladí. Smart WIFI mlžný systém.' },
];

export default function Mlhoviste() {
  useEffect(() => { setSEO(SEO_PAGES.mlhoviste || SEO_PAGES.kolekce); }, []);

  return (
    <div className="min-h-screen bg-white">
      <MlzisteHero />

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-slate-900 transition-all">
                <f.icon size={20} className="text-slate-700 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-medium text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <ModuleCombinations />

      {/* Videos */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <h2 className="font-heading font-light text-3xl text-slate-900 tracking-tight mb-8">Mlžiště a mlžítka v provozu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <video controls playsInline className="w-full aspect-video object-cover rounded-2xl bg-slate-100">
            <source src="https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/f17970686_video_20260619_162927.mp4" type="video/mp4" />
          </video>
          <video controls playsInline className="w-full aspect-video object-cover rounded-2xl bg-slate-100">
            <source src="https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/c7c9d3e68_video_20260619_164025.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="p-12 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <h2 className="font-heading font-light text-3xl text-slate-900 tracking-tight mb-3">Navrhněme mlžítka, pro váš prostor</h2>
          <p className="text-slate-500 mb-8">Konzultace zdarma. 3D vizualizace mlhoviště do 48 h. Mlžítka a mlžné systémy - Mlžidla.cz</p>
          <Link to="/kontakt"
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all">
            Nezávazná poptávka <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}