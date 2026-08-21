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
    <section className="border-y border-border bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-5 text-center sm:mb-14 sm:text-left lg:flex-row lg:items-end lg:justify-between">
          <div className="mx-auto sm:mx-0">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:text-sm">Jak spolupracujeme</p>
            <h2 className="mx-auto max-w-2xl font-heading text-[clamp(2rem,7vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:mx-0">Od prvního nápadu po servis</h2>
          </div>
          <p className="mx-auto max-w-xl text-base leading-7 text-muted-foreground sm:mx-0 sm:max-w-md sm:text-left">Každý projekt provázíme od návrhu přes výrobu až po dlouhodobou péči — ať jde o jedno mlžítko na terase, nebo mlžnou bránu na náměstí.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
                className="group flex h-full items-start gap-4 rounded-2xl border border-border bg-card px-5 py-6 text-left transition-colors duration-300 hover:border-secondary/40 sm:gap-5 sm:px-6 sm:py-7 lg:px-7 lg:py-8">
                <div className="mt-0.5 flex size-14 shrink-0 items-center justify-center rounded-2xl border border-secondary/20 bg-secondary/5 text-secondary">
                  <Icon className="size-7" strokeWidth={1.7} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 font-heading text-xl font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-[1.35rem]">{service.title}</h3>
                  <p className="m-0 max-w-sm text-[0.95rem] leading-7 text-muted-foreground sm:text-base">{service.desc}</p>
                </div>
              </motion.div>);

          })}
        </div>

        <div className="mt-12 flex justify-center sm:mt-14">
          <Link to="/poptavka" className="btn-metallic-mist inline-flex min-h-12 items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold">
            Popsat váš projekt <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>);

}