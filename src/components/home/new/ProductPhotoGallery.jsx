import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
const MEDIA = [
  {
    "title": "BENDY ve městě",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/eb80e8486_IMG_1789934399993.jpg",
    "tag": "Město",
    "badge": "Náhled použití",
    "href": "/produkt/mlzitko-bendy"
  },
  {
    "title": "BENDY a sloupová LINEA",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/e7593e68f_realizace-IMG_5072.jpg",
    "tag": "Zahrady",
    "badge": "Fotografie",
    "href": "/produkt/linea-mlzitko"
  },
  {
    "title": "KVĚT na náměstí",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/25683a407_file_0000000091fc8210b6b21eb1cdf55ece1.png",
    "tag": "Město",
    "badge": "Vizualizace",
    "href": "/produkt/mlzitko-kvet-4"
  },
  {
    "title": "TEEPEE v prostoru",
    "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/06c42b5dc_Screenshot_20260920_171920.jpg",
    "tag": "Město",
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
const FILTERS = ['Vše', 'Náměstí a města', 'Sportoviště', 'Školy a školky', 'Gastro a zahrady', 'Hotely a wellness', 'Nádraží a uzly', 'Videa'];
export default function ProductPhotoGallery() {
  const [filter, setFilter] = useState('Vše');
  const items = MEDIA.filter(item => filter === 'Vše' || item.tag === filter);
  return <section id="home-product-gallery" className="bg-[#071a2b] py-16 text-white sm:py-20" aria-labelledby="media-gallery-title">
    <div className="mx-auto max-w-7xl px-5 lg:px-10">
      <p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan-300">Inspirace a produkty</p>
      <h2 id="media-gallery-title" className="mt-3 max-w-3xl font-heading text-3xl tracking-tight sm:text-5xl">Podívejte se, kam mlha patří.</h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">Prohlédněte si, jak mohou mlžítka fungovat v konkrétním prostoru. Vyberte prostředí a přejděte rovnou k produktu, kategorii nebo návrhu řešení.</p>
      <div className="my-8 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2" aria-label="Filtrovat média">
        {FILTERS.map(label => <button type="button" key={label} aria-pressed={filter === label} onClick={() => setFilter(label)} className={`min-h-11 shrink-0 snap-start rounded-full border px-5 text-sm font-semibold transition-colors ${filter === label ? 'border-cyan-300 bg-cyan-300 text-slate-950' : 'border-white/30 text-white hover:bg-white/10'}`}>{label}</button>)}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => <article key={item.url} className="group overflow-hidden rounded-2xl border border-white/15 bg-white/5">
          <div className="relative aspect-[4/3] overflow-hidden bg-black/20">
            {item.tag === 'Videa' ? <video src={item.url} poster={item.poster} controls playsInline preload="none" aria-label={item.title} className="h-full w-full object-contain"/> :
            <Link to={item.href} aria-label={item.title}><img src={item.url} alt={item.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03] motion-reduce:transition-none"/></Link>}
            {item.tag !== 'Videa' && <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-slate-950/85 px-3 py-1.5 text-xs text-white">{item.badge}</span>}
          </div>
          <div className="flex flex-col gap-3 p-5"><Link to={item.href} className="flex items-start justify-between gap-3 text-white hover:text-cyan-200"><h3 className="text-lg font-semibold leading-tight">{item.title}</h3><ArrowUpRight size={19} className="mt-0.5 shrink-0"/></Link><p className="text-sm leading-6 text-slate-300">{item.text || "Prohlédněte si produkt a možnosti použití v konkrétním prostoru."}</p><Link to={item.href} className="inline-flex items-center gap-2 self-start text-xs font-bold uppercase tracking-[.12em] text-cyan-200 hover:text-white">Navrhnout řešení <ArrowRight size={14}/></Link></div>
        </article>)}
      </div>
    </div>
  </section>;
}
