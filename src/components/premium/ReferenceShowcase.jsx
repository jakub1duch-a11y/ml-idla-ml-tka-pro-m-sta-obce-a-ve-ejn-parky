import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, MapPin, Play, X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const FILTERS = [
  { key: 'all', label: 'Všechny realizace' },
  { key: 'mestsky', label: 'Města · náměstí · parky' },
  { key: 'soukromy', label: 'Rezidence · zahrady · terasy' },
  { key: 'event', label: 'Eventy · pronájmy' },
  { key: 'prumyslovy', label: 'Průmysl · komerční' },
];
const CATEGORY_LABEL = {
  mestsky: 'Městský prostor',
  soukromy: 'Soukromý projekt',
  event: 'Event',
  prumyslovy: 'Průmysl / komerční',
};
const CATEGORY_TAGLINE = {
  mestsky: 'Veřejný prostor · ochlazení pro města a obce',
  soukromy: 'Rezidenční · zahrady, terasy, relaxační zóny',
  event: 'Event · pronájmy a dočasné instalace',
  prumyslovy: 'Komerční · průmyslové a provozní prostory',
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
};
const referencePath = (project) => `/reference/${referenceSlugs[project.id] || project.id}`;

const JICIN_ID = '6a71d1ff57598752eed27bfb';
const JICIN_IMAGES = [
  'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/e7593e68f_realizace-IMG_5072.jpg',
  'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/1db590bd1_realizace-IMG_5040.jpg',
  'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/9dc93a791_realizace-IMG_5039.jpg',
  'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/5c7fc888a_realizace-IMG_5035.jpg',
  'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/add2a849f_realizace-IMG_5036.jpg',
  'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/1938f53e2_realizace-IMG_4983.jpg',
  'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/b60f1bf04_realizace-IMG_4989.jpg',
  'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/ff7aaa73f_realizace-IMG_4974.jpg',
];
const projectPhotos = (project) => project.id === JICIN_ID
  ? JICIN_IMAGES
  : [project.image_url, ...(Array.isArray(project.gallery_urls) ? project.gallery_urls : [])];
const projectCover = (project) => project.id === JICIN_ID ? JICIN_IMAGES[0] : project.image_url;

const isImage = (url) => String(url || '').match(/\.(png|jpe?g|webp|avif|gif)(\?|$)/i);

