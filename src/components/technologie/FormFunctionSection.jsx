import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Palette, CloudRain, Cpu } from 'lucide-react';

const FEATURE_SECTIONS = [
{
  label: 'Forma (Materiál a design)',
  items: [
  { icon: ShieldCheck, title: 'Nerez podle konkrétní řady', text: 'U městských a prémiových řad používáme korozivzdorné nerezové materiály včetně AISI 316L. Přesný materiál a povrch uvádíme vždy u konkrétního produktu nebo projektu.' },
  { icon: Palette, title: 'Variabilita sortimentu', text: 'Od minimalistických bran GATE70 po zakázkové mlžné sochy – systémy dokonale splynou s architekturou místa.' }]

},
{
  label: 'Funkce (Efektivita a Smart technologie)',
  items: [
  { icon: CloudRain, title: 'Nízkotlaké mlžení', text: 'U nízkotlakých řad volíme trysku, tlak a průtok jako jeden celek. Cílem je jemný rozptyl vody odpovídající konkrétnímu prostoru bez potřeby vysokotlakého čerpadla.' },
  { icon: Cpu, title: 'Volitelné smart řízení', text: 'Podle projektu lze doplnit časový program, teplotní podmínky, vzdálené ovládání nebo více samostatných zón. Telemetrie a další senzory jsou volitelné podle zvolené sestavy.' }]

}];


export default function FormFunctionSection() {
  return (
    <section className="mx-auto max-w-7xl border-t border-slate-100 px-6 py-16 lg:px-10">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 max-w-3xl">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-400">Technologie mlžidla.cz a HolmTec.cz</p>
        <h2 className="font-heading text-3xl tracking-[-.02em] text-foreground sm:text-4xl lg:text-5xl">Forma a funkce mlžných systémů</h2>
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
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                    </div>
                  </div>);

            })}
            </div>
          </motion.div>
        )}
      </div>
    </section>);

}