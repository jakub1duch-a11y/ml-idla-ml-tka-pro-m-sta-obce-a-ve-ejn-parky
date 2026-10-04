import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Compass, Trees } from 'lucide-react';

const AUDIENCES = [
  {
    icon: Building2,
    tag: 'Města a obce',
    title: 'Řešíte přehřáté náměstí nebo zastávku',
    points: ['Podklady pro radu města i rozpočet', 'Pilotní nasazení na jedno místo', 'Provozní náklady vyčíslené dopředu'],
    path: '/kategorie/mesta-obce'
  },
  {
    icon: Compass,
    tag: 'Architekti a projektanti',
    title: 'Potřebujete prvek, který obstojí v návrhu',
    points: ['Technické listy a schémata napojení', 'Rozměry a tvar na míru dokumentaci', 'Skryté kotvení a čisté detaily'],
    path: '/kategorie/architekti'
  },
  {
    icon: Trees,
    tag: 'Správci parků a areálů',
    title: 'Chcete ochladit místo, kde jsou lidé a děti',
    points: ['Bez chemie, potravinářská nerez', 'Chytré spínání dle teploty a času', 'Servis, zazimování a záruka'],
    path: '/kategorie/parky-hriste'
  }
];

export default function AudienceFitSection() {
  return (
    <section className="border-y border-border bg-card py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-secondary">Hledáte přesně tohle?</p>
          <h2 className="mt-4 font-heading text-3xl text-foreground lg:text-4xl">Tři situace, ve kterých mlžení funguje nejlépe.</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Najděte tu svoji — uvidíte konkrétní řešení, podklady i referenční instalace.</p>
        </motion.div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {AUDIENCES.map((item, index) => (
            <motion.div key={item.tag} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
              <Link to={item.path} className="group flex h-full flex-col border border-border bg-background p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary">
                <item.icon size={26} className="text-primary" />
                <p className="mt-5 font-mono text-[11px] uppercase tracking-[.16em] text-secondary">{item.tag}</p>
                <h3 className="mt-2 font-heading text-2xl text-foreground">{item.title}</h3>
                <ul className="mt-5 space-y-2.5">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent" />{point}
                    </li>
                  ))}
                </ul>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Zobrazit řešení <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}