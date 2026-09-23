import React from 'react';
import { Link } from 'react-router-dom';
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
    title: 'Sloupková mlžítka',
    subtitle: 'Rovná a designová',
    description:
      'Elegantní vertikální totemy vhodné do parků, k chodníkům a k lavičkám. Subtilní nerezová trubka s důrazem na čistý městský detail.',
    image: '/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp',
    href: '/mlzidla-mlzitka#catalog',
    icon: Droplets,
  },
  {
    title: 'Mlžné brány a oblouky',
    subtitle: 'Průchozí ochlazení',
    description:
      'Nerezové brány pro náměstí, parky, promenády a dětská hřiště. Průchozí mlžná zóna, která přirozeně zve k osvěžení.',
    image: '/media/optimized/81c84ca33_Mrakmlzitko-skolnizahrada.webp',
    href: '/mlzne-brany',
    icon: Building2,
  },
  {
    title: 'Ateliérové a tvarové prvky',
    subtitle: 'Lízátka, TeePee, Květ',
    description:
      'Hravé a umělecké nerezové tvary, které fungují jako dominanta veřejného prostoru i jako reálný chladič vzduchu.',
    image: '/media/optimized/3bd7f70e9_MlitkoAURA-zahradnimlzidlo.webp',
    href: '/mlzidla-mlzitka#catalog',
    icon: Flower2,
  },
];

const spaceCards = [
  { title: 'Náměstí', text: 'Pobytové zóny, trhy, městské akce a místa setkávání.', icon: Building2 },
  { title: 'Parky', text: 'Jemné ochlazení u laviček, cest a klidových ploch.', icon: Sparkles },
  { title: 'Hřiště a školy', text: 'Hravé prvky pro bezpečnější a příjemnější letní provoz.', icon: Flower2 },
  { title: 'Promenády', text: 'Rytmus mlžicích bodů pro pěší a cyklotrasy.', icon: Waves },
];

const smartSteps = [
  { title: 'Teplota a čas', text: 'Systém reaguje podle nastaveného režimu.', icon: ThermometerSun },
  { title: 'Smart ventil / SUPLA', text: 'Chytré řízení přívodu vody a provozních scén.', icon: Wifi },
  { title: 'Automatické spuštění', text: 'Mlžení se spustí ve vhodných podmínkách.', icon: Timer },
  { title: 'Přehled provozu', text: 'Kontrola průtoku, času a spotřeby vody.', icon: Gauge },
];

