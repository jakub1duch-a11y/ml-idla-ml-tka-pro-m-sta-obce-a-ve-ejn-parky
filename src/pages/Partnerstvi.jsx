import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Building2, Trees, Waves, Palette, Tent, Factory, Flower2, Sparkles, Baby, FileText, Ruler, Clock, Shield, Award, Droplets, Gauge, Thermometer, Users, Box } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const BENEFITS = [
  { icon: FileText, title: '3D modely a výkresy', desc: 'Kompletní technická dokumentace, DWG/IFC soubory a materiálové listy pro projektovou přílohu.', color: 'text-blue-500' },
  { icon: Ruler, title: 'Zakázková výroba', desc: 'Každé mlžítko vzniká na míru — tvar, výška, počet trysek i povrchová úprava.', color: 'text-violet-500' },
  { icon: Clock, title: 'Realizace do 8 týdnů', desc: 'Od schválení výkresové dokumentace po instalaci a uvedení do provozu.', color: 'text-amber-500' },
  { icon: Shield, title: 'Norma HolmTec', desc: 'Provozní tlak 3–5 bar, nerez AISI 316L, bezpečnostní doložka pro veřejný prostor.', color: 'text-emerald-500' },
  { icon: Award, title: 'Reference 120+ projektů', desc: 'Parky, náměstí, aquaparky, eventy — ověřené řešení pro veřejné i soukromé investory.', color: 'text-slate-500' },
  { icon: Box, title: 'Servis a záruční podpora', desc: '24měsíční záruka, pravidelná údržba a rychlý záruční i pozáruční servis.', color: 'text-rose-500' },
];

const USAGE_LINKS = [
  { icon: Building2, label: 'Města a obce', path: '/kategorie/mesta-obce', color: 'text-slate-600' },
  { icon: Trees, label: 'Parky a hřiště', path: '/kategorie/parky-hriste', color: 'text-emerald-500' },
  { icon: Waves, label: 'Koupaliště a aquaparky', path: '/kategorie/koupaliste', color: 'text-blue-500' },
  { icon: Flower2, label: 'Outdoor a zahrady', path: '/kategorie/outdoor-zahrady', color: 'text-green-500' },
  { icon: Sparkles, label: 'Art instalace na míru', path: '/kategorie/art-instalace', color: 'text-fuchsia-500' },
  { icon: Baby, label: 'Školy a školky', path: '/kategorie/skoly-skolky-deti', color: 'text-sky-500' },
  { icon: Palette, label: 'Pro architekty', path: '/kategorie/architekti', color: 'text-violet-500' },
  { icon: Factory, label: 'Komerční prostory', path: '/kategorie/komercni', color: 'text-amber-500' },
  { icon: Tent, label: 'Eventy a festivaly', path: '/kategorie/eventy', color: 'text-rose-500' },
];

function AnimCounter({ to, duration = 1.8, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / (duration * 60);
    const id = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(id); }
      else setVal(Math.round(start));
    }, 1000 / 60);
    return () => clearInterval(id);
  }, [inView, to, duration]);

  return <span ref={ref}>{val.toLocaleString('cs-CZ')}{suffix}</span>;
}

