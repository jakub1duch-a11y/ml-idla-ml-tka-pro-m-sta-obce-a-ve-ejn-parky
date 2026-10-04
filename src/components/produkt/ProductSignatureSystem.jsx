import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CloudFog, Droplets, Gauge, MapPin, ShieldCheck, Sparkles, Ruler, Layers3, MoveVertical, ArrowUpRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const FAMILY_VARIANTS = {
  'mlzitko-bendy': {
    title: 'Konfigurace BENDY®',
    eyebrow: 'BENDY® · jeden produkt, více prostorových sestav',
    description: 'Geometrie jednoho prvku BENDY zůstává zachovaná. Volí se pouze počet kusů a jejich rozmístění podle charakteru prostoru.',
    items: [
      { label: 'BENDY SINGLE', sub: '1 samostatný prvek', slug: 'mlzitko-bendy', variant: 'single', image: '/media/optimized/18399510e_generated_image.webp' },
      { label: 'BENDY DUO', sub: '2 stejné prvky v sestavě', slug: 'mlzitko-bendy', variant: 'duo', image: null },
      { label: 'BENDY BACK-TO-BACK', sub: '2 stejné prvky zády k sobě', slug: 'mlzitko-bendy', variant: 'back-to-back', image: null },
      { label: 'BENDY ALEJ', sub: 'více stejných prvků v linii', slug: 'mlzitko-bendy', variant: 'alej', image: null },
    ],
  },
  'mlzitko-steblo': {
    title: 'Varianty kolekce STÉBLO®',
    eyebrow: 'STÉBLO® · samostatná produktová rodina',
    description: 'U STÉBLO® se nemění základní tvar výrobku. Varianty vznikají počtem a rozmístěním stejného prvku v prostoru.',
    items: [
      { label: 'STÉBLO SINGLE', sub: '1 samostatný prvek', slug: 'mlzitko-steblo', image: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/486dbd1bb_mlzitko-steblo-katalog2.png' },
      { label: '2 STÉBLA', sub: '2 prvky · otevřený oblouk', slug: 'mlzitko-2-stebla', image: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/da36612c4_mlzitko-dve-stebla.png' },
      { label: 'STÉBLO GATE', sub: '2 prvky proti sobě', slug: 'brana-bendy', image: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/84aad697d_Steblogate03.png' },
      { label: 'STÉBLO BACK-TO-BACK', sub: '2 prvky · 360°', slug: 'bendy-back-to-back', image: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/8d9115025_BendyBack-to-Back00.png' },
      { label: 'STÉBLO ALEJ', sub: 'více prvků v linii', slug: 'bendy-alej', image: '/media/optimized/f948bad15_generated_image.webp' },
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
      { label: 'LINEA', sub: 'samostatný produkt', slug: 'linea-mlzitko', image: '/media/optimized/6505aa131_generated_image.webp' },
    ],
  },
  'linea-solo': {
    title: 'Produkt LINEA CE®',
    eyebrow: 'LINEA CE® · samostatný produkt',
    description: 'LINEA CE je samostatný výrobek s vlastním profilem, konstrukcí a produktovým detailem. Nezobrazujeme jej jako variantu LINEA.',
    items: [
      { label: 'LINEA CE', sub: 'samostatný produkt', slug: 'linea-solo', image: '/media/optimized/4a183deae_generated_image.webp' },
    ],
  },
  'linea-gate': {
    title: 'LINEA GATE®',
    eyebrow: 'LINEA GATE® · samostatná konfigurace',
    items: [
      { label: 'LINEA GATE', sub: 'průchozí sestava', slug: 'linea-gate', image: '/media/optimized/ab84deeba_generated_image.webp' },
    ],
  },
  'linea-avenue': {
    title: 'LINEA AVENUE®',
    eyebrow: 'LINEA AVENUE® · samostatná konfigurace',
    items: [
      { label: 'LINEA AVENUE', sub: 'víceprvková alej', slug: 'linea-avenue', image: '/media/optimized/e3e9b011c_generated_image.webp' },
    ],
  },
  'aura-mlzitko': {
    title: 'Varianty kolekce AURA®',
    items: [
      { label: 'AURA SINGLE', sub: '1 kruhové mlžítko', slug: 'aura-mlzitko', image: '/media/optimized/8cb34e2c3_generated_image.webp' },
      { label: 'AURA DUO', sub: '2 stejné prvky', slug: 'aura-duo', image: '/media/optimized/dbb1d0d0f_generated_image.webp' },
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
      { label: 'GATE STRAIGHT', sub: 'rovná horní linie', slug: 'mlzna-brana-gate', variant: 'straight', image: '/media/optimized/bec7f86a9_generated_image.webp' },
      { label: 'GATE V', sub: 'lomená varianta do V', slug: 'mlzna-brana-gate', variant: 'v', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/7687747c7_MlznabranaGATE70V.png' },
    ],
  },
  'mlzitko-mrak': {
    title: 'Typ MLŽNÉHO MRAKU®',
    eyebrow: 'MRAK® · typ provedení',
    description: 'Základ produktu zůstává stejný. Volíte typ provedení podle toho, kde má mlžný mrak fungovat — menší pro dětské hřiště, větší pro mlžiště a hřiště, nebo parkovou variantu pro otevřený prostor.',
    items: [
      { label: 'Dětské hřiště', sub: 'menší · pro dětské mlžení a školní areály', slug: 'mlzitko-mrak', variant: 'play', image: '/media/optimized/81c84ca33_Mrakmlzitko-skolnizahrada.webp' },
      { label: 'Velký', sub: 'ideální pro mlžiště a hřiště', slug: 'mlzitko-mrak', variant: 'obrys', image: 'https://drive.google.com/thumbnail?id=1XCICLc8JXvcM1pV9NTHygwNisYz1TS6F&sz=w1600' },
      { label: 'Parkový', sub: 'parková promenáda a otevřený prostor', slug: 'mlzitko-mrak', variant: 'flow', image: 'https://drive.google.com/thumbnail?id=1UBgJ6_7XuIxeDOBz-4LU0Onzjd1hb1Kt&sz=w1600' },
    ],
  },
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
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const currentVariant = params.get('variant');
  const variants = resolveVariantConfig(product.slug);

  const [variantImages, setVariantImages] = useState({});

  useEffect(() => {
    if (!variants || !variants.items) return;
    const slugs = variants.items
      .map((item) => item.slug)
      .filter((slug) => slug && slug !== product.slug);
    if (!slugs.length) return;
    let active = true;
    base44.entities.Product.filter({ slug: { $in: slugs } })
      .then((results) => {
        if (!active || !Array.isArray(results)) return;
        const map = {};
        (results || []).forEach((p) => {
          if (p.slug && p.image_url) map[p.slug] = p.image_url;
        });
        setVariantImages(map);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [product.slug, variants]);
  const isField = product.slug === 'bendy-field';
  const isMrak = product.slug === 'mlzitko-mrak';
  const mrakHref = (patch = {}) => {
    const next = new URLSearchParams(location.search);
    if (!next.get('variant')) next.set('variant', 'obrys');
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
              const active = item.variant
                ? currentVariant === item.variant || (product.slug === 'mlzitko-bendy' && !currentVariant && item.variant === 'single') || (isMrak && !currentVariant && item.variant === 'obrys')
                : item.slug === product.slug && !currentVariant;
              const href = isMrak && item.variant
                ? mrakHref({ variant: item.variant })
                : item.variant
                  ? `/produkt/${item.slug}?variant=${encodeURIComponent(item.variant)}`
                  : `/produkt/${item.slug}`;
              const isBendyConfiguration = product.slug === 'mlzitko-bendy' && Boolean(item.variant);
              const previewImage = variantImages[item.slug] || item.image || (!isBendyConfiguration ? (product.image_url || product.gallery_urls?.[0]) : null);
              return (
                <Link key={`${item.slug}-${item.variant || 'default'}`} to={href} aria-current={active ? 'page' : undefined} className={`group overflow-hidden rounded-[22px] border transition-all duration-300 ${active ? 'border-[#0b4860] bg-[#0b4860] text-white shadow-[0_16px_36px_rgba(11,72,96,.16)]' : 'border-slate-200 bg-white text-slate-800 hover:-translate-y-1 hover:border-[#0b4860]/30 hover:shadow-[0_16px_36px_rgba(11,72,96,.09)]'}`}>
                  {previewImage ? (
                    <div className={`relative aspect-[4/5] overflow-hidden p-2.5 ${active ? 'bg-white' : 'bg-[linear-gradient(180deg,#fbfcfc_0%,#eef3f4_100%)]'}`}>
                      <img src={previewImage} alt={`${item.label} – ${item.sub}`} className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.035]" loading="lazy" />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#031d26]/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      {active && <span className="absolute left-3 top-3 rounded-full bg-[#0b4860] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-white">Vybráno</span>}
                    </div>
                  ) : (
                    <div className={`relative flex aspect-[4/5] flex-col items-center justify-center overflow-hidden p-5 text-center ${active ? 'bg-white' : 'bg-[linear-gradient(180deg,#fbfcfc_0%,#eef3f4_100%)]'}`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(43,191,207,.10),transparent_33%)]" />
                      <div className="relative flex items-end justify-center gap-2.5">
                        {Array.from({ length: item.variant === 'single' ? 1 : item.variant === 'duo' || item.variant === 'back-to-back' ? 2 : 4 }).map((_, index) => (
                          <span key={index} className={`block w-2.5 rounded-full bg-gradient-to-b from-slate-300 via-white to-slate-400 shadow-sm ${item.variant === 'alej' ? 'h-20' : index % 2 ? 'h-24' : 'h-28'}`} />
                        ))}
                      </div>
                      <span className="relative mt-5 font-mono text-[9px] uppercase tracking-[.16em] text-slate-400">Schéma počtu prvků</span>
                      <span className="relative mt-1 text-[10px] leading-relaxed text-slate-500">Schválenou vizualizaci konfigurace doplníme samostatně.</span>
                      {active && <span className="absolute left-3 top-3 rounded-full bg-[#0b4860] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-white">Vybráno</span>}
                    </div>
                  )}
                  <div className="px-3.5 py-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="block text-xs font-bold tracking-wide">{item.label}</span>
                      <ArrowUpRight size={14} className={`shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${active ? 'text-white/70' : 'text-slate-300'}`} />
                    </div>
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