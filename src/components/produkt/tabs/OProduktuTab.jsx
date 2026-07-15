import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Wrench } from 'lucide-react';

const HIGHLIGHTS = [
  { icon: Sparkles, title: 'Jemná mlha bez mokrých povrchů', text: 'Mikrokapky se odpaří ještě ve vzduchu a přinášejí okamžitý pocit osvěžení.' },
  { icon: ShieldCheck, title: 'Pro veřejný i soukromý prostor', text: 'Nerezová konstrukce je navržená pro každodenní venkovní provoz.' },
  { icon: Wrench, title: 'Řešení na míru', text: 'Pomůžeme s návrhem, kotvením i vhodným způsobem ovládání.' },
];

export default function OProduktuTab({ product }) {
  const description = product.description || product.short_description || 'Nerezová konstrukce navržená pro celoroční venkovní provoz s důrazem na minimalistický design a spolehlivost.';
  const paragraphs = description.split(/\n{2,}/).filter(Boolean);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}>
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">O produktu</p>
          <h2 className="font-heading font-bold text-slate-900 text-3xl lg:text-4xl leading-tight">Navržený pro komfort v horkých dnech.</h2>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.08 }} className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed">
          {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </motion.div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-3 gap-4 mt-12">
        {HIGHLIGHTS.map((item, index) => <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08, duration: 0.5 }} className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><item.icon size={20} className="text-slate-700 mb-4" /><h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3><p className="text-sm leading-relaxed text-slate-500">{item.text}</p></motion.div>)}
      </div>
    </section>
  );
}