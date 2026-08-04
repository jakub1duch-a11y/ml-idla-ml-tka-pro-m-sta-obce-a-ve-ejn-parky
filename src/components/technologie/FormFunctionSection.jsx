import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Palette, CloudRain, Cpu } from 'lucide-react';

const FEATURE_SECTIONS = [
{
  label: 'Forma (Materiál a design)',
  items: [
  { icon: ShieldCheck, title: 'Nerezová ocel AISI 316L', text: 'Všechny produkty vyrábíme z vysoce odolné nerezové oceli, která garantuje extrémní životnost ve veřejném prostoru.' },
  { icon: Palette, title: 'Variabilita sortimentu', text: 'Od minimalistických bran GATE70 po zakázkové mlžné sochy – systémy dokonale splynou s architekturou místa.' }]

},
{
  label: 'Funkce (Efektivita a Smart technologie)',
  items: [
  { icon: CloudRain, title: 'Vysokotlaká atomizace', text: 'Speciální trysky generují jemnou suchou mlhu, která bleskově ochladí okolí až o 10 °C bez tvoření kapek na zemi.' },
  { icon: Cpu, title: 'Smart APP/WIFI řízení', text: 'Plná automatizace provozu podle teploty, vzdálená správa přes Wi-Fi aplikaci a sledování reálné spotřeby vody.' }]

}];


export default function FormFunctionSection() {
  return (
    <section className="mx-auto max-w-5xl border-t border-slate-100 px-6 py-16 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-400">Technologie mlžidla.cz a HolmTec.cz</p>
        <h2 className="font-heading text-3xl font-light tracking-tight text-slate-900 lg:text-4xl">Forma a funkce mlžných systémů</h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
        {FEATURE_SECTIONS.map((section, sectionIndex) =>
        <motion.div key={section.label} initial={{ opacity: 0, x: sectionIndex === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="mb-6 font-mono text-xs uppercase tracking-widest text-slate-400">{section.label}</p>
            <div className="space-y-6">
              {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                      <Icon size={18} className="text-slate-700" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-medium text-slate-900 text-lg">{item.title}</h3>
                      <p className="leading-relaxed text-slate-500 text-sm">{item.text}</p>
                    </div>
                  </div>);

            })}
            </div>
          </motion.div>
        )}
      </div>
    </section>);

}