import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';

export default function DownloadsTab({ product }) {
  const files = [
    { title: 'Technický list (PDF)', desc: 'Kompletní parametry a výkresy k instalaci', subject: `Technický list — ${product.name}` },
    { title: 'Cenová nabídka', desc: 'Individuální nabídka na míru vašemu projektu', subject: `Cenová nabídka — ${product.name}` },
    { title: 'Montážní návod', desc: 'Postup instalace a zapojení systému', subject: `Montážní návod — ${product.name}` },
  ];

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 max-w-2xl">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Ke stažení</p>
          <h2 className="font-heading font-light text-4xl lg:text-5xl text-slate-900 tracking-tight mb-5">
            Podklady a dokumentace<br /><span className="text-slate-400">k produktu {product.name}.</span>
          </h2>
          <p className="text-slate-500 text-base font-light leading-relaxed">
            Vyžádejte si technické podklady, montážní návod či individuální cenovou nabídku — odpovídáme do 24 h.
          </p>
        </motion.div>

        <div className="max-w-2xl space-y-4">
          {files.map((f, i) => (
            <motion.a key={f.title} href={`mailto:obchod1@holmtec.cz?subject=${encodeURIComponent(f.subject)}`}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between gap-6 p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center"><FileText size={20} className="text-slate-700" /></div>
                <div>
                  <p className="text-slate-900 font-medium">{f.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{f.desc}</p>
                </div>
              </div>
              <Download size={18} className="text-slate-400 shrink-0" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}