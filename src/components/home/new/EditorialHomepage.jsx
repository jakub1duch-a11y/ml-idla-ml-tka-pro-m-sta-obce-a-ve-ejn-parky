import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, SlidersHorizontal, Wrench } from 'lucide-react';
import '@/styles/editorial-home.css';

const PRODUCTS = [
  { name: 'BENDY', type: 'Organická linie', image: 'bendy-studio.webp', path: '/produkt/mlzitko-bendy', text: 'Jemný oblouk pro náměstí, park i cestu mezi pobytovými místy.' },
  { name: 'GATE', type: 'Průchozí mlžná brána', image: 'gate-studio.webp', path: '/produkt/mlzna-brana-gate', text: 'Výrazný průchozí prvek, který propojí pohyb lidí a letní osvěžení.' },
  { name: 'STÉBLO', type: 'Čistý vertikální prvek', image: 'steblo-studio.webp', path: '/produkt/mlzitko-steblo', text: 'Střídmé nerezové provedení pro zahrady i veřejný prostor.' },
  { name: 'Y-ARMIST', type: 'Architektonické mlžítko', image: 'y-armist-tr60-studio.webp', path: '/produkt/y-armist-tr60', text: 'Charakteristické větvení jako součást moderní architektury.' },
];

const USES = [
  ['01', 'Města a obce', 'Náměstí, parky a místa setkávání.', '/mlzitka-pro-mesta-obce'],
  ['02', 'Školy a sportoviště', 'Osvěžení pro letní pobyt a aktivní zóny.', '/kategorie/skoly-skolky-deti'],
  ['03', 'Zahrady a terasy', 'Komfort v soukromém i komerčním prostoru.', '/rezidencni-mlzeni'],
  ['04', 'Architekti a projektanti', 'Produkt, umístění a technická příprava v souvislostech.', '/kategorie/architekti'],
];

function Action({ to, children, secondary = false }) {
  return <Link className={`eh-button${secondary ? ' eh-button--outline' : ''}`} to={to}>{children}<ArrowRight size={17} aria-hidden="true" /></Link>;
}

