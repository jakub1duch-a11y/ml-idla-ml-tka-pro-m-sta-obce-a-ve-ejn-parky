import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';
import {
  Droplets,
  Gauge,
  Waves,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Wind,
  Sun,
  ArrowRight,
  CircleDot,
  Ruler,
  Layers,
  Zap,
  MapPin,
} from 'lucide-react';

const HERO_VIDEO = '/media/optimized/78cf9a6c8_KolekceBendy_20260812_121335_0000.webm';
const SCRUB_VIDEO = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/52aaab936_MLzitko-bendy-jicin.mp4';
const FALLBACK_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a73ab7232_Mltko-Bendy60-edited1.png';

const EASE = [0.22, 1, 0.36, 1];

/* ── 1 · Cinematic 3D hero — video loop + pointer-tilt product cutout ────── */
function CinematicHero({ product, onExplore }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.16]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.42, 0.92]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 110, damping: 20 });
  const sy = useSpring(py, { stiffness: 110, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-9, 9]);
  const rotateX = useTransform(sy, [0, 1], [7, -7]);

  const handleMove = (e) => {
    if (reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  return (
    <section
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={() => { px.set(0.5); py.set(0.5); }}
      className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-black"
    >
      <motion.video
        src={HERO_VIDEO}
        style={{ scale: videoScale }}
        autoPlay={!reduceMotion}
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-gradient-to-b from-[#02121a]/70 via-[#02121a]/35 to-[#02121a]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(112,193,255,.20),transparent_58%)]" />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 flex h-full flex-col">
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 lg:px-10">
          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}
            className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[.24em] text-white/70 backdrop-blur"
          >
            <Sparkles size={12} className="text-[#70c1ff]" /> BENDY SINGLE® · 3D produkt
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
            className="max-w-3xl font-heading text-5xl font-medium leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl"
          >
            Jedna křivka.<br />
            <span className="text-[#70c1ff]">Nekonečná mlha.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            {product?.short_description || 'Organicky zakřivené nerezové mlžítko HolmTec. Čistá silueta, jemná vodní mlha a přesnost, kterou vidíte na první pohled.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <button onClick={onExplore} type="button" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#02121a] transition-all hover:-translate-y-0.5 hover:bg-[#70c1ff]">
              Prozkoumat produkt <ArrowRight size={16} />
            </button>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3.5 text-sm text-white/60">
              <CircleDot size={14} className="text-[#70c1ff]" /> Video ve smyčce · 3D náhled
            </span>
          </motion.div>
        </div>

        {/* pointer-tilt product silhouette, layered above the video */}
        <motion.div
          aria-hidden="true"
          style={{ rotateX, rotateY, transformPerspective: 1400 }}
          className="pointer-events-none absolute inset-y-0 right-[-6%] hidden w-[52%] items-center justify-center md:flex"
        >
          <motion.img
            src={product?.image_url || FALLBACK_IMAGE}
            alt=""
            draggable="false"
            animate={reduceMotion ? {} : { y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="max-h-[70%] max-w-[80%] select-none object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,.55)]"
          />
        </motion.div>

        <motion.button
          type="button"
          onClick={onExplore}
          animate={reduceMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto mb-8 flex flex-col items-center gap-1.5 text-white/55 transition-colors hover:text-white"
        >
          <span className="font-mono text-[10px] uppercase tracking-[.22em]">Posuňte pro pohyb</span>
          <ChevronDown size={18} />
        </motion.button>
      </motion.div>
    </section>
  );
}

/* ── 2 · Scroll-to-motion: video scrubbed by scroll position ─────────────── */
function ScrollScrubMotion({ product }) {
  const trackRef = useRef(null);
  const videoRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 260, damping: 40, mass: 0.4 });

  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    const v = videoRef.current;
    if (v && ready && v.duration && !Number.isNaN(v.duration)) {
      v.currentTime = Math.min(v.duration - 0.05, Math.max(0, latest * v.duration));
    }
  });

  // moving light that sweeps the frame as the visitor scrolls
  const lightX = useTransform(scrollYProgress, [0, 0.5, 1], ['12%', '82%', '38%']);
  const lightY = useTransform(scrollYProgress, [0, 0.5, 1], ['20%', '55%', '78%']);
  const bgShift = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const beats = [
    { at: [0, 0.32], icon: Waves, title: 'Ohyb, který nese sílu i tvar', text: 'Jedna nerezová křivka bez svarů uprostřed — přesnost dílny HolmTec od prvního milimetru.' },
    { at: [0.32, 0.66], icon: Droplets, title: 'Trysky pod povrchem', text: 'Mikrofiltrované trysky AISI 316L rozprašují vodu na kapky, které se rozpustí dřív, než dopadnou.' },
    { at: [0.66, 1], icon: Wind, title: 'Mlha, kterou cítíte, ne vidíte', text: 'Jemný oblak ochladí okolní vzduch o citelné stupně — bez mokré dlažby a bez čerpadla.' },
  ];

  return (
    <section ref={trackRef} className="relative h-[320vh] bg-[#02121a]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* moving background gradient / light effect tied to scroll */}
        <motion.div
          aria-hidden="true"
          style={{ left: lightX, top: lightY }}
          className="pointer-events-none absolute h-[46vw] w-[46vw] max-h-[560px] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(112,193,255,.30),rgba(112,193,255,.08)_45%,transparent_72%)] blur-2xl"
        />
        <motion.div
          aria-hidden="true"
          style={{ backgroundPositionX: bgShift }}
          className="pointer-events-none absolute inset-0 opacity-[.08] [background-image:repeating-linear-gradient(100deg,#fff_0px,#fff_1px,transparent_1px,transparent_120px)]"
        />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-10">
          <div className="order-2 lg:order-1">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[.24em] text-[#70c1ff]/80">Scroll to motion</p>
            <h2 className="font-heading text-3xl font-medium leading-tight tracking-[-.035em] text-white sm:text-4xl">
              Rolujte a sledujte, jak {product?.name || 'BENDY SINGLE®'} ožívá.
            </h2>
            <div className="mt-8 space-y-3">
              {beats.map(({ at, icon: Icon, title, text }, i) => {
                return (
                  <BeatBox key={title} progress={scrollYProgress} at={at} icon={Icon} title={title} text={text} index={i} />
                );
              })}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black shadow-[0_40px_120px_rgba(0,0,0,.5)]">
              <video
                ref={videoRef}
                src={SCRUB_VIDEO}
                muted
                playsInline
                preload="auto"
                onLoadedMetadata={() => setReady(true)}
                autoPlay={reduceMotion}
                loop={reduceMotion}
                className="aspect-[4/5] w-full object-cover sm:aspect-video lg:aspect-[4/5]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.18em] text-white/70 backdrop-blur">
                <CircleDot size={11} className="text-[#70c1ff]" /> Realizace HolmTec
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BeatBox({ progress, at, icon: Icon, title, text, index }) {
  const opacity = useTransform(progress, [at[0], at[0] + 0.05, at[1] - 0.05, at[1]], [0.28, 1, 1, 0.28]);
  const x = useTransform(progress, [at[0], at[0] + 0.05], [-16, 0]);
  const iconY = useTransform(progress, [at[0], (at[0] + at[1]) / 2, at[1]], [0, -6, 0]);

  return (
    <motion.div style={{ opacity, x }} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[.04] p-4 backdrop-blur-sm">
      <motion.span style={{ y: iconY }} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[.06] text-[#70c1ff]">
        <Icon size={18} strokeWidth={1.7} />
      </motion.span>
      <span className="min-w-0">
        <strong className="block text-sm font-semibold leading-snug text-white">{title}</strong>
        <span className="mt-1 block text-xs leading-relaxed text-white/55">{text}</span>
      </span>
    </motion.div>
  );
}

/* ── 3 · Funnel visualization — problem → product → experience → poptávka ── */
function FunnelVisualization({ product, onPoptat }) {
  const reduceMotion = useReducedMotion();
  const stages = [
    { icon: Sun, width: '100%', label: 'Horký den', text: 'Vzduch v parku, na náměstí nebo na terase se přes poledne přehřívá.' },
    { icon: Waves, width: '78%', label: 'BENDY SINGLE®', text: 'Jedna nerezová křivka s tryskami AISI 316L přivádí nízkotlakou mlhu přesně tam, kam má.' },
    { icon: Droplets, width: '56%', label: 'Jemná mlha', text: 'Mikrokapky se odpaří dřív, než dopadnou — komfort bez mokrého povrchu.' },
    { icon: ShieldCheck, width: '34%', label: 'Nezávazná poptávka', text: 'Konzultace zdarma a 3D vizualizace do 48 hodin ve vašem prostoru.' },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#eef8fb] to-transparent" />
      <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-10">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[.24em] text-[#0b4860]/60">Od horka k chladu</p>
        <h2 className="font-heading text-3xl font-medium leading-tight tracking-[-.035em] text-slate-950 sm:text-4xl">
          Cesta jedné mlhy — od trysky k rozhodnutí.
        </h2>
      </div>

      <div className="relative mx-auto mt-16 flex max-w-2xl flex-col items-center px-6">
        {/* connecting flow line with animated moving dot */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-[#0b4860]/15 via-[#0b4860]/25 to-[#0b4860]/40" />
        {!reduceMotion && (
          <motion.span
            aria-hidden="true"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
            className="pointer-events-none absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#70c1ff] shadow-[0_0_16px_rgba(112,193,255,.9)]"
          />
        )}

        {stages.map(({ icon: Icon, width, label, text }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
            style={{ width }}
            className="relative z-10 mb-5 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_16px_44px_rgba(11,72,96,.08)] last:mb-0 sm:p-6"
          >
            <div className="flex items-start gap-4">
              <motion.span
                animate={reduceMotion ? {} : { y: [0, -5, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0b4860]/[.07] text-[#0b4860]"
              >
                <Icon size={20} strokeWidth={1.7} />
              </motion.span>
              <span className="min-w-0">
                <span className="mb-1 block font-mono text-[10px] uppercase tracking-[.18em] text-[#0b4860]/50">Krok {i + 1}</span>
                <strong className="block text-base font-semibold leading-snug text-slate-900">{label}</strong>
                <span className="mt-1.5 block text-sm leading-relaxed text-slate-500">{text}</span>
              </span>
            </div>
          </motion.div>
        ))}

        <motion.button
          type="button"
          onClick={onPoptat}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
          className="relative z-10 mt-3 inline-flex items-center gap-2 rounded-full bg-[#0b4860] px-8 py-4 text-sm font-bold text-white shadow-[0_16px_40px_rgba(11,72,96,.24)] transition-all hover:-translate-y-0.5 hover:bg-[#08394c]"
        >
          Poptat {product?.name || 'BENDY SINGLE®'} <ArrowRight size={16} />
        </motion.button>
      </div>
    </section>
  );
}

/* ── 4 · Detail grid — animated boxes with moving icons ───────────────────── */
function DetailGrid({ product }) {
  const reduceMotion = useReducedMotion();
  const items = [
    { icon: Ruler, label: 'Výška', value: product?.coverage_area || '≈ 1 800 mm' },
    { icon: Gauge, label: 'Provozní tlak', value: product?.pressure || '2–8 bar' },
    { icon: Layers, label: 'Materiál', value: product?.material || 'Nerez AISI 316L' },
    { icon: Droplets, label: 'Trysky', value: product?.micron_size ? `${product.micron_size} μm` : 'Mikrofiltrace' },
    { icon: Zap, label: 'Řízení', value: product?.power_supply || 'Smart / manuální' },
    { icon: MapPin, label: 'Výroba', value: 'HolmTec, Česká republika' },
  ];

  return (
    <section className="bg-[#f6fafb] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 max-w-xl">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[.24em] text-[#0b4860]/60">Parametry v pohybu</p>
          <h2 className="font-heading text-3xl font-medium leading-tight tracking-[-.035em] text-slate-950 sm:text-4xl">
            Čísla, na kterých stojí každá instalace.
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-3">
          {items.map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0b4860]/25 hover:shadow-[0_18px_40px_rgba(15,23,42,.08)]"
            >
              <motion.span
                animate={reduceMotion ? {} : { y: [0, -4, 0], rotate: [0, -2, 0] }}
                transition={{ duration: 3 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b4860]/[.06] text-[#0b4860]"
              >
                <Icon size={18} strokeWidth={1.7} />
              </motion.span>
              <span className="block font-mono text-[10px] uppercase tracking-wide text-slate-400">{label}</span>
              <span className="mt-1 block text-base font-semibold leading-snug text-slate-900">{value}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Main export ───────────────────────────────────────────────────────────── */
export default function BendySingleExperience({ product, onPoptat }) {
  const detailRef = useRef(null);
  const scrollToDetail = () => {
    const top = detailRef.current?.getBoundingClientRect().top + window.scrollY - 72;
    if (typeof top === 'number') window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <CinematicHero product={product} onExplore={scrollToDetail} />
      <div ref={detailRef}>
        <ScrollScrubMotion product={product} />
      </div>
      <FunnelVisualization product={product} onPoptat={onPoptat} />
      <DetailGrid product={product} />
    </div>
  );
}
