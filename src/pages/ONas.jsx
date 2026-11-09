import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, ArrowDown, Droplets, Wrench, Ruler,
  MapPin, Mail, Phone, Layers3, Waves, Settings2, ShieldCheck,
  ScanLine, MoveUpRight, Factory,
} from 'lucide-react';
import { setSEO } from '@/lib/seo';
import '@/styles/about-premium.css';

const MEDIA = {
  hero: '/media/optimized/518c8c2a3_mlzitka-pro-mesta.webp',
  craft: '/media/optimized/ee5759df9_foto-instalace-vyroba.webp',
  detail: '/media/optimized/87830d99f_detail.webp',
  stamped: '/media/optimized/881a6dd25_aplikaceloganaproduktu.webp',
  laser: '/media/optimized/55ad64b81_laserstitky.webp',
  fair: '/media/optimized/47ca0affa_veletrh.webp',
  brand: '/media/optimized/046393468_brandmarch.webp',
};

const PILLARS = [
  { number: '01', icon: Ruler, title: 'Tvar s technickou logikou', text: 'Tvarujeme nerezové trubky s ohledem na geometrii, návaznosti ohybů, kotvení a skutečné možnosti výroby.' },
  { number: '02', icon: Waves, title: 'Mlha, která patří do prostoru', text: 'Mlžítko navrhujeme jako architektonický prvek. Jemné vodní mlžení doplňuje pobytová místa, nikoli je ovládá.' },
  { number: '03', icon: Settings2, title: 'Technologie podle projektu', text: 'Volíme vhodné trysky, filtraci, přívod vody i způsob spínání. U vybraných sestav doplňujeme chytré řízení SUPLA.' },
  { number: '04', icon: ShieldCheck, title: 'Péče i po instalaci', text: 'Myslíme na dostupnost technologií, údržbu, provozní kontrolu a sezonní zazimování.' },
];

const PROCESS = [
  { number: '01', title: 'Poznáme místo', text: 'Architektura, účel prostoru, voda, elektro, orientační rozměry a způsob používání.' },
  { number: '02', title: 'Navrhneme řešení', text: 'Vybereme katalogový tvar nebo připravíme individuální koncept a technickou specifikaci.' },
  { number: '03', title: 'Vyrobíme v Trutnově', text: 'Ohýbání nerezových profilů, svařování, povrchové dokončení a kontrola detailů.' },
  { number: '04', title: 'Oživíme a pečujeme', text: 'Montáž, nastavení mlžení a domluva na následné servisní péči.' },
];

const COMPANY = {
  name: 'HolmTec s.r.o.',
  address: 'Horní Staré Město 698, 541 02 Trutnov',
  ico: '27486893',
  dic: 'CZ27486893',
  email: 'obchod1@holmtec.cz',
  phone: '+420 774 700 390',
};

function Eyebrow({ children, light = false, index }) {
  return (
    <p className={'about-eyebrow ' + (light ? 'about-eyebrow--light' : '')}>
      {index && <span aria-hidden="true">{index}</span>}{children}
    </p>
  );
}

function Action({ to, children, variant = 'primary', external = false }) {
  const className = 'about-action about-action--' + variant;
  if (external) return <a className={className} href={to} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={17} aria-hidden="true" /></a>;
  return <Link to={to} className={className}>{children}<ArrowRight size={17} aria-hidden="true" /></Link>;
}

