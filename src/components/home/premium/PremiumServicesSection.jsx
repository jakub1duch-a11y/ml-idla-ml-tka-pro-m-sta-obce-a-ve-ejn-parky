import React from "react";
import { motion } from "framer-motion";
import { Ruler, Wrench, Box, CalendarClock, ShieldCheck, FileText } from "lucide-react";

const SERVICES = [
{ icon: Ruler, title: "Návrh na míru", desc: "Popište nám prostor a záměr. Navrhneme mlžný systém, který odpovídá architektuře i skutečnému provozu." },
  { icon: Wrench, title: "Výroba a instalace", desc: "Systém sami vyrobíme v Česku, nainstalujeme a otestujeme přímo na místě." },
  { icon: Box, title: "Konzultace a 3D návrh", desc: "Ještě před výrobou uvidíte, jak řešení zapadne do zahrady, provozu nebo veřejného prostoru." },
  { icon: CalendarClock, title: "Pronájem pro akce", desc: "Dodáme mobilní mlžné systémy pro festivaly, firemní akce i catering — včetně přípravy a servisu." },
  { icon: ShieldCheck, title: "Dlouhodobý servis", desc: "Postaráme se o pravidelnou kontrolu, zazimování, trysky i záruční a pozáruční podporu." },
  { icon: FileText, title: "Technické podklady", desc: "Připravíme výpočty a schémata, se kterými mohou spolehlivě pracovat architekti i realizační firmy." }];


export default function PremiumServicesSection() {
  return (
    <section className="relative bg-primary py-20">
      <div className="mx-auto px-6 lg:px-10 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mb-10">
          <p className="text-xs font-mono tracking-widest uppercase text-accent mb-3">Služby</p>
          <h2 className="font-heading tracking-tight font-medium text-left text-white text-3xl">
            Od prvního návrhu po dlouhodobý servis.
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, i) =>
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}
          className="bg-white/5 rounded-2xl border border-white/15 p-6">
              <div className="rounded-full flex items-center justify-center bg-slate-000 mb-5 h-22 w-22">
                <s.icon size={20} className="text-slate-700 size-2" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading font-bold text-white text-lg mb-2 leading-snug">{s.title}</h3>
              <p className="text-sm text-white/65 leading-relaxed">{s.desc}</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}