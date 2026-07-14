import React from 'react';
import { motion } from 'framer-motion';
import { Download, Wrench, ShieldCheck, Droplets } from 'lucide-react';

const NOZZLE_PDF = 'https://media.base44.com/files/public/6a3ee88c10959cd3588c4d68/96db07d39_drbatrysek.pdf';
const NOZZLE_IMG = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/af0d47654_drbatrysek.png';

const STEPS = [
  { icon: Wrench, title: 'Demontáž', desc: 'Trysku vyšroubujte ručně bez nářadí, filtr vyjměte opatrně z těla trysky.' },
  { icon: Droplets, title: 'Čištění', desc: 'Propláchněte čistou vodou, případně jemným roztokem octa proti usazenému vodnímu kameni.' },
  { icon: ShieldCheck, title: 'Kontrola a montáž', desc: 'Zkontrolujte filtr a těsnění, poté trysku zpět zašroubujte a otestujte průtok.' },
];

export default function NozzleMaintenanceTab({ product }) {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 max-w-2xl">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Údržba</p>
          <h2 className="font-heading font-light text-4xl lg:text-5xl text-slate-900 tracking-tight mb-5">
            Pravidelná péče<br /><span className="text-slate-400">prodlouží životnost trysky.</span>
          </h2>
          <p className="text-slate-500 text-base font-light leading-relaxed">
            Doporučujeme kontrolu a čištění 1–2× ročně — usazený vodní kámen a nečistoty snižují jemnost mlžení.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
          {STEPS.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl border border-slate-200 bg-white">
              <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <s.icon size={18} className="text-slate-900" />
              </div>
              <p className="text-slate-900 font-medium mb-1.5">{i + 1}. {s.title}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-2xl p-6 rounded-2xl border border-slate-200 bg-slate-50">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Instruktážní foto — péče o trysky</p>
          <img src={NOZZLE_IMG} alt="Instruktážní foto — péče a čištění mlžících trysek"
            className="w-full rounded-2xl border border-slate-200 shadow-sm mb-4" loading="lazy" />
          <a href={NOZZLE_PDF} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all">
            <Download size={15} /> Stáhnout PDF návod k tryskám
          </a>
        </motion.div>
      </div>
    </section>
  );
}