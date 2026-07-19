import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';
import ProductPdfDownloads from '@/components/produkt/ProductPdfDownloads';

const NOZZLE_PDF = 'https://media.base44.com/files/public/6a3ee88c10959cd3588c4d68/96db07d39_drbatrysek.pdf';
const NOZZLE_IMG = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/af0d47654_drbatrysek.png';

const SHARED_DOCS = [
  { title: 'Přípravné práce pro instalaci', desc: 'Stavební příprava, výkopy, betonáž a rozvod vody.', url: 'https://media.base44.com/files/public/6a3ee88c10959cd3588c4d68/b704ccfab_Ppravnprceproinstalacimltka.pdf' },
  { title: 'Detaily ocelového mlžítka', desc: 'Technické výkresy pat a průřezů. Měřítko 1:10.', url: 'https://media.base44.com/files/public/6a3ee88c10959cd3588c4d68/f23bec143_DETAILY_OCELOVEHO_MLZITKA.pdf' },
  { title: 'Péče o trysky — PDF návod', desc: 'Přehledný postup demontáže, čištění a údržby mlžících trysek.', url: NOZZLE_PDF },
  { title: 'Chytré ovládání — prospekt', desc: 'Smart App, Supla Cloud, senzory a automatizace.', url: 'https://media.base44.com/files/public/6a3ee88c10959cd3588c4d68/681f0619c_Chytreovladani.pdf' },
];

export default function DownloadsTab({ product }) {
  const emailFiles = [
    { title: `Technický list — ${product.name}`, desc: 'Kompletní parametry a výkresy k instalaci', subject: `Technický list — ${product.name}` },
    { title: 'Individuální cenová nabídka', desc: 'Nabídka na míru vašemu projektu', subject: `Cenová nabídka — ${product.name}` },
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

        <div className="mb-10 max-w-4xl rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <p className="mb-2 text-xs font-mono uppercase tracking-widest text-slate-400">PDF dokumentace mlzidla.cz</p>
          <p className="mb-5 text-sm text-slate-600">Jednotný český produktový list, instalační postup a údržbový manuál s fotografií, technickými parametry, logem a číslovanou patičkou.</p>
          <ProductPdfDownloads product={product} />
        </div>

        <div className="max-w-2xl space-y-4 mb-10">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Sdílená dokumentace — ke stažení hned</p>
          {SHARED_DOCS.map((f, i) => (
            <motion.a key={f.title} href={f.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between gap-6 p-5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all bg-white">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center"><FileText size={20} className="text-slate-700" /></div>
                <div>
                  <p className="text-slate-900 font-medium text-sm">{f.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{f.desc}</p>
                </div>
              </div>
              <Download size={18} className="text-slate-400 shrink-0" />
            </motion.a>
          ))}
        </div>

        <div className="max-w-2xl mb-10 p-6 rounded-2xl border border-slate-200 bg-slate-50">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Instruktážní foto — péče o trysky</p>
          <img src={NOZZLE_IMG} alt="Instruktážní foto — péče a čištění mlžících trysek"
            className="w-full rounded-2xl border border-slate-200 shadow-sm mb-4" loading="lazy" />
          <a href={NOZZLE_PDF} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all">
            <Download size={15} /> Stáhnout PDF návod k tryskám
          </a>
        </div>

        <div className="max-w-2xl space-y-4">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Dokumenty na vyžádání</p>
          {emailFiles.map((f, i) => (
            <motion.a key={f.title} href={`mailto:obchod1@holmtec.cz?subject=${encodeURIComponent(f.subject)}`}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between gap-6 p-5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center"><FileText size={20} className="text-slate-700" /></div>
                <div>
                  <p className="text-slate-900 font-medium text-sm">{f.title}</p>
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