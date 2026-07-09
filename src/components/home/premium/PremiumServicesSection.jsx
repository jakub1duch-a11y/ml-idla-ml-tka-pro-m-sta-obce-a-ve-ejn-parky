import React from "react";
import { motion } from "framer-motion";
import { Ruler, Wrench, Box, CalendarClock, ShieldCheck, FileText } from "lucide-react";

const SERVICES = [
{ icon: Ruler, title: "Zakázková výroba mlžných systémů", desc: "Navrhneme a vyrobíme originální mlžné systémy přesně podle architektonických požadavků vašeho projektu." },
{ icon: Wrench, title: "Instalace na klíč", desc: "Kompletní profesionální montáž, zapojení vysokotlaké technologie a otestování celého systému na místě." },
{ icon: Box, title: "Konzultace a 3D vizualizace", desc: "Odborné poradenství a reálný 3D digitální model zakomponovaný do vaší zahrady nebo provozu ještě před realizací." },
{ icon: CalendarClock, title: "Pronájem mlžných instalací", desc: "Krátkodobý i dlouhodobý pronájem mobilních mlžných systémů pro festivaly, svatby, firemní akce a catering." },
{ icon: ShieldCheck, title: "Servis a údržba", desc: "Pravidelné kontroly, zazimování systému, dekalcifikace trysek a rychlý záruční i pozáruční servis." },
{ icon: FileText, title: "Projektová dokumentace", desc: "Zpracování detailních technických podkladů, hydraulických výpočtů a schémat zapojení pro stavební povolení či kolaudaci." }];


export default function PremiumServicesSection() {
  return (
    <section className="relative lg:py-28 py-20 bg-white overflow-hidden1">
      <div className="mx-auto lg:px-8 px-6 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mb-16">
          <h2 className="tracking-tight [font-family:'Inter',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-normal text-left text-[#111827] text-3xl md:text-3xl">Služby a řešení pro dokonalý mlžný systém

          </h2>
        </motion.div>
        <div>
          {SERVICES.map((s, i) => {
            const isEven = i % 2 === 1;
            const num = String(i + 1).padStart(2, '0');
            return (
              <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}
              className={`relative py-8 ${i !== 0 ? 'border-t border-slate-200' : ''}`}>
                <span className={`pointer-events-none select-none absolute top-1/2 -translate-y-1/2 text-7xl md:text-8xl font-bold text-slate-100 ${isEven ? 'right-0' : 'left-0'}`}>
                  {num}
                </span>
                <div className={`relative flex ${isEven ? 'justify-end text-right' : 'justify-start text-left'}`}>
                  <div className={`max-w-xl ${isEven ? '' : 'flex items-start gap-4'}`}>
                    {!isEven &&
                    <span className="shrink-0 rounded-lg flex items-center justify-center mt-0.5 font-normal [font-family:'Inter',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] border-slate-900 border-2 w-9 h-9 text-2xl text-slate-900">
                        {i + 1}
                      </span>
                    }
                    <p className="font-body text-base md:text-lg text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-900 text-2xl">{s.title}</span> — {s.desc}
                    </p>
                  </div>
                </div>
              </motion.div>);

          })}
        </div>
      </div>
    </section>);

}