import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Images, Loader, MapPin, Play, Sparkles, Video, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AutoPlayVideoPreview from '@/components/ui/AutoPlayVideoPreview';
import { getStudioMedia } from '@/lib/studioMedia';

const VIDEO_RE = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;
const DRIVE_FILE_RE = /drive\.google\.com\/file\/d\/([^/?#]+)/i;
const isVideo = (url) => typeof url === 'string' && VIDEO_RE.test(url);
const isDriveVideo = (url) => typeof url === 'string' && DRIVE_FILE_RE.test(url);
const drivePreviewUrl = (url) => {
  const id = typeof url === 'string' ? url.match(DRIVE_FILE_RE)?.[1] : null;
  return id ? `https://drive.google.com/file/d/${id}/preview` : url;
};
const clean = (items) => [...new Map(items.filter((x) => x?.url).map((x) => [x.url, x])).values()];

function matchesProduct(realization, product) {
  const used = (realization.product_used || '').toLocaleLowerCase('cs-CZ');
  const name = (product.name || '').toLocaleLowerCase('cs-CZ');
  const slug = (product.slug || '').toLocaleLowerCase('cs-CZ');
  const tokens = name
    .replace(/mlžítko|mlžné|®|city|garden/gi, '')
    .split(/\s+/)
    .map((x) => x.trim())
    .filter((x) => x.length > 2);
  return Boolean(used && (used.includes(name) || name.includes(used) || used.includes(slug) || tokens.some((t) => used.includes(t))));
}

function MediaCard({ item, onOpen }) {
  const video = item.type === 'video';
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative min-w-[82%] overflow-hidden rounded-[24px] bg-[#EAF5FB] text-left shadow-[0_12px_36px_rgba(10,35,66,.06)] sm:min-w-0"
    >
      <div className="aspect-[4/3] overflow-hidden bg-[#DCECF4]">
        {video ? (
          isDriveVideo(item.url) ? (
            <div className="relative h-full w-full bg-[#061923]">
              {item.poster ? <img src={item.poster} alt={item.title || 'Video produktu'} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" /> : null}
              <div className="absolute inset-0 bg-black/18" />
            </div>
          ) : (
            <AutoPlayVideoPreview
              src={item.url}
              poster={item.poster}
              label={item.title || 'Video produktu'}
              className="h-full w-full"
              videoClassName="transition-transform duration-500 group-hover:scale-[1.025]"
              threshold={0.55}
              showBadge={false}
            />
          )
        ) : (
          <img src={item.url} alt={item.alt || item.title || 'MLŽIDLA'} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" />
        )}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/22 to-transparent" />
        {video && <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-[#0A2342] shadow-lg"><Play size={16} fill="currentColor" /></span>}
        {item.badge && <span className="absolute right-4 top-4 rounded-full border border-white/35 bg-black/28 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-white backdrop-blur-md">{item.badge}</span>}
      </div>
      <div className="p-4 sm:p-5">
        <p className="font-heading text-base font-bold text-[#0A2342] sm:text-lg">{item.title}</p>
        {item.meta && <p className="mt-1.5 flex items-center gap-1.5 text-xs leading-relaxed text-[#0D2F4F]/55"><MapPin size={12} />{item.meta}</p>}
      </div>
    </button>
  );
}

export default function PdMediaGallery({ product }) {
  const [realizations, setRealizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('photos');
  const [lightbox, setLightbox] = useState(null);
  const [featuredVideoIndex, setFeaturedVideoIndex] = useState(0);

  useEffect(() => {
    setFeaturedVideoIndex(0);
  }, [product.id]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    base44.entities.Realizace.filter({ published: true }, '-year', 100)
      .then((items) => {
        if (!cancelled) setRealizations((items || []).filter((r) => matchesProduct(r, product)));
      })
      .catch(() => { if (!cancelled) setRealizations([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [product.id, product.name, product.slug]);

  const groups = useMemo(() => {
    const studioMedia = getStudioMedia(product);
    const productPhotos = clean([
      studioMedia && { type: 'image', url: studioMedia, title: `${product.name} — studiový náhled`, badge: 'Studio' },
      product.image_url && { type: 'image', url: product.image_url, title: `${product.name} — produkt`, badge: 'Produkt' },
      ...(product.gallery_urls || []).filter((u) => u && !isVideo(u)).map((url, i) => ({ type: 'image', url, title: `${product.name} — fotografie ${i + 1}`, badge: 'Produkt' })),
    ]);

    const realizationPhotos = clean(realizations.flatMap((r) => [
      r.image_url && { type: 'image', url: r.image_url, title: r.name || product.name, meta: [r.location, r.year].filter(Boolean).join(' · '), badge: 'Realizace' },
      ...(r.gallery_urls || []).filter((u) => u && !isVideo(u)).map((url, i) => ({ type: 'image', url, title: `${r.name || 'Realizace'} — ${i + 1}`, meta: [r.location, r.year].filter(Boolean).join(' · '), badge: 'Realizace' })),
    ]));

    const visualizations = clean(realizations.flatMap((r) => [
      r.concept_image_url && { type: 'image', url: r.concept_image_url, title: `${r.name || product.name} — vizualizace`, meta: r.location, badge: 'Vizualizace' },
      r.project_sheet_url && { type: 'image', url: r.project_sheet_url, title: `${r.name || product.name} — projektový návrh`, meta: r.location, badge: 'Návrh' },
    ]));

    const videos = clean([
      product.video_url && { type: 'video', url: product.video_url, poster: product.image_url, title: `${product.name} v akci`, badge: 'Video' },
      ...(product.gallery_urls || []).filter(isVideo).map((url, i) => ({ type: 'video', url, poster: product.image_url, title: `${product.name} — video ${i + 1}`, badge: 'Video' })),
      ...realizations.filter((r) => r.video_url).map((r) => ({ type: 'video', url: r.video_url, poster: r.image_url, title: `${r.name || product.name} — video`, meta: r.location, badge: 'Realizace' })),
    ]);

    return {
      photos: productPhotos,
      realizations: realizationPhotos,
      visualizations,
      videos,
    };
  }, [product, realizations]);

  const tabs = [
    { id: 'photos', label: 'Fotografie produktu', icon: Images, count: groups.photos.length },
    { id: 'realizations', label: 'Reálné realizace', icon: MapPin, count: groups.realizations.length },
    { id: 'visualizations', label: 'Vizualizace', icon: Sparkles, count: groups.visualizations.length },
    { id: 'videos', label: 'Videa', icon: Video, count: groups.videos.length },
  ];

  useEffect(() => {
    if (groups[activeTab]?.length) return;
    const first = tabs.find((t) => t.count > 0);
    if (first) setActiveTab(first.id);
  }, [groups, activeTab]);

  const items = groups[activeTab] || [];
  const allEmpty = tabs.every((t) => t.count === 0);
  const featuredVideo = groups.videos[featuredVideoIndex] || groups.videos[0];

  if (loading) return <section className="bg-[#F7FBFD] py-16"><div className="mx-auto flex max-w-7xl justify-center px-6"><Loader className="animate-spin text-[#0B5EA8]/40" /></div></section>;
  if (allEmpty) return null;

  return (
    <section id="media" className="overflow-hidden bg-[#F7FBFD] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-[#0B97E8] sm:text-[11px]">Produkt v detailu</p>
            <h2 className="mt-3 max-w-3xl font-heading text-3xl font-bold leading-[1.04] tracking-[-.035em] text-[#0A2342] sm:text-4xl lg:text-5xl">Fotografie, realizace, vizualizace a videa.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#0D2F4F]/60 sm:text-base">Prohlédněte si {product.name} z více úhlů — od produktu přes skutečné instalace až po návrhy pro konkrétní prostor.</p>
          </div>
          <p className="max-w-md text-xs leading-6 text-[#0D2F4F]/45 lg:text-right">U reálných realizací zobrazujeme pouze média přiřazená ke konkrétnímu produktu. Vizualizace jsou označené samostatně.</p>
        </div>

        {featuredVideo && (
          <div className="mt-9 overflow-hidden rounded-[28px] border border-[#D8E8F0] bg-white shadow-[0_22px_70px_rgba(10,35,66,.10)]">
            <div className="grid lg:grid-cols-[1.45fr_.55fr]">
              <div className="relative aspect-video min-h-0 bg-[#061923] lg:aspect-auto lg:min-h-[420px]">
                {isDriveVideo(featuredVideo.url) ? (
                  <iframe
                    key={featuredVideo.url}
                    src={drivePreviewUrl(featuredVideo.url)}
                    title={featuredVideo.title || `${product.name} – video`}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0 bg-black"
                  />
                ) : (
                  <AutoPlayVideoPreview
                    key={featuredVideo.url}
                    src={featuredVideo.url}
                    poster={featuredVideo.poster}
                    controls
                    loop
                    label={featuredVideo.title || `${product.name} – video`}
                    className="absolute inset-0 h-full w-full"
                    videoClassName="object-cover"
                    threshold={0.4}
                    showBadge={false}
                  />
                )}
                <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/20 bg-black/42 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-white backdrop-blur-md">{isDriveVideo(featuredVideo.url) ? 'TV reportáž · přehrát' : 'Video produktu · autoplay bez zvuku'}</div>
              </div>

              <div className="flex flex-col p-5 sm:p-6 lg:p-7">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-[#0B97E8]">V provozu</p>
                <h3 className="mt-2 font-heading text-2xl font-bold leading-tight text-[#0A2342]">{featuredVideo.title}</h3>
                {featuredVideo.meta && <p className="mt-2 flex items-center gap-1.5 text-xs text-[#0D2F4F]/55"><MapPin size={13}/>{featuredVideo.meta}</p>}
                <p className="mt-4 text-sm leading-6 text-[#0D2F4F]/58">{isDriveVideo(featuredVideo.url) ? 'Pusťte si reportáž přímo v detailu produktu. Video je vložené z ověřeného zdroje na Google Drive.' : 'Video se spustí automaticky ve chvíli, kdy se dostane do zorného pole. Při odscrollování se pozastaví, takže stránka zůstává rychlá a neruší zvukem.'}</p>

                {groups.videos.length > 1 && (
                  <div className="mt-6 space-y-2">
                    <p className="font-mono text-[9px] font-semibold uppercase tracking-[.14em] text-[#0D2F4F]/38">Další videa</p>
                    {groups.videos.slice(0, 5).map((videoItem, index) => (
                      <button
                        key={videoItem.url}
                        type="button"
                        onClick={() => setFeaturedVideoIndex(index)}
                        className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${featuredVideoIndex === index ? 'border-[#0BA4F5]/45 bg-[#EAF7FD]' : 'border-[#DDE9EF] bg-white hover:border-[#0BA4F5]/25 hover:bg-[#F7FBFD]'}`}
                      >
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${featuredVideoIndex === index ? 'bg-[#0BA4F5] text-white' : 'bg-[#EAF5FB] text-[#0B5EA8]'}`}><Play size={12} fill="currentColor"/></span>
                        <span className="min-w-0"><span className="block truncate text-xs font-semibold text-[#0A2342]">{videoItem.title}</span>{videoItem.meta && <span className="mt-0.5 block truncate text-[10px] text-[#0D2F4F]/40">{videoItem.meta}</span>}</span>
                      </button>
                    ))}
                  </div>
                )}

                <button type="button" onClick={() => setLightbox({ items: groups.videos, index: featuredVideoIndex })} className="mt-auto pt-6 text-left text-xs font-bold text-[#0B5EA8] hover:text-[#073A67]">Otevřít video přes celou obrazovku →</button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              type="button"
              disabled={!count}
              onClick={() => setActiveTab(id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold transition sm:text-sm ${activeTab === id ? 'border-[#0BA4F5] bg-[#0BA4F5] text-white shadow-[0_10px_24px_rgba(11,164,245,.20)]' : count ? 'border-[#D8E8F0] bg-white text-[#0D2F4F] hover:border-[#0BA4F5]/40' : 'cursor-not-allowed border-[#E6EEF2] bg-[#F1F5F7] text-[#0D2F4F]/30'}`}
            >
              <Icon size={15} />{label}<span className={`rounded-full px-1.5 py-0.5 text-[10px] ${activeTab === id ? 'bg-white/20' : 'bg-[#EAF5FB]'}`}>{count}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: .28 }}
            className="mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3 xl:grid-cols-4 [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item, index) => (
              <div key={item.url} className="snap-start sm:block">
                <MediaCard item={item} onOpen={() => setLightbox({ items, index })} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {lightbox && <GalleryLightbox items={lightbox.items} initial={lightbox.index} productName={product.name} onClose={() => setLightbox(null)} />}
    </section>
  );
}

function GalleryLightbox({ items, initial, productName, onClose }) {
  const [index, setIndex] = useState(initial);
  const item = items[index];
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', onKey); };
  }, [items.length, onClose]);

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-[#04141f]/95 p-3 backdrop-blur-xl sm:p-6" onClick={onClose}>
      <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/18" aria-label="Zavřít"><X size={22}/></button>
      <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          {item.type === 'video' ? (
            isDriveVideo(item.url) ? (
              <motion.div key={item.url} className="mx-auto aspect-video max-h-[80vh] w-full overflow-hidden rounded-2xl bg-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <iframe src={drivePreviewUrl(item.url)} title={item.title || productName} allow="autoplay; fullscreen" allowFullScreen className="h-full w-full border-0" />
              </motion.div>
            ) : (
              <motion.video key={item.url} src={item.url} poster={item.poster} controls autoPlay playsInline className="mx-auto max-h-[80vh] w-full rounded-2xl bg-black object-contain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            )
          ) : (
            <motion.img key={item.url} src={item.url} alt={item.alt || item.title || productName} className="mx-auto max-h-[80vh] w-full rounded-2xl object-contain" initial={{ opacity: 0, scale: .985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .985 }} />
          )}
        </AnimatePresence>
        <div className="mt-4 flex items-center justify-between gap-4 px-1 text-white">
          <div><p className="font-heading text-sm font-bold sm:text-base">{item.title}</p>{item.meta && <p className="mt-1 text-xs text-white/50">{item.meta}</p>}</div>
          <p className="font-mono text-[10px] text-white/45">{index + 1} / {items.length}</p>
        </div>
        {items.length > 1 && <>
          <button type="button" onClick={prev} aria-label="Předchozí" className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0A2342] shadow-xl sm:left-4"><ChevronLeft size={22}/></button>
          <button type="button" onClick={next} aria-label="Další" className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0A2342] shadow-xl sm:right-4"><ChevronRight size={22}/></button>
        </>}
      </div>
    </div>
  );
}
