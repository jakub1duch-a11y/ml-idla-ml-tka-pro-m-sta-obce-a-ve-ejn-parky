import React from 'react';

const OPTIONS = [
  {
    src: '/media/optimized/bd29c555a_f16a9c3ea_generated_image.webp',
    title: 'Reálná kotvící patka',
    text: 'Nerezová kotevní deska s výztuhami. U trvalé instalace je po dokončení schovaná pod finálním povrchem.'
  },
  {
    src: '/media/optimized/150f3566d_IMG_20260623_124103.webp',
    title: 'Pevná nebo mobilní instalace',
    text: 'Pro veřejný prostor používáme pevné kotvení do nosného podkladu; pro sezónní instalace lze zvolit zemní vrut.'
  }
];

const LAYERS = [
  ['01', 'Mlžítko', 'Nerezový sloup zůstává viditelný nad finální úrovní terénu.'],
  ['02', 'Skrytá nerezová patka', 'Čtvercová kotevní deska a trojúhelníkové výztuhy jsou zapuštěné pod povrchem.'],
  ['03', 'Kotevní prvky', 'Kotevní šrouby nebo chemické kotvy fixují patku do betonového základu podle statického návrhu.'],
  ['04', 'Betonový základ', 'Nosná betonová deska nebo lokální základ přenáší zatížení do podloží.'],
  ['05', 'Přívod vody', 'Přívod je veden v potrubí nebo chráničce pod povrchem a vyústí u patky podle projektu.'],
  ['06', 'Finální povrch', 'Patku lze překrýt dlažbou, kamennou deskou, mlatem nebo jinou projektovanou skladbou povrchu.']
];

