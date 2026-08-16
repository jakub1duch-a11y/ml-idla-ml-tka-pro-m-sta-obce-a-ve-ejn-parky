import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Droplets, Factory, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { getLocaleFromPath, ROUTE_MAP } from '@/lib/i18n';
import { getLocalizedPage } from '@/lib/localized-content';
import { setSEO } from '@/lib/seo';

const HERO_IMAGES = {
  home: '/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp',
  catalog: '/media/optimized/cfc837b23_image.webp',
  city: '/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp',
  garden: '/media/optimized/b94c771e1_a982a794f_mlzitkosteblo.webp',
  custom: '/media/optimized/68953132b_IMG_3524.webp',
  technology: '/media/optimized/84af07a7b_0d4b710a-7605-463b-835a-71e89991f12d.webp',
  smart: '/media/optimized/cfc837b23_image.webp',
  references: '/assets/reference-zoo-hero.webp',
  contact: '/media/optimized/68953132b_IMG_3524.webp',
  inquiry: '/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp',
  about: '/media/optimized/84af07a7b_0d4b710a-7605-463b-835a-71e89991f12d.webp',
  faq: '/media/optimized/cfc837b23_image.webp',
};

const iconSet = [Droplets, ShieldCheck, Sparkles];

export default function LocalizedLanding({ routeKey = 'home' }) {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const page = getLocalizedPage(routeKey, locale);
  const inquiryPath = ROUTE_MAP.inquiry[locale];
  const primaryPath = routeKey === 'inquiry' ? ROUTE_MAP.contact[locale] : inquiryPath;
  const referencePath = ROUTE_MAP.references[locale];
  const catalogPath = ROUTE_MAP.catalog[locale];

  useEffect(() => {
    setSEO({
      title: page.title,
      description: page.description,
      keywords: page.keywords,
      canonicalPath: page.canonicalPath,
      locale,
      alternates: page.alternates,
      image: HERO_IMAGES[routeKey],
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': routeKey === 'about' ? 'Organization' : 'Service',
        name: page.title,
        description: page.description,
        inLanguage: locale,
        provider: { '@type': 'Organization', name: 'HolmTec', url: 'https://mlzidla.cz' },
        areaServed: ['CZ', 'DE', 'AT', 'PL', 'SK', 'IT', 'EU'],
      },
    });
  }, [locale, page, routeKey]);

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <section className="relative min-h-[670px] overflow-hidden bg-[#061f2b] pt-16 text-white lg:min-h-[760px]">
        <img src={HERO_IMAGES[routeKey]} alt="MLŽIDLA® outdoor misting system" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#041c28]/95 via-[#082f3f]/78 to-[#041c28]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#041c28]/80 via-transparent to-[#041c28]/15" />
        <div className="relative mx-auto flex min-h-[610px] max-w-7xl items-end px-5 pb-14 pt-24 sm:px-6 lg:min-h-[700px] lg:px-8 lg:pb-20">
          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
              <Factory size={14} className="text-cyan-300" />
              <span className="font-mono text-[10px] uppercase tracking-[.18em] text-white/80">{page.badge}</span>
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .05, duration: .38 }} className="mt-7 font-mono text-[11px] uppercase tracking-[.2em] text-cyan-300">{page.eyebrow}</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .09, duration: .45, ease: [0.22, 1, 0.36, 1] }} className="mt-4 max-w-4xl font-heading text-[clamp(2.6rem,9vw,4.8rem)] font-medium leading-[.98] tracking-[-.045em]">{page.heading}</motion.h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15, duration: .42 }} className="mt-7 max-w-3xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">{page.lead}</motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .4 }} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to={primaryPath} className="btn-metallic-mist inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold">{page.primaryCta}<ArrowRight size={16}/></Link>
              <Link to={referencePath} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[.06] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/12">{page.secondaryCta}<ArrowRight size={16}/></Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-0 px-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {page.trust.map((item, index) => (
            <div key={item} className="flex min-h-20 items-center gap-3 border-b border-slate-200 py-5 sm:px-4 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
              <CheckCircle2 size={16} className="shrink-0 text-secondary" />
              <span className="text-sm leading-5 text-slate-600">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="grid gap-4 lg:grid-cols-3">
          {page.sections.map(([title, text], index) => {
            const Icon = iconSet[index % iconSet.length];
            return (
              <motion.article key={title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .4, delay: index * .05 }} className="group border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-950/[.05] sm:p-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-cyan-300"><Icon size={18}/></span>
                <h2 className="mt-7 font-heading text-2xl font-medium tracking-[-.02em]">{title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{text}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="bg-[#062d3b] py-16 text-white lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan-300">MLŽIDLA® / HolmTec</p>
            <h2 className="mt-4 max-w-3xl font-heading text-3xl font-medium leading-tight sm:text-4xl">{page.heading}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">{page.description}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link to={primaryPath} className="btn-metallic-mist inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold">{page.primaryCta}<ArrowRight size={16}/></Link>
            {routeKey !== 'catalog' && <Link to={catalogPath} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10">MLŽIDLA®</Link>}
          </div>
        </div>
      </section>
    </div>
  );
}
