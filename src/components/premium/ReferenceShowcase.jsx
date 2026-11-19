import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, MapPin, Play, Images } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const FILTERS = [
  { key: 'all', label: 'Všechny realizace' },
  { key: 'mestsky', label: 'Města · náměstí · parky' },
  { key: 'soukromy', label: 'Zahrady · rezidence' },
  { key: 'event', label: 'Akce · pronájmy' },
  { key: 'prumyslovy', label: 'Komerční prostory' },
];
const CATEGORY_LABEL = {
  mestsky: 'Města a veřejný prostor',
  soukromy: 'Soukromé zahrady',
  event: 'Akce a pronájmy',
  prumyslovy: 'Komerční realizace',
};
const referenceSlugs = {
  '6a42491409abbf575447aaeb': 'mlzitka-pro-zoo-praha',
  '6a480e05664f948152611f5f': 'mlzitko-mrak-materska-skola-siskova',
  '6a480c0da87022c6c9559115': 'mlzitko-aura-domov-palata-praha-5',
  '6a72947ef1579cba611a2f6b': 'mlzitko-mrak-soukroma-zahrada',
  '6a71d1ff57598752eed27bfb': 'bendy-jicinske-namesti',
  '6a9fdf2f153be3ee13d70207': 'bendy-linea-rodinna-zahrada',
  '6a6b8d1d553d8991f46cd6a3': 'mestska-mlzna-brana-gate',
  '6a450e035aef0b45b2a8728f': 'mesto-polna-mlzitko-mrkev',
  '6ac7164f1b394c252d836779': 'bendy-nemojov',
  '6ac7164f1b394c252d83677a': 'teepee-nove-mesto-na-morave',
};
const NATIVE_VIDEO = /\.(mp4|webm)(\?|$)/i;
const referencePath = (project) => '/reference/' + (referenceSlugs[project.id] || project.id);
const descriptionPlainText = (text) => String(text || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

function ProjectCard({ project }) {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const gallery = project.id === '6a71d1ff57598752eed27bfb'
    ? [] // Chybně přiřazená zahradní fotografie v CMS, nevykreslovat u Jičína.
    : Array.isArray(project.gallery_urls) ? project.gallery_urls : [];
  const clip = [project.video_url, ...gallery].find((url) => NATIVE_VIDEO.test(String(url || '')));
  const cover = project.image_url;
  const mediaCount = gallery.filter((url) => /\.(png|jpe?g|webp|avif|gif)(\?|$)/i.test(String(url || ''))).length + (cover ? 1 : 0);
  const shortText = descriptionPlainText(project.description);
  const categoryLabel = CATEGORY_LABEL[project.category] || 'Reference mlžítek';

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    if (hovered && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.play().catch(() => {});
    } else {
      node.pause();
    }
  }, [hovered]);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(6,31,43,.04)] transition-all duration-500 hover:-translate-y-1 hover:border-teal-300 hover:shadow-[0_22px_55px_rgba(6,31,43,.16)] focus-within:ring-2 focus-within:ring-teal-600">
      <Link
        to={referencePath(project)}
        className="flex h-full flex-col focus-visible:outline-none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label={'Otevřít detail realizace ' + project.name + (project.location ? ', ' + project.location : '')}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#113744]">
          {cover && (
            <img
              src={cover}
              alt={project.id === '6a71d1ff57598752eed27bfb' ? 'Nerezové mlžítko BENDY na Valdštejnově náměstí v Jičíně' : 'Realizace mlžítek: ' + project.name + (project.location ? ' – ' + project.location : '')}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.045]"
            />
          )}
          {clip && hovered && (
            <video
              ref={videoRef}
              src={clip}
              autoPlay={false}
              muted
              loop
              playsInline
              preload="none"
              poster={cover || undefined}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061f2b]/70 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {mediaCount > 1 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-slate-900">
                <Images size={13} /> Fotografie
              </span>
            )}
            {clip && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/45 bg-[#052631]/80 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                <Play size={12} /> Video v projektu
              </span>
            )}
          </div>
          <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
            Otevřít realizaci <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </span>
        </div>
        <div className="flex flex-1 flex-col px-6 pb-7 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[.15em] text-teal-700">
            {categoryLabel}{project.year ? ' / ' + project.year : ''}
          </p>
          <h3 className="mt-3 font-heading text-xl leading-snug tracking-tight text-slate-950 sm:text-2xl">
            {project.id === '6a71d1ff57598752eed27bfb'
              ? 'Mlžítko BENDY na Valdštejnově náměstí v Jičíně'
              : project.name}
          </h3>
          {project.location && (
            <p className="mt-3 flex items-start gap-2 text-sm text-slate-600">
              <MapPin size={15} className="mt-0.5 shrink-0" /> {project.location}
            </p>
          )}
          {shortText && (
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{shortText}</p>
          )}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
            {project.product_used && <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800">{project.product_used}</span>}
            <span className="inline-flex items-center gap-2 text-sm font-bold text-teal-800">Detail projektu <ArrowUpRight size={15} /></span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function ReferenceShowcase() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [active, setActive] = useState('all');

  useEffect(() => {
    let current = true;
    base44.entities.Realizace.list('-created_date', 100)
      .then((items) => { if (current) setProjects((items || []).filter((item) => item.published !== false)); })
      .catch(() => { if (current) setError(true); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, []);

  const counts = useMemo(() => {
    const result = { all: projects.length };
    FILTERS.slice(1).forEach((filter) => {
      result[filter.key] = projects.filter((item) => item.category === filter.key).length;
    });
    return result;
  }, [projects]);

  const visible = useMemo(() => {
    const chosen = active === 'all' ? projects : projects.filter((p) => p.category === active);
    return [...chosen].sort((a, b) => Number(b.featured || 0) - Number(a.featured || 0));
  }, [active, projects]);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-8 lg:pb-28">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Vyberte si projekt podle prostředí a otevřete jeho fotografie, videozáběry a technické souvislosti. Kliknutím na kteroukoli kartu přejdete přímo do detailu realizace.
        </p>
        <Link to="/poptavka" className="btn-metallic-mist inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold">
          Poptat vlastní mlžítko <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filtrovat realizace mlžítek">
        {FILTERS.map((filter) => (
          <button
            type="button"
            key={filter.key}
            onClick={() => setActive(filter.key)}
            aria-pressed={active === filter.key}
            className={'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ' +
              (active === filter.key
                ? 'border-[#063547] bg-[#063547] text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:border-teal-700 hover:text-teal-800')}
          >
            {filter.label} <span className="opacity-70">{counts[filter.key] || 0}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Načítání referencí">
          {Array.from({ length: 6 }, (_, index) => <div key={index} className="h-96 animate-pulse rounded-2xl bg-slate-100" />)}
        </div>
      ) : error ? (
        <p role="alert" className="rounded-xl bg-slate-100 p-8 text-slate-700">Realizace se nepodařilo načíst. Obnovte prosím stránku.</p>
      ) : visible.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      ) : (
        <p className="rounded-xl bg-slate-100 p-8 text-slate-700">V této kategorii zatím nejsou zveřejněné realizace. Vyberte jinou kategorii.</p>
      )}
    </div>
  );
}
