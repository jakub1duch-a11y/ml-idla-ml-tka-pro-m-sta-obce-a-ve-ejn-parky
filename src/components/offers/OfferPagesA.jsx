import React from 'react';
import { Clock, Thermometer, Smartphone, Droplets, ShieldCheck, Sparkles, Users, Leaf, Maximize2, Layers, Anchor, Sun } from 'lucide-react';
import { Logo, Bg, Footer, ProductTitle, IconRow } from './OfferPageParts';

const DEFAULT_BENEFITS = [
  { icon: Droplets, title: 'Jemná vodní mlha', text: 'Příjemně ochlazuje, zvlhčuje vzduch a vytváří svěží prostředí.' },
  { icon: ShieldCheck, title: 'Bezpečné a atraktivní řešení', text: 'Moderní design, který splňuje vysoké nároky na bezpečnost.' },
  { icon: Sparkles, title: 'Nerezová konstrukce', text: 'Kvalitní nerezová ocel pro dlouhou životnost a minimální údržbu.' },
  { icon: Users, title: 'Vhodné pro školy, parky a zahrady', text: 'Ideální pro veřejná prostranství i soukromé zahrady.' },
  { icon: Leaf, title: 'Nízké provozní náklady', text: 'Úsporný provoz a efektivní chlazení s minimální spotřebou vody.' },
];
const ICONS = [Droplets, ShieldCheck, Sparkles, Users, Leaf];

