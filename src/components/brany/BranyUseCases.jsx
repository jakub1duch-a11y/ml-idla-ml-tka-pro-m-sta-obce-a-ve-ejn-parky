import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Waves, Trees, Tent } from 'lucide-react';

const USE_CASES = [
  { icon: Building2, title: 'Náměstí a promenády', desc: 'Mlžná zóna na trase, kde lidé denně procházejí a nemají kam uhnout před sluncem.' },
  { icon: Waves, title: 'Koupaliště a aquaparky', desc: 'Ochlazení u vstupu a mezi bazény — brána zvládne celodenní letní provoz.' },
  { icon: Trees, title: 'Parky a dětská hřiště', desc: 'Bezpečná hra v horkých dnech: jemná mlha bez chemie a bez klouzavého povrchu.' },
  { icon: Tent, title: 'Eventy a festivaly', desc: 'Rychlá montáž na vstupu do areálu, možnost pronájmu pro jednorázové akce.' }
];

const PARAMS = [
  ['Materiál', 'Nerez AISI 316L, broušený povrch'],
  ['Rozměr', '2 × 2,2 m, upravitelné dle projektu'],
  ['Spotřeba vody', '15–25 l/h při plynulém provozu'],
  ['Tlak mlžení', '3–7 bar — bez čerpadla, z vodovodního řadu'],
  ['Napájení a řízení', '12 V, Wi-Fi modul, teplotní a pohybové senzory'],
  ['Kotvení', 'Skrytá patka v betonu nebo zemní vrut']
];

export default function BranyUseCases() {
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:px-8">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-mono text-[11px] uppercase tracking-[.2em] text-secondary">Kam bránu umístit</p>
            <h2 className="mt-4 font-heading text-3xl text-foreground lg:text-4xl">Místa, kde brána dává smysl.</h2>
          </motion.div>
          <div className="mt-8 grid gap-px bg-border sm:grid-cols-2">
            {USE_CASES.map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.07 }} className="bg-card p-6">
                <item.icon size={24} className="text-primary" />
                <h3 className="mt-4 font-heading text-lg text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-secondary">Technické parametry</p>
          <h2 className="mt-4 font-heading text-3xl text-foreground lg:text-4xl">Podklady pro projektanta.</h2>
          <div className="mt-8 border-t border-border">
            {PARAMS.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:items-baseline sm:gap-6">
                <p className="w-48 shrink-0 font-mono text-[11px] uppercase tracking-[.14em] text-muted-foreground">{label}</p>
                <p className="text-sm font-medium text-foreground">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">Rozměry, počet trysek i způsob kotvení upravujeme podle dokumentace. Technické listy a schémata napojení pošleme na vyžádání.</p>
        </motion.div>
      </div>
    </section>
  );
}