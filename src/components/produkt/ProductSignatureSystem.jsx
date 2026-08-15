import React from 'react';
import { Link } from 'react-router-dom';
import { CloudFog, Droplets, Gauge, MapPin, ShieldCheck, Sparkles, Ruler, Layers3 } from 'lucide-react';

const FAMILY_VARIANTS = {
  'mlzitko-bendy': {
    title: 'Varianty kolekce BENDY®',
    items: [
      { label: 'SINGLE', sub: '1 ks', slug: 'mlzitko-bendy' },
      { label: 'ARC 1.0', sub: 'S / M / L', slug: 'bendy-arc' },
      { label: 'ARC 2.0', sub: 'S / M / L', slug: 'bendy-arc-2-0' },
      { label: 'ARC 3.0', sub: 'S / M / L', slug: 'bendy-arc-3-0' },
      { label: 'BACK-TO-BACK', sub: '2 ks · zády k sobě', slug: 'bendy-back-to-back' },
      { label: 'ALEJ', sub: '5+ ks', slug: 'bendy-alej' },
      { label: 'FIELD', sub: 'S / M / L', slug: 'bendy-field' },
    ],
  },
  'bendy-arc': { ref: 'mlzitko-bendy' },
  'bendy-arc-2-0': { ref: 'mlzitko-bendy' },
  'bendy-arc-3-0': { ref: 'mlzitko-bendy' },
  'bendy-back-to-back': { ref: 'mlzitko-bendy' },
  'bendy-alej': { ref: 'mlzitko-bendy' },
  'bendy-field': { ref: 'mlzitko-bendy' },
  'city-arc-3': {
    title: 'Velikost CITY ARC®',
    items: [
      { label: 'ARC 3', sub: '3 prvky', slug: 'city-arc-3' },
      { label: 'ARC 4', sub: '4 prvky', slug: 'city-arc-4' },
      { label: 'ARC 5', sub: '5 prvků', slug: 'city-arc-5' },
    ],
  },
  'city-arc-4': { ref: 'city-arc-3' },
  'city-arc-5': { ref: 'city-arc-3' },
  'linea-solo': {
    title: 'Varianty kolekce LINEA®',
    items: [
      { label: 'SOLO', sub: '1 prvek', slug: 'linea-solo' },
      { label: 'GATE', sub: '2 prvky', slug: 'linea-gate' },
      { label: 'AVENUE', sub: 'více prvků', slug: 'linea-avenue' },
    ],
  },
  'linea-gate': { ref: 'linea-solo' },
  'linea-avenue': { ref: 'linea-solo' },
};

const FIELD_SIZES = [
  { label: 'S', sub: '3 prvky' },
  { label: 'M', sub: '5 prvků' },
  { label: 'L', sub: '7–9 prvků' },
];

function resolveVariantConfig(slug) {
  const own = FAMILY_VARIANTS[slug];
  if (!own) return null;
  if (own.ref) return FAMILY_VARIANTS[own.ref] || null;
  return own;
}

export default function ProductSignatureSystem({ product }) {
  const variants = resolveVariantConfig(product.slug);
  const isField = product.slug === 'bendy-field';
  const isBendyArc = product.product_family === 'BENDY ARC' || ['bendy-arc','bendy-arc-2-0','bendy-arc-3-0'].includes(product.slug);
  const signatures = [
    { icon: Gauge, label: 'Přímé napojení', value: product.pressure || 'Na vodovodní řad' },
    { icon: CloudFog, label: 'Jemná mlha', value: product.micron_size || 'Projektové trysky' },
    { icon: ShieldCheck, label: 'Kvalitní nerez', value: product.material || 'Nerezová konstrukce' },
    { icon: Droplets, label: 'Úsporný provoz', value: product.water_consumption || 'Dle konfigurace' },
    { icon: MapPin, label: 'Český výrobek', value: 'HolmTec · vyrobeno v ČR' },
  ];

  return (
    <div className="mt-7 space-y-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {signatures.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white px-3 py-3.5 text-center">
            <Icon size={19} strokeWidth={1.65} className="mx-auto text-[#0b4860]" />
            <p className="mt-2 text-[11px] font-bold leading-tight text-slate-800">{label}</p>
            <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-slate-500">{value}</p>
          </div>
        ))}
      </div>

      {isBendyArc && (
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400"><Layers3 size={14}/> Velikost BENDY ARC®</div>
          <div className="grid grid-cols-3 gap-2.5">
            {(product.size_variants?.length ? product.size_variants : ['S','M','L']).map((size) => (
              <div key={size} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-4 text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-base font-bold text-slate-900">{size}</span>
                <span className="mt-2 block text-[10px] font-medium uppercase tracking-wider text-slate-500">velikost</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">Rozměry S / M / L a rádius ohybu doplníme po potvrzení výrobních parametrů jednotlivých verzí.</p>
        </div>
      )}

      {isField && (
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400"><Layers3 size={14}/> Velikost mlžiště</div>
          <div className="grid grid-cols-3 gap-2.5">
            {FIELD_SIZES.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-4 text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-base font-bold text-slate-900">{item.label}</span>
                <span className="mt-2 block text-xs font-semibold text-slate-700">{item.sub}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {variants && (
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400"><Ruler size={14}/> {variants.title}</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {variants.items.map((item) => {
              const active = item.slug === product.slug;
              return (
                <Link key={item.slug} to={`/produkt/${item.slug}`} className={`rounded-2xl border px-3 py-3 transition-colors ${active ? 'border-[#0b4860] bg-[#0b4860] text-white' : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'}`}>
                  <span className="block text-xs font-bold tracking-wide">{item.label}</span>
                  <span className={`mt-1 block text-[10px] ${active ? 'text-white/70' : 'text-slate-500'}`}>{item.sub}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {product.slug === 'mlzitko-bendy' && (
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
          <Sparkles size={15} className="text-[#0b4860]" />
          Rádius ohybu a výška městských variant se nastavují podle konkrétního projektu; nezobrazujeme neověřené pevné hodnoty.
        </div>
      )}
    </div>
  );
}
