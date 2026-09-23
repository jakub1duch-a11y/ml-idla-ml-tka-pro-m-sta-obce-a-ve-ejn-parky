import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Images, Loader, MapPin, Play, Sparkles, Video, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AutoPlayVideoPreview from '@/components/ui/AutoPlayVideoPreview';
import { getStudioMedia } from '@/lib/studioMedia';
import { getCuratedProductMedia } from '@/lib/curatedProductMedia';
import { getOptimizedMediaUrl } from '@/lib/optimizedMedia';

const VIDEO_RE = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;
const LINEA_HERO_VIDEO = '/media/products/linea/linea-urban-cooling-hero.mp4';
const isLineaProduct = (product) => product?.slug === 'linea-mlzitko';
const DRIVE_FILE_RE = /drive\.google\.com\/file\/d\/([^/?#]+)/i;
const TECHNICAL_MEDIA_RE = /(1000008748|technick|schema|schéma|edraw|vykres|výkres|montaz|montáž|instalac)/i;
const GARDEN_TEST_RE = /(1000008852|1000008768)/i;
const FLOWER_SCULPTURE_RE = /(1000008416|1000008415)/i;
const EDITORIAL_ONLY_RE = /(1000008842|1000008248)/i;
const isVideo = (url) => typeof url === 'string' && VIDEO_RE.test(url);
const isDriveVideo = (url) => typeof url === 'string' && DRIVE_FILE_RE.test(url);
const drivePreviewUrl = (url) => {
  const id = typeof url === 'string' ? url.match(DRIVE_FILE_RE)?.[1] : null;
  return id ? `https://drive.google.com/file/d/${id}/preview` : url;
};
const clean = (items) => [...new Map(items.filter((x) => x?.url).map((x) => [x.url, x])).values()];
const mediaUrl = (url) => (url && !isVideo(url) ? getOptimizedMediaUrl(url) : url);
const mediaCaption = (item) => item.caption || (
  item.badge === 'Studio' ? 'Studiový náhled produktu' :
  item.badge === 'Schváleno' ? 'Schválená vizualizace umístění' :
  item.badge === 'Vizualizace' || item.badge === 'Návrh' ? 'Vizualizace umístění' :
  item.badge === 'Realizace' ? 'Fotografie z realizace' :
  item.badge === 'Video' || item.badge === 'Hero video' ? 'Video ukázka' :
  item.badge === 'Reálné testování' ? 'Reálné testování v zahradě' :
  'Produktová fotografie'
);
const isTechnicalMedia = (url) => typeof url === 'string' && TECHNICAL_MEDIA_RE.test(url);
const isGardenTest = (url) => typeof url === 'string' && GARDEN_TEST_RE.test(url);
const isFlowerSculptureProduct = (product) => /květ|kvet|socha|art/i.test(`${product.name || ''} ${product.slug || ''}`);
const isAllowedProductMedia = (url, product) => {
  if (typeof url !== 'string' || EDITORIAL_ONLY_RE.test(url) || isTechnicalMedia(url)) return false;
  if (FLOWER_SCULPTURE_RE.test(url) && !isFlowerSculptureProduct(product)) return false;
  return true;
};

function matchesProduct(realization, product) {
  const used = (realization.product_used || '').toLocaleLowerCase('cs-CZ');
  const name = (product.name || '').toLocaleLowerCase('cs-CZ');
  const slug = (product.slug || '').toLocaleLowerCase('cs-CZ');
  if (isLineaProduct(product)) {
    return used === 'linea' || used === 'linea®' || used === 'mlžítko linea' || used === slug;
  }
  const tokens = name
    .replace(/mlžítko|mlžné|®|city|garden/gi, '')
    .split(/\s+/)
    .map((x) => x.trim())
    .filter((x) => x.length > 2);
  return Boolean(used && (used.includes(name) || name.includes(used) || used.includes(slug) || tokens.some((t) => used.includes(t))));
}

function MediaCard({ item, onOpen, productName }) {
  const video = item.type === 'video';
  return (
    <button
      type="button"
      onClick={onOpen}
      className="product-motion-card group relative min-w-[82%] overflow-hidden rounded-[24px] border border-[#D8E8F0] bg-white/80 text-left shadow-[0_12px_36px_rgba(10,35,66,.06)] backdrop-blur-xl sm:min-w-0"
    >
      <div className="aspect-[4/3] overflow-hidden bg-[#DCECF4]">
        {video ? (
          isDriveVideo(item.url) ? (
            <div className="relative h-full w-full bg-[#061923]">
              {item.poster ? <img src={mediaUrl(item.poster)} alt={`${productName} — video ukázka`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" /> : null}
              <div className="absolute inset-0 bg-black/18" />
            </div>
          ) : (
            <AutoPlayVideoPreview
              src={item.url}
              poster={item.poster}
              label={`${productName} — video ukázka`}
              className="h-full w-full"
              videoClassName="transition-transform duration-500 group-hover:scale-[1.025]"
              threshold={0.55}
              showBadge={false}
            />
          )
        ) : (
          <img src={mediaUrl(item.url)} alt={item.alt || `${productName} — ${mediaCaption(item).toLocaleLowerCase('cs-CZ')}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,20,31,.34)_0%,rgba(4,20,31,0)_42%,rgba(10,35,66,.48)_100%)] transition-opacity duration-500 group-hover:opacity-80" />
        {video && <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-[#0A2342] shadow-lg"><Play size={16} fill="currentColor" /></span>}
        {item.badge && <span className="absolute right-4 top-4 rounded-full border border-white/35 bg-black/28 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-white backdrop-blur-md">{item.badge}</span>}
      </div>
      <div className="p-4 sm:p-5">
        <p className="font-heading text-base font-bold text-[#0A2342] sm:text-lg">{mediaCaption(item)}</p>
        {item.meta && <p className="mt-1.5 flex items-center gap-1.5 text-xs leading-relaxed text-[#0D2F4F]/55"><MapPin size={12} />{item.meta}</p>}
      </div>
    </button>
  );
}

export default function PdMediaGallery({ product }) {
  const [realizations, setRealizations] = useState([]);
  const [approvedVisualizations, setApprovedVisualizations] = useState([]);
  const [adminMedia, setAdminMedia] = useState([]);
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
    Promise.all([
      base44.entities.Realizace.filter({ published: true }, '-year', 100).catch(() => []),
      base44.entities.VisualizationAsset.filter({ product_slug: product.slug, approval_status: 'approved', approved_for_presentation: true }, '-updated_date', 100).catch(() => []),
      base44.entities.MediaFile.filter({ product_slug: product.slug }, '-sort_order', 160).catch(() => []),
    ])
      .then(([realizationItems, visualItems, mediaItems]) => {
        if (cancelled) return;
        setRealizations((realizationItems || []).filter((r) => matchesProduct(r, product)));
        setApprovedVisualizations((visualItems || []).filter((item) => item?.image_url));
        setAdminMedia((mediaItems || []).filter((item) => item?.file_url));
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [product.id, product.name, product.slug]);

  const groups = useMemo(() => {
    const studioMedia = getStudioMedia(product);
    const curated = getCuratedProductMedia(product);
    const curatedUrls = new Set(curated.map(item => item.url));
    const adminProductPhotos = adminMedia
      .filter((item) => ['hero', 'gallery', 'detail', 'reference', 'technology'].includes(item.media_role))
      .filter((item) => !isVideo(item.file_url))
      .map((item) => ({ type: 'image', url: mediaUrl(item.file_url), alt: `${product.name} — ${item.file_name || 'produktová fotografie'}`, caption: item.file_name || 'Produktová fotografie', title: item.file_name || 'Produktová fotografie', badge: item.media_role === 'reference' ? 'Reference' : 'Média' }));

    const productPhotos = clean([
      ...adminProductPhotos,
      ...curated.filter(item => item.kind === 'photo').map(item => ({ type: 'image', url: mediaUrl(item.url), alt: item.alt || `${product.name} — produktová fotografie`, caption: item.caption || 'Produktová fotografie', title: 'Produktová fotografie', badge: 'Fotografie' })),
      studioMedia && { type: 'image', url: mediaUrl(studioMedia), alt: `${product.name} — studiový náhled produktu`, caption: 'Studiový náhled produktu', title: 'Studiový náhled produktu', badge: 'Studio' },
      product.image_url && { type: 'image', url: mediaUrl(product.image_url), alt: isGardenTest(product.image_url) ? `${product.name} — reálné testování v zahradě` : `${product.name} — produktový náhled`, caption: isGardenTest(product.image_url) ? 'Reálné testování v zahradě' : 'Produktový náhled', title: isGardenTest(product.image_url) ? 'Reálné testování v zahradě' : 'Produktový náhled', badge: isGardenTest(product.image_url) ? 'Reálné testování' : 'Produkt' },
      ...(product.gallery_urls || [])
        .filter((url) => url && !curatedUrls.has(url) && !isVideo(url) && isAllowedProductMedia(url, product))
        .map((url) => ({
          type: 'image',
          url: mediaUrl(url),
          alt: isGardenTest(url) ? `${product.name} — reálné testování v zahradě` : `${product.name} — produktová fotografie`,
          caption: isGardenTest(url) ? 'Reálné testování v zahradě' : 'Produktová fotografie',
          title: isGardenTest(url) ? 'Reálné testování v zahradě' : 'Produktová fotografie',
          badge: isGardenTest(url) ? 'Reálné testování' : 'Produkt',
        })),
    ]);

    const adminRealizationPhotos = adminMedia
      .filter((item) => item.media_role === 'realization' && !isVideo(item.file_url))
      .map((item) => ({ type: 'image', url: mediaUrl(item.file_url), alt: `${product.name} — ${item.file_name || 'fotografie z realizace'}`, caption: item.file_name || 'Fotografie z realizace', title: item.file_name || 'Fotografie z realizace', badge: 'Realizace' }));

    const realizationPhotos = clean([...adminRealizationPhotos, ...realizations.flatMap((r) => [
      r.image_url && { type: 'image', url: mediaUrl(r.image_url), alt: `${product.name} — fotografie z realizace`, caption: 'Fotografie z realizace', title: 'Fotografie z realizace', meta: [r.location, r.year].filter(Boolean).join(' · '), badge: 'Realizace' },
      ...(r.gallery_urls || []).filter((u) => u && !isVideo(u)).map((url) => ({ type: 'image', url: mediaUrl(url), alt: `${product.name} — fotografie z realizace`, caption: 'Fotografie z realizace', title: 'Fotografie z realizace', meta: [r.location, r.year].filter(Boolean).join(' · '), badge: 'Realizace' })),
    ])]);

    const approvedAdminVisuals = [...approvedVisualizations]
      .sort((a, b) => Number(Boolean(b.is_primary_for_variant)) - Number(Boolean(a.is_primary_for_variant)))
      .map((item) => ({
        type: 'image',
        url: mediaUrl(item.thumbnail_url || item.image_url),
        alt: `${product.name} — schválená vizualizace ${item.configuration || 'umístění'}`,
        caption: item.is_primary_for_variant ? 'Schválená hlavní vizualizace' : 'Schválená vizualizace umístění',
        title: item.title || 'Schválená vizualizace',
        meta: [item.environment, item.configuration, item.quantity ? `${item.quantity} ks` : ''].filter(Boolean).join(' · '),
        badge: 'Schváleno',
      }));

    const visualizations = clean([...approvedAdminVisuals, ...curated.filter(item => item.kind === 'visualization').map(item => ({ type: 'image', url: mediaUrl(item.url), alt: item.alt || `${product.name} — vizualizace umístění`, caption: 'Vizualizace umístění', title: 'Vizualizace umístění', badge: 'Vizualizace' })), ...realizations.flatMap((r) => [
      r.concept_image_url && { type: 'image', url: mediaUrl(r.concept_image_url), alt: `${product.name} — vizualizace umístění`, caption: 'Vizualizace umístění', title: 'Vizualizace umístění', meta: r.location, badge: 'Vizualizace' },
      r.project_sheet_url && { type: 'image', url: mediaUrl(r.project_sheet_url), alt: `${product.name} — návrh umístění`, caption: 'Vizualizace umístění', title: 'Vizualizace umístění', meta: r.location, badge: 'Návrh' },
    ])]);

    const resolvedProductVideo = product.video_url || (isLineaProduct(product) ? LINEA_HERO_VIDEO : '');
    const adminVideos = adminMedia
      .filter((item) => item.media_role === 'video' || isVideo(item.file_url))
      .map((item) => ({ type: 'video', url: item.file_url, poster: mediaUrl(product.image_url), alt: `${product.name} — ${item.file_name || 'video'}`, caption: item.file_name || 'Video ukázka', title: item.file_name || 'Video ukázka', badge: 'Video' }));
    const videos = clean([
      ...adminVideos,
      resolvedProductVideo && { type: 'video', url: resolvedProductVideo, poster: mediaUrl(product.image_url), alt: `${product.name} — video ukázka`, caption: 'Video ukázka', title: 'Video ukázka', badge: 'Hero video' },
      ...(product.gallery_urls || []).filter(isVideo).map((url) => ({ type: 'video', url, poster: mediaUrl(product.image_url), alt: `${product.name} — video ukázka`, caption: 'Video ukázka', title: 'Video ukázka', badge: 'Video' })),
      ...realizations.filter((r) => r.video_url).map((r) => ({ type: 'video', url: r.video_url, poster: mediaUrl(r.image_url), alt: `${product.name} — video z realizace`, caption: 'Video z realizace', title: 'Video z realizace', meta: r.location, badge: 'Realizace' })),
    ]);

    return {
      photos: productPhotos,
      realizations: realizationPhotos,
      visualizations,
      videos,
    };
  }, [product, realizations, approvedVisualizations, adminMedia]);

  const hasGardenTest = groups.photos.some((item) => item.badge === 'Reálné testování');
  const tabs = [
    { id: 'photos', label: hasGardenTest ? 'Reálné testování v zahradě' : 'Fotografie a produktové náhledy', icon: Images, count: groups.photos.length },
    { id: 'realizations', label: 'Reálné realizace', icon: MapPin, count: groups.realizations.length },
    { id: 'visualizations', label: 'Vizualizace umístění', icon: Sparkles, count: groups.visualizations.length },
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
            <h2 className="mt-3 max-w-3xl font-heading text-3xl font-bold leading-[1.04] tracking-[-.035em] text-[#0A2342] sm:text-4xl lg:text-5xl">Vhodné pro zahrady, parky i veřejný prostor</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#0D2F4F]/60 sm:text-base">Prohlédněte si {product.name} z více úhlů — reálné fotografie a realizace držíme odděleně od návrhových vizualizací.</p>
          </div>
          <p className="max-w-md text-xs leading-6 text-[#0D2F4F]/45 lg:text-right">Technická schémata patří do sekce „Příprava a instalace“. Vizualizace umístění jsou vždy označené samostatně.</p>
        </div>

        {featuredVideo && (
          <div className="product-motion-card mt-9 overflow-hidden rounded-[28px] border border-[#D8E8F0] bg-white/90 shadow-[0_22px_70px_rgba(10,35,66,.10)] backdrop-blur-xl">
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
                <MediaCard item={item} productName={product.name} onOpen={() => setLightbox({ items, index })} />
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
            <motion.img key={item.url} src={mediaUrl(item.url)} alt={item.alt || `${productName} — ${mediaCaption(item).toLocaleLowerCase('cs-CZ')}`} className="mx-auto max-h-[80vh] w-full rounded-2xl object-contain" initial={{ opacity: 0, scale: .985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .985 }} />
          )}
        </AnimatePresence>
        <div className="mt-4 flex items-center justify-between gap-4 px-1 text-white">
          <div><p className="font-heading text-sm font-bold sm:text-base">{mediaCaption(item)}</p>{item.meta && <p className="mt-1 text-xs text-white/50">{item.meta}</p>}</div>
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
