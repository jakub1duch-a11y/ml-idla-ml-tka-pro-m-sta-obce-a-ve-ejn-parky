import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Wrench } from 'lucide-react';

export default function InstallationTab({ product }) {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 max-w-2xl">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Plug &amp; Mist · AISI 316L</p>
          <h2 className="font-heading font-light text-4xl lg:text-5xl text-slate-900 tracking-tight mb-5">
            Instalace a kotvení<br /><span className="text-slate-400">bez betonování.</span>
          </h2>
          <p className="text-slate-500 text-base font-light leading-relaxed">
            Nerezová ocel AISI 316L / 1.4301, přímé napojení na vodovod (2–7 BAR) — Plug &amp; Mist bez nutnosti vysokotlakých čerpadel.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="p-8 rounded-2xl border border-slate-200 bg-white relative overflow-hidden">
            <div className="absolute top-6 right-6 px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-bold tracking-widest uppercase rounded-full">
              Instalace 30 min
            </div>
            <span className="inline-block px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono tracking-widest uppercase rounded-full mb-6">Mobilní</span>
            <h3 className="text-2xl font-light text-slate-900 mb-3">Zemní vrut + kolečka</h3>
            <p className="text-sm text-slate-500 font-light mb-6 leading-relaxed">
              Transportní kolečka a integrované úchyty na těle konstrukce, kotvení masivním zemním vrutem se závitem. Kompletní instalace a zprovoznění za 30 minut, bez betonování.
            </p>
            <div className="space-y-3 text-sm text-slate-600 font-light">
              <div className="flex items-start gap-3"><span className="text-emerald-600 font-bold mt-0.5">✓</span><span>Zašroubování vrutu bez speciálního nářadí</span></div>
              <div className="flex items-start gap-3"><span className="text-emerald-600 font-bold mt-0.5">✓</span><span>Snadné přemístění na nový spot</span></div>
              <div className="flex items-start gap-3"><span className="text-emerald-600 font-bold mt-0.5">✓</span><span>Ideální pro zahrady a sezónní akce</span></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="p-8 rounded-2xl border border-slate-200 bg-white">
            <span className="inline-block px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono tracking-widest uppercase rounded-full mb-6">Stálá instalace</span>
            <h3 className="text-2xl font-light text-slate-900 mb-3">Skrytá kotvící patka</h3>
            <p className="text-sm text-slate-500 font-light mb-6 leading-relaxed">
              Patka skrytá pod úrovní terénu pro fixní městské instalace — čistý vzhled bez viditelného kotvení, maximální stabilita pro veřejný prostor.
            </p>
            <div className="space-y-3 text-sm text-slate-600 font-light">
              <div className="flex items-start gap-3"><span className="text-blue-600 font-bold mt-0.5">✓</span><span>Maximální stabilita a bezpečnost</span></div>
              <div className="flex items-start gap-3"><span className="text-blue-600 font-bold mt-0.5">✓</span><span>Profesionální vzhled bez viditelného kotvení</span></div>
              <div className="flex items-start gap-3"><span className="text-blue-600 font-bold mt-0.5">✓</span><span>Vhodné pro náměstí, parky, permanentní projekty</span></div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-20">
          {[
            { icon: ShieldCheck, title: 'Pojistný ventil', desc: 'Hardwarová ochrana proti přetlaku v řadu nad 7 BAR.' },
            { icon: ShieldCheck, title: 'Kryt proti krupobití', desc: 'Mechanický štít solárního panelu, 100% odolnost proti krupobití.' },
            { icon: Wrench, title: 'Bez čerpadel', desc: 'Provoz přímo na 2–7 BAR z běžného vodovodního řadu.' },
          ].map((f) => (
            <div key={f.title} className="p-5 rounded-2xl border border-slate-200 bg-slate-50">
              <f.icon size={20} className="text-slate-500 mb-3" />
              <h3 className="text-slate-900 text-sm font-medium mb-1.5">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}