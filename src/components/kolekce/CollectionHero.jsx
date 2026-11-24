import HeroAtmosphere from '@/components/ui/HeroAtmosphere';
import HeroBackgroundVideo from '@/components/ui/HeroBackgroundVideo';
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ShieldCheck } from 'lucide-react';

const COLLECTION_FALLBACK = '/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp';

export default function CollectionHero({ collection }) {
  const reduced = useReducedMotion();
  const isCity = collection.name === 'Městská mlžítka';
  const isGarden = collection.name === 'Zahradní mlžítka';

  return (
    <section className="hero-motion-surface relative min-h-[620px] overflow-hidden bg-primary text-primary-foreground lg:min-h-[680px]">
      <HeroAtmosphere />
      <div className="absolute inset-0">
        {collection.video_url ? (
          <HeroBackgroundVideo key={collection.video_url} src={collection.video_url} poster={collection.image || COLLECTION_FALLBACK} className="h-full w-full object-cover" />
        ) : (
          <img
            src={collection.image || COLLECTION_FALLBACK}
            alt={collection.name}
            className="h-full w-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            onError={(event) => { event.currentTarget.src = COLLECTION_FALLBACK; }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/74 to-primary/12" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/35 via-transparent to-primary/10" />
      </div>

      <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-6 py-20 lg:min-h-[680px] lg:px-10">
        <motion.div className="max-w-4xl" initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}>
          <p className="font-mono text-[11px] tracking-[.18em] uppercase text-accent">MLŽIDLA® / {collection.label}</p>
          <h1 className="mt-5 max-w-4xl font-heading text-4xl leading-[1.02] text-white sm:text-5xl lg:text-7xl">{collection.headline}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-200 lg:text-xl">{collection.text}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/poptavka" className="catalog-sweep inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground shadow-xl transition hover:-translate-y-0.5">
              {isCity ? 'Získat návrh a cenu' : isGarden ? 'Získat návrh a cenu' : 'Získat návrh a cenu'} <ArrowRight size={16} />
            </Link>
            <Link to={isCity || isGarden ? '/reference' : '/mlzidla-mlzitka#catalog'} className="catalog-sweep inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/[.08] px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/[.14]">
              {isCity || isGarden ? 'Prohlédnout realizace' : 'Prohlédnout produkty'} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/70">
            {isCity && <span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-accent" /> Návrh · výroba · instalace · servis</span>}
            {isGarden && <span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-accent" /> Český návrh a výroba · nerez · servis</span>}
            {collection.video_url && <span className="inline-flex items-center gap-2"><Play size={14} className="text-accent" /> Prohlédněte si video</span>}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
