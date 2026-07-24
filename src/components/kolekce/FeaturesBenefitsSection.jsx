import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Waves, Gauge, Wifi, ShieldCheck, Sparkles } from 'lucide-react';

const FEATURES = [
{ icon: Layers, title: 'Nerezová ocel AISI 316L', desc: 'Potravinářská nerez odolná korozi, mrazu i UV záření. Bez nátěrů a chemikálií.' },
{ icon: Waves, title: 'Mikrokapky 10–50 μm', desc: 'Voda se okamžitě odpaří ve vzduchu — chladí prostor, aniž by cokoliv zvlhčila.' },
{ icon: Gauge, title: 'Nízký tlak 2–7 bar', desc: 'Napojení přímo na vodovodní řad, bez nutnosti čerpadla či tlakové stanice.' },
{ icon: Wifi, title: 'Smart Wi-Fi ovládání', desc: 'Automatizace podle teploty, vlhkosti a denní doby přes mobilní aplikaci.' },
{ icon: ShieldCheck, title: '24 měsíců záruka', desc: 'Rychlý záruční i pozáruční servis, pravidelná údržba na vyžádání.' },
{ icon: Sparkles, title: 'Zakázková výroba', desc: 'Tvar, výška i povrchová úprava na míru vašemu prostoru a projektu.' }];


export default function FeaturesBenefitsSection() {
  return (
    <div className="border-t border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <p className="text-xs font-mono tracking-widest uppercase mb-3 text-[hsl(var(--card-foreground))]">VLASTNOSTI A VÝHODY</p>
          <h2 className="font-light text-3xl text-slate-900 tracking-tight [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] lg:text-3xl">Proč zvolit naše mlžítka.</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) =>
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -3 }}
            className="group p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all overflow-hidden bg-[hsl(var(--foreground))] text-[hsl(var(--card))]">
            
              <motion.div
              whileHover={{ scale: 1.15, rotate: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 14 }}
              className="w-11 h-11 rounded-xl border border-slate-200 flex items-center justify-center mb-4 group-hover:bg-slate-900 transition-colors bg-slate-40">
              
                <f.icon size={19} className="text-slate-900 group-hover:text-white transition-colors" />
              </motion.div>
              <h3 className="font-medium mb-1.5 text-[hsl(var(--popover))] text-2xl">{f.title}</h3>
              <p className="leading-relaxed text-base text-[#c2c2c2]">{f.desc}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>);

}