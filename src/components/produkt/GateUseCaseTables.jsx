import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell, Palmtree, Building2, Trees, ArrowRight, Check,
  Droplets, Gauge, Ruler, Zap, Layers, Component, Shapes, MapPin, Clock } from
'lucide-react';

const VARIANTS = [
{ id: 'gate-u', name: 'GATE70-U', tag: 'Rovná varianta', link: '/gate70' },
{ id: 'gate-v', name: 'GATE70-V', tag: 'Lomený oblouk', link: '/gate70' },
{ id: 'iris', name: 'IRIS BRÁNA', tag: 'SA design', link: '/produkt/linea-el70' }];


const USE_CASES = [
{
  id: 'sportoviste',
  label: 'Sportoviště',
  icon: Dumbbell,
  intro: 'Osvěžení u vstupů, mezi zónami areálu, u tribun a koupališť. Vyšší průchodnost a robustní provoz.',
  recommended: 'gate-u',
  note: 'Pro sportoviště doporučujeme rovnou variantu GATE70-U — čistý průchod, odolná konstrukce a snadné umístění u vstupů do areálu.',
  placement: 'Vstupy do areálu, mezi hřišti, u tribun a laviček',
  operation: 'Intervaly podle návštěvnosti, teplotní spínač od 28 °C'
},
{
  id: 'areal',
  label: 'Areál pro volný čas',
  icon: Palmtree,
  intro: 'Vizuální ochlazovací bod pro pobytové zóny, zahrady, promenády a rekreační prostory.',
  recommended: 'gate-v',
  note: 'Pro areál volného času volíme lomený oblouk GATE70-V — architektonický prvek, který je zároveň funkčním ochlazením.',
  placement: 'Pobytové zóny, promenády, vstupy do zahrad a rekreačních ploch',
  operation: 'Časový harmonogram podle provozní doby areálu'
},
{
  id: 'namesti',
  label: 'Náměstí',
  icon: Building2,
  intro: 'Výrazný průchozí bod pro městská centra, pěší zóny a předprostory veřejných budov.',
  recommended: 'iris',
  note: 'Pro náměstí doporučujeme IRIS BRÁNA — leštěný nerez a plynulý oblouk tvoří designový prvek reprezentativního prostoru.',
  placement: 'Pěší zóny, centra, předprostory veřejných budov',
  operation: 'Automatické scénáře, vzdálené řízení, teplotní automatika'
},
{
  id: 'parky',
  label: 'Parky',
  icon: Trees,
  intro: 'Architektonický průchod mlhou pro cesty, odpočinkové zóny a místa v zeleni.',
  recommended: 'gate-v',
  note: 'Do parků volíme lomený oblouk GATE70-V — organický tvar přirozeně zapadne do zeleně a cest.',
  placement: 'Cesty, odpočinkové zóny, vstupy do parků a promenád',
  operation: 'Teplotní automatika, provoz v letních dnech dle potřeby'
}];


const SPECS = [
{ label: 'Design / tvar', icon: Shapes, gateU: 'Rovný, pravoúhlý', gateV: 'Lomený organický oblouk', iris: 'Plynulý obloukový design' },
{ label: 'Konstrukční profil', icon: Component, gateU: 'Kulatá trubka Ø76 mm', gateV: 'Kulatá trubka Ø76 mm', iris: 'Hranatý (jeklový) profil' },
{ label: 'Materiál', icon: Layers, gateU: 'AISI 316L, broušený/kartáčovaný', gateV: 'AISI 316L, broušený/kartáčovaný', iris: 'AISI 316L, leštěný nerez' },
{ label: 'Rozměry', icon: Ruler, gateU: '2 × 2,2 m (upravitelné)', gateV: '2 × 2,2 m (upravitelné)', iris: 'Výška 0,7 m (upravitelné)' },
{ label: 'Spotřeba vody', icon: Droplets, gateU: '15–25 l/h', gateV: '15–25 l/h', iris: '≈ 30 l/h (0,5 l/min)' },
{ label: 'Tlak mlžení', icon: Gauge, gateU: '3–7 bar', gateV: '3–7 bar', iris: '4–7 bar' },
{ label: 'Napájení / řízení', icon: Zap, gateU: '12 V, Wi-Fi Smart, senzory', gateV: '12 V, Wi-Fi Smart, senzory', iris: 'Vodovodní řad, volitelně Wi-Fi + LED' }];


const SPEC_KEYS = { 'gate-u': 'gateU', 'gate-v': 'gateV', iris: 'iris' };

