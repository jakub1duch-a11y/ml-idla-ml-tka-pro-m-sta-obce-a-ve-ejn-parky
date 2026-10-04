import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ThermometerSnowflake, Gauge, ShieldCheck, Wrench } from 'lucide-react';

const PROOF = [
  { icon: ThermometerSnowflake, value: 'až −10 °C', label: 'pocitová teplota v mlžné zóně' },
  { icon: Gauge, value: 'bez čerpadla', label: 'napojení na běžný vodovodní řad' },
  { icon: ShieldCheck, value: 'AISI 316L', label: 'nerez pro celoroční veřejný provoz' },
  { icon: Wrench, value: 'výroba v ČR', label: 'návrh, výroba, instalace i servis' }
];

export default function B2gHero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-14 lg:pt-32 lg:pb-20">
      <div className="pointer-events-none absolute inset-0 opacity-[0.5]" style={{ backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1.02fr_1fr] lg:gap-16 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-secondary">Pro města, obce a architekty</p>
          <h1 className="mt-4 font-heading text-4xl text-foreground sm:text-5xl lg:text-6xl">
            Chytré chlazení<br />veřejného prostoru.
          </h1>
          <p className="text-measure mt-5 text-lg leading-relaxed text-muted-foreground">
            Nerezová mlžítka a mlžné brány, které sníží pocitovou teplotu na náměstí, promenádě i hřišti — bez mokrého povrchu, bez čerpadla, s chytrým řízením.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/poptavka" className="inline-flex min-h-12 items-center justify-center gap-2 bg-accent px-7 py-4 text-sm font-bold uppercase tracking-[.02em] text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
              Chci návrh a cenovou nabídku <ArrowRight size={16} />
            </Link>
            <Link to="/mlzne-brany" className="inline-flex min-h-12 items-center justify-center gap-2 border border-border px-7 py-4 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary">
              Mlžné brány pro města
            </Link>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">Konzultace i vizualizace zdarma · Odpovídáme do 24 h · Podklady pro projektanty</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.1 }} className="relative">
          <img
            src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e74e5233a_file_000000005214821096b8e88326082970.png"
            alt="Nerezové mlžítko LINEA chladí městskou promenádu v horkém dni"
            className="h-[300px] w-full object-cover shadow-[0_12px_32px_rgba(10,22,40,0.12)] sm:h-[400px] lg:h-[520px]"
            loading="eager" />
          <div className="absolute bottom-0 left-0 right-0 bg-primary/90 px-5 py-4 backdrop-blur-sm sm:left-6 sm:right-auto sm:max-w-xs">
            <p className="font-heading text-sm text-primary-foreground">Mlžná zóna v reálném provozu</p>
            <p className="mt-1 text-xs text-primary-foreground/70">Jemná mlha se odpaří ve vzduchu — povrch zůstává suchý a bezpečný pro chodce.</p>
          </div>
        </motion.div>
      </div>

      <div className="relative mx-auto mt-12 max-w-7xl px-6 lg:mt-16 lg:px-8">
        <div className="grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
          {PROOF.map((item, index) => (
            <motion.div key={item.value} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.07 }} className="bg-card p-5 lg:p-6">
              <item.icon size={22} className="text-primary" />
              <p className="mt-4 font-heading text-xl text-foreground">{item.value}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}