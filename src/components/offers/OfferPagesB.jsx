import React from 'react';
import { Clock, Thermometer, Smartphone, BarChart3, SlidersHorizontal, Smile, TreeDeciduous, Home, Paintbrush, Leaf, Coins, Truck, Package, Cloud } from 'lucide-react';
import { Logo, Bg, Footer, ProductTitle, IconRow, fmtKc, CONTACT } from './OfferPageParts';

export function PlacementPage({ c }) {
  const scenes = [[Smile, 'Zahrada / školka', 'Hravý prvek, který nadchne a zároveň příjemně ochladí okolí.'], [TreeDeciduous, 'Parkové prostředí', 'Osvěžení pro návštěvníky a stylový doplněk prostoru.'], [Home, 'Odpočinková zóna', 'Elegantní řešení pro zahrady a vnitrobloky.']];
  return (
    <div className="offer-page">
      <Logo />
      <div className="op-abs" style={{ left: '5.2cqw', top: '15cqw', right: '5cqw', zIndex: 3 }}>
        <div className="op-h1" style={{ fontSize: '7.4cqw' }}>Návrh umístění.<br /><span className="op-green" style={{ fontSize: '5.4cqw' }}>Možnosti začlenění do prostoru.</span></div>
      </div>
      <div className="op-abs" style={{ left: '3.4cqw', top: '38cqw', width: '65cqw', bottom: '12.5cqw', display: 'grid', gridTemplateRows: 'repeat(3,1fr)', gap: '1.6cqw' }}>
        {scenes.map(([I, t, d], i) => (
          <div key={t} style={{ position: 'relative', borderRadius: '2cqw', overflow: 'hidden' }}>
            <Bg src={c.pick(i)} />
            <div className="op-abs" style={{ left: 0, right: 0, bottom: 0, background: 'rgba(251,252,248,.92)', padding: '1.4cqw 2cqw', display: 'flex', gap: '1.6cqw', alignItems: 'center' }}>
              <div className="op-ico" style={{ width: '7cqw', height: '7cqw' }}><I style={{ width: '55%', height: '55%' }} /></div>
              <div><div className="op-bold">{t}</div><div className="op-cap">{d}</div></div>
            </div>
          </div>
        ))}
      </div>
      <div className="op-abs op-card" style={{ right: '3cqw', top: '38cqw', width: '24cqw', bottom: '13cqw', padding: '0 2cqw' }}>
        <IconRow icon={Paintbrush} title="Design, který zaujme" text="Organický tvar se stává přirozenou dominantou prostoru." size={7} />
        <IconRow icon={Thermometer} title="Příjemné osvěžení" text="Jemná vodní mlha zvyšuje komfort i v horkých dnech." size={7} />
        <IconRow icon={Leaf} title="Přirozené začlenění" text="Nerez ladí s přírodou, zelení i architekturou." size={7} />
        <IconRow icon={Home} title="Univerzální využití" text="Školy, parky, veřejná prostranství i zahrady." size={7} />
      </div>
      <Footer />
    </div>
  );
}

