import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Volume1, SunSnow, Wrench, Smartphone, Move, ShieldCheck, Award, Headset } from 'lucide-react';

const FEATURES = [
  { icon: Sparkles, title: 'Samočistící tryska', desc: 'Vnitřní filtr a konstrukce trysky brání usazování vodního kamene a prodlužuje interval údržby.' },
  { icon: Volume1, title: 'Tichý provoz', desc: 'Hladina hluku pod 40 dB — mlžení nenarušuje pohodu okolí ani v klidových zónách.' },
  { icon: SunSnow, title: 'Odolnost UV a mrazu', desc: 'Nerezová konstrukce a komponenty snáší celoroční venkovní provoz i extrémní teploty.' },
  { icon: Wrench, title: 'Rychlá montáž', desc: 'Systém Plug & Mist — napojení na vodovodní řad bez čerpadla, instalace do jednoho dne.' },
  { icon: Smartphone, title: 'Chytré řízení', desc: 'Programovatelné scénáře, ovládání z mobilní aplikace, kompatibilní se SMART moduly.' },
  { icon: Move, title: 'Mobilní i pevná instalace', desc: 'Volitelně na zemní vrut pro rychlé přemístění, nebo na skrytou patku pro trvalé kotvení.' },
];

const WARRANTY = [
  { icon: ShieldCheck, value: '5 let', title: 'Nerezová konstrukce', desc: 'Záruka na materiál a svary konstrukce proti korozi a mechanickému poškození.' },
  { icon: Award, value: '2 roky', title: 'Elektronika a trysky', desc: 'Záruka na řídicí elektroniku, čerpadla (je-li součástí) a mlžící trysky.' },
  { icon: Headset, value: '24/7', title: 'Podpora a servis', desc: 'Odborná podpora po celou dobu provozu, rychlý záruční i pozáruční servis.' },
];

function FeatureCard({ f, i }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all">
      <motion.div animate={hovered ? { scale: 1.12, rotate: 3 } : { scale: 1, rotate: 0 }} transition={{ duration: 0.3 }}
        className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <f.icon size={17} className="text-slate-900" />
      </motion.div>
      <p className="text-slate-900 font-medium text-sm mb-1">{f.title}</p>
      <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
    </motion.div>
  );
}

function WarrantyCard({ w, i }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="p-6 rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-800 transition-colors">
      <motion.div animate={hovered ? { y: [0, -4, 0] } : { y: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-2 mb-3">
        <w.icon size={16} className="text-cyan" />
        <span className="text-2xl font-heading font-bold text-white tracking-tight">{w.value}</span>
      </motion.div>
      <p className="text-white text-sm font-medium mb-1.5">{w.title}</p>
      <AnimatePresence>
        {hovered && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }} className="text-xs text-white/50 leading-relaxed overflow-hidden">
            {w.desc}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FeaturesWarrantySection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-14 mt-16">
      <div>
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Funkce</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => <FeatureCard key={f.title} f={f} i={i} />)}
        </div>
      </div>
      <div>
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Záruka kvality</p>
        <div className="flex flex-col gap-4">
          {WARRANTY.map((w, i) => <WarrantyCard key={w.title} w={w} i={i} />)}
        </div>
      </div>
    </div>
  );
}