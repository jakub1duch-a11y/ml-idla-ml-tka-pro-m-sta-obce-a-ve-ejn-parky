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
    <section className="relative bg-slate-50 py-20">
      <div className="mx-auto px-6 lg:px-10 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mb-10">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Služby</p>
          <h2 className="font-heading tracking-tight font-bold text-left text-slate-900 text-3xl">
            Služby a řešení pro dokonalý mlžný systém
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, i) =>
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}
          className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="rounded-full flex items-center justify-center bg-slate-000 mb-5 h-22 w-22">
                <s.icon size={20} className="text-slate-700" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-lg mb-2 leading-snug">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}