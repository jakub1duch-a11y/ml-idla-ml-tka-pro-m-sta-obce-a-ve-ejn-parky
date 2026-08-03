import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Palette, CloudRain, Cpu, LucideIcon } from 'lucide-react';

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
    label: 'Forma (Materiál a design)',
    items: [
      { 
        icon: ShieldCheck, 
        title: 'Nerezová ocel AISI 316L', 
        text: 'Všechny produkty vyrábíme z vysoce odolné nerezové oceli, která garantuje extrémní životnost ve veřejném prostoru.' 
      },
      { 
        icon: Palette, 
        title: 'Variabilita sortimentu', 
        text: 'Od minimalistických bran GATE70 po zakázkové mlžné sochy – systémy dokonale splynou s architekturou místa.' 
      },
    ]
  },
  {
    label: 'Funkce (Efektivita a Smart technologie)',
    items: [
      { 
        icon: CloudRain, 
        title: 'Vysokotlaká atomizace', 
        text: 'Speciální trysky generují jemnou suchou mlhu, která bleskově ochladí okolí až o 10 °C bez tvoření kapek na zemi.' 
      },
      { 
        icon: Cpu, 
        title: 'Smart APP/WIFI řízení ', 
        text: 'Plná automatizace provozu podle teploty, vzdálená správa přes Wi-Fi aplikaci a sledování reálné spotřeby vody.' 
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
        <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Technologie mlžidla.cz a HolmTec.cz</p>
        <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">Forma a funkce mlžných systémů</h2>
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