export default function ReferenceShowcase() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    base44.entities.Realizace.list('-created_date', 100)
      .then((items) => setProjects(items.filter((item) => item.published !== false)))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => {
    const map = { all: projects.length };
    FILTERS.forEach((filter) => {
      if (filter.key !== 'all') map[filter.key] = projects.filter((item) => item.category === filter.key).length;
    });
    return map;
  }, [projects]);

  const visible = useMemo(() => {
    const filtered = active === 'all' ? projects : projects.filter((item) => item.category === active);
    return filtered.sort((a, b) => Number(b.featured || 0) - Number(a.featured || 0));
  }, [active, projects]);

  const openLightbox = (project, startIndex = 0) => {
    const photos = projectPhotos(project)
      .filter((url) => url && isImage(url))
      .filter((url, index, all) => all.indexOf(url) === index);
    if (!photos.length) return;
    setLightbox({ project, photos, index: Math.min(startIndex, photos.length - 1) });
  };

  const lightboxNext = () => setLightbox((current) => current ? { ...current, index: (current.index + 1) % current.photos.length } : current);
  const lightboxPrev = () => setLightbox((current) => current ? { ...current, index: (current.index - 1 + current.photos.length) % current.photos.length } : current);

  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setLightbox(null);
      if (event.key === 'ArrowRight') lightboxNext();
      if (event.key === 'ArrowLeft') lightboxPrev();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightbox]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
        <div>
          <p className="font-mono text-[11px] tracking-[.18em] uppercase text-secondary">Galerie realizací</p>
          <h2 className="mt-3 font-heading text-foreground text-3xl lg:text-4xl">Mlžítka a mlžné brány v reálných prostorech.</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">Prohlédněte si nerezová řešení podle typu instalace — od veřejných náměstí a parků přes soukromé zahrady až po eventové pronájmy.</p>
        </div>
        <Link to="/poptavka" className="inline-flex items-center gap-2 btn-metallic-mist rounded-full px-5 py-3 text-sm font-bold">Navrhnout vlastní projekt <ArrowUpRight size={17} /></Link>
      </div>

      {/* Filter chips with counts */}
      <div className="mt-10 flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActive(filter.key)}
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-5 py-2.5 text-xs font-bold transition-all ${active === filter.key ? 'border-primary bg-primary text-primary-foreground shadow-sm' : 'border-border bg-transparent text-muted-foreground hover:border-secondary hover:text-secondary'}`}
          >
            {filter.label}
            <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${active === filter.key ? 'bg-white/20' : 'bg-muted'}`}>{counts[filter.key] || 0}</span>
          </button>
        ))}
      </div>

      {/* Gallery grid */}
      {loading ? (
        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-80 animate-pulse rounded-xl border border-border bg-muted" />)}
        </div>
      ) : (
        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => {
            const galleryPhotos = projectPhotos(project)
              .filter((url) => url && isImage(url))
              .filter((url, index, all) => all.indexOf(url) === index);
            const hasVideo = Boolean(project.video_url);
            return (
              <article key={project.id} className="group flex flex-col overflow-hidden border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-muted" onClick={() => openLightbox(project)}>
                  {projectCover(project) && <img src={projectCover(project)} alt={project.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  {hasVideo && <span className="absolute right-3 top-3 inline-flex items-center gap-1 bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground"><Play size={11} /> VIDEO</span>}
                  {galleryPhotos.length > 1 && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-900 shadow-sm">
                      <Images size={11} /> {galleryPhotos.length} fotek
                    </span>
                  )}
                  <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold text-slate-900 opacity-0 shadow-sm transition group-hover:opacity-100">
                    <Images size={12} className="text-secondary" /> Prohlédnout galerii
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-secondary">
                    <span>{CATEGORY_LABEL[project.category] || 'Realizace'}</span>
                    <span>{project.year}</span>
                  </div>
                  <h3 className="mt-4 font-heading text-2xl text-foreground">{project.name}</h3>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin size={14} className="shrink-0" />{project.location || 'Česká republika'}</p>
                  {project.description && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{project.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}</p>}
                  {project.product_used && <p className="mt-3 inline-flex w-fit rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-semibold text-secondary">{project.product_used}</p>}
                  <div className="mt-auto flex items-center gap-3 pt-5">
                    <Link to={referencePath(project)} className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary">Zobrazit projekt <ArrowUpRight size={15} /></Link>
                    {galleryPhotos.length > 1 && (
                      <button type="button" onClick={() => openLightbox(project)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-secondary">
                        <Images size={15} /> {galleryPhotos.length} fotek
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!loading && !visible.length && (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">V této kategorii zatím není zveřejněná realizace.</p>
          <p className="mt-2 text-sm text-muted-foreground/70">Vyberte jinou kategorii nebo nám napište — rádi připravíme řešení na míru.</p>
        </div>
      )}

      {/* Modern lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-[#031722]/96 backdrop-blur-xl" onClick={() => setLightbox(null)} role="dialog" aria-modal="true" aria-label={`Galerie: ${lightbox.project.name}`}>
          <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between border-b border-white/10 bg-black/15 px-4 py-3 text-white md:px-7">
            <div className="min-w-0">
              <p className="truncate font-heading text-base md:text-lg">{lightbox.project.name}</p>
              <p className="hidden text-xs text-white/55 sm:block">{CATEGORY_TAGLINE[lightbox.project.category] || ''}</p>
            </div>
            <div className="ml-4 flex items-center gap-3">
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs text-white/70">{lightbox.index + 1} / {lightbox.photos.length}</span>
              <button type="button" onClick={() => setLightbox(null)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white transition hover:bg-white/15" aria-label="Zavřít galerii"><X size={20} /></button>
            </div>
          </div>

          <button type="button" onClick={(e) => { e.stopPropagation(); lightboxPrev(); }} className="absolute left-3 top-1/2 z-20 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/25 text-white shadow-lg backdrop-blur transition hover:bg-white/15 md:left-6 md:h-12 md:w-12" aria-label="Předchozí fotografie"><ChevronLeft size={24} /></button>
          <button type="button" onClick={(e) => { e.stopPropagation(); lightboxNext(); }} className="absolute right-3 top-1/2 z-20 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/25 text-white shadow-lg backdrop-blur transition hover:bg-white/15 md:right-6 md:h-12 md:w-12" aria-label="Další fotografie"><ChevronRight size={24} /></button>

          <div className="flex h-full flex-col items-center justify-center px-4 pb-24 pt-20 md:px-20" onClick={(e) => e.stopPropagation()}>
            <div className="flex min-h-0 w-full flex-1 items-center justify-center">
              <img src={lightbox.photos[lightbox.index]} alt={`${lightbox.project.name} — foto ${lightbox.index + 1}`} className="max-h-full max-w-full select-none object-contain shadow-2xl" draggable="false" />
            </div>

            {lightbox.photos.length > 1 && (
              <div className="absolute bottom-3 left-1/2 z-20 flex max-w-[92vw] -translate-x-1/2 gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-black/35 p-2 shadow-xl backdrop-blur-xl md:bottom-5">
                {lightbox.photos.map((photo, index) => (
                  <button key={photo} type="button" onClick={() => setLightbox((current) => current ? { ...current, index } : current)} className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border transition md:h-16 md:w-24 ${index === lightbox.index ? 'border-cyan-300 ring-2 ring-cyan-300/30' : 'border-white/10 opacity-60 hover:opacity-100'}`} aria-label={`Zobrazit fotografii ${index + 1}`}>
                    <img src={photo} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}