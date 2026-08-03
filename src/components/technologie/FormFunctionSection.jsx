import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Layers, Wind, Compass, LucideIcon } from 'lucide-react';

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  text: string;
}

interface SectionData {
  label: string;
  items: FeatureItem[];
}

const SECTIONS: SectionData[] = [
  {
    label: 'Forma (Organická integrace)',
    items: [
      { 
        icon: Sprout, 
        title: 'Přírodní estetika', 
        text: 'Design jemně vychází z organického tvaru stromu a respektuje okolní ráz.' 
      },
      { 
        icon: Layers, 
        title: 'Architektonické začlenění', 
        text: 'Elegantně a přirozeně zapadne do veřejného i soukromého prostranství.' 
      },
    ]
  },
  {
    label: 'Funkce (Mikroklima a orientace)',
    items: [
      { 
        icon: Wind, 
        title: 'Aktivní mikroklima', 
        text: 'Jemná vodní mlha efektivně ochlazuje vzduch a zvyšuje komfort v horkých dnech.' 
      },
      { 
        icon: Compass, 
        title: 'Intuitivní navigace', 
        text: 'Směrovatelné větve navádějí k zajímavým bodům a tvoří přirozený středobod setkávání.' 
      },
    ]
  }
];

export default function FormFunctionSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 lg:px-8 py-16 border-t border-slate-100">
      {/* Hlavní nadpis */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        className="text-center mb-12"
      >
        <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Model OSTEV</p>
        <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">Forma a funkce mlžítka OSTEV</h2>
      </motion.div>

      {/* Grid se sekcemi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
        {SECTIONS.map((section, idx) => (
          <motion.div 
            key={section.label}
            initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
          >
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-6">{section.label}</p>
            <div className="space-y-6">
              {section.items.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-slate-700" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-medium text-sm mb-1">{item.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}