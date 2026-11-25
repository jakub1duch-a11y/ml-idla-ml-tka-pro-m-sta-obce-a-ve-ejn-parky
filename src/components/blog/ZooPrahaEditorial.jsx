import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import BlogArticleEngagement from '@/components/blog/BlogArticleEngagement';
import BlogCommentsSection from '@/components/blog/BlogCommentsSection';

const VIDEO = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/ac8584da1_MLZIDLA_ZOO_Praha_REALNE_ZABERY_DETI_IG.mp4';
const PLACE = 'ZOO Praha · Praha-Troja';
const CREDITS = [
  ['Autorský koncept a design', 'SKULL studio · Matěj Hájek a Pavel Krajčík'],
  ['Projektová dokumentace', 'Atelier Apris'],
  ['Zahradní realizace', 'Zahrady Ing. Jana Švejkovského'],
  ['Nerezové konstrukce a mlžný systém', 'HolmTec s.r.o.'],
];

function ZooVideo({ poster, photos = [] }) {
  const clips = [
    { src: VIDEO, title: 'Mlžné sochy v pohybu', poster },
    { src: '/media/optimized/27d926a20_MlzitkavarealuZOOPraha-zivaukazka.webm', title: 'Živá ukázka v areálu', poster: photos[1]?.url || poster },
    { src: '/media/optimized/2ffb4d391_mlzidla-mlzitkaproparkyamesta04.webm', title: 'Návštěvnický prostor', poster: photos[2]?.url || poster },
    { src: '/media/optimized/9f0153e3a_ml_detailvparku_01.webm', title: 'Detail jemné mlhy', poster: photos[0]?.url || poster },
  ];
  const hostRef = useRef(null);
  const videoRef = useRef(null);
  const touchStart = useRef(null);
  const visible = useInView(hostRef, { amount: 0.2 });
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [saveData] = useState(() => Boolean(navigator.connection?.saveData));
  const clip = clips[active];
  const select = (index) => {
    setActive((index + clips.length) % clips.length);
    setError(false);
  };
  useEffect(() => { if (visible) setLoaded(true); }, [visible]);
  useEffect(() => {
    const update = () => setTabVisible(!document.hidden);
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !loaded) return;
    if (!visible || !tabVisible || paused) video.pause();
    else if (!reducedMotion && !saveData) video.play().catch(() => {});
  }, [active, loaded, visible, tabVisible, paused, reducedMotion, saveData]);
  return <div ref={hostRef} className="min-w-0" aria-label="Videogalerie realizace ZOO Praha">
    <div className="relative isolate aspect-[4/5] w-full overflow-hidden rounded-[24px] bg-[#061f2b] shadow-xl sm:aspect-[3/4]"
      onTouchStart={(e) => {touchStart.current = e.touches[0].clientX;}}
      onTouchEnd={(e) => {if (touchStart.current === null) return; const dx = e.changedTouches[0].clientX - touchStart.current; touchStart.current = null; if (Math.abs(dx) > 55) select(active + (dx < 0 ? 1 : -1));}}>
      {clip.poster && <img src={clip.poster} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover"/>}
      {!error && <video key={clip.src} ref={videoRef} src={loaded ? clip.src : undefined} poster={clip.poster} muted playsInline controls loop preload="none" onPlay={() => setPaused(false)} onPause={() => { if (visible && tabVisible && !videoRef.current?.ended) setPaused(true); }} onError={() => setError(true)} aria-label={clip.title} className="absolute inset-0 h-full w-full bg-black object-contain"/>}
      {error && <p role="status" className="absolute inset-x-0 bottom-12 bg-black/75 p-3 text-center text-sm text-white">Video nelze načíst. Vyberte další záběr.</p>}
      <div className="absolute inset-x-0 top-4 flex justify-between px-3">
        <button type="button" onClick={() => select(active - 1)} aria-label="Předchozí video" className="min-h-11 min-w-11 rounded-full bg-black/70 text-white">‹</button>
        <button type="button" onClick={() => select(active + 1)} aria-label="Další video" className="min-h-11 min-w-11 rounded-full bg-black/70 text-white">›</button>
      </div>
    </div>
    <p aria-live="polite" className="mt-4 text-sm font-semibold text-slate-700">{active + 1} / {clips.length} · {clip.title}</p>
    <div className="mt-3 grid grid-cols-4 gap-2">
      {clips.map((item, i) => <button type="button" key={item.src} aria-label={item.title} aria-pressed={active === i} onClick={() => select(i)} className={`overflow-hidden rounded-lg border-2 ${active === i ? 'border-teal-600' : 'border-transparent'}`}>
        <img src={item.poster} alt="" loading="lazy" className="aspect-video w-full object-cover"/>
      </button>)}
    </div>
  </div>;
}