export function SmartPage({ c }) {
  const feats = [[Clock, 'Časové režimy', 'Nastavte si mlžení podle denního režimu.'], [Thermometer, 'Spínání podle teploty', 'Automatické spuštění při vyšších teplotách.'], [Smartphone, 'Ovládání z mobilu', 'Plná kontrola díky aplikaci SUPLA.'], [BarChart3, 'Přehledný provoz', 'Sledujte stav, statistiky a historii provozu.'], [SlidersHorizontal, 'Individuální konfigurace', 'Přizpůsobíme funkce vašim požadavkům.']];
  return (
    <div className="offer-page">
      <Bg src={c.pick(0)} style={{ height: '70%' }} />
      <div className="op-abs op-fade-top" style={{ inset: '0 0 30% 0' }} />
      <Logo />
      <div className="op-abs" style={{ left: '5.2cqw', top: '16cqw', right: '5cqw', zIndex: 3 }}>
        <div className="op-h1" style={{ fontSize: '8cqw' }}>Automatizace / <span className="op-green">SUPLA</span></div>
        <div className="op-h2 op-green" style={{ fontSize: '4.6cqw', marginTop: '1cqw' }}>Chytré ovládání pro pohodlný provoz.</div>
        <div className="op-txt" style={{ width: '58%', marginTop: '3cqw', fontSize: '2.6cqw', color: '#222' }}>Ovládejte mlžítko jednoduše a chytře. Díky systému SUPLA přizpůsobíte provoz aktuálním podmínkám, vytvoříte časové plány a máte vše pod kontrolou.</div>
      </div>
      <div className="op-abs" style={{ right: '5cqw', top: '44cqw', width: '34cqw', height: '50cqw', background: '#fff', borderRadius: '4cqw', border: '.8cqw solid #1a1a1a', padding: '3cqw', zIndex: 3, boxShadow: '0 2cqw 5cqw rgba(0,0,0,.25)' }}>
        <div className="op-bold op-green" style={{ display: 'flex', gap: '1cqw', alignItems: 'center' }}><Cloud style={{ width: '3.4cqw', height: '3.4cqw' }} /> supla</div>
        <div className="op-card" style={{ marginTop: '2cqw', padding: '2cqw' }}><div className="op-bold"><ProductTitle name={c.productName} /></div><div className="op-cap op-green">● Právě mlží</div></div>
        <div className="op-card" style={{ marginTop: '1.4cqw', padding: '1.6cqw' }}><div className="op-cap" style={{ fontWeight: 700 }}>Časový režim · Aktivní</div></div>
        <div className="op-card" style={{ marginTop: '1.4cqw', padding: '1.6cqw' }}><div className="op-cap" style={{ fontWeight: 700 }}>Podle teploty · Od 26 °C</div></div>
        <div className="op-abs" style={{ left: '3cqw', right: '3cqw', bottom: '3cqw', background: 'var(--op-green)', color: '#fff', textAlign: 'center', padding: '1.8cqw', borderRadius: '1.6cqw', fontWeight: 800, fontSize: '2.1cqw' }}>Spustit mlžítko</div>
      </div>
      <div className="op-abs" style={{ left: '3cqw', right: '3cqw', bottom: '13cqw', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '1.2cqw', textAlign: 'center' }}>
        {feats.map(([I, t, d]) => (
          <div key={t}>
            <div className="op-ico" style={{ width: '9cqw', height: '9cqw', margin: '0 auto' }}><I style={{ width: '50%', height: '50%' }} /></div>
            <div className="op-bold" style={{ marginTop: '1cqw' }}>{t}</div><div className="op-cap">{d}</div>
          </div>
        ))}
      </div>
      <Footer cta="Chytré řešení pro váš prostor." />
    </div>
  );
}

