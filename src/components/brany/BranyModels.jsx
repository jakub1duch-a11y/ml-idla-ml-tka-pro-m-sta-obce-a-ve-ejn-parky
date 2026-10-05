import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const MODELS = [
  {
    name: 'GATE70-U',
    tag: 'Rovná brána',
    desc: 'Pravoúhlý tvar z kulaté nerezové trubky Ø70 mm. Nejčistší řešení pro vstupy, cyklostezky a průchozí zóny.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png',
    path: '/gate70'
  },
  {
    name: 'GATE70-V',
    tag: 'Lomený oblouk',
    desc: 'Oblouková varianta pro náměstí a parky, kde má brána fungovat i jako architektonická dominanta.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/effe6c584_file_0000000022a0821096a8f7e02e1adbff.png',
    path: '/gate70'
  },
  {
    name: 'LINEA CE70',
    tag: 'Obloukový systém',
    desc: 'Leštěný jeklový profil s plynulým obloukem — elegantní forma pro promenády, bazény a reprezentativní vstupy.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/82914bed5_C-MlzitkoLINEA_CE70_couple1.png',
    path: '/produkt/linea-el70'
  }
];

export default function BranyModels() {
  return (
    <section className="border-y border-border bg-card py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-secondary">Modely</p>
          <h2 className="mt-4 font-heading text-3xl text-foreground lg:text-4xl">Tři tvary, jedna technologie.</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Všechny brány stojí na stejném základu: nerez AISI 316L, nízkotlaké mlžení a chytré spínání. Liší se tvarem a vyzněním v prostoru.</p>
        </motion.div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {MODELS.map((model, index) => (
            <motion.div key={model.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
              <Link to={model.path} className="group flex h-full flex-col overflow-hidden border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:border-primary">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src={model.image} alt={`Mlžná brána ${model.name}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="font-mono text-[11px] uppercase tracking-[.16em] text-secondary">{model.tag}</p>
                  <h3 className="mt-2 font-heading text-2xl text-foreground">{model.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{model.desc}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Technický detail <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}