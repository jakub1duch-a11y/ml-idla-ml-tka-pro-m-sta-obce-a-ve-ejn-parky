import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Ruler, Wrench, Box, CalendarClock, ShieldCheck, FileText, ArrowRight } from "lucide-react";

const SERVICES = [
{ icon: Ruler, title: "Návrh na míru", desc: "Popište nám prostor a záměr. Navrhneme mlžný systém, který odpovídá architektuře i skutečnému provozu." },
{ icon: Wrench, title: "Výroba a instalace", desc: "Systém sami vyrobíme v Česku, nainstalujeme a otestujeme přímo na místě." },
{ icon: Box, title: "Konzultace a 3D návrh", desc: "Ještě před výrobou uvidíte, jak řešení zapadne do zahrady, provozu nebo veřejného prostoru." },
{ icon: CalendarClock, title: "Pronájem pro akce", desc: "Dodáme mobilní mlžné systémy pro festivaly, firemní akce i catering — včetně přípravy a servisu." },
{ icon: ShieldCheck, title: "Dlouhodobý servis", desc: "Postaráme se o pravidelnou kontrolu, zazimování, trysky i záruční a pozáruční podporu." },
{ icon: FileText, title: "Technické podklady", desc: "Připravíme výpočty a schémata, se kterými mohou spolehlivě pracovat architekti i realizační firmy." }];


export default function PremiumServicesSection() {
  return (
    <section className="bg-background py-20 border-y border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">Jak spolupracujeme</p>
            <h2 className="max-w-xl font-heading text-4xl tracking-tight text-foreground md:text-4xl">Od prvního nápadu po servis</h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">Každý projekt provázíme od návrhu přes výrobu až po dlouhodobou péči — ať jde o jedno mlžítko na terase, nebo mlžnou bránu na náměstí.</p>
        </div>

        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
                className="border-t border-border py-4">
                <Icon size={26} className="text-secondary mb-4 size-12 items-center" strokeWidth={1.6} />
                <h3 className="mb-2 text-xl font-semibold text-foreground [font-family:'Plus_Jakarta_Sans',_sans-serif]">{service.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{service.desc}</p>
              </motion.div>);

          })}
        </div>

        <div className="mt-14 flex justify-center">
          <Link to="/poptavka" className="btn-metallic-mist inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold">
            Popsat váš projekt <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>);

}