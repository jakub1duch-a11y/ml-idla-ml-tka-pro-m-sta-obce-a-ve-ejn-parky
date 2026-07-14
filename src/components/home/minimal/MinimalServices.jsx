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

export default function MinimalServices() {
  return (
    <section className="relative bg-white py-24 lg:py-32">
      <div className="mx-auto px-6 lg:px-10 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="max-w-xl mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-teal-600 mb-4">Služby</p>
          <h2 className="font-heading font-extralight text-slate-900 text-3xl lg:text-4xl tracking-tight">
            Řešení pro dokonalý mlžný systém.
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}>
              <div className="w-11 h-11 rounded-full bg-teal-50 flex items-center justify-center mb-5">
                <s.icon size={18} className="text-teal-700" strokeWidth={1.3} />
              </div>
              <h3 className="font-heading font-medium text-slate-900 text-base mb-2 leading-snug">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>);
}