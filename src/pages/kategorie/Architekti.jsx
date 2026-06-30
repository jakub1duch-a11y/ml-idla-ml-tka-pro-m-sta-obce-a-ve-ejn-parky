import React, { useEffect } from 'react';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Palette, Download, Mail, FileText, Box, Ruler } from 'lucide-react';

const DOWNLOADS = [
  { icon: Box, title: 'CAD / BIM modely', desc: '3D soubory ve formátu DWG, IFC, Revit family pro integraci do projektové dokumentace.', tag: 'DWG · IFC · RFA' },
  { icon: FileText, title: 'Technické listy', desc: 'Kompletní technické parametry, rozměry, materiálové specifikace a zatížení základů.', tag: 'PDF' },
  { icon: Ruler, title: 'Výkresová dokumentace', desc: 'Výkresy půdorysu, řezy a detaily pro každý standardní model kolekce.', tag: 'PDF · DWG' },
];

const PROCESS = [
  { num: '01', title: 'Brief & inspirace', desc: 'Sdílíte záměr projektu, kontext místa a inspirační reference. My se přizpůsobíme vašemu workflow.' },
  { num: '02', title: '3D návrh na míru', desc: 'Naši designéři zpracují varianty v 3D — organické tvary, abstraktní linie, lokální motivy. Do 48 h.' },
  { num: '03', title: 'Iterace a finalizace', desc: 'Společně upřesníme rozměry, povrchovou úpravu a způsob kotvení. Dodáme podklady pro DPS.' },
  { num: '04', title: 'Výroba a instalace', desc: 'Zakázková výroba z AISI 316L, montáž naším týmem, zprovoznění a servisní smlouva.' },
];

export default function Architekti() {
  useEffect(() => { setSEO(SEO_PAGES.architekti); }, []);
  return (
    <div className="min-h-screen bg-ink pt-28">

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-400/10 border border-violet-400/20 flex items-center justify-center">
              <Palette size={18} className="text-violet-400" />
            </div>
            <p className="text-xs font-mono tracking-widest uppercase text-violet-400">Pro architekty a designéry</p>
          </div>
          <h1 className="font-heading text-4xl lg:text-6xl text-white mb-6" style={{ fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
            Nerez tvarovaný<br /><span style={{ fontStyle: 'italic' }}>podle vašich nápadů.</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl leading-relaxed font-light mb-8">
            Spolupracujeme s architekty, krajinnými architekty a průmyslovými designéry na zcela zakázkových mlžných prvcích. Váš návrh — naše technologie. Dodáváme kompletní BIM podklady, technické listy a výkresy pro projektovou dokumentaci.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="mailto:obchod1@holmtec.cz?subject=Architektonická spolupráce - poptávka podkladů"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25">
              Vyžádat podklady <Download size={15} />
            </a>
            <Link to="/poptavka" className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white text-sm rounded-full hover:bg-white/10 transition-all">
              Konzultace projektu
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Ke stažení */}
      <section className="bg-surface border-y border-white/8 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-xs font-mono tracking-widest uppercase text-white/40 mb-4">Podklady pro projektanty</p>
          <h2 className="text-white text-3xl mb-10" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
            Ke stažení zdarma<br /><span style={{ fontStyle: 'italic' }}>na vyžádání.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DOWNLOADS.map((d, i) => (
              <motion.div key={d.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-7 rounded-2xl bg-card_bg border border-white/10 hover:border-violet-400/30 transition-all group">
                <div className="w-11 h-11 rounded-xl bg-violet-400/10 border border-violet-400/20 flex items-center justify-center mb-4">
                  <d.icon size={20} className="text-violet-400" />
                </div>
                <span className="text-[10px] font-mono text-violet-400/70 tracking-widest uppercase">{d.tag}</span>
                <h3 className="text-white font-medium mt-2 mb-2">{d.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed font-light mb-5">{d.desc}</p>
                <a href="mailto:obchod1@holmtec.cz?subject=Žádost o podklady ke stažení"
                  className="inline-flex items-center gap-2 text-xs font-mono text-violet-400 hover:text-white transition-colors">
                  <Mail size={12} /> Vyžádat e-mailem
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proces */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <p className="text-xs font-mono tracking-widest uppercase text-white/40 mb-4">Jak spolupráce probíhá</p>
        <h2 className="text-white text-3xl mb-12" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
          Od skici<br /><span style={{ fontStyle: 'italic' }}>k hotovému prvku.</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROCESS.map((s, i) => (
            <motion.div key={s.num} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card_bg border border-white/10">
              <p className="font-heading text-4xl text-white/10 mb-3" style={{ fontWeight: 800 }}>{s.num}</p>
              <h3 className="text-white font-medium mb-2 text-sm">{s.title}</h3>
              <p className="text-xs text-white/45 leading-relaxed font-light">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="p-10 rounded-2xl bg-violet-400/5 border border-violet-400/20 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-white text-2xl mb-2" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>Máte projekt, kde by se mlžný prvek hodil?</h3>
            <p className="text-white/50 text-sm">Rádi se zapojíme již ve fázi konceptu. Podklady pro DPS dodáme zdarma.</p>
          </div>
          <a href="mailto:obchod1@holmtec.cz?subject=Architektonická spolupráce"
            className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-violet-400 text-ink text-sm font-bold rounded-full hover:bg-violet-300 transition-all shadow-lg shadow-violet-400/25 whitespace-nowrap">
            Napsat obchodnímu týmu <ArrowRight size={15} />
          </a>
        </div>
      </section>
    </div>
  );
}