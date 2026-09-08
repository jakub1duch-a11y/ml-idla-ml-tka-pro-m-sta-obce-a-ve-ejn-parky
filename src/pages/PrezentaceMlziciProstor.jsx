import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Target, Thermometer, Users, Leaf, CheckCircle2, TrendingUp, ArrowRight, ArrowDown,
  Droplets, Zap, Cloud, ShieldCheck, Sparkles, Mail, Phone, MapPin, Wind, Sun, BarChart3,
} from 'lucide-react';
import { TemperatureChart, SatisfactionChart } from '@/components/prezentace/PresentationCharts';
import { setSEO } from '@/lib/seo';

const HERO_IMG = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e44ee7c54_generated_image.png';

const SLIDES = [
  { id: 'uvod', label: 'Úvod' },
  { id: 'cile', label: 'Cíle' },
  { id: 'teplota', label: 'Mikroklima' },
  { id: 'navstevnost', label: 'Návštěvnost' },
  { id: 'efektivita', label: 'Efektivita' },
  { id: 'benefity', label: 'Benefity' },
  { id: 'rozvoj', label: 'Rozvoj' },
  { id: 'zaver', label: 'Závěr' },
];

function Slide({ id, children, className = '' }) {
  return (
    <section id={id} className={`relative min-h-screen flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-20 ${className}`}>
      <div className="max-w-6xl mx-auto w-full">{children}</div>
    </section>
  );
}

function Eyebrow({ children }) {
  return <p className="font-mono text-[11px] tracking-[.2em] uppercase text-cyan mb-4">{children}</p>;
}