export default function GateUseCaseTables() {
  const [active, setActive] = useState('sportoviste');
  const useCase = USE_CASES.find((u) => u.id === active);
  const RecIcon = useCase.icon;
  const recommended = VARIANTS.find((v) => v.id === useCase.recommended);

  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10 lg:py-24">
        <div className="mb-10 max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[.18em] text-secondary">MLŽNÁ BRÁNA GATE · PŘEHLED PRODUKTŮ</p>
          <h2 className="mt-4 font-heading text-4xl leading-tight text-foreground lg:text-5xl">Jasný přehled brány pro každý prostor.</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            Vyberte typ prostoru a podívejte se na přehlednou tabulku variant brány GATE — včetně doporučení, které řešení se pro dané umístění hodí nejvíce.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-10 flex flex-wrap gap-2">
          {USE_CASES.map((u) => {
            const Icon = u.icon;
            const isActive = active === u.id;
            return (
              <button
                key={u.id}
                onClick={() => setActive(u.id)}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all ${
                isActive ? 'bg-primary text-primary-foreground border border-primary' : 'bg-white border border-border text-foreground hover:border-primary/40'}`
                }>
                
                <Icon size={16} /> {u.label}
              </button>);

          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}>
            
            {/* Use case intro */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4 max-w-3xl">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-primary">
                  <RecIcon size={22} />
                </div>
                <div>
                  <h3 className="font-heading text-2xl text-foreground">{useCase.label}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{useCase.intro}</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-primary whitespace-nowrap">
                <Check size={15} /> Doporučeno: {recommended.name}
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <div className="grid bg-primary text-primary-foreground grid-cols-4">
                <div className="px-5 py-4">
                  <span className="font-mono text-xs uppercase tracking-[.16em] text-white/70">Parametr</span>
                </div>
                {VARIANTS.map((v) =>
                <div
                  key={v.id}
                  className={`px-5 py-4 border-l border-white/10 ${useCase.recommended === v.id ? 'bg-accent/20' : ''}`}>
                  
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{v.name}</span>
                      {useCase.recommended === v.id &&
                    <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Doporučeno</span>
                    }
                    </div>
                    <span className="mt-1 block font-mono text-[10px] uppercase tracking-widest text-white/50">{v.tag}</span>
                  </div>
                )}
              </div>

              {SPECS.map((s, i) =>
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36, delay: 0.06 + i * 0.05, ease: [0.22, 1, 0.36, 1] }} className={`grid grid-cols-4 ${i % 2 === 0 ? 'bg-white' : 'bg-muted/30'} transition-colors hover:bg-accent/10`}>
                  <div className="px-5 py-4 flex items-center gap-2">
                    <s.icon size={14} className="text-muted-foreground shrink-0" />
                    <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{s.label}</span>
                  </div>
                  {VARIANTS.map((v) => {
                  const val = s[SPEC_KEYS[v.id]];
                  const isRec = useCase.recommended === v.id;
                  return (
                    <div key={v.id} className={`px-5 py-4 border-l border-border flex items-center ${isRec ? 'bg-accent/5' : ''}`}>
                        <span className={`text-sm font-medium leading-snug ${isRec ? 'text-primary' : 'text-foreground'}`}>{val}</span>
                      </div>);

                })}
                </motion.div>
              )}

              <div className="grid grid-cols-4 bg-muted/40">
                <div className="px-5 py-4 flex items-center gap-2">
                  <MapPin size={14} className="text-muted-foreground shrink-0" />
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Doporučené umístění</span>
                </div>
                <div className="col-span-3 px-5 py-4 border-l border-border">
                  <span className="text-sm font-medium text-foreground">{useCase.placement}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 bg-white">
                <div className="px-5 py-4 flex items-center gap-2">
                  <Clock size={14} className="text-muted-foreground shrink-0" />
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Provozní režim</span>
                </div>
                <div className="col-span-3 px-5 py-4 border-l border-border">
                  <span className="text-sm font-medium text-foreground">{useCase.operation}</span>
                </div>
              </div>
            </div>

            {/* Mobile stacked cards */}
            <div className="lg:hidden space-y-4">
              {VARIANTS.map((v, vi) => {
                const isRec = useCase.recommended === v.id;
                return (
                  <motion.div key={v.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, delay: vi * 0.08, ease: [0.22, 1, 0.36, 1] }} whileHover={{ y: -4, transition: { duration: 0.24 } }} className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${isRec ? 'border-accent' : 'border-border'}`}>
                    <div className={`px-4 py-3.5 flex items-center justify-between ${isRec ? 'bg-accent/15' : 'bg-primary'}`}>
                      <div>
                        <span className="text-sm font-bold text-foreground">{v.name}</span>
                        <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{v.tag}</span>
                      </div>
                      {isRec &&
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Doporučeno</span>
                      }
                    </div>
                    {SPECS.map((s, i) =>
                    <div key={s.label} className={`flex items-start gap-3 px-4 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-muted/30'}`}>
                        <s.icon size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">{s.label}</p>
                          <p className={`text-sm font-medium leading-snug ${isRec ? 'text-primary' : 'text-foreground'}`}>{s[SPEC_KEYS[v.id]]}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3 px-4 py-3 bg-muted/40">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Umístění & provoz</p>
                        <p className="text-sm font-medium text-foreground">{useCase.placement} · {useCase.operation}</p>
                      </div>
                    </div>
                  </motion.div>);

              })}
            </div>

            {/* Recommendation note + CTA */}
            <div className="mt-8 flex flex-col gap-6 rounded-2xl bg-primary p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4 max-w-2xl">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-accent">
                  <Check size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-1">Naše doporučení pro {useCase.label.toLowerCase()}</p>
                  <p className="text-xs leading-relaxed text-white/60">{useCase.note}</p>
                </div>
              </div>
              <Link
                to={`/poptavka?produkt=${encodeURIComponent('Mlžná brána ' + recommended.name)}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-primary transition-all hover:opacity-90 whitespace-nowrap">
                
                Poptat {recommended.name} <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>);

}