export function CoverPage({ c }) {
  return (
    <div className="offer-page">
      <div className="op-abs" style={{ inset: '0 0 24% 0' }}>
        <Bg src={c.pick(0)} />
        <div className="op-abs op-fade-top" style={{ inset: 0 }} />
      </div>
      <Logo />
      <div className="op-abs" style={{ left: '5.2cqw', top: '17cqw', right: '8cqw', zIndex: 3 }}>
        <div className="op-h1">Designová mlžítka.<br /><span className="op-green">Chytrý provoz.</span></div>
        <div className="op-sub" style={{ marginTop: '3cqw' }}>Česká nerezová řešení<br />pro města, parky a zahrady.</div>
      </div>
      <span className="op-note" style={{ bottom: '25.5%' }}>Ilustrační vizualizace</span>
      <div className="op-abs" style={{ left: '5.2cqw', bottom: '12cqw', right: '5cqw', height: '16cqw', display: 'flex', alignItems: 'center', gap: '4cqw' }}>
        <div style={{ flex: 1.2 }}>
          <div className="op-h2" style={{ fontSize: '6.4cqw' }}><ProductTitle name={c.productName} /></div>
          <div className="op-rule" />
          <div className="op-cap" style={{ letterSpacing: '.25em', marginTop: '1.6cqw' }}>MRAK • STÉBLO • LINEA • BENDY</div>
        </div>
        {c.smart && (
          <div style={{ flex: 1, borderLeft: '.15cqw solid #cfd6c4', paddingLeft: '3cqw' }}>
            <div className="op-cap" style={{ fontWeight: 700, letterSpacing: '.12em' }}>AUTOMATIZACE / SUPLA</div>
            <div style={{ display: 'flex', gap: '2.4cqw', marginTop: '1.4cqw' }}>
              {[[Clock, 'Časové režimy'], [Thermometer, 'Podle teploty'], [Smartphone, 'Ovládání z mobilu']].map(([I, t]) => (
                <div key={t} style={{ textAlign: 'center', width: '9cqw' }}>
                  <div className="op-ico" style={{ width: '7.5cqw', height: '7.5cqw', margin: '0 auto' }}><I style={{ width: '55%', height: '55%' }} /></div>
                  <div className="op-cap" style={{ fontWeight: 600, marginTop: '.6cqw', color: '#111' }}>{t}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export function SolutionPage({ c }) {
  const list = (c.benefits.length ? c.benefits.slice(0, 5).map((b, i) => ({ icon: ICONS[i % 5], title: b, text: '' })) : DEFAULT_BENEFITS);
  return (
    <div className="offer-page">
      <Bg src={c.pick(1)} style={{ height: '70%' }} />
      <div className="op-abs op-fade-top" style={{ inset: '0 0 30% 0' }} />
      <Logo />
      <div className="op-abs" style={{ left: '5.2cqw', top: '17cqw', right: '5cqw', zIndex: 3 }}>
        <div className="op-h1" style={{ fontSize: '7.4cqw' }}>Řešení pro <span className="op-green">{c.forWhom}</span></div>
        <div className="op-sub" style={{ fontWeight: 700, marginTop: '1.4cqw' }}><ProductTitle name={c.productName} /> pro příjemné letní osvěžení.</div>
        <div className="op-txt" style={{ width: '56%', marginTop: '2cqw', fontSize: '2.5cqw', color: '#222' }}>{c.goal || c.solution}</div>
      </div>
      <div className="op-abs" style={{ right: '3cqw', top: '24cqw', width: '33cqw', zIndex: 3, background: 'rgba(251,252,248,.9)', borderRadius: '2cqw', padding: '0 2cqw' }}>
        {list.map((b) => <IconRow key={b.title} icon={b.icon} title={b.title} text={b.text} size={8} />)}
      </div>
      <div className="op-abs" style={{ left: '3.4cqw', right: '3.4cqw', bottom: '12.5cqw', height: '20cqw', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.6cqw' }}>
        {[[c.pick(2), 'Jemná a osvěžující mlha', 'Speciální trysky vytváří jemnou vodní mlhu.'],
          [c.gallery[1] || c.pick(0), 'Kvalitní nerezové provedení', 'Odolná nerezová ocel a precizní zpracování.'],
          [c.pick(3), 'Atraktivní prvek', 'Moderní design podporuje pobyt venku.']].map(([src, t, d]) => (
          <div key={t}>
            <div style={{ height: '11.5cqw' }}>{src ? <img src={src} alt="" className="op-img" /> : <div className="op-img op-bg-fallback" />}</div>
            <div className="op-bold" style={{ marginTop: '.8cqw' }}>{t}</div><div className="op-cap">{d}</div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export function TechPage({ c }) {
  const p = c.product || {};
  const rows = [
    [Maximize2, 'Rozměr', p.coverage_area ? `Pokrytí: ${p.coverage_area}` : 'dle zvolené konfigurace'],
    [Layers, 'Materiál', p.material || 'nerezová ocel'],
    [Droplets, 'Jemné mlžení', p.micron_size ? `kapky ${p.micron_size}` : 'pomocí trysek'],
    [Droplets, 'Připojení vody', p.pressure ? `tlak ${p.pressure}` : 'dle konfigurace'],
    [Anchor, 'Kotvení', 'do zpevněného podkladu'],
    [Sun, 'Použití', 'vhodné pro venkovní použití'],
  ];
  return (
    <div className="offer-page" style={{ background: 'linear-gradient(180deg,#fff,#f1f4ec)' }}>
      <Logo />
      <div className="op-abs" style={{ left: '5.2cqw', top: '17cqw', right: '5cqw', zIndex: 3 }}>
        <div className="op-h1" style={{ fontSize: '7.6cqw' }}>Technické informace<br /><span className="op-green"><ProductTitle name={c.productName} /></span></div>
        <div className="op-sub" style={{ marginTop: '2cqw' }}>Design, funkčnost a kvalita<br />pro moderní veřejná prostranství.</div>
      </div>
      <div className="op-abs" style={{ left: '5cqw', top: '47cqw', width: '40cqw' }}>
        {rows.map(([I, t, d]) => (
          <div key={t} style={{ display: 'flex', gap: '2cqw', alignItems: 'center', marginBottom: '3.4cqw' }}>
            <div className="op-ico" style={{ width: '9cqw', height: '9cqw' }}><I style={{ width: '50%', height: '50%' }} /></div>
            <div className="op-txt" style={{ color: '#111' }}><b>{t}</b><br />{d}</div>
          </div>
        ))}
      </div>
      <div className="op-abs" style={{ right: '4cqw', top: '44cqw', width: '48cqw', height: '78cqw' }}>
        {c.product?.image_url && <img src={c.product.image_url} alt={c.productName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
      </div>
      <div className="op-abs" style={{ left: '3.4cqw', right: '3.4cqw', bottom: '12.5cqw', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.4cqw' }}>
        {['Jemné mlžení pomocí nerezových trysek', 'Odolná konstrukce z kvalitní nerezové oceli', 'Stabilní kotvení do zpevněného podkladu', 'Precizní detaily pro dlouhou životnost'].map((t, i) => {
          const src = c.gallery[i + 1] || c.pick(i);
          return (
            <div key={t}>
              <div style={{ height: '16cqw' }}>{src ? <img src={src} alt="" className="op-img" /> : <div className="op-img op-bg-fallback" />}</div>
              <div className="op-cap" style={{ marginTop: '.8cqw', color: '#111' }}><b className="op-green">{t.split(' ').slice(0, 2).join(' ')}</b> {t.split(' ').slice(2).join(' ')}</div>
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
}