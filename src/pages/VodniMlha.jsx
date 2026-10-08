import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Gauge, Wind, ThermometerSun, Wrench, Wifi, Sparkles } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const HERO_VIDEO = '/media/optimized/eb7e87313_mlzidla-mlzitkaproparkyamesta03.webm';
const HERO_POSTER = '/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp';

const BENEFITS = [
  { icon: ThermometerSun, title: 'Lokální ochlazení', text: 'Jemné kapky se ve vzduchu částečně odpařují a odebírají okolnímu prostředí teplo. Výsledný efekt závisí na teplotě, vlhkosti a proudění vzduchu.' },
  { icon: Gauge, title: 'Nízkotlaké řešení', text: 'Vybraná mlžítka MLŽIDLA.cz pracují s běžným vodovodním tlakem. Není nutné automaticky navrhovat vysokotlaké čerpadlo pro každou instalaci.' },
  { icon: Wifi, title: 'Smart provoz', text: 'Časové plány, teplotní podmínky, vzdálené sepnutí a další scénáře pomáhají spouštět mlžení pouze ve chvíli, kdy dává smysl.' },
  { icon: Wrench, title: 'Servisovatelnost', text: 'Filtrace, přístup k armaturám, proplach a zazimování řešíme už při návrhu, aby byl dlouhodobý provoz předvídatelný.' },
];

