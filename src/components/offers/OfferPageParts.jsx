import React from 'react';

export const CONTACT = { name: 'Ing. Radek Meduna', email: 'meduna@holmtec.cz', phone: '+420 774 700 390', site: 'mlzidla.cz' };

export const fmtKc = (v) => `${new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 2 }).format(Number(v || 0))} Kč`;

export function Logo() {
  return (
    <div className="op-logo">
      <div className="op-logo-word">MLŽIDLA.cz<sup>®</sup></div>
      <div className="op-logo-by">by HolmTec</div>
    </div>
  );
}

export function Bg({ src, className = '', style }) {
  return src
    ? <img src={src} alt="" className={`op-bg ${className}`} style={style} />
    : <div className={`op-bg op-bg-fallback ${className}`} />;
}

export function Footer({ cta = 'Ukažte nám svůj prostor.' }) {
  return (
    <>
      <div className="op-wave" />
      <div className="op-foot">
        <span className="op-cta">{cta} →</span>
        <div className="op-foot-contact">
          <b>{CONTACT.name}</b><br />{CONTACT.email} • {CONTACT.phone}
        </div>
        <div className="op-foot-site">{CONTACT.site}</div>
      </div>
    </>
  );
}

// Název produktu: poslední slovo (např. číslo modelu) zeleně.
export function ProductTitle({ name }) {
  const parts = String(name || '').trim().split(/\s+/);
  const last = parts.length > 1 ? parts.pop() : '';
  return <>{parts.join(' ')}{last && <> <span className="op-green">{last}</span></>}</>;
}

export function IconRow({ icon: Icon, title, text, size = 7 }) {
  return (
    <div style={{ display: 'flex', gap: '2cqw', alignItems: 'center', padding: '1.7cqw 0', borderBottom: '.12cqw solid #dde2d3' }}>
      <div className="op-ico" style={{ width: `${size}cqw`, height: `${size}cqw` }}><Icon style={{ width: '55%', height: '55%' }} /></div>
      <div><div className="op-bold">{title}</div><div className="op-cap">{text}</div></div>
    </div>
  );
}