import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Calculator, Droplets, ShieldCheck, Wifi, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const FALLBACK_HERO = {
  eyebrow: 'MLŽIDLA® · HolmTec',
  headline: 'Ochlazení, které patří do architektury.',
  subheadline: 'Nerezová mlžítka pro města, parky i zahrady. Jemná mlha ochladí až o 10 °C, běžný vodovodní řad stačí a chytré řízení spustí mlžení jen podle potřeby.',
  primary_cta_label: 'Nezávazně navrhnout řešení',
  primary_cta_href: '/poptavka',
  secondary_cta_label: 'Spočítat orientační cenu',
  secondary_cta_href: '/kalkulacka',
  trust_points: ['Jemná vodní mlha', 'Nerezové provedení', 'Smart řízení'],
};

const FALLBACK_VIDEO = '/media/optimized/eb7e87313_mlzidla-mlzitkaproparkyamesta03.webm';
const FALLBACK_IMAGE = '/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp';

const TRUST_ICONS = [Droplets, ShieldCheck, Wifi];

export default function HeroDynamic() {
  const reduceMotion = useReducedMotion();
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.HomepageHero.list('-updated_date', 20)
      .then((items) => {
        const active = (items || []).find((h) => h.enabled !== false) || (items || [])[0] || null;
        setHero(active);
      })
      .catch(() => setHero(null))
      .finally(() => setLoading(false));
  }, []);

  const data = { ...FALLBACK_HERO, ...(hero || {}) };
  const videoUrl = hero?.video_url || FALLBACK_VIDEO;
  const posterUrl = FALLBACK_IMAGE;

  if (loading) return (
    <section className="relative isolate min-h-[60svh] overflow-hidden bg-[#071d26] text-white flex items-center justify-center">
      <Loader size={24} className="animate-spin text-cyan/40" />
    </section>
  );

  return (
    <section className="relative isolate min-h-[78svh] overflow-hidden bg-[#071d26] text-white sm:min-h-[84svh]">
      <video
        className="absolute inset-0 h-full w-full object-cover object-center"
        autoPlay={!reduceMotion}
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterUrl}
        aria-label="Architektonická mlžítka MLŽIDLA® ve veřejném prostoru"
      >
        <source src={videoUrl} type="video/webm" />
      </video>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,24,32,.91)_0%,rgba(4,24,32,.70)_46%,rgba(4,24,32,.18)_78%,rgba(4,24,32,.08)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,29,38,.18)_0%,rgba(7,29,38,.02)_48%,rgba(7,29,38,.60)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-[78svh] max-w-7xl items-end px-5 pb-10 pt-28 sm:min-h-[84svh] sm:px-8 sm:pb-14 lg:px-10 lg:pb-16">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .45 }}
            className="font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-[#8be5ef]"
          >
            {data.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .58, delay: .05 }}
            className="mt-4 max-w-[14ch] font-heading text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[.94] tracking-[-.04em]"
          >
            {data.headline}
          </motion.h1>

          {data.subheadline && (
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .5, delay: .12 }}
              className="mt-6 max-w-xl text-base leading-7 text-white/76 sm:text-lg"
            >
              {data.subheadline}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .5, delay: .18 }}
            className="mt-7 flex flex-col gap-3 sm:flex-row"
          >
            <Link to={data.primary_cta_href || '/poptavka'} className="btn-metallic-mist inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#61d5e5] px-7 py-3.5 text-sm font-bold text-[#082934] transition hover:-translate-y-0.5">
              {data.primary_cta_label || 'Nezávazně navrhnout řešení'} <ArrowRight size={16} />
            </Link>
            <Link to={data.secondary_cta_href || '/kalkulacka'} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/24 bg-black/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10">
              <Calculator size={16} /> {data.secondary_cta_label || 'Spočítat orientační cenu'}
            </Link>
          </motion.div>

          {Array.isArray(data.trust_points) && data.trust_points.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/14 pt-4">
              {data.trust_points.slice(0, 3).map((label, i) => {
                const Icon = TRUST_ICONS[i] || Droplets;
                return (
                  <span key={label} className="inline-flex items-center gap-2 text-xs text-white/64">
                    <Icon size={14} className="text-[#8be5ef]" /> {label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}