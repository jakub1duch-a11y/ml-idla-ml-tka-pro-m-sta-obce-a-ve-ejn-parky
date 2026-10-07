import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
const MEDIA = [
  {
    "title": "BENDY ve městě",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/eb80e8486_IMG_1789934399993.jpg",
    "tag": "Náměstí a města",
    "badge": "Náhled použití",
    "href": "/produkt/mlzitko-bendy",
    "text": "Organická linie BENDY® doplňuje náměstí a pěší trasy. Prohlédněte si umístění mlžítka v městském prostoru."
  },
  {
    "title": "BENDY a sloupová LINEA",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/e7593e68f_realizace-IMG_5072.jpg",
    "tag": "Gastro a zahrady",
    "badge": "Fotografie",
    "href": "/produkt/linea-mlzitko",
    "text": "Dva odlišné tvary pro pobytovou zónu: BENDY® s obloukovou linií a LINEA® v čistém sloupkovém provedení."
  },
  {
    "title": "KVĚT na náměstí",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/25683a407_file_0000000091fc8210b6b21eb1cdf55ece1.png",
    "tag": "Náměstí a města",
    "badge": "Vizualizace",
    "href": "/produkt/mlzitko-kvet-4",
    "text": "KVĚT 4 jako výrazný bod letního osvěžení. Vizualizace ukazuje vztah mlžítka k otevřené ploše náměstí."
  },
  {
    "title": "TEEPEE v prostoru",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/06c42b5dc_Screenshot_20260920_171920.jpg",
    "tag": "Náměstí a města",
    "badge": "Vizualizace",
    "href": "/produkt/teepee",
    "text": "Prostorový tvar TEEPEE přitahuje pozornost v parku i na náměstí. Podívejte se na návrh jeho umístění."
  },
  {
    "title": "Osvěžení na sportovišti",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/48b54bbc2_1789940598791.png",
    "tag": "Sportoviště",
    "badge": "Vizualizace",
    "href": "/kategorie/parky-hriste",
    "text": "Mlžná zóna podél sportovní trasy nebo u místa odpočinku. Výběr prvků a rozmístění navrhneme podle areálu."
  },
  {
    "title": "MRAK ve školní zahradě",
    "url": "/media/optimized/db-4098079e74-84805a215_mlnprvek-mrak-mlzidla02.webp",
    "tag": "Školy a školky",
    "badge": "Produktová vizualizace",
    "href": "/produkt/mlzitko-mrak",
    "text": "Hravý tvar MRAK pro školní zahrady a dětské pobytové zóny. Rozměry a režim mlžení se volí podle místa."
  },
  {
    "title": "AURA pro hotelovou terasu",
    "url": "/media/optimized/3bd7f70e9_MlitkoAURA-zahradnimlzidlo.webp",
    "tag": "Hotely a wellness",
    "badge": "Produktová vizualizace",
    "href": "/produkt/aura-mlzitko",
    "text": "Kruhová AURA® jako nenápadný prvek osvěžení u hotelové terasy. Prohlédněte si produktový náhled."
  },
  {
    "title": "Zahrádka restaurace a terasa",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/e7593e68f_realizace-IMG_5072.jpg",
    "tag": "Gastro a zahrady",
    "badge": "Fotografie",
    "href": "/rezidencni-mlzeni",
    "text": "Mlžení začleněné do venkovního posezení. Návrh přizpůsobíme stolům, průchodům a charakteru terasy."
  },
  {
    "title": "Městské náměstí a obchodní zóna",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/25683a407_file_0000000091fc8210b6b21eb1cdf55ece1.png",
    "tag": "Náměstí a města",
    "badge": "Vizualizace",
    "href": "/mlzitka-pro-mesta-obce",
    "text": "KVĚT 4 ve vizualizaci veřejné plochy. Inspirace pro osvěžující bod na náměstí nebo pěší zóně."
  },
  {
    "title": "Nádraží a dopravní uzly",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/eb80e8486_IMG_1789934399993.jpg",
    "tag": "Nádraží a uzly",
    "badge": "Náhled použití",
    "href": "/mlzitka-pro-mesta-obce",
    "text": "Inspirace pro umístění BENDY® u frekventovaných tras. Konkrétní řešení vychází z pohybu lidí a možností místa."
  },
  {
    "title": "Z výroby mlžítka MRAK",
    "url": "https://drive.google.com/thumbnail?id=1cAuotLpUftsG_fNk3ii_RKWZ83EyWdK6&sz=w1600",
    "tag": "Produkty",
    "badge": "Výroba",
    "href": "/produkt/mlzitko-mrak",
    "text": "Detail výroby mlžítka MRAK. Prohlédněte si nerezové provedení a pokračujte k přehledu produktu."
  },
  {
    "title": "BENDY v provozu",
    "url": "https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/78cf9a6c8_KolekceBendy_20260812_121335_0000.mp4",
    "poster": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/e7593e68f_realizace-IMG_5072.jpg",
    "tag": "Videa",
    "badge": "Video",
    "href": "/produkt/mlzitko-bendy",
    "text": "Video mlžítka BENDY® v provozu. Podívejte se na rozptyl vodní mlhy a zasazení prvku do prostoru."
  },
  {
    "title": "LINEA v provozu",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/c37b035c2_mlzidla-linea-real-video-01.mp4",
    "poster": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/e7593e68f_realizace-IMG_5072.jpg",
    "tag": "Videa",
    "badge": "Video",
    "href": "/produkt/linea-mlzitko",
    "text": "Sloupková LINEA® při mlžení. Krátké video ukazuje čistou siluetu a použití v pobytové zóně."
  }
];

