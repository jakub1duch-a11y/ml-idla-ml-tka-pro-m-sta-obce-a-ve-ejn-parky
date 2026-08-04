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
    <section className="relative bg-primary py-20 hidden">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mb-10">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">Služby</p>
          <h2 className="text-left font-heading text-3xl font-medium tracking-tight text-white">Od prvního návrhu po dlouhodobý servis.</h2>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) =>
          <motion.div key={service.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06, duration: 0.5 }} className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                <service.icon size={20} className="text-accent" strokeWidth={1.5} />
              </div>
              <h3 className="mb-2 font-heading text-lg font-bold leading-snug text-white">{service.title}</h3>
              <p className="text-sm leading-relaxed text-white/70">{service.desc}</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}