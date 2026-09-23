import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  Droplets,
  Flower2,
  Gauge,
  ShieldCheck,
  Sparkles,
  ThermometerSun,
  Timer,
  Wifi,
  Wrench,
  Waves,
} from 'lucide-react';

const categoryCards = [
  {
    number: '01',
    title: 'LINEA® — sloupové mlžítko',
    subtitle: 'Čistá vertikální linie',
    description:
      'Samostatné nerezové sloupové mlžítko pro promenády, terasy a městský prostor. Zobrazený produkt vychází z ověřené MASTER reference.',
    image:
      'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/6af16b6a9_linea---rezidencni-mlzeni.jpg',
    href: '/produkt/linea-mlzitko',
    icon: Droplets,
  },
  {
    number: '02',
    title: 'Mlžné brány',
    subtitle: 'Průchozí vodní mlha',
    description:
      'Architektonické průchozí prvky pro náměstí, parky, sportoviště a pobytové zóny. Geometrie brány se v animaci nemění.',
    image:
      'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/7687747c7_MlznabranaGATE70V.png',
    href: '/mlzne-brany',
    icon: Building2,
  },
  {
    number: '03',
    title: 'Ateliérové prvky',
    subtitle: 'TEEPEE · Květ · objekty na míru',
    description:
      'Výrazné nerezové objekty, které propojují funkci mlžení s architekturou veřejného prostoru. Každý tvar vychází z konkrétní produktové reference.',
    image:
      'https://base44.app/api/apps/6a96b2f0a9a77bed890bf313/files/mp/public/6a96b2f0a9a77bed890bf313/ebbd577b1_07_teepee_brno_portrait.jpg',
    href: '/zakazkova-mlzitka',
    icon: Flower2,
  },
];

const spaceCards = [
  { title: 'Náměstí', text: 'Pobytové zóny, městské akce a místa setkávání.', icon: Building2 },
  { title: 'Parky', text: 'Jemné osvěžení u cest, laviček a klidových ploch.', icon: Sparkles },
  { title: 'Hřiště a školy', text: 'Hravé prvky pro příjemnější letní pobyt venku.', icon: Flower2 },
  { title: 'Promenády', text: 'Rytmus mlžicích bodů podél pěších tras.', icon: Waves },
];

const smartSteps = [
  { title: 'Teplota a čas', text: 'Provozní scénář se řídí nastavenými podmínkami.', icon: ThermometerSun },
  { title: 'Smart ventil / SUPLA', text: 'Řízení přívodu vody a jednotlivých zón.', icon: Wifi },
  { title: 'Automatické spuštění', text: 'Spuštění podle ověřené konfigurace projektu.', icon: Timer },
  { title: 'Přehled provozu', text: 'Dostupná provozní data podle osazených prvků.', icon: Gauge },
];

