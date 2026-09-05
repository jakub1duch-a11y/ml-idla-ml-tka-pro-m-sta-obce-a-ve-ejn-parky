import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, MapPin, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Mapa známých ID referencí na jejich URL slugy ( stejné jako v ReferenceDetail )
const REFERENCE_SLUGS = {
  '6a42491409abbf575447aaeb': 'mlzitka-pro-zoo-praha',
  '6a480e05664f948152611f5f': 'mlzitko-mrak-materska-skola-siskova',
  '6a480c0da87022c6c9559115': 'mlzitko-aura-domov-palata-praha-5',
  '6a72947ef1579cba611a2f6b': 'mlzitko-mrak-soukroma-zahrada',
  '6a71d1ff57598752eed27bfb': 'bendy-jicinske-namesti',
  '6a6b8d1d553d8991f46cd6a3': 'mestska-mlzna-brana-gate',
  '6a450e035aef0b45b2a8728f': 'mesto-polna-mlzitko-mrkev',
};

const PROJECT_ORDER = [
  '6a42491409abbf575447aaeb', // ZOO Praha
  '6a450e035aef0b45b2a8728f', // Město Polná — MRKEV
  '6a71d1ff57598752eed27bfb', // Bendy Jičín
  '6a480e05664f948152611f5f', // MŠ Šiškova — MRAK
  '6a6b8d1d553d8991f46cd6a3', // Městská brána GATE
  '6a72947ef1579cba611a2f6b', // Soukromá zahrada MRAK
];

const CATEGORY_LABELS = {
  mestsky: 'Městský prostor',
  event: 'Event',
  soukromy: 'Soukromý',
  prumyslovy: 'Průmyslový',
};

const isVideoFile = (url) => /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url || '');

function buildLink(project) {
  return `/reference/${REFERENCE_SLUGS[project.id] || project.id}`;
}

export default function ProjectGallerySection() {
  const reduceMotion = useReducedMotion();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Realizace.list()
      .then((items) => {
        const all = items || [];
        // Seřadit podle preferovaného pořadí, doplnit o další featured/published
        const ordered = PROJECT_ORDER
          .map((id) => all.find((p) => p.id === id))
          .filter(Boolean);
        const extras = all.filter((p) =>
          p.published !== false &&
          p.image_url &&
          !ordered.includes(p) &&
          (p.featured || p.id !== '6a60d9d9702abda4e28159d3')
        ).slice(0, 6 - ordered.length);
        setProjects([...ordered, ...extras].slice(0, 6));
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-[#061f2b] py-20">
        <div className="flex justify-center">
          <Loader size={24} className="animate-spin text-white/30" />
        </div>
      </section>
    );
  }

  if (!projects.length) return null;

  const [hero, ...rest] = projects;

  return (
    <section className="relative overflow-hidden bg-[#061f2b] py-16 text-white sm:py-20 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(34,211,238,0.06)_0%,transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        {/* Heading */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] tracking-[.2em] uppercase text-[#22D3EE]">
              Fotogalerie realizací
            </p>
            <h2 className="mt-4 max-w-2xl font-heading text-[clamp(2rem,8vw,2.75rem)] leading-[1.06] tracking-[-0.035em] lg:text-5xl">
              Projekty, které ochlazují města, areály i zahrady.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/65">
              Od ZOO Praha přes historická náměstí po soukromé terasy. Každá realizace je navržená na míru prostoru a provozu.
            </p>
          </div>
          <Link
            to="/reference"
            className="btn-secondary-outline inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white sm:w-auto"
          >
            Všechny realizace <ArrowRight size={16} />
          </Link>
        </div>

        {/* Magazine grid */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {/* Hero project — zaber 2 sloupce + 2 řádky na desktopu */}
          {hero && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: reduceMotion ? 0 : 0.5 }}
              className="lg:col-span-2 lg:row-span-2"
            >
              <Link
                to={buildLink(hero)}
                className="group relative block h-full min-h-[320px] overflow-hidden rounded-2xl bg-slate-800"
              >
                <img
                  src={hero.image_url}
                  alt={hero.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041c28]/90 via-[#041c28]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-[.14em] text-[#22D3EE]">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={12} className="shrink-0" />
                      <span className="max-w-[200px] truncate">{hero.location || 'Česko'}</span>
                    </span>
                    {hero.year && <span>{hero.year}</span>}
                    {hero.category && <span className="rounded-full border border-white/20 px-2.5 py-1 text-white/80">{CATEGORY_LABELS[hero.category] || hero.category}</span>}
                  </div>
                  <h3 className="mt-4 font-heading text-2xl leading-[1.15] sm:text-3xl lg:text-[2.1rem]">
                    {hero.name}
                  </h3>
                  {hero.product_used && (
                    <p className="mt-2 text-sm text-white/60">Produkt: {hero.product_used}</p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition-transform group-hover:translate-x-1">
                    Zobrazit realizaci <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Menší projekty */}
          {rest.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: reduceMotion ? 0 : 0.45, delay: (i % 3) * 0.06 }}
            >
              <Link
                to={buildLink(project)}
                className="group relative block h-full min-h-[260px] overflow-hidden rounded-2xl bg-slate-800"
              >
                <img
                  src={project.image_url}
                  alt={project.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041c28]/88 via-[#041c28]/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[.12em] text-[#22D3EE]">
                    <MapPin size={11} className="shrink-0" />
                    <span className="max-w-[160px] truncate">{project.location || 'Česko'}</span>
                    {project.year && <span className="text-white/50">· {project.year}</span>}
                  </div>
                  <h3 className="mt-3 font-heading text-lg leading-[1.2] line-clamp-2">
                    {project.name}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 transition-transform group-hover:translate-x-1">
                    Detail <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}