export function PricePage({ c }) {
  return (
    <div className="offer-page">
      <div className="op-abs" style={{ inset: '0 0 55% 0' }}><Bg src={c.pick(0)} /><div className="op-abs" style={{ inset: 0, background: 'linear-gradient(90deg,rgba(255,255,255,.95) 0,rgba(255,255,255,.6) 45%,rgba(255,255,255,0) 75%)' }} /></div>
      <Logo />
      <div className="op-abs" style={{ left: '5.2cqw', top: '16cqw', width: '55%', zIndex: 3 }}>
        <div className="op-h1" style={{ fontSize: '7.6cqw' }}>Cenová nabídka<br /><span className="op-green" style={{ fontSize: '6.4cqw' }}>Přehled navrženého řešení.</span></div>
        <div className="op-sub" style={{ marginTop: '2.4cqw' }}>Pro: <b>{c.clientName}</b></div>
        <div className="op-cap" style={{ marginTop: '1cqw' }}>Nabídka {c.quoteNumber || '—'} · platnost do {c.validUntil}</div>
      </div>
      <div className="op-abs" style={{ left: '4cqw', right: '4cqw', top: '55cqw', zIndex: 3 }}>
        <div className="op-h2" style={{ fontSize: '5cqw' }}>Položky nabídky</div>
        <div style={{ marginTop: '2cqw', display: 'grid', gap: '1.6cqw' }}>
          {c.lines.slice(0, 5).map((l, i) => (
            <div key={i} className="op-card" style={{ display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}>
              <div style={{ width: '20cqw', background: '#e6e9e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {i === 0 && c.product?.image_url ? <img src={c.product.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <Package className="op-green" style={{ width: '8cqw', height: '8cqw' }} />}
              </div>
              <div style={{ flex: 1, padding: '1.8cqw 2.4cqw' }}>
                <div className="op-h2" style={{ fontSize: '3.6cqw' }}>{l.label}</div>
                <div className="op-cap">{l.quantity ? `${l.quantity} ${l.unit || 'ks'}` : ''}{l.source ? ` · ${l.source}` : ''}</div>
              </div>
              <div style={{ width: '24cqw', background: '#e1e6d6', padding: '2cqw', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="op-cap">Cena</div><div className="op-h2 op-green" style={{ fontSize: '3.6cqw' }}>{fmtKc(l.total)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="op-card" style={{ marginTop: '2cqw', padding: '3cqw 4cqw', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="op-h2" style={{ fontSize: '6cqw' }}>Celkem</div>
          <div className="op-h1 op-green" style={{ fontSize: '7.4cqw' }}>{fmtKc(c.total)}</div>
        </div>
        <div style={{ display: 'flex', gap: '3cqw', marginTop: '2cqw' }}>
          <div style={{ display: 'flex', gap: '1.6cqw', alignItems: 'center', flex: 1 }}><div className="op-ico" style={{ width: '8cqw', height: '8cqw' }}><Coins style={{ width: '50%', height: '50%' }} /></div><div className="op-bold">Všechny ceny jsou uvedeny bez DPH.</div></div>
          <div style={{ display: 'flex', gap: '1.6cqw', alignItems: 'center', flex: 1 }}><div className="op-ico" style={{ width: '8cqw', height: '8cqw' }}><Truck style={{ width: '50%', height: '50%' }} /></div><div className="op-cap">Montáž, doprava a stavební připravenost nejsou zahrnuty.</div></div>
        </div>
      </div>
      <Footer cta="Rádi s Vámi probereme detaily." />
    </div>
  );
}

export function DarkHeroPage({ c }) {
  return (
    <div className="offer-page op-dark">
      {c.pick(1) && <Bg src={c.pick(1)} style={{ opacity: .85 }} />}
      <div className="op-abs" style={{ left: 0, right: 0, bottom: '6%', textAlign: 'center', color: '#fff' }}>
        <div className="op-h2" style={{ fontSize: '6cqw', color: '#fff' }}><ProductTitle name={c.productName} /></div>
        <div className="op-rule" style={{ margin: '1.4cqw auto 0' }} />
      </div>
    </div>
  );
}

export function PhotoHeroPage({ c }) {
  return (
    <div className="offer-page">
      <Bg src={c.pick(2)} />
      <div className="op-abs op-fade-top" style={{ inset: '0 0 60% 0' }} />
      <div className="op-abs" style={{ left: '7cqw', top: '10cqw', zIndex: 3 }}>
        <div className="op-h1" style={{ fontSize: '7.4cqw' }}><ProductTitle name={c.productName} /></div>
        <div className="op-rule" />
        <div className="op-sub" style={{ marginTop: '2.6cqw' }}>Příjemné letní osvěžení</div>
      </div>
    </div>
  );
}

export function RecapPage({ c }) {
  return (
    <div className="offer-page" style={{ padding: '9cqw', background: '#fafaf5' }}>
      <div className="op-h1" style={{ fontSize: '6.6cqw' }}>REKAPITULACE A PODMÍNKY</div>
      <div className="op-sub" style={{ marginTop: '4cqw', fontSize: '2.9cqw' }}>{c.clientName}{c.clientCompany ? ` | ${c.clientCompany}` : ''}<br />{c.productName}</div>
      <div style={{ marginTop: '6cqw' }}>
        {c.lines.map((l, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '2.9cqw', padding: '1.4cqw 0' }}><span>{l.label}</span><span>{fmtKc(l.total)}</span></div>)}
      </div>
      <div style={{ borderTop: '.15cqw solid #d6d9cb', marginTop: '2cqw', paddingTop: '2cqw', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '3.3cqw' }} className="op-green"><span>CELKEM BEZ DPH</span><span>{fmtKc(c.total)}</span></div>
      <div className="op-bold" style={{ marginTop: '4cqw', fontSize: '2.5cqw' }}>VŠECHNY CENY JSOU UVEDENY BEZ DPH.</div>
      <div className="op-txt" style={{ marginTop: '3cqw', lineHeight: 2, fontSize: '2.4cqw', color: '#222' }}>
        Cena nezahrnuje dopravu, montáž ani stavební přípravu.<br />
        Rozsah sestavy SUPLA, technické vybavení a cena podléhají potvrzení.<br />
        Obrazové vizualizace jsou ilustrační; mohou zobrazovat odlišné detaily.<br />
        Pro realizaci je nutné ověřit skutečné rozměry, umístění, kotvení, rozvod vody a elektroinstalaci podle projektu.<br />
        Platnost nabídky do {c.validUntil}. Termín dodání, záloha a další podmínky budou upřesněny.<br />
        Zpracování: MLŽIDLA.cz by HolmTec | {CONTACT.name}<br />
        Kontakt: {CONTACT.email} | {CONTACT.phone}<br />
        Datum přípravy: {c.today}
      </div>
      <div className="op-abs op-cap" style={{ left: '9cqw', right: '9cqw', bottom: '8cqw', borderTop: '.15cqw solid #d6d9cb', paddingTop: '2cqw' }}>MLŽIDLA.cz | Nabídka č. {c.quoteNumber || '—'}</div>
    </div>
  );
}