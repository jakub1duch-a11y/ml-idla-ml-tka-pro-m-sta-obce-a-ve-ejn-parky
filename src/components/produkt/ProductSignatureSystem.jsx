import React from 'react';
import { Link } from 'react-router-dom';
import { CloudFog, Droplets, Gauge, MapPin, ShieldCheck, Sparkles, Ruler, Layers3, MoveVertical } from 'lucide-react';

const FAMILY_VARIANTS = {
  'mlzitko-bendy': {
    title: 'Varianty kolekce BENDY®',
    items: [
      { label: 'MLŽÍTKO', sub: '1 ks', slug: 'mlzitko-bendy' },
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
      { label: 'MLŽÍTKO', sub: '1 prvek', slug: 'linea-solo' },
      { label: 'GATE', sub: '2 prvky', slug: 'linea-gate' },
      { label: 'AVENUE', sub: 'více prvků', slug: 'linea-avenue' },
    ],
  },
  'linea-gate': { ref: 'linea-solo' },
  'linea-avenue': { ref: 'linea-solo' },
  'y-armist-tr60': {
    title: 'Varianty MLŽÍTKA Y-ARMIST',
    items: [
      { label: 'TRUBKA', sub: 'TUBE · kulatý profil', slug: 'y-armist-tr60', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3063e3653_MlzitkoY-ARMISTTR60_3.png' },
      { label: 'JEKL', sub: 'hranatý profil', slug: 'y-armist-j70', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/93cd8ff63_MlzitkoY-ARMISTJ70_2.png' },
    ],
  },
  'y-armist-j70': { ref: 'y-armist-tr60' },
};

const FIELD_SIZES = [
  { label: 'S', sub: '3 prvky', note: 'Kompaktní mlžiště pro menší náměstí, školy a sportoviště.' },
  { label: 'M', sub: '5 prvků', note: 'Vyvážená sestava pro parky, promenády a frekventované veřejné plochy.' },
  { label: 'L', sub: '7–9 prvků', note: 'Velkorysé víceprvkové ochlazení pro rozsáhlejší veřejný prostor.' },
  { label: 'AVENUE', sub: '8 prvků v linii', note: 'Liniová městská alej pro promenády, pěší zóny a průchozí ochlazovací trasu.' },
];

function resolveVariantConfig(slug) {
  const own = FAMILY_VARIANTS[slug];
  if (!own) return null;
  if (own.ref) return FAMILY_VARIANTS[own.ref] || null;
  return own;
}

const formatMm = (value) => String(value).replace('.', ',');

export default function ProductSignatureSystem({ product, showSignatures = true }) {
  const variants = resolveVariantConfig(product.slug);
  const isField = product.slug === 'bendy-field';
  const isBendyArc = product.product_family === 'BENDY ARC' || ['bendy-arc','bendy-arc-2-0','bendy-arc-3-0'].includes(product.slug);
  const profileDiameters = product.profile_diameters_mm || [];
  const wallThicknesses = product.wall_thicknesses_mm || [];
  const hasProfileConfig = profileDiameters.length > 0 || wallThicknesses.length > 0;
  const signatures = [
    { icon: Gauge, label: 'Přímé napojení', value: product.pressure || 'Na vodovodní řad' },
    { icon: CloudFog, label: 'Jemná mlha', value: product.micron_size || 'Projektové trysky' },
    { icon: ShieldCheck, label: 'Kvalitní nerez', value: product.material || 'Nerezová konstrukce' },
    { icon: Droplets, label: 'Úsporný provoz', value: product.water_consumption || 'Dle konfigurace' },
    { icon: MapPin, label: 'Český výrobek', value: 'HolmTec · vyrobeno v ČR' },
  ];

  return (
    <div className="mt-7 space-y-5">
      {showSignatures && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,.035)]">
          <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-5 sm:divide-x sm:divide-y-0">
            {signatures.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-4 sm:min-h-[108px] sm:flex-col sm:justify-center sm:px-3 sm:text-center">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0b4860]/[.055] text-[#0b4860]">
                  <Icon size={20} strokeWidth={1.6} />
                </span>
                <span className="min-w-0">
                  <p className="text-[12px] font-bold leading-tight text-slate-900">{label}</p>
                  <p className="mt-1 text-[10px] leading-snug text-slate-500 sm:line-clamp-2">{value}</p>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasProfileConfig && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Technické varianty profilu</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">Dostupné výrobní varianty. Výchozí konfigurace pro vizualizace a AR je zvýrazněná.</p>
            </div>
            {product.ar_reference_version && <span className="hidden sm:inline-flex rounded-full border border-[#0b4860]/15 bg-white px-3 py-1 text-[10px] font-semibold text-[#0b4860]">AR Base v1</span>}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-slate-700"><Ruler size={14} className="text-[#0b4860]"/> Průměr profilu</div>
              <div className="flex flex-wrap gap-2">
                {profileDiameters.map((diameter) => {
                  const active = Number(diameter) === Number(product.default_profile_diameter_mm);
                  return <span key={diameter} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${active ? 'border-[#0b4860] bg-[#0b4860] text-white' : 'border-slate-200 bg-white text-slate-700'}`}>Ø{formatMm(diameter)} mm</span>;
                })}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-slate-700"><Layers3 size={14} className="text-[#0b4860]"/> Tloušťka stěny</div>
              <div className="flex flex-wrap gap-2">
                {wallThicknesses.map((thickness) => {
                  const active = Number(thickness) === Number(product.default_wall_thickness_mm);
                  return <span key={thickness} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${active ? 'border-[#0b4860] bg-[#0b4860] text-white' : 'border-slate-200 bg-white text-slate-700'}`}>{formatMm(thickness)} mm</span>;
                })}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-slate-700"><MoveVertical size={14} className="text-[#0b4860]"/> Referenční výška</div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                <span className="text-sm font-bold text-slate-900">{product.nominal_height_mm ? `≈ ${formatMm(product.nominal_height_mm)} mm` : 'Projektová'}</span>
                {product.ar_reference_version && <span className="mt-0.5 block text-[10px] text-slate-500">pro základní 3D / AR model</span>}
              </div>
            </div>
          </div>
        </div>
      )}

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
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400"><Layers3 size={14}/> Varianty BENDY FIELD®</div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">Zvolte rozsah sestavy podle velikosti prostoru. Přesné rozestupy, počet trysek a řízení se navrhují projektově.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {FIELD_SIZES.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,.035)]">
                <span className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#0b4860]/15 bg-[#0b4860]/[.05] px-3 text-sm font-bold text-[#0b4860]">{item.label}</span>
                <span className="mt-3 block text-sm font-semibold text-slate-900">{item.sub}</span>
                <span className="mt-1.5 block text-[11px] leading-relaxed text-slate-500">{item.note}</span>
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
                <Link key={item.slug} to={`/produkt/${item.slug}`} className={`overflow-hidden rounded-2xl border transition-colors ${active ? 'border-[#0b4860] bg-[#0b4860] text-white' : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'}`}>
                  {item.image && <div className="aspect-[4/3] overflow-hidden bg-slate-100"><img src={item.image} alt={`${item.label} – ${item.sub}`} className="h-full w-full object-cover" loading="lazy" /></div>}
                  <div className="px-3 py-3">
                    <span className="block text-xs font-bold tracking-wide">{item.label}</span>
                    <span className={`mt-1 block text-[10px] ${active ? 'text-white/70' : 'text-slate-500'}`}>{item.sub}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {product.slug === 'mlzitko-bendy' && (
        <div className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
          <Sparkles size={15} className="mt-0.5 shrink-0 text-[#0b4860]" />
          <span><strong>BENDY SINGLE AR Base v1:</strong> Ø60,2 mm, referenční výška přibližně 1 800 mm, měřítko 1:1. Přesný průběh ohybu, kotvení a pozice trysek ještě zpřesníme podle výrobního podkladu.</span>
        </div>
      )}
    </div>
  );
}
