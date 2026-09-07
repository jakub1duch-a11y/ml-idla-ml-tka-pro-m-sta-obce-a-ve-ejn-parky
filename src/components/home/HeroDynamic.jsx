import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Camera, Droplets, MapPin, ShieldCheck, Thermometer, Wifi } from 'lucide-react';

const HERO_SCENES = [
  {
    label: 'Město',
    kicker: 'Veřejný prostor',
    headline: 'Město se nadechne.',
    text: 'Architektonická mlžítka mění rozpálené náměstí, park nebo pěší zónu v místo, kde se dá v horku zůstat déle — bez mokrého efektu a bez rušivé techniky.',
    video: 'https://media.base44.com/videos/public/69d723859ec0e3321c6b8bb6/cb467bdec_mlznesochyproobceamesta.mp4',
    poster: '/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp',
    stat: '5–10 °C',
    statLabel: 'pocitové ochlazení v místě mlžení',
  },
  {
    label: 'Park',
    kicker: 'Lidé a mikroklima',
    headline: 'Jemná mlha, která zve lidi ven.',
    text: 'Navrhujeme pobytové zóny pro obce, školy, areály i zahrady. Produkt vybíráme podle prostoru, proudění vzduchu, provozu a způsobu používání.',
    video: '/media/optimized/eb7e87313_mlzidla-mlzitkaproparkyamesta03.webm',
    poster: '/media/optimized/4737b1d8d_5b1b2bcc1b140ee76c8402a1e6313b8f.webp',
    stat: 'Smart',
    statLabel: 'spínání podle teploty a času',
  },
  {
    label: 'Detail',
    kicker: 'Nerezová konstrukce',
    headline: 'Technologie má sloužit prostoru.',
    text: 'Konstrukce z nerezové oceli, jemné trysky a chytré řízení tvoří systém, který působí klidně, přirozeně a přitom vydrží běžný provoz veřejného prostoru.',
    video: '/media/optimized/9f0153e3a_ml_detailvparku_01.webm',
    poster: '/media/optimized/5401e0933_dac8b98065c5472b16bc1910348915a1.webp',
    stat: 'INOX',
    statLabel: 'odolné provedení pro exteriér',
  },
];

const TRUST_POINTS = [
  { icon: Droplets, label: 'jemná vodní mlha' },
  { icon: ShieldCheck, label: 'nerezové provedení' },
  { icon: Wifi, label: 'chytré řízení' },
  { icon: Camera, label: 'vizualizace před výrobou' },
];

