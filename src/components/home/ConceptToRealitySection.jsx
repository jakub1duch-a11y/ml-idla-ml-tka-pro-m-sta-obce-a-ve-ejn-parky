import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Settings, Factory, HardHat } from 'lucide-react';

const STEPS = [
{ num: '1', title: 'Koncept a inspirace', icon: Compass, text: <>Probereme ideální tvar — od organických motivů (pávi ocas, mrak) po lokální symboly vašeho místa. <span className="font-bold text-foreground">Konzultace zdarma.</span></> },
{ num: '2', title: 'CAD a technická podpora', icon: Settings, text: 'Návrh zapracujeme do projektové dokumentace a s architekty ověříme, že je reálně vyrobitelný.' },
{ num: '3', title: 'Zakázková výroba', icon: Factory, text: 'Vyrábíme ve vlastní dílně s využitím 22 let zkušeností dceřiné společnosti Ohýbací centrum HolmTec.' },
{ num: '4', title: 'Rychlá instalace', icon: HardHat, text: 'Montáž provádíme s důrazem na bezpečnost provozu i na estetiku finálního výsledku.' }];


export default function ConceptToRealitySection() {
  return (
    <section className="border-y border-border bg-background py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">Jak vzniká vaše mlžítko</p>
          <h2 className="font-heading text-4xl tracking-tight text-foreground md:text-5xl">Od skici na papíře po mlhu na místě</h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: index % 2 === 0 ? 24 : 4 }}
                whileInView={{ opacity: 1, y: index % 2 === 0 ? 12 : 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="relative rounded-2xl border border-border bg-card p-6">
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-heading text-3xl text-secondary">{step.num}</span>
                  <Icon size={22} className="text-muted-foreground" strokeWidth={1.6} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground [font-family:'Plus_Jakarta_Sans',_sans-serif]">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </motion.div>);

          })}
        </div>
      </div>
    </section>);

}
