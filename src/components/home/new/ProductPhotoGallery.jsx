import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
const MEDIA = [
  {
    "title": "BENDY ve městě",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/eb80e8486_IMG_1789934399993.jpg",
    "tag": "Náměstí a města",
    "badge": "Náhled použití",
    "href": "/produkt/mlzitko-bendy"
  },
  {
    "title": "BENDY a sloupová LINEA",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/e7593e68f_realizace-IMG_5072.jpg",
    "tag": "Gastro a zahrady",
    "badge": "Fotografie",
    "href": "/produkt/linea-mlzitko"
  },
  {
    "title": "KVĚT na náměstí",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/25683a407_file_0000000091fc8210b6b21eb1cdf55ece1.png",
    "tag": "Náměstí a města",
    "badge": "Vizualizace",
    "href": "/produkt/mlzitko-kvet-4"
  },
  {
    "title": "TEEPEE v prostoru",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/06c42b5dc_Screenshot_20260920_171920.jpg",
    "tag": "Náměstí a města",
    "badge": "Vizualizace",
    "href": "/produkt/teepee"
  },
  {
    "title": "Osvěžení na sportovišti",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/48b54bbc2_1789940598791.png",
    "tag": "Sportoviště",
    "badge": "Vizualizace",
    "href": "/kategorie/parky-hriste",
    "text": "Mlžná zóna pro sportovní areály, hřiště a místa s aktivním pohybem."
  },
  {
    "title": "MRAK ve školní zahradě",
    "url": "/media/optimized/db-4098079e74-84805a215_mlnprvek-mrak-mlzidla02.webp",
    "tag": "Školy a školky",
    "badge": "Produktová vizualizace",
    "href": "/produkt/mlzitko-mrak",
    "text": "Hravé mlžítko pro školy, školky, dětská hřiště a střediska volného času."
  },
  {
    "title": "AURA pro hotelovou terasu",
    "url": "/media/optimized/3bd7f70e9_MlitkoAURA-zahradnimlzidlo.webp",
    "tag": "Hotely a wellness",
    "badge": "Produktová vizualizace",
    "href": "/produkt/aura-mlzitko",
    "text": "Elegantní prvek pro hotelové terasy, wellness zahrady a pobytové zóny."
  },
  {
    "title": "Zahrádka restaurace a terasa",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/e7593e68f_realizace-IMG_5072.jpg",
    "tag": "Gastro a zahrady",
    "badge": "Fotografie",
    "href": "/rezidencni-mlzeni",
    "text": "Příjemnější pobyt hostů na zahrádkách restaurací, terasách a vnitroblocích."
  },
  {
    "title": "Městské náměstí a obchodní zóna",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/25683a407_file_0000000091fc8210b6b21eb1cdf55ece1.png",
    "tag": "Náměstí a města",
    "badge": "Vizualizace",
    "href": "/mlzitka-pro-mesta-obce",
    "text": "Vodní mlha pro veřejná prostranství, centra měst, pěší zóny a obchodní ulice."
  },
  {
    "title": "Nádraží a dopravní uzly",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/eb80e8486_IMG_1789934399993.jpg",
    "tag": "Nádraží a uzly",
    "badge": "Náhled použití",
    "href": "/mlzitka-pro-mesta-obce",
    "text": "Osvěžení pro čekací zóny, nástupní prostory a frekventované městské trasy."
  },
  {
    "title": "Z výroby mlžítka MRAK",
    "url": "https://drive.google.com/thumbnail?id=1cAuotLpUftsG_fNk3ii_RKWZ83EyWdK6&sz=w1600",
    "tag": "Produkty",
    "badge": "Výroba",
    "href": "/produkt/mlzitko-mrak"
  },
  {
    "title": "BENDY v provozu",
    "url": "https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/78cf9a6c8_KolekceBendy_20260812_121335_0000.mp4",
    "poster": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/e7593e68f_realizace-IMG_5072.jpg",
    "tag": "Videa",
    "badge": "Video",
    "href": "/produkt/mlzitko-bendy"
  },
  {
    "title": "LINEA v provozu",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/c37b035c2_mlzidla-linea-real-video-01.mp4",
    "poster": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/e7593e68f_realizace-IMG_5072.jpg",
    "tag": "Videa",
    "badge": "Video",
    "href": "/produkt/linea-mlzitko"
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
  custom: 'Produkty',
};
const isImageFile = (file) => String(file?.file_type || '').startsWith('image/') || /\.(png|jpe?g|webp|avif)(\?|#|$)/i.test(file?.file_url || '');

export default function ProductPhotoGallery() {
  const [filter, setFilter] = useState('Vše');
  const [approvedVisuals, setApprovedVisuals] = useState([]);
  const [adminMedia, setAdminMedia] = useState([]);

  useEffect(() => {
    let active = true;
    Promise.all([
      base44.entities.VisualizationAsset.filter({ approval_status: 'approved', approved_for_presentation: true }, '-updated_date', 80).catch(() => []),
      base44.entities.MediaFile.list('-created_date', 240).catch(() => []),
    ]).then(([visuals, files]) => {
      if (!active) return;
      setApprovedVisuals((visuals || []).filter((item) => item?.image_url));
      setAdminMedia((files || []).filter((item) => item?.file_url));
    });
    return () => { active = false; };
  }, []);

  const allItems = useMemo(() => {
    const visuals = approvedVisuals.map((item) => ({
      title: item.product_name || item.title || 'Schválená vizualizace',
      url: item.thumbnail_url || item.image_url,
      tag: ENVIRONMENT_TAG[item.environment] || 'Produkty',
      badge: 'Schválená vizualizace',
      href: item.product_slug ? `/produkt/${item.product_slug}` : '/mlzidla-mlzitka',
      text: item.scene_description || `Schválený návrh použití produktu ${item.product_name || ''}.`,
      approved: true,
      primary: Boolean(item.is_primary_for_variant),
      updated: item.updated_date || '',
    }));

    const media = adminMedia
      .filter(isImageFile)
      .filter((item) => ['homepage_visual', 'hero', 'gallery', 'reference', 'realization'].includes(item.media_role))
      .map((item) => ({
        title: item.file_name || item.media_group || 'MLŽIDLA®',
        url: item.file_url,
        tag: 'Produkty',
        badge: item.media_role === 'realization' || item.media_role === 'reference' ? 'Fotografie' : 'Média',
        href: item.product_slug ? `/produkt/${item.product_slug}` : '/mlzidla-mlzitka',
        text: item.media_group ? `${item.media_group} — fotografie z administrace webu.` : 'Fotografie z administrace webu.',
      }));

    const combined = [...visuals.sort((a, b) => Number(b.primary) - Number(a.primary)), ...media, ...MEDIA];
    return [...new Map(combined.filter((item) => item?.url).map((item) => [item.url, item])).values()].slice(0, 30);
  }, [approvedVisuals, adminMedia]);

  const items = allItems.filter(item => filter === 'Vše' || item.tag === filter);
  return <section id="home-product-gallery" className="bg-[#071a2b] py-16 text-white sm:py-20" aria-labelledby="media-gallery-title">
    <div className="mx-auto max-w-7xl px-5 lg:px-10">
      <p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan-300">Inspirace a produkty</p>
      <h2 id="media-gallery-title" className="mt-3 max-w-3xl font-heading text-3xl tracking-tight sm:text-5xl">Podívejte se, kam mlha patří.</h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">Prohlédněte si, jak mohou mlžítka fungovat v konkrétním prostoru. Vyberte prostředí a přejděte rovnou k produktu, kategorii nebo návrhu řešení.</p>
      <div className="my-8 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2" aria-label="Filtrovat média">
        {FILTERS.map(label => <button type="button" key={label} aria-pressed={filter === label} onClick={() => setFilter(label)} className={`min-h-11 shrink-0 snap-start rounded-full border px-5 text-sm font-semibold transition-colors ${filter === label ? 'border-cyan-300 bg-cyan-300 text-slate-950' : 'border-white/30 text-white hover:bg-white/10'}`}>{label}</button>)}
      </div>
      <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => <article key={`${item.url}-${index}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/5">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/20">
            {item.tag === 'Videa' ? <video src={item.url} poster={item.poster} controls playsInline preload="metadata" aria-label={item.title} className="h-full w-full object-cover object-center"/> :
            <Link to={item.href} aria-label={item.title} className="block h-full w-full"><img src={item.url} alt={item.title} loading="lazy" decoding="async" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="h-full w-full object-cover object-center transition-transform duration-500 motion-safe:group-hover:scale-[1.04] motion-reduce:transition-none"/></Link>}
            {item.tag !== 'Videa' && <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-slate-950/85 px-3 py-1.5 text-xs text-white">{item.badge}</span>}
          </div>
          <div className="flex flex-1 flex-col gap-3 p-5"><Link to={item.href} className="flex items-start justify-between gap-3 text-white hover:text-cyan-200"><h3 className="text-lg font-semibold leading-tight">{item.title}</h3><ArrowUpRight size={19} className="mt-0.5 shrink-0"/></Link><p className="flex-1 text-sm leading-6 text-slate-300">{item.text || "Prohlédněte si produkt a možnosti použití v konkrétním prostoru."}</p><Link to={item.href} className="inline-flex items-center gap-2 self-start text-xs font-bold uppercase tracking-[.12em] text-cyan-200 hover:text-white">Navrhnout řešení <ArrowRight size={14}/></Link></div>
        </article>)}
      </div>
    </div>
  </section>;
}