export default function HeroDynamic() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [videoError, setVideoError] = useState({});
  const activeScene = HERO_SCENES[active];

  useEffect(() => {
    if (reduceMotion) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % HERO_SCENES.length);
    }, 7600);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const handleMouseMove = (event) => {
    const root = event.currentTarget;
    const rect = root.getBoundingClientRect();
    root.style.setProperty('--hero-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    root.style.setProperty('--hero-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  const sceneButtons = useMemo(() => HERO_SCENES.map((scene, index) => ({ ...scene, index })), []);

  return (
    <section
      className="relative isolate min-h-[92svh] overflow-hidden bg-[#061517] text-white sm:min-h-[94svh]"
      style={{ '--hero-x': '28%', '--hero-y': '42%' }}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 overflow-hidden">
        {HERO_SCENES.map((scene, index) => (
          <div
            key={scene.label}
            className={`absolute inset-0 transition-opacity duration-1000 ${active === index ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden={active !== index}
          >
            {!reduceMotion && !videoError[index] ? (
              <video
                className="h-full w-full scale-[1.02] object-cover object-center"
                src={scene.video}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={scene.poster}
                onError={() => setVideoError((current) => ({ ...current, [index]: true }))}
              />
            ) : (
              <img src={scene.poster} alt="Mlžítka MLŽIDLA® v reálném venkovním prostoru" className="h-full w-full object-cover object-center" />
            )}
          </div>
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,18,20,.94)_0%,rgba(4,18,20,.76)_38%,rgba(4,18,20,.32)_68%,rgba(4,18,20,.18)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,18,20,.10)_0%,rgba(4,18,20,.18)_48%,rgba(4,18,20,.84)_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-45 [background:radial-gradient(circle_at_var(--hero-x)_var(--hero-y),rgba(172,255,255,.36),transparent_0%,transparent_31%),radial-gradient(circle_at_16%_70%,rgba(34,211,238,.18),transparent_34%),radial-gradient(circle_at_76%_28%,rgba(255,255,255,.12),transparent_28%)]" />
        <div className="hero-mist-layer hero-mist-layer-a" />
        <div className="hero-mist-layer hero-mist-layer-b" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-7xl items-end px-5 pb-7 pt-28 sm:min-h-[94svh] sm:px-8 sm:pb-10 lg:px-10 lg:pb-14">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <motion.div
            key={activeScene.headline}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="max-w-4xl"
          >
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[.24em] text-[#9eeaf0] sm:text-xs">
              MLŽIDLA® / HolmTec · {activeScene.kicker}
            </p>
            <h1 className="mt-4 max-w-[12ch] font-heading text-[clamp(3.2rem,9vw,7.8rem)] font-semibold leading-[.86] tracking-[-.07em]">
              {activeScene.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/76 sm:text-lg">
              {activeScene.text}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/poptavka" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#dffcff] px-7 py-3.5 text-sm font-bold text-[#062125] shadow-[0_18px_50px_rgba(158,234,240,.24)] transition hover:-translate-y-0.5 hover:bg-white">
                Poslat prostor k návrhu <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
              <Link to="/mlzidla-mlzitka" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/24 bg-white/8 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/14">
                Prohlédnout produkty
              </Link>
            </div>
            <div className="mt-8 grid max-w-3xl grid-cols-2 gap-2 sm:grid-cols-4">
              {TRUST_POINTS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-white/12 bg-white/8 px-3 py-3 backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/12">
                    <Icon size={16} className="text-[#9eeaf0]" />
                    <p className="mt-2 text-[11px] font-semibold leading-4 text-white/72">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <aside className="rounded-[2rem] border border-white/14 bg-white/10 p-4 backdrop-blur-xl lg:p-5">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.2em] text-white/45">aktuální scéna</p>
                <p className="mt-1 text-sm font-semibold text-white">{activeScene.label}</p>
              </div>
              <div className="text-right">
                <p className="font-heading text-3xl font-semibold leading-none text-[#b7fbff]">{activeScene.stat}</p>
                <p className="mt-1 max-w-[160px] text-[10px] leading-4 text-white/48">{activeScene.statLabel}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {sceneButtons.map((scene) => (
                <button
                  key={scene.label}
                  type="button"
                  onClick={() => setActive(scene.index)}
                  className={`group flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${active === scene.index ? 'border-[#9eeaf0]/60 bg-[#9eeaf0]/14' : 'border-white/10 bg-black/10 hover:bg-white/10'}`}
                >
                  <span>
                    <span className="block text-xs font-bold text-white">{scene.label}</span>
                    <span className="mt-0.5 block text-[10px] text-white/45">{scene.kicker}</span>
                  </span>
                  <span className={`h-2 w-2 rounded-full transition ${active === scene.index ? 'bg-[#9eeaf0] shadow-[0_0_18px_rgba(158,234,240,.9)]' : 'bg-white/24 group-hover:bg-white/50'}`} />
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-black/14 px-4 py-3 text-[11px] leading-5 text-white/58">
              <MapPin size={14} className="shrink-0 text-[#9eeaf0]" />
              Reálné použití pro města, obce, školy, areály i rezidenční zahrady.
            </div>
          </aside>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 h-px bg-gradient-to-r from-transparent via-[#9eeaf0]/40 to-transparent" />
      <div className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 text-[10px] uppercase tracking-[.22em] text-white/32 lg:flex">
        <Thermometer size={13} /> Posuňte dolů
      </div>
    </section>
  );
}
