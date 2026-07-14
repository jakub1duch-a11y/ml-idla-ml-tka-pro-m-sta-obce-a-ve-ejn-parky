import React from "react";
import { motion } from "framer-motion";
import { Ruler, Wrench, Box, CalendarClock, ShieldCheck, FileText } from "lucide-react";

const SERVICES = [
{ icon: Ruler, title: "Zakázková výroba", desc: "Navrhneme a vyrobíme originální mlžné systémy přesně podle požadavků vašeho projektu." },
{ icon: Wrench, title: "Instalace na klíč", desc: "Kompletní profesionální montáž a otestování celého systému přímo na místě." },
{ icon: Box, title: "3D vizualizace", desc: "Odborné poradenství a reálný 3D model zakomponovaný do vaší zahrady či provozu." },
{ icon: CalendarClock, title: "Pronájem instalací", desc: "Krátkodobý i dlouhodobý pronájem mobilních mlžných systémů pro eventy a festivaly." },
{ icon: ShieldCheck, title: "Servis a údržba", desc: "Pravidelné kontroly, dekalcifikace trysek a rychlý záruční i pozáruční servis." },
{ icon: FileText, title: "Dokumentace", desc: "Technické podklady, hydraulické výpočty a schémata pro stavební povolení." }];

export default function BoldServices() {
  return (
    <section className="relative bg-white py-20 lg:py-28 border-t-2 border-black">
      <div className="mx-auto px-6 lg:px-10 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-black tracking-[0.25em] uppercase text-red-600 mb-3">Služby</p>
            <h2 className="font-heading font-black uppercase tracking-tight text-slate-900 text-3xl lg:text-4xl">
              Řešení pro dokonalý mlžný systém
            </h2>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-black">
          {SERVICES.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }}
              className="p-7 border-r border-b border-black hover:bg-black hover:text-white transition-colors group">
              <div className="w-12 h-12 bg-black text-white group-hover:bg-red-600 flex items-center justify-center mb-5 transition-colors">
                <s.icon size={20} strokeWidth={1.5} />
              </div>
              <h3 className="font-heading font-black uppercase text-slate-900 group-hover:text-white text-base mb-2 leading-snug transition-colors">{s.title}</h3>
              <p className="text-sm text-slate-500 group-hover:text-white/70 leading-relaxed transition-colors">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>);
}