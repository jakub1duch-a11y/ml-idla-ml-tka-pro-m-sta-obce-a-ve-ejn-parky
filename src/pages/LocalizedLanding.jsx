import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Droplets,
  Factory,
  Palette,
  ShieldCheck,
  Sparkles,
  Trees,
  Wifi,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { getLocaleFromPath, ROUTE_MAP } from '@/lib/i18n';
import { getLocalizedPage } from '@/lib/localized-content';
import { getLocalizedUi } from '@/lib/localized-ui';
import { setSEO } from '@/lib/seo';
import LocalizedInquiryForm from '@/components/localized/LocalizedInquiryForm';

const HERO_IMAGES = {
  home: '/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp',
  catalog: '/media/optimized/cfc837b23_image.webp',
  city: '/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp',
  garden: '/media/optimized/b94c771e1_a982a794f_mlzitkosteblo.webp',
  custom: '/media/optimized/68953132b_IMG_3524.webp',
  technology: '/media/optimized/84af07a7b_0d4b710a-7605-463b-835a-71e89991f12d.webp',
  smart: '/media/optimized/5c4b99749_Smartmlzitka-ovladanizmobilu.webp',
  references: '/assets/reference-zoo-hero.webp',
  contact: '/media/optimized/68953132b_IMG_3524.webp',
  inquiry: '/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp',
  about: '/media/optimized/84af07a7b_0d4b710a-7605-463b-835a-71e89991f12d.webp',
  faq: '/media/optimized/cfc837b23_image.webp',
};

const SOLUTION_MEDIA = {
  catalog: { image: '/media/optimized/cfc837b23_image.webp', icon: Droplets },
  city: { image: '/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp', icon: Building2 },
  garden: { image: '/media/optimized/b94c771e1_a982a794f_mlzitkosteblo.webp', icon: Trees },
  custom: { image: '/media/optimized/68953132b_IMG_3524.webp', icon: Palette },
  smart: { image: '/media/optimized/5c4b99749_Smartmlzitka-ovladanizmobilu.webp', icon: Wifi },
  references: { image: '/assets/reference-zoo-hero.webp', icon: ShieldCheck },
};

const iconSet = [Droplets, ShieldCheck, Sparkles];
const RELATED_KEYS = ['catalog', 'city', 'garden', 'custom', 'smart', 'references'];
const FORM_ROUTES = new Set(['contact', 'inquiry']);