export default function ProductCategoryShowcase() {
  return (
    <section className="mlzCategoryShowcase" id="produkty-kategorie">
      <style>{`
        .mlzCategoryShowcase {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 14% 5%, rgba(34, 211, 238, .16), transparent 28%),
            radial-gradient(circle at 88% 18%, rgba(14, 165, 233, .12), transparent 30%),
            linear-gradient(180deg, #f7fbfd 0%, #ffffff 52%, #f3f8fb 100%);
          padding: clamp(72px, 9vw, 132px) clamp(20px, 5vw, 72px);
          color: #07131d;
        }
        .mlzCategoryShowcase::before,
        .mlzCategoryShowcase::after {
          content: '';
          position: absolute;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: rgba(34, 211, 238, .08);
          filter: blur(28px);
          pointer-events: none;
        }
        .mlzCategoryShowcase::before { left: -90px; top: 80px; }
        .mlzCategoryShowcase::after { right: -110px; bottom: 160px; }
        .mlzCatInner { position: relative; z-index: 1; max-width: 1500px; margin: 0 auto; }
        .mlzCatKicker { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: #0b8ec5; font-size: 11px; letter-spacing: .24em; text-transform: uppercase; font-weight: 800; text-align: center; }
        .mlzCatTitle { margin: 14px auto 0; max-width: 980px; text-align: center; font-size: clamp(42px, 6vw, 82px); line-height: .92; letter-spacing: -.065em; font-weight: 900; color: #07131d; }
        .mlzCatTitle span { color: #08aeea; }
        .mlzCatLead { max-width: 860px; margin: 22px auto 0; text-align: center; font-size: clamp(17px, 1.7vw, 22px); line-height: 1.55; color: #536a79; }
        .mlzTicker { margin: 36px -72px 44px; overflow: hidden; border-block: 1px solid rgba(11, 142, 197, .18); background: rgba(255,255,255,.56); backdrop-filter: blur(14px); }
        .mlzTickerTrack { display: flex; width: max-content; animation: mlzTicker 28s linear infinite; padding: 14px 0; }
        .mlzTickerTrack span { white-space: nowrap; margin-inline: 28px; color: #0a3256; font-weight: 800; letter-spacing: .03em; }
        @keyframes mlzTicker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .mlzCatGrid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
        .mlzCatCard { opacity: 0; transform: translateY(28px); animation: mlzReveal .7s ease-out forwards; animation-delay: var(--delay, 0s); position: relative; min-height: 520px; overflow: hidden; border-radius: 34px; background: #07131d; box-shadow: 0 28px 90px rgba(7,19,29,.14); text-decoration: none; color: #fff; }
        .mlzCatCard:nth-child(2) { --delay: .12s; }
        .mlzCatCard:nth-child(3) { --delay: .24s; }
        @keyframes mlzReveal { to { opacity: 1; transform: translateY(0); } }
        .mlzCatCard img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .8s cubic-bezier(.2,.8,.2,1), filter .8s; filter: saturate(1.04) contrast(1.02); }
        .mlzCatCard:hover img { transform: scale(1.075); filter: saturate(1.16) contrast(1.04); }
        .mlzCatShade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,19,29,.06) 0%, rgba(7,19,29,.24) 42%, rgba(7,19,29,.88) 100%); }
        .mlzCatContent { position: absolute; inset: auto 0 0 0; padding: 28px; }
        .mlzCatIcon { width: 62px; height: 62px; display: grid; place-items: center; border-radius: 22px; background: rgba(255,255,255,.92); color: #0b8ec5; box-shadow: 0 16px 44px rgba(7,19,29,.16); margin-bottom: 18px; }
        .mlzCatContent small { display: block; margin-bottom: 8px; color: #22d3ee; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
        .mlzCatContent h3 { margin: 0; font-size: clamp(26px, 2.7vw, 38px); line-height: .98; letter-spacing: -.045em; font-weight: 900; }
        .mlzCatContent p { margin: 16px 0 22px; color: rgba(255,255,255,.78); line-height: 1.55; }
        .mlzCardCta { display: inline-flex; align-items: center; gap: 10px; font-weight: 900; color: #fff; }
        .mlzSpaceGrid { margin-top: 52px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
        .mlzSpaceCard { border: 1px solid rgba(11, 142, 197, .16); border-radius: 24px; padding: 22px; background: rgba(255,255,255,.78); box-shadow: 0 18px 60px rgba(7,19,29,.06); }
        .mlzSpaceCard svg { color: #0b8ec5; margin-bottom: 14px; }
        .mlzSpaceCard h4 { margin: 0 0 8px; font-size: 18px; letter-spacing: -.03em; }
        .mlzSpaceCard p { margin: 0; color: #5a6b78; line-height: 1.5; font-size: 14px; }
        .mlzSmartPanel { margin-top: 78px; border-radius: 38px; overflow: hidden; color: #fff; background: radial-gradient(circle at 75% 20%, rgba(34,211,238,.28), transparent 28%), linear-gradient(135deg, #06111d, #0a2843 54%, #07131d); box-shadow: 0 34px 110px rgba(7,19,29,.22); }
        .mlzSmartInner { display: grid; grid-template-columns: .9fr 1.1fr; gap: 34px; padding: clamp(28px, 5vw, 58px); align-items: center; }
        .mlzSmartInner h3 { margin: 0; font-size: clamp(34px, 5vw, 68px); line-height: .95; letter-spacing: -.06em; }
        .mlzSmartInner h3 span { color: #22d3ee; }
        .mlzSmartInner p { color: rgba(255,255,255,.74); line-height: 1.65; font-size: 17px; }
        .mlzSmartSteps { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .mlzSmartStep { border: 1px solid rgba(255,255,255,.16); background: rgba(255,255,255,.08); border-radius: 22px; padding: 20px; backdrop-filter: blur(18px); }
        .mlzSmartStep svg { color: #22d3ee; margin-bottom: 12px; }
        .mlzSmartStep strong { display: block; margin-bottom: 5px; }
        .mlzSmartStep span { display: block; color: rgba(255,255,255,.68); font-size: 14px; line-height: 1.45; }
        .mlzAnchorPanel { margin-top: 28px; border-radius: 34px; border: 1px solid rgba(11, 142, 197, .14); background: #fff; display: grid; grid-template-columns: 1fr 1.2fr; overflow: hidden; box-shadow: 0 20px 70px rgba(7,19,29,.09); }
        .mlzAnchorCopy { padding: clamp(28px, 5vw, 54px); }
        .mlzAnchorCopy h3 { margin: 0; font-size: clamp(32px, 4vw, 56px); line-height: .96; letter-spacing: -.055em; }
        .mlzAnchorCopy h3 span { color: #0b8ec5; }
        .mlzAnchorCopy p { color: #5a6b78; line-height: 1.65; font-size: 16px; }
        .mlzAnchorList { display: grid; gap: 12px; margin-top: 22px; }
        .mlzAnchorList div { display: flex; gap: 12px; align-items: flex-start; color: #0a3256; font-weight: 800; }
        .mlzAnchorVisual { position: relative; min-height: 420px; background: linear-gradient(135deg, #eef6f9, #ffffff); display: grid; place-items: center; padding: 34px; }
        .mlzAnchorDiagram { width: min(480px, 100%); aspect-ratio: 1/1; border-radius: 50%; background: radial-gradient(circle, #fff 0 28%, rgba(34,211,238,.12) 29% 43%, transparent 44%), linear-gradient(180deg, rgba(7,19,29,.06), transparent); border: 1px solid rgba(11,142,197,.18); position: relative; }
        .mlzAnchorDiagram::before { content: ''; position: absolute; left: 50%; top: 9%; width: 52px; height: 72%; transform: translateX(-50%); border-radius: 26px 26px 12px 12px; background: linear-gradient(90deg, #aeb7bc, #f7f9fa 45%, #7f8c93); box-shadow: 0 12px 34px rgba(7,19,29,.14); }
        .mlzAnchorDiagram::after { content: 'skrytá patka + přívod vody pod dlažbou'; position: absolute; left: 50%; bottom: 18%; transform: translateX(-50%); width: 74%; border-radius: 18px; padding: 14px; background: #07131d; color: #fff; text-align: center; font-size: 13px; font-weight: 800; }
        @media (max-width: 1000px) { .mlzCatGrid, .mlzSpaceGrid, .mlzSmartInner, .mlzAnchorPanel { grid-template-columns: 1fr; } .mlzCatCard { min-height: 420px; } .mlzTicker { margin-inline: -20px; } }
        @media (prefers-reduced-motion: reduce) { .mlzTickerTrack, .mlzCatCard { animation: none; opacity: 1; transform: none; } .mlzCatCard img { transition: none; } }
      `}</style>

      <div className="mlzCatInner">
        <p className="mlzCatKicker">Řešení pro města a obce</p>
        <h2 className="mlzCatTitle">Kategorie <span>mlžítek</span></h2>
        <p className="mlzCatLead">
          Přehled produktových skupin pro rychlou orientaci starostů, projektantů a správců veřejného prostoru.
          Každá kategorie vede k vhodným produktům, vizualizaci do prostoru a poptávce.
        </p>

        <div className="mlzTicker" aria-hidden="true">
          <div className="mlzTickerTrack">
            {[0, 1].map((loop) => (
              <React.Fragment key={loop}>
                <span>Chladnější města</span>
                <span>Jemná mlha</span>
                <span>Nerez AISI 304</span>
                <span>Skryté kotvení</span>
                <span>Chytré řízení SUPLA</span>
                <span>Méně rozpálených ploch</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="mlzCatGrid">
          {categoryCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.title} to={card.href} className="mlzCatCard">
                <img src={card.image} alt={`${card.title} — ${card.subtitle}`} loading="lazy" />
                <div className="mlzCatShade" />
                <div className="mlzCatContent">
                  <div className="mlzCatIcon"><Icon size={30} /></div>
                  <small>{card.subtitle}</small>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <span className="mlzCardCta">Otevřít kategorii <ArrowRight size={18} /></span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mlzSpaceGrid">
          {spaceCards.map((space) => {
            const Icon = space.icon;
            return (
              <article className="mlzSpaceCard" key={space.title}>
                <Icon size={28} />
                <h4>{space.title}</h4>
                <p>{space.text}</p>
              </article>
            );
          })}
        </div>

        <div className="mlzSmartPanel">
          <div className="mlzSmartInner">
            <div>
              <p className="mlzCatKicker" style={{ textAlign: 'left', color: '#22d3ee' }}>MLŽIDLA.CZ + SUPLA</p>
              <h3>Chytré řízení, <span>když je potřeba.</span></h3>
              <p>
                Mlžení nemá běžet naslepo. Pro města, zahrady i veřejný prostor připravujeme provozní scénáře podle teploty,
                času, zóny a reálného využití místa.
              </p>
              <Link to="/poptavka" className="btn-brand-accent-link" style={{ marginTop: 18 }}>Chci návrh řízení →</Link>
            </div>
            <div className="mlzSmartSteps">
              {smartSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div className="mlzSmartStep" key={step.title}>
                    <Icon size={28} />
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
            <p className="mlzCatKicker" style={{ textAlign: 'left' }}>Instalace pro veřejný prostor</p>
            <h3>Skryté kotvení <span>pro městské použití.</span></h3>
            <p>
              Technické řešení nechává vyniknout prostor. Přívod vody a kotvení jsou vedené čistě pod povrchem,
              krycí patka zůstává nenápadná a konstrukce je připravená pro dlouhodobý provoz ve veřejném prostoru.
            </p>
            <div className="mlzAnchorList">
              <div><ShieldCheck size={20} /> Antivandal provedení a nerezová konstrukce</div>
              <div><Wrench size={20} /> Betonový základ, přívod vody a servisní přístup</div>
              <div><Sparkles size={20} /> Čistý detail bez rušivých prvků v dlažbě</div>
            </div>
          </div>
          <div className="mlzAnchorVisual">
            <div className="mlzAnchorDiagram" aria-label="Schéma skrytého kotvení mlžítka" />
          </div>
        </div>
      </div>
    </section>
  );
}
