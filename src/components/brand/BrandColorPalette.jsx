import React from 'react';

const COLORS = [
  { name: 'Námořní tma', hex: '#0A1628', rgb: '10 · 22 · 40', cmyk: '75 · 45 · 0 · 84', use: 'Primární barva · 60 % plochy · důvěra a technická hloubka', swatch: 'bg-ink text-white' },
  { name: 'Oceánová modrá', hex: '#1A85B0', rgb: '26 · 133 · 176', cmyk: '85 · 24 · 0 · 31', use: 'Sekundární barva · 30 % plochy · orientace a návaznost', swatch: 'bg-hydro text-white' },
  { name: 'Tyrkysová mlha', hex: '#2BBFCF', rgb: '43 · 191 · 207', cmyk: '79 · 8 · 0 · 19', use: 'Akcent · 10 % plochy · CTA a důležité prvky', swatch: 'bg-cyan text-ink' },
  { name: 'Ledová bílá', hex: '#F5F7FA', rgb: '245 · 247 · 250', cmyk: '2 · 1 · 0 · 2', use: 'Neutrální plocha · klid, čitelnost a prostor', swatch: 'bg-brandwhite text-ink' }
];

export default function BrandColorPalette() {
  return <div className="mt-14"><div className="max-w-2xl"><p className="font-mono text-xs uppercase tracking-[.16em] text-secondary">Barevný systém</p><h3 className="mt-3 text-3xl">Paleta s přesně určenou rolí.</h3><p className="mt-3 text-muted-foreground">Analogická paleta PulseLab pracuje v poměru 60–30–10: námořní tma, oceánová modrá a střídmý akcent tyrkysové mlhy.</p></div>
    <div className="mt-7 grid overflow-hidden rounded-2xl border border-border sm:grid-cols-2 lg:grid-cols-4">{COLORS.map(color => <article key={color.name} className="bg-card"><div className={`flex h-32 items-end p-4 ${color.swatch}`}><span className="font-mono text-xs">{color.hex}</span></div><div className="p-5"><h4 className="text-lg">{color.name}</h4><dl className="mt-4 space-y-2 font-mono text-[11px] text-muted-foreground"><div><dt className="inline text-foreground">RGB </dt><dd className="inline">{color.rgb}</dd></div><div><dt className="inline text-foreground">CMYK </dt><dd className="inline">{color.cmyk}</dd></div></dl><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{color.use}</p></div></article>)}</div>
  </div>;
}