const cardVariants = {
  hidden: { opacity: 0, y: 34 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: .72, delay: index * .09, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ProductCategoryShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="mlzCategoryShowcase" id="produkty-kategorie" data-home-reveal>
      <style>{`
        .mlzCategoryShowcase {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 16% 3%, rgba(107,184,214,.17), transparent 27%),
            radial-gradient(circle at 86% 24%, rgba(207,243,255,.09), transparent 24%),
            linear-gradient(180deg, #07131d 0%, #081827 50%, #06111b 100%);
          padding: clamp(76px, 9vw, 138px) clamp(20px, 5vw, 72px);
          color: #fff;
        }
        .mlzCategoryShowcase::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .28;
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: linear-gradient(to bottom, black, transparent 62%);
        }
        .mlzCategoryShowcase::after {
          content: '';
          position: absolute;
          left: -15%;
          right: -15%;
          top: 25%;
          height: 360px;
          pointer-events: none;
          background: radial-gradient(ellipse at center, rgba(207,243,255,.10), transparent 66%);
          filter: blur(46px);
          animation: mlzCategoryMist 14s ease-in-out infinite;
        }
        @keyframes mlzCategoryMist {
          0%,100% { transform: translate3d(-4%, 0, 0) scale(1); opacity: .44; }
          50% { transform: translate3d(6%, -4%, 0) scale(1.12); opacity: .78; }
        }
        .mlzCatInner { position: relative; z-index: 1; max-width: 1500px; margin: 0 auto; }
        .mlzCatKicker { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: #9ED9F0; font-size: 10px; letter-spacing: .27em; text-transform: uppercase; font-weight: 800; text-align: center; }
        .mlzCatTitle { margin: 15px auto 0; max-width: 1040px; text-align: center; font-size: clamp(44px, 6.3vw, 88px); line-height: .91; letter-spacing: -.065em; font-weight: 800; color: #f8fbfc; }
        .mlzCatTitle span { color: #9ED9F0; }
        .mlzCatLead { max-width: 790px; margin: 24px auto 0; text-align: center; font-size: clamp(16px, 1.55vw, 21px); line-height: 1.62; color: rgba(235,245,249,.7); }
        .mlzCatGrid { margin-top: 48px; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 18px; }
        .mlzCatCard { position: relative; min-height: 610px; overflow: hidden; border: 1px solid rgba(158,217,240,.22); background: #0b1c2b; text-decoration: none; color: #fff; box-shadow: 0 34px 90px rgba(0,0,0,.22); isolation: isolate; }
        .mlzCatImage { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .95s cubic-bezier(.2,.8,.2,1), filter .95s; filter: saturate(.92) contrast(1.04); }
        .mlzCatCard:hover .mlzCatImage { transform: scale(1.045); filter: saturate(1.04) contrast(1.06); }
        .mlzCatShade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(4,12,18,.12) 0%, rgba(4,12,18,.15) 34%, rgba(4,12,18,.94) 78%, rgba(4,12,18,.98) 100%); }
        .mlzCatGlow { position: absolute; inset: 20% -20% auto; height: 180px; background: radial-gradient(ellipse, rgba(207,243,255,.22), transparent 65%); filter: blur(26px); opacity: 0; transition: opacity .7s; }
        .mlzCatCard:hover .mlzCatGlow { opacity: 1; }
        .mlzCatNumber { position: absolute; left: 24px; top: 22px; z-index: 2; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; letter-spacing: .22em; color: rgba(255,255,255,.8); }
        .mlzCatArrow { position: absolute; right: 20px; top: 18px; z-index: 3; display: grid; place-items: center; width: 48px; height: 48px; border: 1px solid rgba(158,217,240,.42); border-radius: 999px; background: rgba(7,19,29,.42); backdrop-filter: blur(12px); transition: transform .35s, background .35s; }
        .mlzCatCard:hover .mlzCatArrow { transform: translate(2px,-2px); background: rgba(107,184,214,.24); }
        .mlzCatContent { position: absolute; z-index: 3; inset: auto 0 0; padding: 28px; }
        .mlzCatIcon { display: grid; place-items: center; width: 48px; height: 48px; margin-bottom: 18px; border: 1px solid rgba(158,217,240,.28); background: rgba(7,19,29,.58); color: #9ED9F0; backdrop-filter: blur(12px); }
        .mlzCatContent small { display: block; margin-bottom: 9px; color: #9ED9F0; font-size: 10px; font-weight: 800; letter-spacing: .17em; text-transform: uppercase; }
        .mlzCatContent h3 { margin: 0; font-size: clamp(25px, 2.35vw, 36px); line-height: 1; letter-spacing: -.045em; font-weight: 800; }
        .mlzCatContent p { margin: 15px 0 20px; color: rgba(235,245,249,.70); line-height: 1.58; font-size: 14px; }
        .mlzCardCta { display: inline-flex; align-items: center; gap: 10px; color: #fff; font-size: 13px; font-weight: 800; }
        .mlzSpaceGrid { margin-top: 18px; display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 12px; }
        .mlzSpaceCard { min-height: 142px; border: 1px solid rgba(158,217,240,.13); background: rgba(255,255,255,.035); padding: 20px; backdrop-filter: blur(14px); }
        .mlzSpaceCard svg { color: #9ED9F0; margin-bottom: 14px; }
        .mlzSpaceCard h4 { margin: 0 0 7px; font-size: 17px; letter-spacing: -.025em; color: #f8fbfc; }
        .mlzSpaceCard p { margin: 0; color: rgba(235,245,249,.60); line-height: 1.5; font-size: 13px; }
        .mlzSmartPanel { margin-top: 76px; overflow: hidden; border: 1px solid rgba(158,217,240,.18); background: radial-gradient(circle at 75% 20%, rgba(107,184,214,.21), transparent 28%), linear-gradient(135deg, rgba(13,38,57,.96), rgba(5,15,24,.98)); box-shadow: 0 34px 110px rgba(0,0,0,.24); }
        .mlzSmartInner { display: grid; grid-template-columns: .88fr 1.12fr; gap: 36px; padding: clamp(30px,5vw,62px); align-items: center; }
        .mlzSmartInner h3 { margin: 0; font-size: clamp(35px,4.8vw,66px); line-height: .94; letter-spacing: -.06em; }
        .mlzSmartInner h3 span { color: #9ED9F0; }
        .mlzSmartInner p { max-width: 620px; color: rgba(235,245,249,.67); line-height: 1.68; font-size: 16px; }
        .mlzSmartSteps { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
        .mlzSmartStep { min-height: 158px; border: 1px solid rgba(255,255,255,.11); background: rgba(255,255,255,.045); padding: 20px; backdrop-filter: blur(18px); }
        .mlzSmartStep svg { color: #9ED9F0; margin-bottom: 18px; }
        .mlzSmartStep strong { display: block; margin-bottom: 6px; color: #fff; }
        .mlzSmartStep span { display: block; color: rgba(235,245,249,.58); font-size: 13px; line-height: 1.5; }
        .mlzAnchorPanel { margin-top: 18px; display: grid; grid-template-columns: .95fr 1.05fr; overflow: hidden; border: 1px solid rgba(158,217,240,.15); background: rgba(255,255,255,.03); }
        .mlzAnchorCopy { padding: clamp(30px,5vw,58px); }
        .mlzAnchorCopy h3 { margin: 0; font-size: clamp(34px,4vw,58px); line-height: .96; letter-spacing: -.055em; }
        .mlzAnchorCopy h3 span { color: #9ED9F0; }
        .mlzAnchorCopy p { color: rgba(235,245,249,.64); line-height: 1.68; }
        .mlzAnchorList { display: grid; gap: 12px; margin-top: 24px; }
        .mlzAnchorList div { display: flex; gap: 11px; align-items: flex-start; color: rgba(245,250,252,.84); font-size: 14px; font-weight: 650; }
        .mlzAnchorVisual { position: relative; min-height: 440px; overflow: hidden; background: radial-gradient(circle at 50% 45%, rgba(158,217,240,.13), transparent 35%), linear-gradient(150deg,#0d2232,#07131d); display: grid; place-items: center; }
        .mlzAnchorVisual::before { content: ''; position: absolute; width: 54px; height: 72%; border-radius: 27px 27px 10px 10px; background: linear-gradient(90deg,#707b82,#eef4f6 45%,#9ea8ad 72%,#5f6970); box-shadow: 0 14px 54px rgba(0,0,0,.35); }
        .mlzAnchorVisual::after { content: ''; position: absolute; left: 18%; right: 18%; bottom: 20%; height: 2px; background: linear-gradient(90deg,transparent,#9ED9F0,transparent); box-shadow: 0 0 34px rgba(158,217,240,.45); }
        .mlzAnchorLabel { position: absolute; z-index: 2; bottom: 9%; left: 50%; transform: translateX(-50%); width: min(80%,420px); border: 1px solid rgba(158,217,240,.17); background: rgba(6,17,27,.78); padding: 13px 16px; text-align: center; color: rgba(245,250,252,.78); font-size: 12px; font-weight: 750; backdrop-filter: blur(14px); }
        @media (max-width: 1000px) {
          .mlzCatGrid, .mlzSpaceGrid, .mlzSmartInner, .mlzAnchorPanel { grid-template-columns: 1fr; }
          .mlzCatCard { min-height: 540px; }
          .mlzSmartSteps { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 620px) {
          .mlzSmartSteps { grid-template-columns: 1fr; }
          .mlzCatCard { min-height: 500px; }
          .mlzCatContent { padding: 22px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mlzCategoryShowcase::after { animation: none; }
          .mlzCatImage, .mlzCatArrow, .mlzCatGlow { transition: none; }
        }
      `}</style>

      <div className="mlzCatInner">
        <p className="mlzCatKicker">Architektonická řada · skutečné produktové reference</p>
        <h2 className="mlzCatTitle">Kategorie <span>mlžítek</span></h2>
        <p className="mlzCatLead">
          Tři jasné produktové směry pro veřejný i soukromý prostor. Animace pracuje s atmosférou,
          ne s geometrií výrobku — tvar, proporce a trysky zůstávají podle ověřené reference.
        </p>

        <div className="mlzCatGrid">
          {categoryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                custom={index}
                variants={reduceMotion ? undefined : cardVariants}
                initial={reduceMotion ? false : 'hidden'}
                whileInView={reduceMotion ? undefined : 'visible'}
                viewport={{ once: true, margin: '-70px' }}
                whileHover={reduceMotion ? undefined : { y: -7 }}
                transition={{ duration: .35 }}
              >
                <Link to={card.href} className="mlzCatCard group block">
                  <img className="mlzCatImage" src={card.image} alt={card.title} loading="lazy" decoding="async" />
                  <div className="mlzCatShade" />
                  <div className="mlzCatGlow" />
                  <span className="mlzCatNumber">{card.number}</span>
                  <span className="mlzCatArrow" aria-hidden="true"><ArrowRight size={18} /></span>
                  <div className="mlzCatContent">
                    <div className="mlzCatIcon"><Icon size={23} /></div>
                    <small>{card.subtitle}</small>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <span className="mlzCardCta">Prohlédnout řešení <ArrowRight size={16} /></span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mlzSpaceGrid">
          {spaceCards.map((space) => {
            const Icon = space.icon;
            return (
              <article className="mlzSpaceCard" key={space.title}>
                <Icon size={24} strokeWidth={1.6} />
                <h4>{space.title}</h4>
                <p>{space.text}</p>
              </article>
            );
          })}
        </div>

        <div className="mlzSmartPanel">
          <div className="mlzSmartInner">
            <div>
              <p className="mlzCatKicker" style={{ textAlign: 'left' }}>Smart řízení · SUPLA</p>
              <h3>Provoz, který se řídí <span>podle projektu.</span></h3>
              <p>
                Řízení přívodu vody, provozních časů a zón skládáme podle konkrétní instalace.
                Na webu zobrazujeme jen funkce, které jsou pro danou sestavu skutečně použité nebo ověřené.
              </p>
              <Link to="/smart-ovladani" className="mt-7 inline-flex min-h-12 items-center gap-2 border border-[#9ED9F0]/30 bg-[#9ED9F0]/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-[#9ED9F0]/16">
                Chytré ovládání <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mlzSmartSteps">
              {smartSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div className="mlzSmartStep" key={step.title}>
                    <Icon size={25} strokeWidth={1.6} />
                    <strong>{step.title}</strong>
                    <span>{step.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mlzAnchorPanel">
          <div className="mlzAnchorCopy">
            <p className="mlzCatKicker" style={{ textAlign: 'left' }}>Instalace a detail</p>
            <h3>Technika ustoupí. <span>Produkt zůstane.</span></h3>
            <p>
              U trvalých instalací vedeme technické prvky co nejčistěji a návaznost na povrch řešíme podle konkrétního projektu.
              Vizualizace kotvení je informační — rozměry a konstrukční detaily se doplňují pouze z ověřené dokumentace.
            </p>
            <div className="mlzAnchorList">
              <div><ShieldCheck size={19} /> Produktová geometrie se v generovaných scénách nemění.</div>
              <div><Wrench size={19} /> Způsob kotvení a napojení se vybírá podle místa instalace.</div>
              <div><Sparkles size={19} /> Pohyb na webu tvoří světlo, mlha, kamera a UI vrstvy.</div>
            </div>
          </div>
          <div className="mlzAnchorVisual" aria-label="Ilustrační schéma čistého napojení mlžítka">
            <div className="mlzAnchorLabel">Ilustrační princip · konkrétní kotvení se ověřuje podle projektu</div>
          </div>
        </div>
      </div>
    </section>
  );
}
