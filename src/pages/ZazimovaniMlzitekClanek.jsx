import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Snowflake, Wind, Droplets, ShieldCheck, ArrowRight, BookOpen } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import ReactMarkdown from 'react-markdown';
import gallery from '../../content/blog/zazimovani-fotografie.md?raw';

const photo='/assets/images/zazimovani-nahled.webp';
const steps=[
['01','Bezpečné odstavení','Uzavřete přívod vody, vypněte ovládání a uvolněte tlak podle pokynů ke konkrétní instalaci.'],
['02','Vypuštění vody','Vypusťte vodu z rozvodů, armatur, filtrů a dalších částí, kde by mohla při mrazu zůstat.'],
['03','Profouknutí rozvodů','Je-li to pro daný systém přípustné, zbytkovou vodu odstraňte regulovaným stlačeným vzduchem. Dodržte limity komponent a doporučený servisní postup.'],
['04','Kontrola a ochrana','Zkontrolujte trysky, filtraci, ventily a technologii. Součásti citlivé na mráz zabezpečte podle pokynů výrobce.']
];
export default function ZazimovaniMlzitekClanek(){
 useEffect(()=>{setSEO({title:'Zazimování mlžítek: ochrana před mrazem | MLŽIDLA.cz',description:'Jak zazimovat designové mlžítko, vypustit vodu a bezpečně připravit rozvody na zimu. Odborný servis nebo bezplatný návod MLŽIDLA.cz.',image:photo,canonicalPath:'/blog/zazimovani-mlzitek',robots:'index, follow'});},[]);
 return <main className="bg-white text-[#0A233A]">
 <section className="mx-auto max-w-6xl px-5 pt-12 pb-9"><Link to="/blog" className="text-sm text-cyan-700 hover:underline">← Blog a novinky</Link><div className="mt-8 text-xs font-semibold uppercase tracking-[.2em] text-cyan-700">SERVIS A ÚDRŽBA · PODZIM 2026</div><h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">Zazimování mlžítek: připravte své mlžítko na zimu</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">Správné zazimování pomáhá chránit nerezové mlžítko, vodní rozvody i technologii před poškozením mrazem. Nabízíme odbornou servisní péči i návod pro vlastní údržbu.</p></section>
 <section className="mx-auto max-w-6xl px-5"><img src={photo} alt="Obloukové nerezové mlžítko v podzimní zahradě" className="w-full rounded-3xl object-cover object-top max-h-[680px]"/></section>
 <section className="mx-auto max-w-6xl px-5 py-16"><div className="flex items-center gap-3 text-cyan-700"><Snowflake/><span className="text-sm font-semibold uppercase tracking-widest">Proč zazimovat</span></div><h2 className="mt-4 text-3xl font-bold">Zbytková voda může při mrazu poškodit systém</h2><p className="mt-5 max-w-4xl text-slate-600 leading-8">Po skončení sezóny je potřeba věnovat pozornost zejména vodě v potrubí, tryskách, filtrech a armaturách. Pouhé vypnutí ovládání nemusí stačit. Cílem je bezpečně odstavit instalaci a ochránit všechny části citlivé na mráz.</p><div className="mt-9 grid gap-5 md:grid-cols-2">{steps.map(([n,t,d])=><div key={n} className="rounded-2xl border border-slate-200 bg-slate-50 p-7"><div className="text-sm font-bold text-cyan-700">{n}</div><h3 className="mt-3 text-xl font-bold">{t}</h3><p className="mt-3 leading-7 text-slate-600">{d}</p></div>)}</div></section>
 <section aria-label="Fotografie mlžítek a servisní šachty" className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 md:grid-cols-3">
   <ReactMarkdown components={{
     p: ({ children }) => <>{children}</>,
     img: ({ src, alt, title }) => (
       <figure>
         <img src={src} alt={alt} loading="lazy" className="h-auto w-full rounded-2xl" />
         <figcaption className="mt-2 text-sm text-slate-600">{title}</figcaption>
       </figure>
     ),
   }}>{gallery}</ReactMarkdown>
 </section>
 <section className="bg-[#082B44] text-white"><div className="mx-auto grid max-w-6xl gap-9 px-5 py-16 md:grid-cols-2"><div><Wind className="text-cyan-300"/><h2 className="mt-4 text-3xl font-bold">Zazimování a celosezónní servis od nás</h2><p className="mt-5 leading-8 text-slate-200">Nechcete řešit servis sami? Pomůžeme s odborným zazimováním, pravidelnou údržbou a jarním uvedením mlžítka do provozu podle konkrétní instalace.</p><Link to="/kontakt" className="mt-6 inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-[#082B44]">Poptat servis <ArrowRight size={17}/></Link></div><div><BookOpen className="text-cyan-300"/><h2 className="mt-4 text-3xl font-bold">Vlastní údržba podle manuálu</h2><p className="mt-5 leading-8 text-slate-200">Pro běžnou péči jsme připravili bezplatný Návod k obsluze, údržbě a zazimování mlžítek. Najdete v něm doporučení pro kontrolu, čištění a přípravu na další sezónu.</p><Link to="/ke-stazeni" className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/60 px-6 py-3 font-semibold">Stáhnout manuál <ArrowRight size={17}/></Link></div></div></section>
 <section className="mx-auto max-w-6xl px-5 py-10 text-sm text-slate-500"><p><ShieldCheck className="mr-2 inline-block" size={18}/>Pro profukování používejte pouze postup a tlak schválený pro konkrétní instalaci. Před servisním zásahem systém odtlakujte. Mlžítko není herní prvek dle ČSN EN 1176.</p></section>
 </main>
}