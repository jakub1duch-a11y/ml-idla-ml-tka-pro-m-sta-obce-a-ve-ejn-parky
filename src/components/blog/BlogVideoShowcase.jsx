import React from 'react';
import { Play, Film, Factory, Waves, Trees, Building2, Sparkles } from 'lucide-react';

const MEDIA = [
  { group: 'Realizace', title: 'Mlžítka v ZOO Praha', text: 'Živá ukázka mlžítek v reálném návštěvnickém provozu.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/27d926a20_MlzitkavarealuZOOPraha-zivaukazka.mov', poster: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4737b1d8d_5b1b2bcc1b140ee76c8402a1e6313b8f.jpg' },
  { group: 'Mlžné brány', title: 'Efekt mlžné brány', text: 'Detail jemné mlhy a jejího pohybu v prostoru.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/c857caa78_Efektmlhy-mlznabrana-zivynahled.mov', poster: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/5401e0933_dac8b98065c5472b16bc1910348915a1.jpg' },
  { group: 'Výroba', title: 'Svařování a výroba', text: 'Pohled do české zakázkové výroby MLŽIDLA®.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/2d9d98473_Svaovnukzkazive.mov', poster: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/66c02aadb_Screenshot_20260712_212842.jpg' },
  { group: 'Města', title: 'Mlžítka pro parky a města', text: 'Sekvence městského řešení v reálném prostoru.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/eb7e87313_mlzidla-mlzitkaproparkyamesta03.MOV' },
  { group: 'Města', title: 'Detail mlžítka v parku', text: 'Detail konstrukce a mlžení v městské zeleni.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/9f0153e3a_ml_detailvparku_01.MOV' },
  { group: 'Města', title: 'Mlžítka v městském prostoru', text: 'Další krátká sekvence městské instalace.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/2ffb4d391_mlzidla-mlzitkaproparkyamesta04.MOV' },
  { group: 'Produkty', title: 'Mlžná spirála v akci', text: 'Pohyb mlhy kolem designového produktu Spirál a.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/ae9faa0a3_video-mlitkospiralavakci.MOV' },
  { group: 'Produkty', title: 'Mlžítko Mrak', text: 'Video sekvence produktu Mrak / Oblak.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/cd51ba0aa_mlzitko-mrak-oblak.webm' },
  { group: 'Produkty', title: 'Mlžení zblízka', text: 'Krátká sekvence jemné vodní mlhy.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/bc59d4ed7_4419E385-9A17-4EF1-AA75-90C2B12ACDE3.MOV' },
  { group: 'Produkty', title: 'Jemná mlha v provozu', text: 'Detail rozptylu mikrokapek během provozu.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/2dbc1232d_EFC9FCE8-7138-44C3-AAE6-246F88644813.MOV' },
  { group: 'Mlžné brány', title: 'Mlžná brána v akci', text: 'Průchod mlžnou bránou a prostorový efekt.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/858a3a3f3_1283CEC3-EA3F-42B3-9E58-3788630B07A6.MOV' },
  { group: 'Produkty', title: 'Chladivý efekt naživo', text: 'Krátká produktová sekvence aktivního mlžení.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/ce13ff8ac_AF599DD3-EFF1-43AB-B6AB-40C8B869039F.MOV' },
  { group: 'Výroba', title: 'Svařování mlžítek HolmTec', text: 'Výrobní sekvence z dílny.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/fc20c7f11_svarovanimlzitekHolmTec-video.webm' },
  { group: 'Výroba', title: 'Svařování kotvících patek', text: 'Detail zpracování nerezových konstrukčních prvků.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/f8417df7f_svarovanimlzitekHolmTec-video02.webm' },
  { group: 'Mlžné brány', title: 'GATE70 — mlhový efekt', text: 'Mlžná brána GATE70 v parku.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/aa11e932c_mlnbrnaGATE70.mp4' },
  { group: 'Mlžné brány', title: 'GATE — detail trysek', text: 'Detail mlhy a trysek v aktivním provozu.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/a4733f633_detailnamlhumlznebrany.MOV' },
  { group: 'Mlžné brány', title: 'Mlžná brána v provozu', text: 'Sekvence aktivního mlžení brány.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/37a6da879_mlzeni-mlznbrany-vakci.MOV' },
  { group: 'Mlžné brány', title: 'GATE74 — realizace', text: 'Ukázka varianty GATE74 v provozu.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/352fd3ef1_mlnbrnaGATE74-vakci.MOV' },
  { group: 'Mlžné brány', title: 'GATE74 — druhý pohled', text: 'Další úhel na mlžnou bránu během provozu.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/4b66409ed_mlnbrnaGATE74-vakci1.MOV' },
  { group: 'Zahrady', title: 'AURA — zahradní mlžítko', text: 'Ukázka zahradního mlžítka AURA.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/feff82d99_Aura-mlzitko-video-01.MP4' },
  { group: 'Města', title: 'Městská mlžná brána GATE', text: 'Video použité v městské kolekci.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/0d9a4e147_mlznabranaGATE70-video.mp4' },
  { group: 'Realizace', title: 'Mlžný strom — živá ukázka', text: 'Reálný pohled na mlžný strom v prostoru.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/30dac59df_Mlzitkaostev-zivaukazkamlznystrom.mov' },
  { group: 'Města', title: 'Mlžné sochy pro obce a města', text: 'Prezentační sekvence řešení pro veřejný prostor.', url: 'https://media.base44.com/videos/public/69d723859ec0e3321c6b8bb6/cb467bdec_mlznesochyproobceamesta.mp4' },
  { group: 'Komerční', title: 'Mlžiště pro komerční prostory', text: 'Ukázka řešení pro gastro, hotely a komerční areály.', url: 'https://media.base44.com/videos/public/69d723859ec0e3321c6b8bb6/a155bfef6_mlzisteprokomercniprostory.mp4' },
  { group: 'Architektura', title: 'Mlžítka a mlžné sochy', text: 'Video inspirace pro architekty a projektanty.', url: 'https://media.base44.com/videos/public/69d723859ec0e3321c6b8bb6/74b224ffb_mlzitkaamlznesochy.mp4' },
  { group: 'Architektura', title: 'MLŽIDLA® / HolmTec', text: 'Další prezentační sekvence produktů a instalací.', url: 'https://media.base44.com/videos/public/69d723859ec0e3321c6b8bb6/7e305c760_mlzitkaholmtec.mp4' }
];

const ICONS = { Výroba: Factory, 'Mlžné brány': Waves, Zahrady: Trees, Města: Building2, Produkty: Sparkles };

export default function BlogVideoShowcase() {
  return <section>
    <div className="mb-10 flex flex-col justify-between gap-5 border-b border-border pb-7 lg:flex-row lg:items-end">
      <div><p className="font-mono text-[11px] uppercase tracking-[.2em] text-secondary">Video knihovna · MLŽIDLA®</p><h2 className="mt-3 font-heading text-3xl tracking-[-.02em] text-foreground sm:text-4xl lg:text-5xl">Videa, realizace a živé sekvence.</h2><p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">Reálný provoz, produktové detaily, mlžné brány, městské instalace i záběry z české výroby. Videa jsou načítána až podle potřeby, aby galerie zůstala použitelná i na mobilu.</p></div>
      <div className="inline-flex items-center gap-2 self-start rounded-full border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground"><Film size={14}/>{MEDIA.length} ukázek</div>
    </div>

    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {MEDIA.map((video, index) => { const Icon = ICONS[video.group] || Play; return <article key={`${video.url}-${index}`} className="group overflow-hidden rounded-2xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-video overflow-hidden bg-primary"><video controls playsInline preload="none" poster={video.poster} className="h-full w-full object-cover"><source src={video.url}/></video><span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#041c28]/80 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.14em] text-white backdrop-blur"><Icon size={11}/>{video.group}</span></div>
        <div className="p-5"><h3 className="font-heading text-xl text-foreground">{video.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{video.text}</p></div>
      </article>; })}
    </div>
  </section>;
}