import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Droplets, Ruler, Layers3, ScanLine } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { responsiveProductSrcSet } from '@/lib/responsiveProductMedia';

function GateShapeIcon({ kind, className = '' }) {
  let d = 'M9 40V12 Q9 7 15 7H49 Q55 7 55 12V40';
  if (kind === 'vee') d = 'M9 40V8L32 19L55 8V40';
  if (kind === 'arc') d = 'M9 40V27C9 2 55 2 55 27V40';
  if (kind === 'radius') d = 'M9 40V20Q9 7 22 7H42Q55 7 55 20V40';
  return (
    <svg viewBox="0 0 64 48" className={className} fill="none" stroke="currentColor"
      strokeWidth="3.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
      <path d="M5 43H13M51 43H59" strokeWidth="2" opacity=".6" />
    </svg>
  );
}

function getShape(name) {
  if (/\bV\b|lomen/i.test(name)) return 'vee';
  if (/OBLOUK/i.test(name)) return 'arc';
  if (/RADIUS/i.test(name)) return 'radius';
  return 'straight';
}

function formatDimensions(variant) {
  if (!variant?.dimensions) return 'Rozměry na upřesnění';
  return `${variant.dimensions} mm`;
}

export default function GateVariantHero({ product }) {
  const reducedMotion = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const variants = useMemo(() => {
    const listed = Array.isArray(product.variants) ? product.variants.filter((v) => v?.name) : [];
    // The V-shaped configuration has an admin-verified product MASTER, but
    // its exact dimensions have not been certified for a separate variant.
    // Display it with no invented dimensions, profile, nozzles or price.
    const vMaster = product.visual_master_verified ? product.visual_master_reference_url : '';
    const hasV = listed.some((v) => getShape(v.name) === 'vee');
    const vVariant = vMaster && !hasV ? [{
      name: 'GATE V – lomený střed',
      image_url: vMaster,
      dimensions: '',
      profile: '',
      nozzles: '',
      description: 'Lomená horní linie podle referenční fotografie. Rozměry, profil a osazení trysek potvrdíme v technickém návrhu.',
      variant_visual_state: 'MASTER produktu',
    }] : [];
    return [...vVariant, ...listed];
  }, [product.variants, product.visual_master_reference_url, product.visual_master_verified]);

  const selectedName = params.get('varianta');
  const initial = Math.max(0, variants.findIndex((v) => v.name === selectedName));
  const [active, setActive] = useState(initial);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setActive(Math.max(0, variants.findIndex((v) => v.name === selectedName)));
  }, [selectedName, product.slug, variants]);

  useEffect(() => { setImageFailed(false); }, [active]);

  const select = (index) => {
    const chosen = (index + variants.length) % variants.length;
    if (!variants.length) return;
    setActive(chosen);
    const next = new URLSearchParams(params);
    next.set('varianta', variants[chosen].name);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  if (variants.length === 0) return null;
  const current = variants[active] || variants[0];
  const kind = getShape(current.name);
  const image = current.image_url || '';
  const quoteUrl = `/poptavka?produkt=${encodeURIComponent(product.slug)}&varianta=${encodeURIComponent(current.name)}`;
  // Motion is driven by the selected variant, not a timer. For users who
  // prefer reduced motion, all content remains immediately visible.
  const enter = (delay = 0, distance = 16) => reducedMotion
    ? { initial: false, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: distance },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: .48, delay, ease: [0.22, 1, 0.36, 1] },
      };
  const shapeTitle = kind === 'vee' ? 'Lomený střed' : kind === 'arc'
    ? 'Obloukové provedení' : kind === 'radius' ? 'Zaoblené rohy' : 'Rovné břevno';

  return (
    <section id="prehled" className="min-w-0 overflow-hidden bg-[#F5FAFC]">
      <div className="mx-auto max-w-[1500px] px-4 pb-10 pt-6 sm:px-8 lg:px-12 lg:pb-16 lg:pt-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[.16em] text-[#07749D]">MLŽNÁ BRÁNA GATE® · varianty provedení</p>
          <span className="rounded-full border border-[#C6E0E9] bg-white px-3 py-1 text-xs font-semibold text-[#34576C]">
            {active + 1} / {variants.length} provedení
          </span>
        </div>

        <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,.83fr)_minmax(0,1.17fr)] lg:items-center lg:gap-10">
          <div className="order-2 min-w-0 lg:order-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={`shape-${current.name}`} {...enter(0)}
                className="mb-5 inline-flex items-center gap-3 rounded-2xl border border-[#CDE3EA] bg-white p-3 text-[#0E709A]">
                <motion.span
                  initial={reducedMotion ? false : { pathLength: 0, opacity: 0, rotate: -7 }}
                  animate={{ pathLength: 1, opacity: 1, rotate: 0 }}
                  transition={{ duration: reducedMotion ? 0 : .6, ease: 'easeOut' }}>
                  <GateShapeIcon kind={kind} className="h-11 w-14" />
                </motion.span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[.14em] text-[#335A70]">
                  {shapeTitle}
                </span>
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
              <motion.h1 key={`name-${current.name}`} {...enter(reducedMotion ? 0 : .08)}
                className="max-w-[16ch] break-words font-heading text-[clamp(2.1rem,5vw,4.25rem)] font-extrabold leading-[1.04] tracking-[-.045em] text-[#081F32]">
                {current.name}
              </motion.h1>
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={`description-${current.name}`} {...enter(reducedMotion ? 0 : .12)}
                className="mt-5 max-w-xl text-sm leading-7 text-[#486477] sm:text-base">
                {current.description || product.short_description}
              </motion.p>
            </AnimatePresence>

            <AnimatePresence mode="wait" initial={false}>
              <motion.dl key={`specifications-${current.name}`} {...enter(reducedMotion ? 0 : .18)}
                className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#DCEAF0] bg-white p-4">
                <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-[#537283]"><Ruler size={14} aria-hidden="true" /> Š × V</dt>
                <dd className="mt-2 text-sm font-bold text-[#08283E]">{formatDimensions(current)}</dd>
              </div>
              <div className="rounded-2xl border border-[#DCEAF0] bg-white p-4">
                <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-[#537283]"><Layers3 size={14} aria-hidden="true" /> Profil</dt>
                <dd className="mt-2 text-sm font-bold text-[#08283E]">{current.profile || 'Na upřesnění'}</dd>
              </div>
              <div className="col-span-2 rounded-2xl border border-[#DCEAF0] bg-white p-4 sm:col-span-1">
                <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-[#537283]"><Droplets size={14} aria-hidden="true" /> Trysky</dt>
                <dd className="mt-2 text-sm font-bold text-[#08283E]">{current.nozzles || 'Na upřesnění'}</dd>
              </div>
              </motion.dl>
            </AnimatePresence>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="#gate-variant-info" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#88B9CB] bg-white px-6 py-3 text-sm font-bold text-[#0B3D56] transition hover:bg-[#EBF7FA]">
                Detail varianty <ScanLine size={16} aria-hidden="true" />
              </a>
              <Link to={quoteUrl} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#00B8EB] px-6 py-3 text-sm font-bold text-[#061D2C] transition hover:bg-[#6CDAF5]">
                Poptat cenu varianty <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="order-1 min-w-0 lg:order-2">
            <div className="relative isolate aspect-video overflow-hidden rounded-[1.75rem] border border-[#D3E8EF] bg-[radial-gradient(ellipse_at_50%_24%,#FFFFFF_12%,#EAF4F7_67%,#D6E6EB_100%)] shadow-[0_22px_65px_rgba(9,48,70,.08)] lg:aspect-[16/10] 2xl:aspect-video">
              <AnimatePresence mode="wait" initial={false}>
                {image && !imageFailed ? (
                  <motion.img key={current.name} src={image} srcSet={responsiveProductSrcSet(image)}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    alt={`${current.name} — katalogový náhled provedení`}
                    onError={() => setImageFailed(true)}
                    initial={reducedMotion ? false : { opacity: 0, scale: 1.035, x: 12 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, scale: .99, x: -12 }}
                    transition={{ duration: reducedMotion ? 0 : .65, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 h-full w-full object-contain p-3 sm:p-5 xl:p-7" />
                ) : (
                  <motion.div key={`fallback-${current.name}`} className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center text-[#37667F]">
                    <GateShapeIcon kind={kind} className="h-24 w-32" />
                    <span className="max-w-xs text-sm font-semibold">Katalogový náhled varianty čeká na ověření.</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={`hero-metadata-${current.name}`} {...enter(reducedMotion ? 0 : .25, 12)}
                  className="pointer-events-none absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 sm:bottom-5 sm:left-5 sm:right-5">
                  <span className="rounded-full border border-white/75 bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-[#406A7F] shadow-sm backdrop-blur-md">
                    {current.variant_visual_state || 'Katalogový podklad'}
                  </span>
                  <span className="inline-flex max-w-full items-center gap-2 rounded-2xl border border-white/80 bg-white/95 px-3 py-2 text-[#0C425D] shadow-[0_8px_24px_rgba(12,54,82,.12)] backdrop-blur-xl sm:px-4">
                    <motion.span aria-hidden="true"
                      initial={reducedMotion ? false : { opacity: 0, rotate: -10, scale: .75 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      transition={{ duration: reducedMotion ? 0 : .5, delay: reducedMotion ? 0 : .28 }}>
                      <GateShapeIcon kind={kind} className="h-7 w-9 sm:h-9 sm:w-12" />
                    </motion.span>
                    <span className="flex flex-col">
                      <span className="text-[9px] font-semibold uppercase tracking-[.08em] text-[#4E7D91]">Šířka × výška</span>
                      <span className="text-xs font-bold tabular-nums sm:text-sm">{formatDimensions(current)}</span>
                    </span>
                  </span>
                </motion.div>
              </AnimatePresence>
              <button type="button" onClick={() => select(active - 1)} aria-label="Předchozí varianta"
                className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#D7E8EF] bg-white/95 text-[#123F59] shadow-md transition hover:bg-white sm:left-4">
                <ChevronLeft size={22} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => select(active + 1)} aria-label="Další varianta"
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#D7E8EF] bg-white/95 text-[#123F59] shadow-md transition hover:bg-white sm:right-4">
                <ChevronRight size={22} aria-hidden="true" />
              </button>
            </div>
            <div role="group" aria-label="Vybrat rozměr a tvar brány" className="mt-4 flex gap-2 overflow-x-auto pb-3">
              {variants.map((item, index) => (
                <button key={item.name} type="button" onClick={() => select(index)}
                  aria-pressed={index === active} aria-label={`${item.name}, ${formatDimensions(item)}`}
                  className={`flex min-h-[90px] min-w-[125px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl border px-3 py-2 text-center transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008AC0] sm:min-w-[145px] ${index === active ? 'border-[#008CB8] bg-[#E5F6FC] text-[#054B68]' : 'border-[#D4E6EC] bg-white text-[#45667A] hover:border-[#70C4DD]'}`}>
                  <motion.span animate={index === active && !reducedMotion ? { scale: [1, 1.09, 1] } : { scale: 1 }}
                    transition={{ duration: .4, ease: 'easeOut' }}>
                    <GateShapeIcon kind={getShape(item.name)} className="h-8 w-12" />
                  </motion.span>
                  <span className="line-clamp-1 max-w-[125px] text-[10px] font-bold">{item.name.replace(/^BRÁNA /, '')}</span>
                  <span className="text-[10px] font-semibold">{item.dimensions ? `${item.dimensions} mm` : 'Rozměr na dotaz'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div id="gate-variant-info" className="mt-12 scroll-mt-28 rounded-[1.5rem] border border-[#D5E8EF] bg-white p-6 sm:p-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.17em] text-[#087DA5]">Technické provedení vybrané varianty</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-[#0B2D45]">{current.name}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#4C6576]">{current.description || 'Konfiguraci přizpůsobíme prostoru.'}</p>
          <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-sm text-[#294C61]">
            <span><strong>Rozměr:</strong> {formatDimensions(current)}</span>
            <span><strong>Profil:</strong> {current.profile || 'Na upřesnění'}</span>
            <span><strong>Trysky:</strong> {current.nozzles || 'Na upřesnění'}</span>
          </div>
          <p className="mt-5 text-xs leading-6 text-[#6D7F8D]">
            Rozměry a technické údaje jsou převzaty z katalogového záznamu. Náhledy jednotlivých variant nepředstavují výrobní výkres. Nové studiové vizualizace podléhají kontrole geometrie podle jejich MASTER podkladů.
          </p>
        </div>
      </div>
    </section>
  );
}