function HiddenAnchorDiagram() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-[#f8fafc]">
      <div className="grid lg:grid-cols-[1.15fr_.85fr]">
        <div className="relative min-h-[520px] border-b border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-cyan-700">Technický náhled · řez terénem</p>
              <h3 className="mt-2 font-heading text-2xl text-slate-950">Jak je patka schovaná v zemi</h3>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[.15em] text-slate-500">schematicky</span>
          </div>

          <svg viewBox="0 0 720 520" className="h-auto w-full" role="img" aria-label="Schematický řez skrytým kotvením mlžítka do betonového základu">
            <defs>
              <linearGradient id="steel" x1="0" x2="1">
                <stop offset="0%" stopColor="#8b9298" />
                <stop offset="35%" stopColor="#f8fafc" />
                <stop offset="62%" stopColor="#aeb5ba" />
                <stop offset="100%" stopColor="#737b82" />
              </linearGradient>
              <linearGradient id="concrete" x1="0" x2="1">
                <stop offset="0%" stopColor="#cbd1d5" />
                <stop offset="100%" stopColor="#aeb5ba" />
              </linearGradient>
              <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="7" stdDeviation="8" floodColor="#0f172a" floodOpacity=".14" />
              </filter>
            </defs>

            <rect x="0" y="0" width="720" height="520" fill="#f8fafc" />
            <rect x="0" y="210" width="720" height="50" fill="#d6c9b7" />
            <rect x="0" y="260" width="720" height="34" fill="#b9a991" />
            <rect x="60" y="294" width="600" height="192" rx="10" fill="url(#concrete)" />
            <rect x="0" y="486" width="720" height="34" fill="#ded4c5" />

            <text x="22" y="240" fontSize="15" fill="#475569" fontFamily="sans-serif">finální povrch</text>
            <text x="22" y="284" fontSize="13" fill="#64748b" fontFamily="sans-serif">ložná / vyrovnávací vrstva</text>
            <text x="82" y="330" fontSize="14" fill="#475569" fontFamily="sans-serif">nosný betonový základ</text>

            <g filter="url(#shadow)">
              <rect x="337" y="52" width="46" height="260" rx="23" fill="url(#steel)" stroke="#737b82" strokeWidth="1.4" />
              <rect x="275" y="298" width="170" height="18" rx="4" fill="url(#steel)" stroke="#697178" strokeWidth="1.4" />
              <path d="M318 298 L342 240 L342 298 Z" fill="#aeb5ba" stroke="#737b82" strokeWidth="1.3" />
              <path d="M402 298 L378 240 L378 298 Z" fill="#aeb5ba" stroke="#737b82" strokeWidth="1.3" />
              <path d="M292 298 L342 258 L342 298 Z" fill="#c4c9cd" stroke="#737b82" strokeWidth="1.3" />
              <path d="M428 298 L378 258 L378 298 Z" fill="#c4c9cd" stroke="#737b82" strokeWidth="1.3" />
            </g>

            <g stroke="#64748b" strokeWidth="6" strokeLinecap="round">
              <line x1="300" y1="316" x2="300" y2="430" />
              <line x1="420" y1="316" x2="420" y2="430" />
            </g>
            <g fill="#475569">
              <circle cx="300" cy="316" r="8" /><circle cx="420" cy="316" r="8" />
              <circle cx="300" cy="430" r="10" /><circle cx="420" cy="430" r="10" />
            </g>

            <path d="M0 405 C100 405 155 380 240 380 L321 380" fill="none" stroke="#2b7081" strokeWidth="9" strokeLinecap="round" />
            <path d="M321 380 L337 368" fill="none" stroke="#2b7081" strokeWidth="9" strokeLinecap="round" />
            <circle cx="337" cy="368" r="8" fill="#22a6b3" />

            <line x1="0" y1="210" x2="720" y2="210" stroke="#0b4860" strokeWidth="2" strokeDasharray="7 7" />
            <text x="525" y="199" fontSize="13" fill="#0b4860" fontFamily="sans-serif">úroveň hotového terénu</text>

            <g fontFamily="sans-serif" fontSize="13" fill="#0f172a">
              <line x1="383" y1="112" x2="520" y2="88" stroke="#2bbfcf" strokeWidth="2" />
              <circle cx="383" cy="112" r="5" fill="#2bbfcf" />
              <text x="528" y="92">nerezový sloup</text>

              <line x1="410" y1="272" x2="536" y2="248" stroke="#2bbfcf" strokeWidth="2" />
              <circle cx="410" cy="272" r="5" fill="#2bbfcf" />
              <text x="544" y="252">výztuhy patky</text>

              <line x1="436" y1="307" x2="550" y2="326" stroke="#2bbfcf" strokeWidth="2" />
              <circle cx="436" cy="307" r="5" fill="#2bbfcf" />
              <text x="558" y="330">kotevní deska</text>

              <line x1="420" y1="385" x2="550" y2="392" stroke="#2bbfcf" strokeWidth="2" />
              <circle cx="420" cy="385" r="5" fill="#2bbfcf" />
              <text x="558" y="396">kotevní šroub / chemická kotva</text>

              <line x1="275" y1="380" x2="188" y2="356" stroke="#2bbfcf" strokeWidth="2" />
              <circle cx="275" cy="380" r="5" fill="#2bbfcf" />
              <text x="30" y="360">přívod vody pod povrchem</text>
            </g>
          </svg>

          <p className="mt-4 max-w-2xl text-xs leading-relaxed text-slate-500">
            Vizualizace je princip instalace. Přesný rozměr betonového základu, počet a typ kotev, hloubka zapuštění i skladba povrchu se stanovují podle konkrétního produktu, podloží a statického návrhu projektu.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-slate-400">Co zůstane skryté</p>
          <div className="mt-5 space-y-5">
            {LAYERS.map(([num, title, text]) => (
              <div key={num} className="grid grid-cols-[36px_1fr] gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 font-mono text-[10px] font-bold text-cyan-800">{num}</div>
                <div><h4 className="text-sm font-semibold text-slate-950">{title}</h4><p className="mt-1 text-xs leading-relaxed text-slate-500">{text}</p></div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-sm font-semibold text-slate-950">Čím se patka zakryje?</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">Nejčastěji navazujícím finálním povrchem projektu. Patka může být pod velkoformátovou nebo betonovou dlažbou, kamennou deskou, mlatovým povrchem či jinou skladbou. Okolí sloupu se detailně dořeší tak, aby kotvení nebylo pohledově rušivé a současně zůstal možný servis podle zvoleného řešení.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Betonová dlažba', 'Kamenná deska', 'Velkoformátová dlažba', 'Mlat / parkový povrch', 'Projektový krycí detail'].map((item) => <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-medium text-slate-600">{item}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnchoringGallery() {
  return (
    <div className="mb-16 space-y-6">
      <HiddenAnchorDiagram />
      <div className="grid gap-6 md:grid-cols-2">
        {OPTIONS.map((option) => (
          <figure key={option.src} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="aspect-[4/3] overflow-hidden bg-slate-100"><img src={option.src} alt={option.title} className="h-full w-full object-cover" loading="lazy" /></div>
            <figcaption className="p-5"><h3 className="font-heading text-lg text-slate-900">{option.title}</h3><p className="mt-1 text-sm leading-relaxed text-slate-500">{option.text}</p></figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}