export default function ZooPrahaEditorial({ post }) {
  const reducedMotion = useReducedMotion();
  return <article className="min-h-screen bg-white">
    <section className="relative isolate min-h-[760px] overflow-hidden bg-[#051f2b] text-white">
      <img src={post.image_url} alt={post.image_alt || 'Mlžné sochy v areálu ZOO Praha'} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#041b27]/95 via-[#041b27]/65 to-[#041b27]/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#041b27]/95 via-transparent to-[#041b27]/30" />
      <div className="relative mx-auto flex min-h-[760px] max-w-7xl flex-col justify-between px-5 pb-14 pt-28 sm:px-8 lg:px-10 lg:pb-20">
        <Link to="/blog" className="inline-flex w-fit min-h-11 items-center gap-3 text-sm text-white/85 hover:text-white"><ArrowLeft size={17} /> Zpět na magazín</Link>
        <motion.header initial={reducedMotion ? false : {opacity:0,y:35}} animate={{opacity:1,y:0}} transition={{duration:.75}} className="max-w-5xl">
          <p className="text-[11px] font-semibold uppercase tracking-[.24em] text-cyan-200">MLŽIDLA® / REDAKČNÍ PŘÍBĚH / ZOO PRAHA</p>
          <h1 className="mt-6 max-w-4xl font-heading text-4xl leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">{post.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">{post.perex}</p>
          <div className="mt-9 flex flex-wrap gap-5 text-xs font-medium uppercase tracking-[.1em] text-white/75">
            <span>Redakční návrh: Jakub Duch</span><span>ZOO Praha · 2024</span><span>MLŽIDLA.cz / HolmTec</span>
          </div>
        </motion.header>
      </div>
    </section>
    <div className="border-b border-slate-200 bg-[#f5f8f8]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-5 py-7 sm:grid-cols-3 sm:px-8 lg:px-10">
        <div><p className="text-[10px] uppercase tracking-widest text-slate-500">Realizace</p><p className="mt-2 text-lg font-semibold text-[#0a3141]">2024</p></div>
        <div><p className="text-[10px] uppercase tracking-widest text-slate-500">Počet mlžných soch</p><p className="mt-2 text-lg font-semibold text-[#0a3141]">6</p></div>
        <div><p className="text-[10px] uppercase tracking-widest text-slate-500">Umístění</p><p className="mt-2 inline-flex items-center gap-1.5 text-base font-semibold text-[#0a3141]"><MapPin size={16} /> {PLACE}</p></div>
      </div>
    </div>
    <section className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_.75fr] lg:gap-16 lg:px-10 lg:py-24">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-teal-700">Funkce, která má vlastní tvář</p>
        <h2 className="mt-5 max-w-2xl font-heading text-3xl leading-tight text-[#0c3040] sm:text-5xl">Když se voda stane součástí prostoru.</h2>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Organické křivky nerezových mlžných soch stojí na pomezí designu a techniky. Záběry z návštěvnického areálu ukazují jejich skutečné měřítko, charakter i jemnou vodní mlhu.</p>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">Přehrávání se spustí při zobrazení videa, bez zvuku. Pokud chcete slyšet původní záznam, zvuk můžete aktivovat tlačítkem.</p>
        <a href="#zoo-editorial-text" className="mt-6 inline-flex min-h-11 items-center gap-2 border-b border-teal-800 pb-1 font-semibold text-teal-800">Přečíst celý příběh <ArrowRight size={16}/></a>
      </div>
      <ZooVideo poster={post.content_images?.find((item) => item.kind === 'photo')?.url || post.image_url} photos={(post.content_images || []).filter(item => item.kind === 'photo')} />
    </section>
    <section id="zoo-editorial-text" className="bg-[#f7fafb] py-16 sm:py-24" aria-label="Redakční reportáž ZOO Praha">
      <div className="mx-auto grid max-w-7xl gap-9 px-5 sm:px-8 lg:grid-cols-[270px_1fr] lg:gap-16 lg:px-10">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-[11px] uppercase tracking-[.2em] text-teal-700">Projektový tým</p>
          <div className="mt-7 space-y-6">
            {CREDITS.map(([label, value]) => <div key={label} className="border-t border-slate-300 pt-4"><p className="text-xs uppercase tracking-wider text-slate-500">{label}</p><p className="mt-2 text-sm font-semibold leading-6 text-[#153744]">{value}</p></div>)}
          </div>
          <Link to="/mlzitka-pro-mesta-obce" className="mt-10 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-teal-800 underline underline-offset-4">Mlžítka pro veřejný prostor <ArrowUpRight size={15}/></Link>
        </aside>
        <div className="min-w-0">
          <div className="zoo-editorial-prose prose prose-slate max-w-none text-[17px] leading-[1.85] prose-headings:font-heading prose-headings:tracking-tight prose-headings:text-[#082e41] prose-p:text-slate-650 prose-a:text-teal-800 prose-strong:text-[#0a3141] [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:text-3xl [&_h2]:font-semibold sm:[&_h2]:text-4xl [&_figure]:my-11 [&_figure]:overflow-hidden [&_figure]:rounded-[18px] [&_figure]:bg-white [&_figure]:shadow-[0_18px_60px_rgba(5,31,42,.08)] [&_img]:block [&_img]:w-full [&_img]:max-h-[670px] [&_img]:object-cover [&_figcaption]:px-5 [&_figcaption]:py-4 [&_figcaption]:text-sm [&_figcaption]:leading-6 [&_figcaption]:text-slate-500" dangerouslySetInnerHTML={{__html:sanitizeHtml(post.content || '')}} />
          <div className="mt-12 border-t border-slate-300 pt-8"><p className="text-sm font-semibold text-slate-700">Redakční návrh pro Jakuba Ducha · MLŽIDLA.cz / HolmTec</p><p className="mt-2 text-sm text-slate-500">Materiály: fotografie a video skutečné instalace, projektové podklady a informace výrobce.</p></div>
          <div className="mt-8"><BlogArticleEngagement postId={post.id} title={post.title}/></div>
        </div>
      </div>
    </section>
    <section className="bg-[#061f2b] px-5 py-16 text-white sm:py-24">
      <div className="mx-auto grid max-w-7xl items-end gap-8 lg:grid-cols-[1fr_auto]">
        <div><p className="text-xs font-semibold uppercase tracking-[.22em] text-cyan-200">MLŽIDLA.cz / BY HOLMTEC</p><h2 className="mt-4 max-w-3xl font-heading text-3xl leading-tight sm:text-5xl">Přemýšlíte o mlžné zóně pro svůj park nebo návštěvnický areál?</h2><p className="mt-5 max-w-2xl leading-7 text-white/75">Navrhneme vhodnou podobu nerezových mlžítek, technické napojení a řešení podle podmínek vašeho prostoru.</p></div>
        <Link to="/poptavka" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-white px-7 py-3 font-semibold text-[#061f2b] hover:bg-cyan-100">Poptat podobné řešení <ArrowRight size={17}/></Link>
      </div>
    </section>
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10"><BlogCommentsSection postId={post.id}/></div>
  </article>;
}
