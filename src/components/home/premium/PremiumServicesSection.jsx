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
    <section className="relative lg:py-32 py-24 bg-">
      <div className="max-w-7xl mx-auto lg:px-8 px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <h2 className="tracking-tight [font-family:'Inter',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-normal text-left text-4xl md:text-4xl">Služby a řešení pro dokonalý mlžný systém</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }} className="p-8 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all bg-[#F8F9FA]">
                <motion.div initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 + 0.1, duration: 0.5, ease: 'backOut' }}
                className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-100 to-cyan-50 flex items-center justify-center mb-6">
                  <Icon size={26} className="text-sky-600" />
                </motion.div>
                <h3 className="font-heading text-xl text-slate-900 mb-3">{s.title}</h3>
                <p className="font-body text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </motion.div>);

          })}
        </div>
      </div>
    </section>);

}