function MistPrincipleGraphic() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-cyan-100/70 bg-gradient-to-br from-[#F5FBFC] via-white to-[#EAF7F8] p-4 shadow-[0_24px_70px_rgba(8,63,80,.10)] sm:p-7">
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-[#176b7b]">
        <Sparkles size={15} aria-hidden="true" /> Princip vodní mlhy
      </div>
      <svg viewBox="0 0 760 420" role="img" aria-labelledby="mist-graphic-title mist-graphic-desc" className="h-auto w-full">
        <title id="mist-graphic-title">Schéma vzniku vodní mlhy</title>
        <desc id="mist-graphic-desc">Voda proudí do nerezové trysky, která ji rozpráší na jemné kapky. Část kapek se odpaří a odebírá teplo okolnímu vzduchu.</desc>
        <defs>
          <linearGradient id="steel" x1="0" x2="1">
            <stop offset="0" stopColor="#9aaeb6" />
            <stop offset=".45" stopColor="#f4f8f9" />
            <stop offset=".7" stopColor="#b6c6cc" />
            <stop offset="1" stopColor="#7f959e" />
          </linearGradient>
          <linearGradient id="water" x1="0" x2="1">
            <stop offset="0" stopColor="#0f7f96" />
            <stop offset="1" stopColor="#7de4ef" />
          </linearGradient>
          <filter id="mistBlur">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        <path d="M40 210 H255" stroke="url(#water)" strokeWidth="24" strokeLinecap="round" />
        <path d="M255 174 H345 L378 210 L345 246 H255 Z" fill="url(#steel)" stroke="#748b95" strokeWidth="3" />
        <circle cx="372" cy="210" r="9" fill="#0f7f96" />
        <path d="M387 210 C455 178 514 152 690 126" stroke="#7ad9e4" strokeWidth="2" strokeDasharray="6 9" fill="none" opacity=".7" />
        <path d="M387 210 C470 210 560 210 708 210" stroke="#7ad9e4" strokeWidth="2" strokeDasharray="6 9" fill="none" opacity=".7" />
        <path d="M387 210 C455 242 514 268 690 294" stroke="#7ad9e4" strokeWidth="2" strokeDasharray="6 9" fill="none" opacity=".7" />

        <g className="motion-reduce:hidden">
          {[
            [410,188,5,0],[430,225,4,.25],[455,167,4,.5],[475,235,6,.75],[505,196,4,1],[530,255,5,1.25],
            [555,148,5,1.5],[585,218,4,1.75],[615,177,6,2],[650,248,4,2.25],[683,201,5,2.5]
          ].map(([cx, cy, r, begin], index) => (
            <circle key={index} cx={cx} cy={cy} r={r} fill="#8ae9f2" opacity=".78">
              <animate attributeName="cx" values={`${cx};${cx + 34};${cx + 62}`} dur="2.8s" begin={`${begin}s`} repeatCount="indefinite" />
              <animate attributeName="cy" values={`${cy};${cy - 7};${cy + 5}`} dur="2.8s" begin={`${begin}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values=".85;.45;0" dur="2.8s" begin={`${begin}s`} repeatCount="indefinite" />
            </circle>
          ))}
          <ellipse cx="565" cy="210" rx="130" ry="88" fill="#9beaf2" opacity=".12" filter="url(#mistBlur)">
            <animate attributeName="rx" values="105;145;125" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values=".08;.18;.08" dur="4s" repeatCount="indefinite" />
          </ellipse>
        </g>

        <g fontFamily="Inter, sans-serif" fontSize="18" fill="#143d4e">
          <text x="44" y="172" fontWeight="700">Voda</text>
          <text x="270" y="300" fontWeight="700">Mlžicí tryska</text>
          <text x="514" y="90" fontWeight="700">Jemné kapky</text>
          <text x="540" y="348" fontSize="15" fill="#56727e">odpařování → odběr tepla</text>
        </g>
      </svg>
      <div className="mt-2 grid gap-2 text-sm text-[#526C79] sm:grid-cols-3">
        <span className="rounded-2xl bg-white px-4 py-3">1. stabilní přívod vody</span>
        <span className="rounded-2xl bg-white px-4 py-3">2. rozprášení v trysce</span>
        <span className="rounded-2xl bg-white px-4 py-3">3. jemná mlha v prostoru</span>
      </div>
    </div>
  );
}

export default function VodniMlha() {
  useEffect(() => {
    setSEO({
      title: 'Vodní mlha: princip, použití a ochlazení | MLŽIDLA.cz',
      description: 'Jak funguje vodní mlha, kde ji použít a co ovlivňuje účinek. Princip trysek, nízkotlaké mlžení, Smart řízení a návrh pro zahrady i města.',
      keywords: 'vodní mlha, vodní mlha na zahradu, vodní mlha na terasu, mlha na zahradu, zahradní mlha, vodní mlha na pergolu, trysky na vodní mlhu, nízkotlaké mlžení',
      canonicalPath: '/vodni-mlha',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'TechArticle',
            headline: 'Vodní mlha pro ochlazení venkovního prostoru',
            description: 'Praktické vysvětlení vodní mlhy, nízkotlakého mlžení, trysek a použití na zahradách, terasách a ve veřejném prostoru.',
            author: { '@type': 'Organization', name: 'HolmTec' },
            publisher: { '@type': 'Organization', name: 'HolmTec' },
            mainEntityOfPage: 'https://mlzidla.cz/vodni-mlha'
          },
          {
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'Co je vodní mlha?', acceptedAnswer: { '@type': 'Answer', text: 'Vodní mlha vzniká rozprášením vody přes jemné trysky na malé kapky. Část kapek se ve vzduchu odpaří a pomáhá snižovat tepelnou zátěž v okolí mlžicí zóny.' } },
              { '@type': 'Question', name: 'Je pro vodní mlhu vždy nutné vysokotlaké čerpadlo?', acceptedAnswer: { '@type': 'Answer', text: 'Ne. Pro řadu zahradních a veřejných aplikací lze navrhnout nízkotlaké mlžení napojené na běžný vodovodní řad. Konkrétní řešení závisí na požadované jemnosti mlhy, tlaku a průtoku.' } },
              { '@type': 'Question', name: 'Kam se vodní mlha hodí?', acceptedAnswer: { '@type': 'Answer', text: 'Vodní mlha se používá na zahradách, terasách, pergolách, v parcích, na náměstích, sportovištích, dětských hřištích a dalších venkovních místech s tepelnou zátěží.' } }
            ]
          }
        ]
      },
    });
  }, []);

  return (
    <main className="bg-white pt-[68px]">
      <section className="relative isolate min-h-[76svh] overflow-hidden bg-[#071d2b] text-white sm:min-h-[680px]">
        <img src={HERO_POSTER} alt="" aria-hidden="true" className="absolute inset-0 -z-30 h-full w-full object-cover object-center" />
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[58%_center] motion-reduce:hidden sm:object-center"
          src={HERO_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={HERO_POSTER}
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,24,36,.94)_0%,rgba(4,24,36,.82)_45%,rgba(4,24,36,.38)_100%)] sm:bg-[linear-gradient(90deg,rgba(4,24,36,.95)_0%,rgba(4,24,36,.72)_52%,rgba(4,24,36,.22)_100%)]" />
        <div className="mx-auto flex min-h-[76svh] max-w-7xl items-end px-5 pb-12 pt-20 sm:min-h-[680px] sm:items-center sm:px-6 sm:py-20 lg:px-10">
          <div className="max-w-4xl">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-cyan-200 sm:text-xs sm:tracking-[.2em]">JAK FUNGUJÍ · TECHNOLOGIE · VODNÍ MLHA</p>
            <h1 className="mt-4 max-w-4xl font-heading text-[clamp(2.5rem,11vw,5.4rem)] font-semibold leading-[.94] tracking-[-.04em] text-white">
              Vodní mlha.<br />Princip, který je vidět i cítit.
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/78 sm:mt-7 sm:text-lg sm:leading-8">
              Jemné kapky vody se rozptýlí do vzduchu a část z nich se odpaří. Správný návrh trysek, tlaku, proudění a řízení určuje, jak příjemně bude mlžicí zóna fungovat.
            </p>
            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
              <a href="#princip" className="btn-metallic-mist inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold">Jak mlha vzniká <ArrowRight size={16} /></a>
              <Link to="/mlzidla-mlzitka" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm">Vybrat mlžítko <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>

      <section id="princip" className="mx-auto grid max-w-7xl scroll-mt-24 gap-10 px-5 py-14 sm:px-6 sm:py-16 lg:grid-cols-[.82fr_1.18fr] lg:items-center lg:px-10 lg:py-24">
        <div>
          <p className="font-mono text-xs uppercase tracking-[.18em] text-secondary">JAK TO FUNGUJE</p>
          <h2 className="mt-4 font-heading text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">Z vody vzniknou jemné kapky. Odpařování odebírá teplo okolnímu vzduchu.</h2>
          <div className="mt-6 space-y-4 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            <p>Tryska rozdělí proud vody na malé kapky. Čím vhodnější je kombinace tlaku, otvoru trysky a proudění vzduchu, tím jemnější a účinnější může být výsledná mlha.</p>
            <p>Pro praktický návrh proto nestačí jen počet trysek. Sledujeme tlak vody, průtok, vzdálenost lidí od mlžení, vítr, vlhkost, požadovanou intenzitu a způsob spouštění.</p>
          </div>
          <Link to="/jak-to-funguje" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-primary">Detail technologie a evaporace <ArrowRight size={16} /></Link>
        </div>
        <MistPrincipleGraphic />
      </section>

      <section className="border-y border-border bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-24">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-[1.6rem] border border-border bg-white p-6 shadow-[0_12px_35px_rgba(15,53,71,.04)] sm:p-7">
                <Icon size={23} className="text-secondary" strokeWidth={1.6} />
                <h3 className="mt-6 font-heading text-2xl text-foreground sm:mt-8">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground sm:leading-relaxed">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="border-t border-border pt-7">
            <div className="flex items-center gap-3"><Droplets className="text-secondary" size={22} /><p className="font-mono text-[10px] uppercase tracking-[.14em] text-secondary sm:text-xs sm:tracking-[.18em]">ZAHRADA · TERASA · PERGOLA</p></div>
            <h2 className="mt-5 font-heading text-3xl text-foreground lg:text-4xl">Vodní mlha na zahradu bez vizuálního kompromisu.</h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground">Místo hadic zavěšených pod pergolou lze použít samostatný nerezový designový prvek. Mlžítko se stává součástí prostoru a lze ho doplnit o sezonní připojení, chytrý ventil nebo zemní kotvení podle modelu.</p>
            <Link to="/zahradni-mlzitka" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-primary">Zahradní mlžítka <ArrowRight size={16} /></Link>
          </div>
          <div className="border-t border-border pt-7">
            <div className="flex items-center gap-3"><Wind className="text-secondary" size={22} /><p className="font-mono text-[10px] uppercase tracking-[.14em] text-secondary sm:text-xs sm:tracking-[.18em]">MĚSTA · PARKY · SPORTOVIŠTĚ</p></div>
            <h2 className="mt-5 font-heading text-3xl text-foreground lg:text-4xl">Řízené ochlazovací body pro veřejný prostor.</h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground">Ve veřejném prostoru řešíme odolnost, vandalismus, přístup k servisu, provozní režim a spotřebu vody. Více prvků lze rozdělit do samostatných zón a řídit podle času, teploty nebo provozního harmonogramu.</p>
            <Link to="/mestske-mlzitka" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-primary">Městská mlžítka <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="bg-[#12415e] text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-14 sm:px-6 sm:py-16 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.18em] text-accent">NÁVRH SYSTÉMU</p>
            <h2 className="mt-4 max-w-3xl font-heading text-3xl leading-tight sm:text-4xl">Chcete vodní mlhu pro konkrétní prostor? Navrhneme počet prvků, napojení i řízení.</h2>
          </div>
          <Link to="/poptavka" className="btn-metallic-mist inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">Nezávazná konzultace <ArrowRight size={16} /></Link>
        </div>
      </section>
    </main>
  );
}
