import React, { useState } from 'react';
import { Play, Film, Clapperboard, Factory, Waves, Building2, Sparkles } from 'lucide-react';

const VIDEOS = [
  { title: 'Městská kolekce — GATE70', text: 'Video používané v prezentaci městské kolekce a veřejného prostoru.', url: '/media/optimized/0d9a4e147_mlznabranaGATE70-video.webm', group: 'produkt' },
  { title: 'Zahradní AURA', text: 'Produktová ukázka zahradního mlžítka AURA v provozu.', url: '/media/optimized/feff82d99_Aura-mlzitko-video-01.webm', group: 'produkt' },
  { title: 'Animace mlhy MLŽIDLA®', text: 'Krátká animovaná sekvence vizuální identity a principu mlžení.', url: '/media/optimized/e93fc3844_mist-animatedicon02.webm', group: 'sekvence' },
  { title: 'Animovaný symbol mlžení', text: 'Motion sekvence používaná v prezentaci MLŽIDLA®.', url: '/media/optimized/2c4b0efa9_animatediconmist.webm', group: 'sekvence' },
  { title: 'Mlžná brána — živá ukázka II', text: 'Další uložená sekvence reálného mlžného efektu brány.', url: '/media/optimized/5a2af0f9e_Efektmlhy-mlznabrana-zivynahled.webm', group: 'detail' },
  { title: 'Mlžná brána — živá ukázka III', text: 'Alternativní záběr mlžné brány používaný u referencí.', url: '/media/optimized/42cf4b972_Efektmlhy-mlznabrana-zivynahled.webm', group: 'detail' },
  { title: 'Detail jemné mlhy — sekvence II', text: 'Další uložená verze detailní sekvence aktivního mlžení.', url: '/media/optimized/bdb338033_EFC9FCE8-7138-44C3-AAE6-246F88644813.webm', group: 'detail' },
  { title: 'Chladivý efekt — sekvence II', text: 'Alternativní záběr rozptylu mlhy v bezprostředním okolí.', url: '/media/optimized/b0171e69d_AF599DD3-EFF1-43AB-B6AB-40C8B869039F.webm', group: 'detail' },
  { title: 'Mlžná brána — sekvence II', text: 'Další uložený záběr průchodu a práce mlhy v bráně.', url: '/media/optimized/66dd73724_1283CEC3-EA3F-42B3-9E58-3788630B07A6.webm', group: 'detail' },
  { title: 'Mlžení zblízka — sekvence II', text: 'Alternativní detail mikrokapek a jemnosti vodní mlhy.', url: '/media/optimized/1d1271290_4419E385-9A17-4EF1-AA75-90C2B12ACDE3.webm', group: 'detail' },
  { title: 'Mlžítka v ZOO Praha', text: 'Živá ukázka instalace v návštěvnickém provozu.', url: '/media/optimized/27d926a20_MlzitkavarealuZOOPraha-zivaukazka.webm', poster: '/media/optimized/4737b1d8d_5b1b2bcc1b140ee76c8402a1e6313b8f.webp', group: 'realizace' },
  { title: 'Mlžná brána — živý efekt', text: 'Jemná mlha a její pohyb přímo v prostoru.', url: '/media/optimized/c857caa78_Efektmlhy-mlznabrana-zivynahled.webm', poster: '/media/optimized/5401e0933_dac8b98065c5472b16bc1910348915a1.webp', group: 'produkt' },
  { title: 'Mlžný strom OSTREV', text: 'Živá ukázka mlžného stromu a charakteru mlhy.', url: '/media/optimized/30dac59df_Mlzitkaostev-zivaukazkamlznystrom.webm', group: 'produkt' },
  { title: 'GATE70 v parku', text: 'Mlžná brána v reálném městském prostředí.', url: '/media/optimized/aa11e932c_mlnbrnaGATE70.webm', group: 'produkt' },
  { title: 'Detail mlhy GATE', text: 'Detail trysek a mlžného efektu brány.', url: '/media/optimized/a4733f633_detailnamlhumlznebrany.webm', group: 'produkt' },
  { title: 'Mlžná brána v akci', text: 'Průchod mlžnou bránou a intenzita mlžení.', url: '/media/optimized/37a6da879_mlzeni-mlznbrany-vakci.webm', group: 'produkt' },
  { title: 'GATE74 — realizace', text: 'Ukázka větší mlžné brány v provozu.', url: '/media/optimized/352fd3ef1_mlnbrnaGATE74-vakci.webm', group: 'produkt' },
  { title: 'GATE74 — druhý pohled', text: 'Prostorový pohled na mlžný efekt GATE74.', url: '/media/optimized/4b66409ed_mlnbrnaGATE74-vakci1.webm', group: 'produkt' },
  { title: 'Mlžná spirála v akci', text: 'Autorský nerezový prvek při aktivním mlžení.', url: '/media/optimized/ae9faa0a3_video-mlitkospiralavakci.webm', group: 'produkt' },
  { title: 'Mlžítka pro parky a města', text: 'Sekvence městské instalace a práce mlhy v prostoru.', url: '/media/optimized/eb7e87313_mlzidla-mlzitkaproparkyamesta03.webm', group: 'realizace' },
  { title: 'Detail instalace v parku', text: 'Krátká sekvence produktu a okolního veřejného prostoru.', url: '/media/optimized/9f0153e3a_ml_detailvparku_01.webm', group: 'realizace' },
  { title: 'Městská instalace — sekvence', text: 'Další pohled na mlžítka pro parky a města.', url: '/media/optimized/2ffb4d391_mlzidla-mlzitkaproparkyamesta04.webm', group: 'realizace' },
  { title: 'Mlžné sochy pro obce a města', text: 'Filmová ukázka řešení pro veřejný prostor.', url: 'https://media.base44.com/videos/public/69d723859ec0e3321c6b8bb6/cb467bdec_mlznesochyproobceamesta.mp4', group: 'realizace' },
  { title: 'Mlžiště pro komerční prostory', text: 'Ukázka řešení pro gastro, hotely a komerční projekty.', url: 'https://media.base44.com/videos/public/69d723859ec0e3321c6b8bb6/a155bfef6_mlzisteprokomercniprostory.mp4', group: 'realizace' },
  { title: 'Mlžítka a mlžné sochy', text: 'Prezentační sekvence produktů pro architektonické projekty.', url: 'https://media.base44.com/videos/public/69d723859ec0e3321c6b8bb6/74b224ffb_mlzitkaamlznesochy.mp4', group: 'realizace' },
  { title: 'MLŽIDLA® / HolmTec', text: 'Produktová a realizační videosekvence.', url: 'https://media.base44.com/videos/public/69d723859ec0e3321c6b8bb6/7e305c760_mlzitkaholmtec.mp4', group: 'realizace' },
  { title: 'Mlžítko MRAK', text: 'Animovaná ukázka mlžítka Mrak / Oblak.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/cd51ba0aa_mlzitko-mrak-oblak.webm', group: 'produkt' },
  { title: 'Mlžení zblízka', text: 'Detail mikrokapek a charakteru jemné vodní mlhy.', url: '/media/optimized/bc59d4ed7_4419E385-9A17-4EF1-AA75-90C2B12ACDE3.webm', group: 'detail' },
  { title: 'Jemná mlha v provozu', text: 'Detailní sekvence aktivního mlžení.', url: '/media/optimized/2dbc1232d_EFC9FCE8-7138-44C3-AAE6-246F88644813.webm', group: 'detail' },
  { title: 'Mlžná brána — sekvence', text: 'Krátká živá ukázka mlžné brány.', url: '/media/optimized/858a3a3f3_1283CEC3-EA3F-42B3-9E58-3788630B07A6.webm', group: 'detail' },
  { title: 'Chladivý efekt naživo', text: 'Pohyb mlhy a její rozptyl v bezprostředním okolí.', url: '/media/optimized/ce13ff8ac_AF599DD3-EFF1-43AB-B6AB-40C8B869039F.webm', group: 'detail' },
  { title: 'Svařování mlžítek', text: 'Pohled do české zakázkové výroby HolmTec.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/fc20c7f11_svarovanimlzitekHolmTec-video.webm', group: 'vyroba' },
  { title: 'Výroba kotvících patek', text: 'Sekvence svařování a zpracování nerezových dílů.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/f8417df7f_svarovanimlzitekHolmTec-video02.webm', group: 'vyroba' },
  { title: 'Svařování — živá ukázka', text: 'Další pohled přímo do procesu výroby MLŽIDLA®.', url: '/media/optimized/2d9d98473_Svaovnukzkazive.webm', poster: '/media/optimized/66c02aadb_Screenshot_20260712_212842.webp', group: 'vyroba' },
  { title: 'Parky a hřiště', text: 'Vizualizační videosekvence řešení pro veřejný prostor.', url: '/media/optimized/3c3e64d18_generated_video.webm', group: 'sekvence' },
  { title: 'Koupaliště a aquaparky', text: 'Videosekvence využití mlžení ve vodních areálech.', url: '/media/optimized/9eb62596b_generated_video.webm', group: 'sekvence' },
  { title: 'Školy a dětské prostory', text: 'Vizualizační sekvence mlžení pro dětské a školní areály.', url: '/media/optimized/e557b652c_generated_video.webm', group: 'sekvence' },
  { title: 'Zahrady a terasy', text: 'Sekvence mlžítka v soukromém venkovním prostoru.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/da5bb1cbb_mlzitko-mrak-oblak.MOV', group: 'sekvence' },
  { title: 'Instalace mlžítka MRAK', text: 'Ukázka autorské instalace a výsledného efektu.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/94c2b5f74_instalace-mlzitka-mrak.MOV', group: 'sekvence' },
  { title: 'Eventy a festivaly', text: 'Videosekvence mobilního využití mlžení při akcích.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/f0ba17112_generated_video.mp4', group: 'sekvence' },
  { title: 'Mlžení — filmový detail', text: 'Atmosférická videosekvence používaná v prezentaci MLŽIDLA®.', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/c7c9d3e68_video_20260619_164025.mp4', group: 'detail' },
];

const FILTERS = [
  { id: 'all', label: 'Vše', icon: Film },
  { id: 'realizace', label: 'Realizace', icon: Building2 },
  { id: 'produkt', label: 'Produkty', icon: Sparkles },
  { id: 'detail', label: 'Mlžení zblízka', icon: Waves },
  { id: 'vyroba', label: 'Výroba', icon: Factory },
  { id: 'sekvence', label: 'Sekvence', icon: Clapperboard },
];

export default function BlogVideoShowcase() {
  const [filter, setFilter] = useState('all');
  const visible = filter === 'all' ? VIDEOS : VIDEOS.filter(v => v.group === filter);
  const hero = visible[0];
  const rest = visible.slice(1);

  return <section>
    <div className="flex flex-col gap-5 border-b border-border pb-7 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[.2em] text-secondary">Video archiv · MLŽIDLA®</p>
        <h2 className="mt-3 font-heading text-3xl tracking-[-.02em] text-foreground sm:text-4xl lg:text-5xl">Videa, živé ukázky a sekvence.</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">Reálné instalace, produktové detaily, mlžné brány, výroba i krátké vizualizační sekvence. Videa zobrazujeme přímo bez automatického přehrávání, aby stránka zůstala rychlá i na mobilu.</p>
      </div>
      <span className="font-mono text-xs uppercase tracking-[.16em] text-muted-foreground">{VIDEOS.length} videí</span>
    </div>

    <div className="mt-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {FILTERS.map(({id,label,icon:Icon}) => <button key={id} onClick={() => setFilter(id)} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition ${filter === id ? 'border-primary bg-primary text-white' : 'border-border bg-white text-muted-foreground hover:border-secondary hover:text-secondary'}`}><Icon size={14}/>{label}</button>)}
    </div>

    {hero && <article className="mt-8 grid overflow-hidden rounded-3xl border border-border bg-primary text-white shadow-sm lg:grid-cols-[1.45fr_.55fr]">
      <video key={hero.url} controls playsInline preload="metadata" poster={hero.poster} className="aspect-video h-full w-full bg-black object-contain"><source src={hero.url}/></video>
      <div className="flex flex-col justify-end p-6 lg:p-8"><span className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan-300">Doporučená ukázka</span><h3 className="mt-3 font-heading text-2xl lg:text-3xl">{hero.title}</h3><p className="mt-3 text-sm leading-relaxed text-white/65">{hero.text}</p></div>
    </article>}

    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {rest.map(video => <article key={video.url} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-lg">
        <div className="relative bg-primary"><video controls playsInline preload="none" poster={video.poster} className="aspect-video w-full bg-black object-cover"><source src={video.url}/></video><span className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/15 bg-primary/75 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.14em] text-white backdrop-blur"><Play size={10} className="mr-1 inline"/>Video</span></div>
        <div className="p-5"><h3 className="font-heading text-xl text-foreground">{video.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{video.text}</p></div>
      </article>)}
    </div>
  </section>;
}