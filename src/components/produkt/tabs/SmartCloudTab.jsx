import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Smartphone, Gauge, Droplet } from 'lucide-react';

const MODES = [
  'Úsporný režim — Cloud aktivní: Detekován pokles teploty, snižuji intenzitu mlžení.',
  'Předpověď deště — Cloud pozastavuje mlžení na příštích 6 hodin.',
  'Hladina nádrže nízká — Automatické omezení chodu, čeká na doplnění.',
  'Slunečno, 28 °C — Zvyšuji intenzitu mlžení, tlak udržován na 5 BAR.',
];

export default function SmartCloudTab() {
  const [modeIdx, setModeIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setModeIdx((i) => (i + 1) % MODES.length), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 max-w-2xl">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">HolmApp · Cloud řízení</p>
        <h2 className="font-heading font-light text-4xl lg:text-5xl text-slate-900 tracking-tight mb-5">
          Mlžení, které<br /><span className="text-slate-400">myslí za vás.</span>
        </h2>
        <p className="text-slate-500 text-base font-light leading-relaxed">
          Nízkotlaký ventil (2–7 BAR) propojený s cloudem HolmApp vyhodnocuje předpověď počasí a automaticky reguluje trysky — úspora vody až 45 % oproti nepřerušovanému provozu.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="relative mx-auto w-[240px] rounded-[2.5rem] border-8 border-slate-900 bg-slate-900 aspect-[9/19] overflow-hidden shadow-2xl">
          <div className="absolute inset-1.5 bg-gradient-to-b from-sky-50 to-white rounded-[2rem] p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Cloud size={16} className="text-sky-500" />
              <span className="text-xs font-medium text-slate-700">HolmApp — Cloud aktivní</span>
            </div>
            <motion.div
              key={modeIdx}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-3 border border-slate-200 text-[11px] text-slate-600 leading-snug flex-1"
            >
              {MODES[modeIdx]}
            </motion.div>
            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>TLAK: 2–7 BAR</span>
              <span>ÚSPORA: 45%</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { icon: Smartphone, title: 'HolmApp řízení', desc: 'Ovládání mlžení odkudkoliv z mobilu, notifikace o stavu systému.' },
            { icon: Cloud, title: 'Předpověď v cloudu', desc: 'Automatická regulace dle teploty, vlhkosti a předpovědi počasí.' },
            { icon: Droplet, title: 'Monitoring nádrží', desc: 'Snímač hladiny vody chrání čerpadlo proti chodu na sucho.' },
            { icon: Gauge, title: 'Nízkotlaký provoz', desc: '2–8 bar — napojení na běžný vodovodní řad bez čerpadel.' },
          ].map((f) => (
            <div key={f.title} className="p-5 rounded-2xl border border-slate-200 bg-white">
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