export default function PrezentaceMlziciProstor() {
  const [activeSlide, setActiveSlide] = useState(0);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    setSEO({ title: 'Mlžící prostor — Výsledky a vyhodnocení provozu 2026', robots: 'noindex, nofollow' });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = SLIDES.findIndex((s) => s.id === e.target.id);
            if (idx >= 0) setActiveSlide(idx);
          }
        });
      },
      { threshold: 0.5 }
    );
    SLIDES.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F4FAFC] text-[#0A1628]">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-[#D3E2E8]">
        <motion.div className="h-full bg-[#22D3EE]" style={{ width: progressWidth }} />
      </div>

      {/* Side navigation */}
      <nav className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className="group flex items-center gap-2.5 justify-end"
            aria-label={s.label}
          >
            <span className={`font-mono text-[10px] tracking-wider uppercase transition-all ${activeSlide === i ? 'text-[#153863] opacity-100' : 'opacity-0 group-hover:opacity-60 text-[#5A6B78]'}`}>
              {s.label}
            </span>
            <span className={`block transition-all ${activeSlide === i ? 'w-8 h-[3px] bg-[#22D3EE]' : 'w-3 h-[3px] bg-[#466279]/40 group-hover:bg-[#466279]'}`} />
          </button>
        ))}
      </nav>

      {/* Slide counter */}
      <div className="fixed left-6 sm:left-10 bottom-6 z-50 font-mono text-xs text-[#5A6B78]">
        <span className="text-[#153863] font-bold">{String(activeSlide + 1).padStart(2, '0')}</span>
        <span className="mx-1">/</span>
        <span>{String(SLIDES.length).padStart(2, '0')}</span>
      </div>

      {/* SLIDE 1 — Úvod */}
      <Slide id="uvod" className="relative overflow-hidden bg-[#0A1628] text-white">
        <img src={HERO_IMG} alt="Mlžící systém v akci" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628]/90 via-[#0A1628]/60 to-[#041c28]/80" />
        <div className="relative z-10">
          <Eyebrow>MLŽIDLA® · Sezónní report 2026</Eyebrow>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}
            className="font-heading text-[clamp(2.2rem,6vw,5rem)] leading-[1.02] tracking-[-.04em] max-w-4xl">
            Mlžící prostor — Výsledky a vyhodnocení provozu 2026
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .15 }}
            className="mt-6 text-lg sm:text-xl text-white/75 max-w-2xl leading-relaxed">
            Přínos ochlazovací zóny pro mikroklima a komfort návštěvníků. Průběžné měření, reálná data, ověřený dopad.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4 }}
            className="mt-10 flex flex-wrap gap-6 text-sm text-white/50 font-mono">
            <span className="flex items-center gap-2"><MapPin size={14} className="text-cyan" /> Město Jičín · Náměstí</span>
            <span className="flex items-center gap-2"><Sun size={14} className="text-cyan" /> Období: květen — září 2026</span>
            <span className="flex items-center gap-2"><Wind size={14} className="text-cyan" /> Vysokotlaké mlžení</span>
          </motion.div>
          <button onClick={() => scrollTo('cile')} className="mt-12 inline-flex items-center gap-2 text-sm text-white/60 hover:text-cyan transition">
            Pokračovat <ArrowDown size={16} />
          </button>
        </div>
      </Slide>

      {/* SLIDE 2 — Cíle a specifikace */}
      <Slide id="cile" className="bg-white border-b border-[#D3E2E8]">
        <Eyebrow>Slide 02 · Cíle projektu</Eyebrow>
        <h2 className="font-heading text-[clamp(1.8rem,4vw,3rem)] tracking-[-.03em] max-w-3xl mb-8">
          Proč byl mlžící prostor vytvořen.
        </h2>
        <div className="grid lg:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Thermometer, title: 'Tepelné ostrovy', text: 'Aktivní boj proti městským tepelným ostrovům — ochlazení rozpálených ploch náměstí a zpevněných ploch.' },
            { icon: Users, title: 'Komfort návštěvníků', text: 'Zvýšení pohodlí pro obyvatele i turisty v nejteplejších hodinách dne. Prodlenější pobyt ve veřejném prostoru.' },
            { icon: ShieldCheck, title: 'Podpora zdraví', text: 'Prevence přehřátí a dehydratace u rizikových skupin. Jemná mlha filtruje prach a pyl ze vzduchu.' },
          ].map((c) => (
            <div key={c.title} className="border border-[#D3E2E8] p-6">
              <c.icon size={28} className="text-[#22D3EE] mb-4" />
              <h3 className="font-heading text-lg mb-2">{c.title}</h3>
              <p className="text-sm text-[#5A6B78] leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 border-t border-[#D3E2E8] pt-6">
          {[
            { label: 'Typ systému', value: 'Vysokotlaké mlžení 60 bar' },
            { label: 'Lokalita', value: 'Jičínské náměstí' },
            { label: 'Období provozu', value: 'Květen — září 2026' },
            { label: 'Počet trysek', value: '24 × AISI 316L' },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-mono text-[10px] tracking-widest uppercase text-[#5A6B78] mb-1">{s.label}</p>
              <p className="font-heading text-base text-[#0A1628]">{s.value}</p>
            </div>
          ))}
        </div>
      </Slide>

      {/* SLIDE 3 — Mikroklima / Teplota */}
      <Slide id="teplota" className="bg-[#F4FAFC] border-b border-[#D3E2E8]">
        <Eyebrow>Slide 03 · Mikroklima</Eyebrow>
        <h2 className="font-heading text-[clamp(1.8rem,4vw,3rem)] tracking-[-.03em] max-w-3xl mb-2">
          Měřitelné dopady na teplotu okolí.
        </h2>
        <p className="text-[#5A6B78] mb-8 max-w-2xl">
          Průběžné měření teploty a vlhkosti v ochlazovací zóně vs. referenční bod mimo zónu. Data ze 4 nejteplejších dnů sezóny.
        </p>
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
          <div className="border border-[#D3E2E8] bg-white p-6">
            <p className="font-mono text-[10px] tracking-widest uppercase text-[#5A6B78] mb-4">Průměrná teplota (°C) — den s max 35 °C</p>
            <TemperatureChart />
          </div>
          <div className="space-y-4">
            {[
              { icon: Thermometer, value: '−8 °C', label: 'Snížení pocitové teploty v poledních hodinách', color: 'text-[#22D3EE]' },
              { icon: Droplets, value: '+18 %', label: 'Zvýšení relativní vlhkosti vzduchu v zóně', color: 'text-[#153863]' },
              { icon: Wind, value: '12 s', label: 'Doba do dosažení plného ochlazovacího efektu', color: 'text-[#22D3EE]' },
            ].map((s) => (
              <div key={s.label} className="flex items-start gap-4 border-l-2 border-[#22D3EE] pl-4 py-1">
                <s.icon size={24} className={s.color + ' shrink-0 mt-0.5'} />
                <div>
                  <p className="font-heading text-2xl tracking-[-.02em]">{s.value}</p>
                  <p className="text-sm text-[#5A6B78] leading-relaxed">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* SLIDE 4 — Návštěvnost a reakce */}
      <Slide id="navstevnost" className="bg-white border-b border-[#D3E2E8]">
        <Eyebrow>Slide 04 · Návštěvnost & zpětná vazba</Eyebrow>
        <h2 className="font-heading text-[clamp(1.8rem,4vw,3rem)] tracking-[-.03em] max-w-3xl mb-2">
          Sociální přínos a zpětná vazba veřejnosti.
        </h2>
        <p className="text-[#5A6B78] mb-8 max-w-2xl">
          Data ze 3 nejteplejších dnů (teplota nad 32 °C). Dotazníkové šetření mezi 180 návštěvníky.
        </p>
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8 items-start">
          <div className="border border-[#D3E2E8] p-6">
            <p className="font-mono text-[10px] tracking-widest uppercase text-[#5A6B78] mb-4">Spokojenost návštěvníků (n = 180)</p>
            <SatisfactionChart />
          </div>
          <div className="space-y-5">
            {[
              { icon: Users, value: '+47 %', label: 'Zvýšení doby pobytu v prostoru oproti neochlazovaným dnům' },
              { icon: CheckCircle2, value: '90 %', label: 'Návštěvníků vnímá ochlazení jako příjemné nebo velmi příjemné' },
              { icon: TrendingUp, value: '2 400', label: 'Průměrný počet osob denně procházejících ochlazovací zónou' },
            ].map((s) => (
              <div key={s.label} className="flex items-start gap-4 bg-[#F4FAFC] border border-[#D3E2E8] p-5">
                <s.icon size={24} className="text-[#22D3EE] shrink-0 mt-0.5" />
                <div>
                  <p className="font-heading text-xl tracking-[-.02em]">{s.value}</p>
                  <p className="text-sm text-[#5A6B78] leading-relaxed">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* SLIDE 5 — Provozní efektivita */}
      <Slide id="efektivita" className="bg-[#F4FAFC] border-b border-[#D3E2E8]">
        <Eyebrow>Slide 05 · Provozní & ekologická efektivita</Eyebrow>
        <h2 className="font-heading text-[clamp(1.8rem,4vw,3rem)] tracking-[-.03em] max-w-3xl mb-8">
          Spotřeba zdrojů a udržitelnost.
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Droplets, value: '0,12 l', label: 'Spotřeba vody na 1 hodinu provozu (na trysku)', sub: '70% méně než konvenční ostřik' },
            { icon: Zap, value: '0,18 kWh', label: 'Spotřeba el. energie na 1 hodinu celého systému', sub: 'Ekvivalent jedné LED žárovky' },
            { icon: Cloud, value: 'Automatizace', label: 'Spouštění dle teplotních čidel (≥ 28 °C)', sub: 'Bez ručního zásahu' },
            { icon: Leaf, value: 'Bez chemie', label: '100 % pitná voda, žádné aditiva', sub: 'Šetrné k životnímu prostředí' },
          ].map((s) => (
            <div key={s.label} className="border border-[#D3E2E8] bg-white p-5">
              <s.icon size={24} className="text-[#22D3EE] mb-3" />
              <p className="font-heading text-xl tracking-[-.02em] mb-1">{s.value}</p>
              <p className="text-xs text-[#5A6B78] leading-relaxed mb-2">{s.label}</p>
              <p className="text-[10px] font-mono text-[#22D3EE] uppercase tracking-wider">{s.sub}</p>
            </div>
          ))}
        </div>
        <div className="border border-[#22D3EE]/30 bg-[#22D3EE]/5 p-5 flex items-start gap-3">
          <BarChart3 size={20} className="text-[#22D3EE] shrink-0 mt-0.5" />
          <p className="text-sm text-[#153863] leading-relaxed">
            <span className="font-semibold">Měsíční provozní náklady:</span> cca 1 200 Kč (voda + energie) při průměrném 6hodinovém denním provozu.
            Návratnost investice v nepeněžitím přínosu (komfort, PR, atraktivita prostoru) již v 1. sezóně.
          </p>
        </div>
      </Slide>

      {/* SLIDE 6 — Agregované benefity */}
      <Slide id="benefit" className="bg-[#0A1628] text-white">
        <Eyebrow>Slide 06 · Hlavní benefity v kostce</Eyebrow>
        <h2 className="font-heading text-[clamp(1.8rem,4vw,3rem)] tracking-[-.03em] max-w-3xl mb-10">
          Agregované přínosy sezóny 2026.
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Thermometer, title: 'Ochlazení prostoru', text: 'Až −8 °C pocitové teploty v aktivní zóně. Okamžitý efekt po spuštění.' },
            { icon: Wind, title: 'Filtrace prachu a pylu', text: 'Jemná mlha váže prachové částice a snižuje koncentrac alergenů ve vzduchu.' },
            { icon: Sparkles, title: 'Estetický & urbanistický prvek', text: 'Nerezové provedení respektuje historické prostředí. Pozitivní vizuální dopad.' },
            { icon: TrendingUp, title: 'Pozitivní PR', text: 'Ochrana značky města. Zájem médií, sdílení na sociálních sítích návštěvníky.' },
          ].map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border border-white/10 bg-white/5 p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center bg-[#22D3EE]/10 mb-4">
                <b.icon size={24} className="text-[#22D3EE]" />
              </div>
              <h3 className="font-heading text-lg mb-2 text-white">{b.title}</h3>
              <p className="text-sm text-white/55 leading-relaxed">{b.text}</p>
            </motion.div>
          ))}
        </div>
      </Slide>

      {/* SLIDE 7 — Doporučení / Rozvoj */}
      <Slide id="rozvoj" className="bg-white border-b border-[#D3E2E8]">
        <Eyebrow>Slide 07 · Budoucnost & optimalizace</Eyebrow>
        <h2 className="font-heading text-[clamp(1.8rem,4vw,3rem)] tracking-[-.03em] max-w-3xl mb-2">
          Doporučení pro další fázi.
        </h2>
        <p className="text-[#5A6B78] mb-8 max-w-2xl">
          Na základě dat ze sezóny 2026 identifikujeme 4 konkrétní kroky pro zvýšení efektivity a dopadu systému.
        </p>
        <div className="space-y-3">
          {[
            { num: '01', title: 'Rozšíření o stínicí prvky', text: 'Kombinace mlžení s pohyblivými stěnami pro dosažení až −12 °C pocitové teploty v nejkritičtějších hodinách.' },
            { num: '02', title: 'Integrace zeleně', text: 'Doplnění stromové výsadby v okolí trysek pro přirozený stín a synergický efekt odparu z listů.' },
            { num: '03', title: 'Instalace na dalších lokalitách', text: 'Rozšíření na park a lázeňský areál. Replikace ověřeného řešení, predikce stejného dopadu.' },
            { num: '04', title: 'Smart řízení & datový dashboard', text: 'Real-time monitoring teplot, spotřeby a komfortu. Prediktivní spouštění dle předpovědi počasí.' },
          ].map((r) => (
            <div key={r.num} className="flex gap-5 border border-[#D3E2E8] p-5 hover:border-[#22D3EE] transition group">
              <span className="font-mono text-2xl text-[#22D3EE] shrink-0">{r.num}</span>
              <div>
                <h3 className="font-heading text-lg mb-1 group-hover:text-[#22D3EE] transition">{r.title}</h3>
                <p className="text-sm text-[#5A6B78] leading-relaxed">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Slide>

      {/* SLIDE 8 — Závěr + CTA */}
      <Slide id="zaver" className="bg-[#0A1628] text-white">
        <div className="text-center">
          <Eyebrow>Slide 08 · Závěr</Eyebrow>
          <h2 className="font-heading text-[clamp(2rem,5vw,4rem)] tracking-[-.04em] mb-4">
            Děkujeme za pozornost.
          </h2>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed mb-10">
            Mlžící prostor v Jičíně funguje. Data potvrzují reálný přínos pro mikroklima, komfort i udržitelnost.
            Připraveni odpovědět na vaše dotazy.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
          {[
            { icon: Mail, label: 'E-mail', value: 'meduna@holmtec.cz' },
            { icon: Phone, label: 'Telefon', value: '+420 774 700 390' },
            { icon: MapPin, label: 'Sídlo', value: 'HolmTec s.r.o. · MLŽIDLA®' },
          ].map((c) => (
            <div key={c.label} className="border border-white/10 bg-white/5 p-5 text-center">
              <c.icon size={20} className="text-[#22D3EE] mx-auto mb-2" />
              <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-1">{c.label}</p>
              <p className="text-sm text-white">{c.value}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto border border-[#22D3EE]/30 bg-[#22D3EE]/5 p-6 text-center">
          <p className="font-heading text-lg text-white mb-2">Chcete mlžící prostor ve svém městě?</p>
          <p className="text-sm text-white/55 mb-5">Nezávazně spočítáme náklady a přínos pro vaši lokalitu. Od návrhu po realizaci.</p>
          <Link to="/poptavka" className="btn-metallic-mist inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-[#082934] bg-[#61d5e5]">
            Poptat řešení na míru <ArrowRight size={16} />
          </Link>
        </div>

        <p className="text-center mt-8 font-mono text-[10px] tracking-widest uppercase text-white/25">
          MLŽIDLA® · HolmTec s.r.o. · 2026
        </p>
      </Slide>
    </div>
  );
}