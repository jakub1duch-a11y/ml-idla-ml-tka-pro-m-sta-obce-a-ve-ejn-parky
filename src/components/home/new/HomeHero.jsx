import React from 'react';
import { Link } from 'react-router-dom';
import '@/styles/home-hero-chamber.css';
import HeroVideoSlider from './HeroVideoSlider';

const HERO_BG_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/31f47cba8_generated_2ddf28f6.jpg';

const benefits = [
{ symbol: '◌', text: 'Cíleně osvěžuje pobytovou zónu' },
{ symbol: '≈', text: 'Jemná mlha pro příjemnější pobyt' },
{ symbol: '⌁', text: 'Úsporný provoz a chytré řízení' },
{ symbol: '◇', text: 'Odolná nerezová konstrukce' }];


const tiles = [
{
  index: '01',
  title: 'LINEA CE',
  text: 'Nerezová linie s charakteristickým ohybem',
  alt: 'Nerezové mlžítko LINEA CE',
  tileAlt: 'LINEA CE',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/974a8f55c_generated_017c9687.jpg',
  link: '/produkt/linea-solo'
},
{
  index: '02',
  title: 'MRAK',
  text: 'Hravé osvěžení pro děti a hřiště',
  alt: 'Mlžítko MRAK na dětském hřišti',
  tileAlt: 'MRAK',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a02e88a84_generated_44e6876a.jpg',
  link: '/produkt/mlzitko-mrak'
},
{
  index: '03',
  title: 'MLŽNÁ BRÁNA',
  text: 'Průchozí vodní mlha pro náměstí',
  alt: 'Mlžná brána na náměstí',
  tileAlt: 'Mlžná brána',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/b192a1cfe_generated_ff513b25.jpg',
  link: '/mlzne-brany'
},
{
  index: '04',
  title: 'BENDY',
  text: 'Organická linie pro pobytové zóny',
  alt: 'Organické nerezové mlžítko v pobytové zóně',
  tileAlt: 'BENDY',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/57f97ac19_generated_07f816aa.jpg',
  link: '/produkt/mlzitko-bendy'
}];


export default function HomeHero() {
  return (
    <section className="alpska-hero-chamber" data-no-watermark="true" aria-label="MLŽIDLA.CZ hero">
      <HeroVideoSlider />
      <div className="hero-top">
        <div className="hero-visual">
          <img
            src={HERO_BG_IMAGE}
            alt="Mlžítka ve veřejném prostoru s jemnou vodní mlhou"
            fetchPriority="high" />
          
        </div>
        <div className="mist" />

        <div className="hero-copy">
          <div className="kicker">
            <span className="drop" aria-hidden="true">✦</span>
            <span>Kapka úlevy · přirozené osvěžení</span>
          </div>
          <p className="micro">MLŽENÍ, KTERÉ DÁVÁ SMYSL</p>
          <h1>Mlžítka pro města, obce i zahrady.</h1>
          <p>
            Designová městská i zahradní mlžítka, mlžné brány a mlhoviště pro náměstí, parky, hřiště, sportoviště a terasy. Návrh i chytré řízení podle konkrétního místa.
          </p>
          <div className="actions">
            <Link to="/poptavka" className="btn">
              <span>Navrhnout řešení</span>
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <Link to="/katalog-mlzitek" className="btn secondary">
              <span className="arrow" aria-hidden="true">↗</span>
              <span>Prohlédnout produkty</span>
            </Link>
          </div>
        </div>

        <div className="benefits" aria-label="Hlavní přínosy mlžítek">
          {benefits.map((item) =>
          <div key={item.text} className="benefit">
              <span className="bicon" aria-hidden="true">{item.symbol}</span>
              <p>{item.text}</p>
            </div>
          )}
        </div>

        <div className="cascade">
          {tiles.map((tile) =>
          <Link key={tile.title} to={tile.link} className="product">
              <img src={tile.image} alt={tile.alt} loading="eager" decoding="async" />
              <div className="product-body">
                <div className="prod-head">
                  <span>{tile.index}</span>
                  <span className="prod-tag">Produkt</span>
                </div>
                <h2>{tile.title}</h2>
                <p>{tile.text}</p>
                <div className="detail">
                  Detail produktu <span>→</span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      <div className="lower-wrap hidden">
        <div className="lower hidden">
          <div className="lower-label">
            MLŽIDLA / 01
            <i />
          </div>
          {tiles.map((tile) =>
          <Link key={`lower-${tile.title}`} to={tile.link} className="tile">
              <img src={tile.image} alt={tile.tileAlt} loading="lazy" decoding="async" />
              <div className="tile-body">
                <span className="tile-index">{tile.index}</span>
                <span className="tile-type">Produkt</span>
                <h3>{tile.title}</h3>
                <p>{tile.text}</p>
                <div className="detail">
                  Detail produktu <span>→</span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>);

}