export default function ONas() {
  useEffect(() => {
    setSEO({
      title: 'O nás | MLŽIDLA.cz × HolmTec — česká výroba mlžných soch',
      description: 'Od nerezové trubky k architektonickému mlžení. Poznejte výrobní zázemí HolmTec v Trutnově, design MLŽIDLA.cz, technologii a průběh spolupráce.',
      robots: 'index, follow',
    });
  }, []);

  return (
    <main id="main-content" className="about-page bg-white text-[#10213D]">
      <section className="about-hero relative isolate overflow-hidden text-white" aria-labelledby="about-title">
        <img src={MEDIA.hero} alt="Mlžící prvek MLŽIDLA v městském veřejném prostoru" className="about-hero__image" fetchPriority="high" />
        <div className="about-hero__shade" aria-hidden="true" />
        <div className="about-hero__mesh" aria-hidden="true" />
        <div className="about-hero__glow" aria-hidden="true" />
        <div className="about-hero__content relative z-10 mx-auto flex w-full max-w-[1440px] flex-col justify-end px-6 pb-16 pt-32 sm:px-10 lg:px-16 lg:pb-24">
          <Eyebrow light>MLŽIDLA.cz <span className="about-bullet" aria-hidden="true" /> VÝROBNÍ ZÁZEMÍ HOLMTEC</Eyebrow>
          <h1 id="about-title" className="about-hero__heading mt-7 max-w-5xl font-heading font-bold leading-[0.99] tracking-[-.055em]">
            Z nerezové trubky.<br />
            <span className="about-hero__heading-accent">Do života města.</span>
          </h1>
          <p className="mt-8 max-w-xl text-[1.06rem] leading-relaxed text-white/85 sm:text-xl">
            Designové mlžné sochy, za kterými stojí skutečná česká výroba. Spojujeme řemeslo HolmTec s promyšleným ochlazováním veřejného prostoru.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Action to="/poptavka">Navrhnout řešení</Action>
            <Action to="/reference" variant="outline">Naše realizace</Action>
          </div>
          <a href="#nas-pribeh" className="about-scroll-link mt-12 inline-flex w-fit items-center gap-3 text-sm text-white/80 transition hover:text-white">
            <span className="about-scroll-link__icon"><ArrowDown size={15} aria-hidden="true" /></span> Poznejte náš příběh
          </a>
        </div>
        <div className="about-hero__caption absolute bottom-6 right-8 z-10 hidden text-right text-xs uppercase tracking-[.2em] text-white/70 lg:block">
          <span className="block text-white">MLŽIDLA × HOLMTEC</span>
          Navrženo a vyráběno v Česku
        </div>
      </section>

      <div className="about-proof-strip" aria-label="Základní principy značky">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-6 px-6 py-7 sm:px-10 lg:grid-cols-4 lg:px-16">
          {[['01', 'České výrobní zázemí'], ['02', 'Nerez a přesné ohýbání'], ['03', 'Design pro konkrétní místo'], ['04', 'Technologie a servis']].map(([n, title]) => (
            <div className="about-proof" key={n}><span>{n} /</span><strong>{title}</strong></div>
          ))}
        </div>
      </div>

      <section id="nas-pribeh" className="about-story mx-auto grid max-w-[1440px] items-center gap-12 px-6 py-24 sm:px-10 lg:grid-cols-[.92fr_1.08fr] lg:gap-20 lg:px-16 lg:py-32" aria-labelledby="about-story-heading">
        <div className="about-story__text">
          <Eyebrow index="01">PŮVOD ZNAČKY</Eyebrow>
          <h2 id="about-story-heading" className="about-heading mt-5">Nejdřív řemeslo.<br /><em>Potom vlastní tvar.</em></h2>
          <div className="mt-8 max-w-[59ch] space-y-5 text-base leading-[1.85] text-slate-600">
            <p><strong className="font-semibold text-[#10213D]">MLŽIDLA.cz vyrůstají z výrobního zázemí společnosti HolmTec.</strong> Zkušenost s přesným ohýbáním trubek, zakázkovými díly a zpracováním nerezu nám umožňuje navrhovat mlžítka také jako sochařské objekty.</p>
            <p>Nekreslíme jen atraktivní siluetu. Přemýšlíme, jak ji vyrobit, ukotvit, připojit k vodě a dlouhodobě udržovat. Právě proto stojí design a technické řešení od začátku vedle sebe.</p>
          </div>
          <div className="about-signature mt-9 flex items-center gap-4 border-t border-[#dbe8ee] pt-6">
            <span className="about-signature__icon"><Factory size={25} aria-hidden="true" /></span>
            <div><strong className="block text-sm text-[#10213D]">HolmTec s.r.o. · Trutnov</strong><span className="text-xs uppercase tracking-widest text-slate-500">Vývoj • vlastní výroba • technické zázemí</span></div>
          </div>
        </div>
        <div className="about-story__visual relative">
          <div className="about-story__photo-wrap">
            <img src={MEDIA.craft} alt="Výroba a instalace nerezového mlžítka" loading="lazy" decoding="async" className="about-story__main-photo" />
          </div>
          <div className="about-story__detail-photo">
            <img src={MEDIA.detail} alt="Detail opracování nerezového povrchu" loading="lazy" decoding="async" />
          </div>
          <div className="about-story__floating-label"><span>OD NÁVRHU</span><strong>K REÁLNÉMU VÝROBKU</strong><ScanLine size={22} aria-hidden="true" /></div>
        </div>
      </section>

      <section className="about-principles bg-[#F2F7F9] py-24 lg:py-32" aria-labelledby="about-principles-heading">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <div className="grid gap-6 lg:grid-cols-[1fr_.7fr] lg:items-end">
            <div><Eyebrow index="02">CO JE V NAŠEM DNA</Eyebrow><h2 id="about-principles-heading" className="about-heading mt-5">Krása, která<br /><em>musí fungovat.</em></h2></div>
            <p className="max-w-md text-base leading-8 text-slate-600 lg:justify-self-end">Veřejný prostor si žádá víc než hezký objekt. Mlžítko musí přirozeně zapadnout, obstát v provozu a být technicky smysluplné.</p>
          </div>
          <div className="about-pillars mt-14 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {PILLARS.map((item) => (
              <article className="about-pillar group" key={item.number}>
                <div className="flex items-start justify-between"><span className="about-pillar__number">{item.number} / 04</span><item.icon size={27} strokeWidth={1.5} className="text-[#1379c4]" aria-hidden="true" /></div>
                <h3 className="mt-16 font-heading text-2xl font-semibold leading-snug tracking-[-.03em] text-[#10213D]">{item.title}</h3>
                <p className="mt-5 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-material relative overflow-hidden bg-[#10213D] text-white" aria-labelledby="about-material-heading">
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 82% 35%, #2A91CA 0%, transparent 55%)' }} aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1440px] gap-14 px-6 py-24 sm:px-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-24 lg:px-16 lg:py-32">
          <div className="about-material__media relative">
            <img src={MEDIA.stamped} alt="Značení na nerezovém výrobku MLŽIDLA" loading="lazy" decoding="async" className="aspect-[5/4] w-full object-cover" />
            <div className="absolute -bottom-5 -right-3 w-[43%] overflow-hidden border-[7px] border-[#10213D] sm:-right-7">
              <img src={MEDIA.laser} alt="Detail laserového označení nerezového dílu" loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
            </div>
            <span className="about-material__corner" aria-hidden="true">M / H</span>
          </div>
          <div>
            <Eyebrow light index="03">MATERIÁL A TECHNOLOGIE</Eyebrow>
            <h2 id="about-material-heading" className="about-heading about-heading--light mt-5">Nerez není<br /><em>jen povrch.</em></h2>
            <p className="mt-8 max-w-[55ch] text-base leading-[1.9] text-white/78">Je to možnost vytvořit čistou, pevnou a dlouhodobě udržovatelnou konstrukci. Ohýbání, svařování, povrchové dokončení i napojení technologií řešíme jako jeden celek.</p>
            <div className="mt-9 grid gap-px border-y border-white/15 sm:grid-cols-3">
              {[['01', 'Tvarování'], ['02', 'Dokončení'], ['03', 'Instalace']].map(([n, title]) => (
                <div className="border-white/15 py-5 sm:border-r sm:pr-5 sm:last:border-r-0 sm:not-first:pl-5" key={n}><span className="block font-mono text-xs text-[#83D6F0]">{n}</span><strong className="mt-2 block font-heading text-lg">{title}</strong></div>
              ))}
            </div>
            <a href="https://holmtec.cz" target="_blank" rel="noopener noreferrer" className="about-text-link mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[#9DE2F5] hover:text-white">
              Poznat výrobní zázemí HolmTec <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="about-process mx-auto max-w-[1440px] px-6 py-24 sm:px-10 lg:px-16 lg:py-32" aria-labelledby="about-process-heading">
        <div className="grid gap-7 lg:grid-cols-[1.05fr_.7fr] lg:items-end">
          <div><Eyebrow index="04">JAK SPOLUPRACUJEME</Eyebrow><h2 id="about-process-heading" className="about-heading mt-5">Od první skici<br /><em>do veřejného prostoru.</em></h2></div>
          <p className="max-w-md leading-8 text-slate-600 lg:justify-self-end">Jedna návazná cesta od zadání až ke spuštění. U každého projektu přizpůsobujeme rozsah spolupráce reálným podmínkám místa.</p>
        </div>
        <ol className="about-timeline mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PROCESS.map((item) => (
            <li key={item.number} className="about-timeline__step">
              <span className="about-timeline__number">{item.number}</span>
              <div className="about-timeline__rule" aria-hidden="true" />
              <h3 className="mt-7 font-heading text-xl font-semibold">{item.title}</h3>
              <p className="mt-4 max-w-xs text-sm leading-7 text-slate-600">{item.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-wrap gap-3">
          <Action to="/katalog-mlzitek" variant="navy">Prohlédnout produkty</Action>
          <Action to="/servis-udrzba" variant="subtle">Servis a údržba</Action>
        </div>
      </section>

      <section className="about-bridge relative overflow-hidden bg-[#E8F7FC] py-20 lg:py-28" aria-labelledby="about-bridge-heading">
        <div className="about-bridge__orb" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1440px] gap-10 px-6 sm:px-10 lg:grid-cols-[1fr_.8fr] lg:items-center lg:px-16">
          <div>
            <Eyebrow index="05">DVA SVĚTY. JEDEN ZÁMĚR.</Eyebrow>
            <h2 id="about-bridge-heading" className="about-heading mt-5"><span>HolmTec</span><span className="about-bridge__cross"> × </span><span>MLŽIDLA.cz</span></h2>
            <p className="mt-7 max-w-xl text-base leading-8 text-slate-700">HolmTec přináší znalost materiálu a výroby. MLŽIDLA tuto zkušenost mění v objekty pro města, školy, parky, architekty i soukromé zahrady. Dva pohledy, které se ve výsledku doplňují.</p>
          </div>
          <div className="about-bridge__panel">
            <span className="mb-6 inline-block font-mono text-xs uppercase tracking-[.2em] text-[#3A7B9E]">ZNAČKA A REALIZACE</span>
            <div className="space-y-5">
              <div className="flex items-center gap-4"><Layers3 size={27} className="text-[#1175B3]" aria-hidden="true" /><div><strong className="block">MLŽIDLA.cz</strong><span className="text-sm text-slate-600">Designové mlžné sochy a ochlazování prostoru</span></div></div>
              <div className="h-px bg-[#C6DFEB]" aria-hidden="true" />
              <div className="flex items-center gap-4"><Wrench size={27} className="text-[#1175B3]" aria-hidden="true" /><div><strong className="block">HolmTec</strong><span className="text-sm text-slate-600">Technické zázemí, přesné ohýbání a výroba</span></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-contact mx-auto grid max-w-[1440px] gap-12 px-6 py-24 sm:px-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-20 lg:px-16 lg:py-28" aria-labelledby="about-contact-heading">
        <div>
          <Eyebrow index="06">KDE NÁS NAJDETE</Eyebrow>
          <h2 id="about-contact-heading" className="about-heading mt-5">Za každým návrhem<br /><em>je konkrétní dílna.</em></h2>
          <p className="mt-6 max-w-md leading-8 text-slate-600">Naše výrobní zázemí najdete v Trutnově. Rádi s vámi probereme řešení pro konkrétní místo, od jednoho mlžítka po sestavu prvků.</p>
          <div className="mt-9"><Action to="/kontakt" variant="navy">Spojit se s námi</Action></div>
        </div>
        <div className="about-contact__panel">
          <div className="flex items-center gap-3"><span className="about-contact__mark">H</span><div><span className="block font-mono text-xs uppercase tracking-widest text-[#4C7895]">Provozovatel a výrobce</span><strong className="font-heading text-2xl font-semibold">{COMPANY.name}</strong></div></div>
          <div className="mt-9 grid gap-5 text-sm text-slate-700 sm:grid-cols-2">
            <div className="flex items-start gap-3"><MapPin size={19} className="mt-0.5 shrink-0 text-[#147FB9]" aria-hidden="true" /><span>{COMPANY.address}</span></div>
            <div className="flex items-start gap-3"><Mail size={19} className="mt-0.5 shrink-0 text-[#147FB9]" aria-hidden="true" /><a href="mailto:obchod1@holmtec.cz" className="break-all underline-offset-4 hover:underline">{COMPANY.email}</a></div>
            <div className="flex items-start gap-3"><Phone size={19} className="mt-0.5 shrink-0 text-[#147FB9]" aria-hidden="true" /><a href="tel:+420774700390" className="hover:underline">{COMPANY.phone}</a></div>
            <div className="flex items-start gap-3"><ShieldCheck size={19} className="mt-0.5 shrink-0 text-[#147FB9]" aria-hidden="true" /><span>IČO {COMPANY.ico}<br />DIČ {COMPANY.dic}</span></div>
          </div>
          <div className="mt-9 border-t border-[#D6E8EE] pt-5 text-xs leading-6 text-slate-500">Webová prezentace a digitální design: Jakub Duch. Produktové řešení a výrobní zázemí: HolmTec s.r.o.</div>
        </div>
      </section>

      <section className="about-final-cta relative isolate overflow-hidden bg-[#0D2F4F] py-24 text-white lg:py-32" aria-labelledby="about-cta-heading">
        <div className="about-final-cta__glow" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-[1440px] flex-col items-start gap-10 px-6 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-16">
          <div><Eyebrow light>PŘÍŠTÍ PROJEKT</Eyebrow><h2 id="about-cta-heading" className="mt-5 max-w-3xl font-heading text-4xl font-bold leading-[1.07] tracking-[-.045em] sm:text-5xl lg:text-6xl">Místo, které dává<br /><span className="text-[#9DE2F5]">prostor osvěžení.</span></h2><p className="mt-6 max-w-xl text-base leading-8 text-white/80">Pošlete nám představu prostoru. Pomůžeme najít tvar i technické řešení, které do něj bude patřit.</p></div>
          <Action to="/poptavka">Poptat vlastní řešení</Action>
        </div>
      </section>
    </main>
  );
}
