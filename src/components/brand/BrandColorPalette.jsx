import React from 'react';

// Paleta odvozená z nového logotypu: hluboká modř + čistá voda + svěží mlha.
const COLORS = [
  { name: 'Deep Ink', hex: '#071A2F', rgb: '7 · 26 · 47', cmyk: '85 · 45 · 0 · 82', use: 'Primární tmavá plocha, patička, kontrast a prémiový technický charakter', swatch: 'bg-[#071A2F] text-white' },
  { name: 'Ocean Blue', hex: '#0878E8', rgb: '8 · 120 · 232', cmyk: '97 · 48 · 0 · 9', use: 'Sekundární modrá pro digitální vrstvy, navigaci, grafy a aktivní prvky', swatch: 'bg-[#0878E8] text-white' },
  { name: 'Fresh Cyan', hex: '#00B7FF', rgb: '0 · 183 · 255', cmyk: '100 · 28 · 0 · 0', use: 'Hlavní akcent, CTA, interakce, mlha a světelný detail loga', swatch: 'bg-[#00B7FF] text-[#071A2F]' },
  { name: 'Mist Blue', hex: '#7DD3FC', rgb: '125 · 211 · 252', cmyk: '50 · 16 · 0 · 1', use: 'Jemné přechody, hover stavy a lehké atmosférické vrstvy', swatch: 'bg-[#7DD3FC] text-[#071A2F]' },
  { name: 'Ice White', hex: '#F5FAFD', rgb: '245 · 250 · 253', cmyk: '3 · 1 · 0 · 1', use: 'Světlé pozadí, čistota, vzdušnost a maximální čitelnost', swatch: 'bg-[#F5FAFD] text-[#071A2F]' },
];

export default function BrandColorPalette() {
  return (
    <div className="mt-14">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[.16em] text-secondary">Barevný systém</p>
        <h3 className="mt-3 text-3xl">Barvy vycházejí přímo z kapky a tekutého Ž.</h3>
        <p className="mt-3 text-muted-foreground">Deep Ink drží technickou důvěryhodnost, Ocean Blue nese digitální vrstvu a Fresh Cyan funguje jako zapamatovatelný signál značky.</p>
      </div>
      <div className="mt-7 grid overflow-hidden rounded-2xl border border-border sm:grid-cols-2 lg:grid-cols-5">
        {COLORS.map((color) => (
          <article key={color.name} className="bg-card">
            <div className={`flex h-32 items-end p-4 ${color.swatch}`}><span className="font-mono text-xs">{color.hex}</span></div>
            <div className="p-5">
              <h4 className="text-lg">{color.name}</h4>
              <dl className="mt-4 space-y-2 font-mono text-[11px] text-muted-foreground">
                <div><dt className="inline text-foreground">RGB </dt><dd className="inline">{color.rgb}</dd></div>
                <div><dt className="inline text-foreground">CMYK </dt><dd className="inline">{color.cmyk}</dd></div>
              </dl>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{color.use}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
