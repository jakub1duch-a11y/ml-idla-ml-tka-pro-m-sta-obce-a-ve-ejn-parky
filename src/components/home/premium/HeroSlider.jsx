import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Droplets, ShieldCheck, Wifi, Volume2, VolumeX, Wind } from 'lucide-react';

const HERO_IMAGE = '/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp';
const HERO_VIDEO = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/91abf85e4_a912389b-814c-4922-8d8c-d71f9d9299f9.mp4';

const FACTS = [
  { icon: Droplets, label: 'Jemná vodní mlha' },
  { icon: ShieldCheck, label: 'Nerezové provedení' },
  { icon: Wifi, label: 'Smart řízení' },
];

export default function HeroSlider() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) v.play().catch(() => {});
  };

  return (
    <section className="relative isolate min-h-[78svh] overflow-hidden bg-[#071d26] text-white sm:min-h-[84svh]">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-center"
        autoPlay={!reduceMotion}
        muted
        loop
        playsInline
        preload="metadata"
        poster={HERO_IMAGE}
        aria-label="Požitek z ochlazení — jemná mlha z nerezových mlžítek MLŽIDLA® v horkém letním dni"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,24,32,.88)_0%,rgba(4,24,32,.58)_42%,rgba(4,24,32,.12)_72%,rgba(4,24,32,.04)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,29,38,.12)_0%,rgba(7,29,38,0)_42%,rgba(7,29,38,.60)_100%)]" />

      {/* Audio toggle */}
      <button
        onClick={toggleMute}
        className="absolute right-5 top-24 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition hover:bg-white/15 sm:right-8"
        aria-label={muted ? 'Zapnout zvuk' : 'Vypnout zvuk'}
        title={muted ? 'Zapnout zvuk mlžení' : 'Vypnout zvuk'}
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <div className="relative z-10 mx-auto flex min-h-[78svh] max-w-7xl items-end px-5 pb-10 pt-28 sm:min-h-[84svh] sm:px-8 sm:pb-14 lg:px-10 lg:pb-16">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .45 }}
            className="font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-[#8be5ef]"
          >
            MLŽIDLA® · HolmTec
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .58, delay: .05 }}
            className="mt-4 max-w-[14ch] font-heading text-[clamp(3rem,7vw,6.7rem)] font-medium leading-[.94] tracking-[-.055em]"
          >
            Požitek z ochlazení, který okamžitě cítíte.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .5, delay: .12 }}
            className="mt-6 max-w-xl text-base leading-7 text-white/76 sm:text-lg"
          >
            Jemná mlha z nerezových mlžítek ochladí vzduch až o 10 °C a promění horký den v osvěžující chvilku. Cítíte úlevu okamžitě — na náměstí, v parku, na zahradě. Zapněte zvuk a zažijte jemnost mlžení naplno.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .5, delay: .18 }}
            className="mt-7 flex flex-col gap-3 sm:flex-row"
          >
            <Link to="/mlzidla-mlzitka" className="btn-metallic-mist inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#61d5e5] px-7 py-3.5 text-sm font-bold text-[#082934] transition hover:-translate-y-0.5">
              Prohlédnout mlžítka <ArrowRight size={16} />
            </Link>
            <Link to="/poptavka" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/24 bg-black/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10">
              Poptat řešení na míru
            </Link>
          </motion.div>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/14 pt-4">
            {FACTS.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2 text-xs text-white/64">
                <Icon size={14} className="text-[#8be5ef]" /> {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Cooling sensation badge */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: .6, delay: .4 }}
        className="absolute bottom-8 right-5 z-10 hidden items-center gap-3 rounded-xl border border-[#8be5ef]/25 bg-[#071d26]/60 px-4 py-3 backdrop-blur-md sm:right-8 lg:flex"
      >
        <Wind size={20} className="text-[#8be5ef]" />
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#8be5ef]">Okamžitá úleva</p>
          <p className="text-sm font-medium text-white">Až −10 °C za pár sekund</p>
        </div>
      </motion.div>
    </section>
  );
}