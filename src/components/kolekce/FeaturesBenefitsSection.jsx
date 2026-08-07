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
          <p className="tracking-widest uppercase text-slate-400 mb-3 [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-normal text-lg">VLASTNOSTI A VÝHODY</p>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">Proč zvolit naše mlžítka.</h2>
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
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
            
              <motion.div
              whileHover={{ scale: 1.15, rotate: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 14 }}
              className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
              
                <f.icon size={19} className="text-slate-900" />
              </motion.div>
              <h3 className="text-slate-900 font-medium mb-1.5">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>);

}