export default function Partnerstvi() {
  useEffect(() => {
    setSEO({
      title: 'Partnerství — Architekti, projektanti a města',
      description: 'Spolupráce HolmTec pro architekty, projektanty a zástupce měst. 3D modely, technická dokumentace, zakázková výroba mlžných soch a mlhovišť pro veřejné prostory.',
      keywords: 'partnerství architekti mlžení, projektová dokumentace mlžitka, mlžné sochy pro města, spolupráce HolmTec architekti',
      canonicalPath: '/partnerstvi',
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <div className="relative min-h-[80vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/742398fb8_d2d38c7f9_Copilot_20260507_020118.png"
            alt="Mlžná brána HolmTec pro veřejné prostory"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pb-20 pt-36 grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <span className="inline-block px-4 py-1.5 bg-white/10 border border-white/25 text-white text-xs font-mono tracking-widest uppercase rounded-full mb-6">
              Partnerství a spolupráce
            </span>
            <h1 className="font-heading font-light text-4xl sm:text-5xl lg:text-7xl text-white tracking-tight leading-[0.95] mb-6">
              Navrhujete<br />veřejný prostor?<br />
              <span className="text-white/60 italic font-extralight">Mlžení ho oživí.</span>
            </h1>
            <p className="text-white/70 text-lg font-light leading-relaxed max-w-lg mb-8">
              Spolupracujeme s architekty, projektanty a zástupci měst na navrhování mlžných instalací, které jsou technicky precizní a vizuálně výrazné.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/kontakt" className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
                Domluvit konzultaci <ArrowRight size={16} />
              </Link>
              <Link to="/manualy" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 border border-white/25 text-white text-sm font-medium rounded-full hover:bg-white/20 transition-all">
                Technická dokumentace
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* WATER CONSUMPTION CALCULATOR */}
      <div className="bg-slate-50 border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-3">Technická kalkulace</p>
              <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-4">
                Spotřeba vody — Mlžná brána Smart<br />
                <span className="text-slate-400 font-extralight">při standardním tlaku 4 bar</span>
              </h2>
              <p className="text-slate-500 leading-relaxed font-light">
                Nízkotlaká mlžná brána GATE70 pracuje na principu evaporace. Při tlaku 4 bar spotřebuje
                minimální množství vody, přičemž účinnost ochlazení prostoru dosahuje až −9 °C.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Gauge, label: 'Provozní tlak', value: '4 bar', sub: 'standard (rozsah 3–5 bar)', highlight: false },
                { icon: Droplets, label: 'Průtok (2 trysky)', value: '36 L/h', sub: 'GATE70 — 18 L/h × 2', highlight: false },
                { icon: Droplets, label: 'Spotřeba — den', value: null, counter: 288, suffix: ' L', sub: '8 hod. denního provozu', highlight: true },
                { icon: Droplets, label: 'Spotřeba — sezóna', value: null, counter: 25920, suffix: ' L', sub: '90 dní (cca 26 m³)', highlight: true },
                { icon: Thermometer, label: 'Efekt ochlazení', value: '−9 °C', sub: 'okolní vzduch (při 35 °C)', highlight: false },
                { icon: Award, label: 'Náklady na vodu', value: null, counter: 2600, suffix: ' Kč', sub: 'za celou sezónu', highlight: false },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className={`rounded-2xl border p-5 ${item.highlight ? 'bg-white border-slate-300 shadow-sm' : 'bg-white border-slate-200'}`}>
                  <item.icon size={18} className="text-slate-400 mb-3" />
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="font-heading font-light text-2xl mb-1 text-slate-900">
                    {item.value ? item.value : <AnimCounter to={item.counter} suffix={item.suffix} />}
                  </p>
                  <p className="text-xs text-slate-400 font-light">{item.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cost comparison bar */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="mt-10 p-6 rounded-2xl bg-white border border-slate-200">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">Srovnání nákladů za sezónu (90 dní)</p>
            <div className="space-y-4">
              {[
                { label: 'Mlžná brána HolmTec (voda)', value: 2600, max: 90000, color: 'bg-slate-700' },
                { label: 'Venkovní klimatizace (elektřina)', value: 85000, max: 90000, color: 'bg-red-400' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm text-slate-600 font-light">{item.label}</p>
                    <p className="text-sm font-mono text-slate-900 font-medium">{item.value.toLocaleString('cs-CZ')} Kč</p>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100">
                    <motion.div className={`h-full rounded-full ${item.color}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(item.value / item.max) * 100}%` }}
                      viewport={{ once: true }} transition={{ duration: 1.2, ease: 'easeOut' }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4 font-light">
              Mlžítko šetří oproti klimatizaci přes 95 % provozních nákladů při srovnatelném efektu ochlazení venkovního prostoru.
            </p>
          </motion.div>
        </div>
      </div>

      {/* KEY FEATURES */}
      <div className="py-20 max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
          <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-3">Pro profesionální partnery</p>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">Co získáte spoluprací s HolmTec</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-5">
                <b.icon size={20} className={b.color} />
              </div>
              <h3 className="font-heading font-medium text-slate-900 text-base mb-2">{b.title}</h3>
              <p className="text-sm text-slate-500 font-light leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* TECH SPECS STRIP */}
      <div className="bg-slate-50 border-y border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Provozní tlak', value: '3–5 bar', sub: 'optimální rozsah' },
              { label: 'Průměr kapky', value: '10–50 μm', sub: 'evaporuje před dopadem' },
              { label: 'Materiál', value: 'AISI 316L', sub: 'potravinářský nerez' },
              { label: 'Ochlazení', value: 'až −9 °C', sub: 'okolního vzduchu' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <p className="font-heading font-light text-2xl text-slate-900 mb-1">{s.value}</p>
                <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">{s.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORY LINKS */}
      <div className="py-20 max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-3">Podle využití</p>
          <h2 className="font-heading font-light text-3xl text-slate-900 tracking-tight">Pro jaký segment projektujete?</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {USAGE_LINKS.map((link, i) => (
            <motion.div key={link.path} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link to={link.path}
                className="group flex items-center gap-3 px-5 py-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
                <link.icon size={18} className={`${link.color} shrink-0`} />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors font-light">{link.label}</span>
                <ArrowRight size={13} className="ml-auto text-slate-300 group-hover:text-slate-600 transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* PRODUCT SHOWCASE */}
      <div className="bg-slate-50 border-t border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <img
              src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/1a8bf738a_7926f77e-d40e-463f-b1ae-2e20e46e13e0.jpg"
              alt="Y-ARMIST technický výkres a mlžný efekt"
              className="rounded-2xl w-full object-cover border border-slate-200"
            />
          </div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-3">Partnerská dokumentace</p>
            <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-4">
              Technické podklady pro váš projekt
            </h2>
            <p className="text-slate-500 leading-relaxed font-light mb-8">
              Pro architekty a projektanty připravujeme kompletní dokumentaci: technické výkresy ve formátech DWG a PDF, 3D modely, materiálové certifikáty AISI 316L a instalační specifikace kompatibilní s projektovými standardy.
            </p>
            <ul className="space-y-3 mb-8">
              {['Technické výkresy (DWG, PDF)', '3D modely pro renderování', 'Materiálové certifikáty AISI 316L', 'Instalační manuály a schémata zapojení', 'Parametrické specifikace pro BIM'].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600 font-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />{item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link to="/manualy" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-full hover:bg-slate-100 transition-all">
                Ke stažení
              </Link>
              <Link to="/kontakt" className="btn-metallic-mist px-6 py-3 text-sm font-bold">
                Kontaktovat projektový tým <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 text-center max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Users size={32} className="mx-auto mb-5 text-slate-300" />
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 mb-4">Zahajte spolupráci</h2>
          <p className="text-slate-500 font-light leading-relaxed mb-8">
            Konzultace k projektové dokumentaci, cenová kalkulace i 3D vizualizace — vše zdarma a do 48 hodin.
          </p>
          <Link to="/kontakt" className="btn-metallic-mist px-8 py-4 text-sm font-bold">
            Domluvit schůzku <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}