export default function EditorialHomepage() {
  return <div className="editorial-home">
    <section className="eh-hero" aria-labelledby="eh-title">
      <div className="eh-hero-copy">
        <p className="eh-kicker">MLŽIDLA® / Design pro lepší klima</p>
        <h1 id="eh-title">Architektura,<br />která <span>osvěží.</span></h1>
        <p className="eh-lead">Nerezová mlžítka pro místa, kde lidé chtějí zůstat. Promyšlený design, jemná vodní mlha a řízení podle vašeho prostoru.</p>
        <div className="eh-actions"><Action to="/poptavka">Navrhnout řešení</Action><Link to="/katalog-mlzitek" className="eh-text-link">Prohlédnout kolekci <ArrowRight size={17} /></Link></div>
        <div className="eh-hero-note"><span>Navrženo pro vaše místo.</span><span>Vyrobeno společností HolmTec.</span></div>
      </div>
      <figure className="eh-hero-image">
        <img src="/media/optimized/31478e4b3_bendymlzitko02.webp" alt="Mlžítko BENDY v městském prostoru" fetchPriority="high" decoding="async" />
        <figcaption><span>BENDY / veřejný prostor</span><Link to="/produkt/mlzitko-bendy" aria-label="Prohlédnout BENDY"><ArrowRight size={22} /></Link></figcaption>
      </figure>
    </section>

    <section className="eh-intro eh-container">
      <p className="eh-kicker">Voda. Nerez. Prostor.</p>
      <h2>Malý prvek.<br /><span>Velký rozdíl v pobytu.</span></h2>
      <p>V horkých dnech vzniká příjemnější místo přímo tam, kde se lidé potkávají. Mlžítko vybíráme podle charakteru prostoru, pohybu lidí a způsobu provozu. Tak, aby přirozeně doplnilo architekturu.</p>
    </section>

    <section className="eh-collection eh-container" id="home-product-gallery" aria-labelledby="eh-products">
      <div className="eh-heading"><div><p className="eh-kicker">Produktová kolekce</p><h2 id="eh-products">Každý prostor má svůj tvar.</h2></div><Link to="/katalog-mlzitek" className="eh-text-link">Celý katalog <ArrowRight size={17} /></Link></div>
      <div className="eh-products">{PRODUCTS.map((product) => <Link to={product.path} className="eh-product" key={product.name}>
        <div className="eh-product-image"><img src={`/media/studio/${product.image}`} alt={`${product.name} — katalogové provedení`} loading="lazy" decoding="async" /></div>
        <div className="eh-product-title"><h3>{product.name}</h3><ArrowRight size={20} aria-hidden="true" /></div>
        <p className="eh-product-type">{product.type}</p><p>{product.text}</p>
      </Link>)}</div>
    </section>

    <section className="eh-uses" aria-labelledby="eh-uses-title"><div className="eh-container eh-uses-layout">
      <div><p className="eh-kicker">Řešení podle místa</p><h2 id="eh-uses-title">Začínáme<br /><span>vaším prostorem.</span></h2><p>Od jedné pobytové zóny po soustavu prvků v celém areálu. Návrh má vždy konkrétní účel.</p></div>
      <div className="eh-use-list">{USES.map(([number, title, text, path]) => <Link to={path} key={number}><span className="eh-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowRight size={21} aria-hidden="true" /></Link>)}</div>
    </div></section>

    <section className="eh-system eh-container" aria-labelledby="eh-system-title">
      <div className="eh-heading"><div><p className="eh-kicker">Promyšlený celek</p><h2 id="eh-system-title">Design na povrchu.<br />Technika v souvislostech.</h2></div><Link to="/jak-to-funguje" className="eh-text-link">Princip mlžení <ArrowRight size={17} /></Link></div>
      <div className="eh-system-grid">{[
        [Droplets, 'Jemná vodní mlha', 'Přívod vody, filtrace a mlžítko tvoří jeden systém. Parametry a spotřebu stanovíme podle vybrané konfigurace.'],
        [Wrench, 'Čistá instalace', 'Kotvení a přívody koordinujeme s povrchem, stavební přípravou a servisním přístupem. Detaily potvrzuje projekt.'],
        [SlidersHorizontal, 'Řízený provoz', 'Časové plány a pulzní režimy pomáhají přizpůsobit mlžení využití místa. Senzory a vzdálené ovládání podle výbavy.'],
      ].map(([Icon, title, text]) => <article key={title}><Icon size={27} strokeWidth={1.4} /><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>

    <section className="eh-smart" aria-labelledby="eh-smart-title"><div className="eh-container eh-smart-layout">
      <figure><img src="/media/optimized/5c4b99749_Smartmlzitka-ovladanizmobilu.webp" alt="Mobilní aplikace pro ovládání mlžného systému" loading="lazy" decoding="async" /><figcaption>Ukázka mobilního řízení / funkce podle konfigurace</figcaption></figure>
      <div><p className="eh-kicker">Smart řízení / SUPLA</p><h2 id="eh-smart-title">Osvěžení.<br /><span>Pod vaší kontrolou.</span></h2><p>Nastavte, kdy má systém pracovat. Časové plány, pulzní mlžení a ovládání z aplikace propojují komfort s přehlednou správou.</p>
        <ul><li>Provozní okna podle využití prostoru</li><li>Samostatně řízené zóny podle zapojení</li><li>Teplotní scénáře s odpovídajícím senzorem</li></ul>
        <p className="eh-small">Vzdálený přístup vyžaduje připojení k internetu. Výbavu a kompatibilitu navrhneme pro konkrétní instalaci.</p><Action to="/smart-ovladani">Prozkoumat chytré řízení</Action>
      </div>
    </div></section>

    <section className="eh-process eh-container" aria-labelledby="eh-process-title"><div className="eh-heading"><div><p className="eh-kicker">Spolupráce</p><h2 id="eh-process-title">Od prvního místa<br />k první letní sezóně.</h2></div><p>Jeden navazující proces. Od výběru až po předání provozu.</p></div>
      <div className="eh-process-grid">{[
        ['01', 'Poznáme místo', 'Fotografie, situace a vaše představa jsou začátek. Prověříme využití prostoru i možnosti napojení.'],
        ['02', 'Navrhneme celek', 'Vybereme kombinaci, doporučíme umístění a připravíme technické podklady i cenovou nabídku.'],
        ['03', 'Připravíme provoz', 'Výroba, koordinace instalace, nastavení řízení a předání dokumentace podle rozsahu dodávky.'],
      ].map(([number, title, text]) => <article key={number}><span className="eh-number">{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>

    <section className="eh-contact"><div className="eh-container"><p className="eh-kicker">Váš další projekt</p><h2>Dejme vašemu místu<br /><span>příjemnější léto.</span></h2><p>Pošlete nám fotografii nebo situační výkres. Navrhneme další krok.</p><div className="eh-actions"><Action to="/poptavka">Popsat můj projekt</Action><Link to="/kontakt" className="eh-text-link">Promluvit s námi <ArrowRight size={17} /></Link></div></div></section>
  </div>;
}