const FILTERS = ['Vše', 'Náměstí a města', 'Sportoviště', 'Školy a školky', 'Gastro a zahrady', 'Hotely a wellness', 'Nádraží a uzly', 'Produkty', 'Videa'];
const ENVIRONMENT_TAG = {
  namesti: 'Náměstí a města',
  mestsky_park: 'Náměstí a města',
  maly_mestsky_park: 'Náměstí a města',
  promenada: 'Náměstí a města',
  sportoviste: 'Sportoviště',
  hriste: 'Sportoviště',
  koupaliste: 'Sportoviště',
  skola_skolka: 'Školy a školky',
  rezidencni_zahrada: 'Gastro a zahrady',
  gastro_terasa: 'Gastro a zahrady',
  hotel_wellness: 'Hotely a wellness',
  event: 'Náměstí a města',
  custom: 'Produkty'
};
const isImageFile = (file) => String(file?.file_type || '').startsWith('image/') || /\.(png|jpe?g|webp|avif)(\?|#|$)/i.test(file?.file_url || '');

const SPACE_LABELS = {
  namesti: 'náměstí',
  mestsky_park: 'městský park',
  maly_mestsky_park: 'městský park',
  promenada: 'promenáda',
  sportoviste: 'sportoviště',
  hriste: 'hřiště',
  koupaliste: 'koupaliště',
  skola_skolka: 'školní zahrada',
  rezidencni_zahrada: 'rezidenční zahrada',
  gastro_terasa: 'gastro terasa',
  hotel_wellness: 'hotelová terasa',
  event: 'eventový prostor',
  custom: 'konkrétní prostor',
};
const PRODUCT_NAMES_BY_SLUG = {
  'mlzitko-bendy': 'BENDY®',
  'linea-mlzitko': 'LINEA®',
  'mlzitko-kvet-4': 'KVĚT 4',
  teepee: 'TEEPEE',
  'mlzitko-mrak': 'MRAK',
  'aura-mlzitko': 'AURA®',
};

const readableSpace = (item, fallback = 'konkrétní prostor') => {
  const raw = item?.environment_label || item?.space_name || item?.location || item?.environment;
  if (!raw) return fallback;
  return SPACE_LABELS[raw] || String(raw).replace(/[_-]+/g, ' ').trim();
};

const visualTitle = (item, fallbackProduct = 'Mlžítko MLŽIDLA') => {
  const product = item?.product_name || item?.product_title || item?.product || PRODUCT_NAMES_BY_SLUG[item?.product_slug] || fallbackProduct;
  return `${product} · ${readableSpace(item)}`;
};

export default function ProductPhotoGallery() {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState('Vše');
  const [approvedVisuals, setApprovedVisuals] = useState([]);
  const [adminMedia, setAdminMedia] = useState([]);
  const [activeSwiper, setActiveSwiper] = useState(null);
  const [sliderState, setSliderState] = useState({ isBeginning: true, isEnd: false, index: 0 });
  const syncSwiper = (swiper) => setSliderState({ isBeginning: swiper.isBeginning, isEnd: swiper.isEnd, index: swiper.activeIndex });

  useEffect(() => {
    let active = true;
    Promise.all([
    base44.entities.VisualizationAsset.filter({ approval_status: 'approved', approved_for_presentation: true }, '-updated_date', 80).catch(() => []),
    base44.entities.MediaFile.list('-created_date', 240).catch(() => [])]
    ).then(([visuals, files]) => {
      if (!active) return;
      setApprovedVisuals((visuals || []).filter((item) => item?.image_url));
      setAdminMedia((files || []).filter((item) => item?.file_url));
    });
    return () => {active = false;};
  }, []);

  const allItems = useMemo(() => {
    const visuals = approvedVisuals.map((item) => ({
      title: visualTitle(item),
      url: item.thumbnail_url || item.image_url,
      tag: ENVIRONMENT_TAG[item.environment] || 'Produkty',
      badge: 'Náhled v prostoru',
      href: item.product_slug ? `/produkt/${item.product_slug}` : '/mlzidla-mlzitka',
      text: item.scene_description || `Náhled použití ${item.product_name || 'mlžítka'} v prostoru: ${readableSpace(item)}.`,
      approved: true,
      primary: Boolean(item.is_primary_for_variant),
      updated: item.updated_date || ''
    }));

    const media = adminMedia.
    filter(isImageFile).
    filter((item) => ['homepage_visual', 'hero', 'gallery', 'reference', 'realization'].includes(item.media_role)).
    map((item) => ({
      title: `${item.product_name || item.product_title || PRODUCT_NAMES_BY_SLUG[item.product_slug] || 'Mlžítko MLŽIDLA'} · ${item.space_name || item.media_group || 'konkrétní prostor'}`,
      url: item.file_url,
      tag: 'Produkty',
      badge: item.media_role === 'realization' || item.media_role === 'reference' ? 'Náhled v prostoru' : 'Produktový náhled',
      href: item.product_slug ? `/produkt/${item.product_slug}` : '/mlzidla-mlzitka',
      text: `Náhled mlžítka v prostoru: ${item.space_name || item.media_group || 'konkrétní prostor'}.`
    }));

    const combined = [...visuals.sort((a, b) => Number(b.primary) - Number(a.primary)), ...media, ...MEDIA];
    return [...new Map(combined.filter((item) => item?.url).map((item) => [item.url, item])).values()].slice(0, 30);
  }, [approvedVisuals, adminMedia]);

  const items = allItems.filter((item) => filter === 'Vše' || item.tag === filter);
  return <section id="home-product-gallery" className="relative overflow-hidden bg-[#071a2b] py-20 text-white sm:py-24 lg:py-28" aria-labelledby="media-gallery-title">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,.11),transparent_30%),radial-gradient(circle_at_88%_82%,rgba(14,116,144,.12),transparent_32%)]" />
    <div className="relative mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan-300">Inspirace a produkty</p>
        <h2 id="media-gallery-title" className="mt-3 max-w-3xl font-heading text-3xl font-semibold tracking-[-.04em] sm:text-5xl">Mlžítka v prostoru. Inspirace pro vaše místo.</h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">Od městského náměstí po zahradní terasu. Prohlédněte si fotografie, vizualizace a videa mlžítek, vyberte prostředí a objevte řešení pro své místo.</p>
      </div>

      <div className="my-9 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Filtrovat média">
        {FILTERS.map((label) => <button type="button" key={label} aria-pressed={filter === label} onClick={() => setFilter(label)} className={`min-h-11 shrink-0 snap-start rounded-full px-5 text-sm font-semibold transition-all duration-300 ${filter === label ? ' bg-cyan-300 text-slate-950 shadow-[0_10px_30px_rgba(34,211,238,.18)]' : ' bg-white/[.07] text-white/85 hover:-translate-y-0.5  hover:bg-white/[.13]'}`}>{label}</button>)}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: reduced ? 0 : .28, ease: [0.22, 1, 0.36, 1] }}
          className="relative">
          
          <Swiper
            modules={[A11y, Keyboard, Mousewheel, Navigation, Pagination]}
            slidesPerView={1.06}
            spaceBetween={16}
            onSwiper={(swiper) => { setActiveSwiper(swiper); syncSwiper(swiper); }}
            onSlideChange={syncSwiper}
            onResize={syncSwiper}
            pagination={{ clickable: true, dynamicBullets: true }}
            speed={reduced ? 0 : 550}
            keyboard={{ enabled: true }}
            mousewheel={{ forceToAxis: true }}
            grabCursor
            watchOverflow
            breakpoints={{
              640: { slidesPerView: 1.65, spaceBetween: 18 },
              900: { slidesPerView: 2.25, spaceBetween: 20 },
              1180: { slidesPerView: 3, spaceBetween: 20 }
            }}
            className="mlzidla-product-swiper !overflow-visible !pb-14"
            aria-label={`Galerie MLŽIDLA — ${filter}`}>
            
          {items.map((item, index) => <SwiperSlide key={`${item.url}-${index}`} className="!h-auto">
          <motion.article
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: .18 }}
                whileHover={reduced ? undefined : { y: -5 }}
                transition={{ duration: reduced ? 0 : .42, delay: Math.min(index, 5) * .035, ease: [0.22, 1, 0.36, 1] }}
                className="inspiration-slider-card group flex h-full min-h-[28rem] flex-col overflow-hidden rounded-[28px] bg-[#102b3f] shadow-[0_24px_64px_rgba(0,0,0,.18)] transition-colors duration-300 hover:bg-[#15364b]">
                
            <div className="relative aspect-[16/11] w-full overflow-hidden bg-black/20">
              {item.tag === 'Videa' ? <video src={item.url} poster={item.poster} controls playsInline preload="metadata" aria-label={item.title} className="h-full w-full object-cover object-center" /> :
                  <Link to={item.href} aria-label={item.title} className="block h-full w-full"><img src={item.url} alt={item.title} loading="lazy" decoding="async" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="h-full w-full object-cover object-center transition-transform duration-700 motion-safe:group-hover:scale-[1.035] motion-reduce:transition-none rounded-none" /></Link>}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06131e]/45 via-transparent to-transparent opacity-70" />
              {item.tag !== 'Videa' && <span className={`pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full  px-3 py-1.5 text-[11px] font-semibold backdrop-blur-md ${item.approved ? ' bg-[#062433]/82 text-cyan-200' : ' bg-slate-950/72 text-white'}`}>{item.approved && <ShieldCheck size={13} />} {item.badge}</span>}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[.12em] text-cyan-200/80">{item.tag}</p>
              <Link to={item.href} className="flex items-start justify-between gap-3 text-white transition hover:text-cyan-200"><h3 className="line-clamp-2 text-lg font-semibold leading-tight tracking-[-.02em]">{item.title}</h3><ArrowUpRight size={19} className="mt-0.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
              <p className="line-clamp-3 flex-1 text-sm leading-6 text-slate-200/90">{item.text || "Objevte tvar mlžítka a jeho umístění. Řešení přizpůsobíme konkrétnímu prostoru."}</p>
              <Link to={item.href} className="inline-flex items-center gap-2 self-start text-xs font-bold uppercase tracking-[.12em] text-cyan-200 transition hover:gap-3 hover:text-white">{item.href.startsWith('/produkt/') ? 'Prohlédnout produkt' : 'Prohlédnout řešení'} <ArrowRight size={14} /></Link>
            </div>
          </motion.article>
          </SwiperSlide>)}
          </Swiper>
          {items.length > 1 && <div className="mt-2 flex items-center justify-between gap-4">
            <p className="text-xs text-slate-300">{Math.min(sliderState.index + 1, items.length)} / {items.length} náhledů<span className="hidden sm:inline"> · posuňte pro další inspiraci</span></p>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => activeSwiper?.slidePrev()} disabled={sliderState.isBeginning} aria-label="Předchozí náhled" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white shadow-lg transition disabled:cursor-default disabled:opacity-30 hover:bg-cyan-200 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
                <ChevronLeft size={23} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => activeSwiper?.slideNext()} disabled={sliderState.isEnd} aria-label="Další náhled" className="flex h-12 items-center justify-center gap-2 rounded-full bg-cyan-200 px-5 text-sm font-semibold text-slate-950 shadow-lg transition disabled:cursor-default disabled:opacity-30 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
                Další <ChevronRight size={23} aria-hidden="true" />
              </button>
            </div>
          </div>}
        </motion.div>
      </AnimatePresence>
    </div>
  </section>;
}