function FeatureCards({ page }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      <div className="grid gap-4 lg:grid-cols-3">
        {page.sections.map(([title, text], index) => {
          const Icon = iconSet[index % iconSet.length];
          return (
            <motion.article key={title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .34, delay: index * .04, ease: [0.22, 1, 0.36, 1] }} className="group rounded-[26px] border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-950/[.05] sm:p-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-cyan-300"><Icon size={18}/></span>
              <h2 className="mt-7 font-heading text-2xl font-medium tracking-[-.02em]">{title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{text}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function FaqSection({ page, ui }) {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[.2em] text-secondary">{ui.faqKicker}</p>
        <h2 className="mt-3 font-heading text-3xl font-medium tracking-[-.035em] text-slate-950 sm:text-4xl">{ui.faqTitle}</h2>
        <div className="mt-8 space-y-3">
          {page.sections.map(([title, text], index) => (
            <motion.details key={title} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .28, delay: index * .035 }} className="group rounded-2xl border border-slate-200 bg-white open:border-slate-300 open:shadow-lg open:shadow-slate-950/[.035]">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 font-semibold text-slate-900 sm:px-6">
                <span>{title}</span><ChevronDown size={18} className="shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"/>
              </summary>
              <p className="border-t border-slate-100 px-5 py-5 text-sm leading-7 text-slate-600 sm:px-6 sm:text-base">{text}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}

function SmartVisual({ ui, reduceMotion }) {
  return (
    <section className="overflow-hidden bg-[#061f2b] py-16 text-white sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[.86fr_1.14fr] lg:gap-16 lg:px-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-cyan-300">{ui.smartKicker}</p>
          <h2 className="mt-3 max-w-xl font-heading text-3xl font-medium leading-tight tracking-[-.035em] sm:text-4xl lg:text-5xl">{ui.smartTitle}</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">{ui.smartText}</p>
          <div className="mt-7 flex flex-wrap gap-2">
            {ui.smartPills.map((pill) => <span key={pill} className="rounded-full border border-white/15 bg-white/[.06] px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur">{pill}</span>)}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, x: reduceMotion ? 0 : 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .42, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto w-full max-w-2xl">
          <div className="overflow-hidden rounded-[30px] border border-white/12 bg-white shadow-2xl shadow-black/30">
            <img src="/media/optimized/5c4b99749_Smartmlzitka-ovladanizmobilu.webp" alt={ui.smartTitle} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-contain" />
          </div>
          {!reduceMotion && <>
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-4 left-4 rounded-2xl border border-white/20 bg-[#082a37]/92 px-4 py-3 shadow-xl backdrop-blur-xl sm:left-7">
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.7)]"/><span className="text-xs font-semibold">{ui.smartPills[0]}</span></div>
            </motion.div>
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: .4 }} className="absolute -right-2 top-8 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-slate-900 shadow-xl backdrop-blur sm:right-5">
              <div className="flex items-center gap-2"><Wifi size={14} className="text-secondary"/><span className="text-xs font-semibold">{ui.smartPills[1]}</span></div>
            </motion.div>
          </>}
        </motion.div>
      </div>
    </section>
  );
}

function ProjectFlow({ ui }) {
  return (
    <section className="bg-slate-950 py-16 text-white sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-cyan-300">{ui.flowKicker}</p>
            <h2 className="mt-3 max-w-xl font-heading text-3xl font-medium leading-tight tracking-[-.035em] sm:text-4xl">{ui.flowTitle}</h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[26px] bg-white/10 sm:grid-cols-2">
            {ui.steps.map(([number, title, text], index) => (
              <motion.article key={number} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .3, delay: index * .035 }} className="bg-[#0a2732] p-5 sm:p-6">
                <span className="font-mono text-[10px] tracking-[.18em] text-cyan-300">{number}</span>
                <h3 className="mt-4 font-heading text-xl font-medium">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/58">{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExploreSolutions({ locale, ui, currentRoute }) {
  return (
    <section className="border-t border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-secondary">{ui.exploreKicker}</p>
          <h2 className="mt-3 font-heading text-3xl font-medium tracking-[-.035em] text-slate-950 sm:text-4xl">{ui.exploreTitle}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{ui.exploreText}</p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RELATED_KEYS.filter((key) => key !== currentRoute).map((key, index) => {
            const media = SOLUTION_MEDIA[key];
            const Icon = media.icon;
            return (
              <motion.div key={key} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .28, delay: Math.min(index * .03, .12) }}>
                <Link to={ROUTE_MAP[key][locale]} className="group relative flex min-h-48 overflow-hidden rounded-[24px] bg-slate-900 text-white">
                  <img src={media.image} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-[1.035] group-hover:opacity-65" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-transparent"/>
                  <div className="relative mt-auto flex w-full items-end justify-between gap-4 p-5">
                    <div><Icon size={17} className="text-cyan-300"/><h3 className="mt-3 font-heading text-xl font-medium">{ui.cards[key]}</h3></div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 transition group-hover:translate-x-1 group-hover:bg-white/20"><ArrowRight size={15}/></span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function LocalizedLanding({ routeKey = 'home' }) {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const locale = getLocaleFromPath(location.pathname);
  const page = getLocalizedPage(routeKey, locale);
  const ui = getLocalizedUi(locale);
  const inquiryPath = ROUTE_MAP.inquiry[locale];
  const primaryPath = routeKey === 'inquiry' ? ROUTE_MAP.contact[locale] : inquiryPath;
  const referencePath = ROUTE_MAP.references[locale];
  const catalogPath = ROUTE_MAP.catalog[locale];

  useEffect(() => {
    /** @type {any[]} */
    const graph = [
      {
        '@type': 'Organization',
        '@id': 'https://mlzidla.cz/#organization',
        name: 'HolmTec',
        url: 'https://mlzidla.cz',
        brand: { '@type': 'Brand', name: 'MLŽIDLA®' },
        knowsLanguage: ['cs', 'en', 'de', 'pl', 'sk', 'it'],
        contactPoint: { '@type': 'ContactPoint', telephone: '+420774700390', email: 'obchod1@holmtec.cz', contactType: 'sales' },
      },
      {
        '@type': FORM_ROUTES.has(routeKey) ? 'ContactPage' : routeKey === 'about' ? 'AboutPage' : 'Service',
        '@id': `https://mlzidla.cz${page.canonicalPath}#page`,
        url: `https://mlzidla.cz${page.canonicalPath}`,
        name: page.title,
        description: page.description,
        inLanguage: locale,
        provider: { '@id': 'https://mlzidla.cz/#organization' },
        areaServed: ['CZ', 'DE', 'AT', 'PL', 'SK', 'IT', 'EU'],
      },
    ];

    if (routeKey === 'faq') {
      graph.push({
        '@type': 'FAQPage',
        '@id': `https://mlzidla.cz${page.canonicalPath}#faq`,
        inLanguage: locale,
        mainEntity: page.sections.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
      });
    }

    setSEO({
      title: page.title,
      description: page.description,
      keywords: page.keywords,
      canonicalPath: page.canonicalPath,
      locale,
      alternates: page.alternates,
      image: HERO_IMAGES[routeKey],
      jsonLd: { '@context': 'https://schema.org', '@graph': graph },
    });
  }, [locale, page, routeKey]);

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <section className="relative min-h-[650px] overflow-hidden bg-[#061f2b] pt-16 text-white sm:min-h-[680px] lg:min-h-[760px]">
        <img src={HERO_IMAGES[routeKey]} alt="MLŽIDLA® outdoor misting system" fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#041c28]/96 via-[#082f3f]/80 to-[#041c28]/22" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#041c28]/82 via-transparent to-[#041c28]/15" />
        <div className="relative mx-auto flex min-h-[590px] max-w-7xl items-end px-5 pb-14 pt-24 sm:min-h-[620px] sm:px-6 lg:min-h-[700px] lg:px-8 lg:pb-20">
          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: reduceMotion ? 0 : 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }} className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
              <Factory size={14} className="shrink-0 text-cyan-300" />
              <span className="truncate font-mono text-[9px] uppercase tracking-[.16em] text-white/80 sm:text-[10px] sm:tracking-[.18em]">{page.badge}</span>
            </motion.div>
            <motion.p initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .04, duration: .32 }} className="mt-7 font-mono text-[10px] uppercase tracking-[.2em] text-cyan-300 sm:text-[11px]">{page.eyebrow}</motion.p>
            <motion.h1 initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .07, duration: .4, ease: [0.22, 1, 0.36, 1] }} className="mt-4 max-w-4xl font-heading text-[clamp(2.45rem,9vw,4.8rem)] font-medium leading-[.98] tracking-[-.045em]">{page.heading}</motion.h1>
            <motion.p initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .38 }} className="mt-7 max-w-3xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">{page.lead}</motion.p>
            <motion.div initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .17, duration: .34 }} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to={primaryPath} className="btn-metallic-mist inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold">{page.primaryCta}<ArrowRight size={16}/></Link>
              <Link to={referencePath} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[.06] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/12">{page.secondaryCta}<ArrowRight size={16}/></Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl px-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {page.trust.map((item) => (
            <div key={item} className="flex min-h-20 items-center gap-3 border-b border-slate-200 py-5 sm:px-4 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
              <CheckCircle2 size={16} className="shrink-0 text-secondary" />
              <span className="text-sm leading-5 text-slate-600">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {FORM_ROUTES.has(routeKey) && <LocalizedInquiryForm locale={locale} routeKey={routeKey} sourcePath={location.pathname} />}
      {routeKey === 'smart' && <SmartVisual ui={ui} reduceMotion={reduceMotion} />}
      {routeKey === 'faq' ? <FaqSection page={page} ui={ui} /> : <FeatureCards page={page} />}
      {!FORM_ROUTES.has(routeKey) && routeKey !== 'faq' && <ProjectFlow ui={ui} />}
      <ExploreSolutions locale={locale} ui={ui} currentRoute={routeKey} />

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
