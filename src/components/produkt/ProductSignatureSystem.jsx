import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CloudFog, Droplets, Gauge, MapPin, ShieldCheck, Sparkles, Ruler, Layers3, MoveVertical } from 'lucide-react';

const FAMILY_VARIANTS = {
  'mlzitko-bendy': {
    title: 'Varianty kolekce BENDY®',
    eyebrow: 'BENDY® · jeden produkt, různé ohyby',
    description: 'Základ výrobku zůstává stejný. Mění se rádius a délka ohybu podle požadovaného dosahu a charakteru prostoru.',
    items: [
      { label: 'BENDY SINGLE', sub: 'základní ohyb', slug: 'mlzitko-bendy', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/18399510e_generated_image.png' },
      { label: 'BENDY RADIUS S', sub: 'kompaktní ohyb', slug: 'bendy-radius-s', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/18399510e_generated_image.png' },
      { label: 'BENDY RADIUS M', sub: 'střední rádius', slug: 'bendy-radius-m', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/18399510e_generated_image.png' },
      { label: 'BENDY RADIUS L', sub: 'větší rádius · delší konec', slug: 'bendy-radius-l', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/18399510e_generated_image.png' },
      { label: 'BENDY FIELD', sub: 'prodloužený ohyb · plošné sestavy', slug: 'bendy-field', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/0e00a3c23_generated_image.png' },
    ],
  },
  'bendy-radius-s': { ref: 'mlzitko-bendy' },
  'bendy-radius-m': { ref: 'mlzitko-bendy' },
  'bendy-radius-l': { ref: 'mlzitko-bendy' },
  'bendy-field': { ref: 'mlzitko-bendy' },
  'mlzitko-steblo': {
    title: 'Varianty kolekce STÉBLO®',
    eyebrow: 'STÉBLO® · samostatná produktová rodina',
    description: 'U STÉBLO® se nemění základní tvar výrobku. Varianty vznikají počtem a rozmístěním stejného prvku v prostoru.',
    items: [
      { label: 'STÉBLO SINGLE', sub: '1 samostatný prvek', slug: 'mlzitko-steblo', image: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/486dbd1bb_mlzitko-steblo-katalog2.png' },
      { label: '2 STÉBLA', sub: '2 prvky · otevřený oblouk', slug: 'mlzitko-2-stebla', image: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/da36612c4_mlzitko-dve-stebla.png' },
      { label: 'STÉBLO GATE', sub: '2 prvky proti sobě', slug: 'brana-bendy', image: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/84aad697d_Steblogate03.png' },
      { label: 'STÉBLO BACK-TO-BACK', sub: '2 prvky · 360°', slug: 'bendy-back-to-back', image: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/8d9115025_BendyBack-to-Back00.png' },
      { label: 'STÉBLO ALEJ', sub: 'více prvků v linii', slug: 'bendy-alej', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f948bad15_generated_image.png' },
    ],
  },
  'mlzitko-2-stebla': { ref: 'mlzitko-steblo' },
  'brana-bendy': { ref: 'mlzitko-steblo' },
  'bendy-back-to-back': { ref: 'mlzitko-steblo' },
  'bendy-alej': { ref: 'mlzitko-steblo' },

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
  'linea-mlzitko': {
    title: 'Produkt LINEA®',
    eyebrow: 'LINEA® · samostatný produkt',
    description: 'LINEA je samostatná produktová řada. Není variantou ani přejmenovanou verzí produktu LINEA CE.',
    items: [
      { label: 'LINEA', sub: 'samostatný produkt', slug: 'linea-mlzitko', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6505aa131_generated_image.png' },
    ],
  },
  'linea-solo': {
    title: 'Produkt LINEA CE®',
    eyebrow: 'LINEA CE® · samostatný produkt',
    description: 'LINEA CE je samostatný výrobek s vlastním profilem, konstrukcí a produktovým detailem. Nezobrazujeme jej jako variantu LINEA.',
    items: [
      { label: 'LINEA CE', sub: 'samostatný produkt', slug: 'linea-solo', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4a183deae_generated_image.png' },
    ],
  },
  'linea-gate': {
    title: 'LINEA GATE®',
    eyebrow: 'LINEA GATE® · samostatná konfigurace',
    items: [
      { label: 'LINEA GATE', sub: 'průchozí sestava', slug: 'linea-gate', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ab84deeba_generated_image.png' },
    ],
  },
  'linea-avenue': {
    title: 'LINEA AVENUE®',
    eyebrow: 'LINEA AVENUE® · samostatná konfigurace',
    items: [
      { label: 'LINEA AVENUE', sub: 'víceprvková alej', slug: 'linea-avenue', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e3e9b011c_generated_image.png' },
    ],
  },
  'aura-mlzitko': {
    title: 'Varianty kolekce AURA®',
    items: [
      { label: 'AURA SINGLE', sub: '1 kruhové mlžítko', slug: 'aura-mlzitko', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8cb34e2c3_generated_image.png' },
      { label: 'AURA DUO', sub: '2 stejné prvky', slug: 'aura-duo', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/dbb1d0d0f_generated_image.png' },
    ],
  },
  'aura-duo': { ref: 'aura-mlzitko' },
  'y-armist-tr60': {
    title: 'Varianty MLŽÍTKA Y-ARMIST',
    items: [
      { label: 'TRUBKA', sub: 'TUBE · kulatý profil', slug: 'y-armist-tr60', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3063e3653_MlzitkoY-ARMISTTR60_3.png' },
      { label: 'JEKL', sub: 'hranatý profil', slug: 'y-armist-j70', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/93cd8ff63_MlzitkoY-ARMISTJ70_2.png' },
    ],
  },
  'y-armist-j70': { ref: 'y-armist-tr60' },
  'mlzna-brana-gate': {
    title: 'Varianty MLŽNÉ BRÁNY GATE®',
    eyebrow: 'GATE® · tvar brány',
    description: 'Dvě architektonické varianty stejné průchozí mlžné brány.',
    items: [
      { label: 'GATE STRAIGHT', sub: 'rovná horní linie', slug: 'mlzna-brana-gate', variant: 'straight', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/bec7f86a9_generated_image.png' },
      { label: 'GATE V', sub: 'zakřivená varianta do V', slug: 'mlzna-brana-gate', variant: 'v', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/7687747c7_MlznabranaGATE70V.png' },
    ],
  },
  'mlzitko-mrak': {
    title: 'Typ ohybu MLŽNÉHO MRAKU®',
    eyebrow: 'MRAK® · tvarová varianta',
    description: 'Základ produktu zůstává stejný. Volíte charakter obrysu, následně výšku a velikost podle měřítka prostoru.',
    items: [
      { label: 'OBRYS', sub: 'čistý univerzální tvar', slug: 'mlzitko-mrak', variant: 'obrys', image: 'https://drive.google.com/thumbnail?id=1XCICLc8JXvcM1pV9NTHygwNisYz1TS6F&sz=w1600' },
      { label: 'FLOW', sub: 'plynulejší dynamický ohyb', slug: 'mlzitko-mrak', variant: 'flow', image: 'https://drive.google.com/thumbnail?id=1UBgJ6_7XuIxeDOBz-4LU0Onzjd1hb1Kt&sz=w1600' },
      { label: 'ORGANIK', sub: 'měkčí organická linie', slug: 'mlzitko-mrak', variant: 'organik', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ef3414919_generated_image.png' },
    ],
  },
};

const FIELD_SIZES = [
  { label: 'S', sub: '3 prvky', note: 'Kompaktní mlžiště pro menší náměstí, školy a sportoviště.' },
  { label: 'M', sub: '5 prvků', note: 'Vyvážená sestava pro parky, promenády a frekventované veřejné plochy.' },
  { label: 'L', sub: '7–9 prvků', note: 'Velkorysé víceprvkové ochlazení pro rozsáhlejší veřejný prostor.' },
  { label: 'AVENUE', sub: '8 prvků v linii', note: 'Liniová městská alej pro promenády, pěší zóny a průchozí ochlazovací trasu.' },
];

const MRAK_HEIGHTS = [
  { value: '2200', label: '2200 mm', note: 'Kompaktní výška pro menší prostory a dětské zóny.' },
  { value: '2500', label: '2500 mm', note: 'Univerzální standard pro většinu veřejných instalací.' },
  { value: '2800', label: '2800 mm', note: 'Výraznější měřítko pro otevřená náměstí a promenády.' },
];

const MRAK_SIZES = [
  { value: 'kompakt', label: 'KOMPAKT', note: 'Menší obrys a jemnější prostorový akcent.' },
  { value: 'standard', label: 'STANDARD', note: 'Vyvážená velikost pro běžné městské a parkové použití.' },
  { value: 'rozsireny', label: 'ROZŠÍŘENÝ', note: 'Větší obrys s výraznějším mlžným účinkem.' },
];

function resolveVariantConfig(slug) {
  const own = FAMILY_VARIANTS[slug];
  if (!own) return null;
  if (own.ref) return FAMILY_VARIANTS[own.ref] || null;
  return own;
}

const formatMm = (value) => String(value).replace('.', ',');

export default function ProductSignatureSystem({ product, showSignatures = true }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const currentVariant = params.get('variant');
  const mrakHeight = params.get('height') || '2500';
  const mrakSize = params.get('size') || 'standard';
  const variants = resolveVariantConfig(product.slug);
  const isField = product.slug === 'bendy-field';
  const isMrak = product.slug === 'mlzitko-mrak';
  const mrakHref = (patch = {}) => {
    const next = new URLSearchParams(location.search);
    if (!next.get('variant')) next.set('variant', 'obrys');
    if (!next.get('height')) next.set('height', '2500');
    if (!next.get('size')) next.set('size', 'standard');
    Object.entries(patch).forEach(([key, value]) => next.set(key, value));
    return `/produkt/${product.slug}?${next.toString()}`;
  };
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

      {isMrak && (
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,.045)] sm:p-5">
          <div className="mb-5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[.16em] text-[#0b4860]/60">MRAK® · rozměrové varianty</p>
            <div className="mt-1 flex items-center gap-2 text-base font-semibold text-slate-900"><MoveVertical size={16} className="text-[#0b4860]"/> Výška a velikost</div>
            <p className="mt-2 text-xs leading-5 text-slate-500">Výška určuje měřítko instalace, velikost pak šířku a výraznost samotného obrysu. Přesné rozměry se potvrzují podle projektu.</p>
          </div>
          <div className="space-y-5">
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[.12em] text-slate-500">Výška</div>
              <div className="grid grid-cols-3 gap-2.5">
                {MRAK_HEIGHTS.map((item) => {
                  const active = mrakHeight === item.value;
                  return <Link key={item.value} to={mrakHref({ height: item.value })} className={`rounded-2xl border px-3 py-3 transition-all ${active ? 'border-[#0b4860] bg-[#0b4860]/[.06] shadow-sm' : 'border-slate-200 hover:border-[#0b4860]/30 hover:bg-slate-50'}`}><span className={`block text-sm font-bold ${active ? 'text-[#0b4860]' : 'text-slate-900'}`}>{item.label}</span><span className="mt-1 block text-[10px] leading-4 text-slate-500">{item.note}</span></Link>;
                })}
              </div>
            </div>
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[.12em] text-slate-500">Velikost mlžného mraku</div>
              <div className="grid grid-cols-3 gap-2.5">
                {MRAK_SIZES.map((item) => {
                  const active = mrakSize === item.value;
                  return <Link key={item.value} to={mrakHref({ size: item.value })} className={`rounded-2xl border px-3 py-3 transition-all ${active ? 'border-[#0b4860] bg-[#0b4860]/[.06] shadow-sm' : 'border-slate-200 hover:border-[#0b4860]/30 hover:bg-slate-50'}`}><span className={`block text-sm font-bold ${active ? 'text-[#0b4860]' : 'text-slate-900'}`}>{item.label}</span><span className="mt-1 block text-[10px] leading-4 text-slate-500">{item.note}</span></Link>;
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {variants && (
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,.045)] sm:p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              {variants.eyebrow && <p className="font-mono text-[10px] font-semibold uppercase tracking-[.16em] text-[#0b4860]/60">{variants.eyebrow}</p>}
              <div className="mt-1 flex items-center gap-2 text-base font-semibold text-slate-900"><Layers3 size={16} className="text-[#0b4860]"/> {variants.title}</div>
              {variants.description && <p className="mt-2 text-xs leading-5 text-slate-500">{variants.description}</p>}
            </div>
            <span className="shrink-0 rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-medium text-slate-500">{variants.items.length} variant{variants.items.length === 1 ? 'a' : variants.items.length < 5 ? 'y' : ''}</span>
          </div>
          <div className={`grid gap-3 ${variants.items.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-5'}`}>
            {variants.items.map((item) => {
              const active = item.variant ? currentVariant === item.variant || (isMrak && !currentVariant && item.variant === 'obrys') : item.slug === product.slug && !currentVariant;
              const href = isMrak && item.variant ? mrakHref({ variant: item.variant }) : item.variant ? `/produkt/${item.slug}?variant=${encodeURIComponent(item.variant)}` : `/produkt/${item.slug}`;
              const previewImage = item.image || product.image_url || product.gallery_urls?.[0] || null;
              return (
                <Link key={`${item.slug}-${item.variant || 'default'}`} to={href} aria-current={active ? 'page' : undefined} className={`group overflow-hidden rounded-2xl border transition-all duration-300 ${active ? 'border-[#0b4860] bg-[#0b4860] text-white shadow-md' : 'border-slate-200 bg-white text-slate-800 hover:-translate-y-0.5 hover:border-[#0b4860]/35 hover:shadow-md'}`}>
                  {previewImage ? <div className={`relative aspect-[4/5] overflow-hidden p-2.5 ${active ? 'bg-white' : 'bg-[linear-gradient(180deg,#fafafa_0%,#eef2f3_100%)]'}`}><img src={previewImage} alt={`${item.label} – ${item.sub}`} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.025]" loading="lazy" />{active && <span className="absolute left-3 top-3 rounded-full bg-[#0b4860] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-white">Vybráno</span>}</div> : <div className={`relative flex aspect-[4/5] items-center justify-center overflow-hidden ${active ? 'bg-white' : 'bg-[linear-gradient(180deg,#fafafa_0%,#eef2f3_100%)]'}`}><div className="absolute inset-x-[28%] top-[18%] bottom-[18%] rounded-full border-[3px] border-[#0b4860]/15"/><Ruler size={28} className="relative text-[#0b4860]/35"/>{active && <span className="absolute left-3 top-3 rounded-full bg-[#0b4860] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-white">Vybráno</span>}</div>}
                  <div className="px-3.5 py-3.5">
                    <span className="block text-xs font-bold tracking-wide">{item.label}</span>
                    <span className={`mt-1 block text-[10px] leading-4 ${active ? 'text-white/75' : 'text-slate-500'}`}>{item.sub}</span>
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
