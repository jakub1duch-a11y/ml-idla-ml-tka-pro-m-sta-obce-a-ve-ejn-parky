import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Trees, Footprints, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

const RULES = {
  'mlzitko-bendy': { label: 'BENDY', configs: ['single','duo','back-to-back','alej','portal'] },
  'mlzitko-steblo': { label: 'STÉBLO', configs: ['single','duo','back-to-back','alej','portal'] },
  'linea-mlzitko': { label: 'LINEA', configs: ['single','duo','alej','portal'] },
  'linea-solo': { label: 'LINEA CE', configs: ['single','duo','portal'] },
  'linea-gate': { label: 'LINEA CE GATE', configs: ['portal'] },
  'mlzna-brana-gate': { label: 'GATE', configs: ['portal'] },
  'brana-bendy': { label: 'STÉBLO GATE', configs: ['portal'] },
};

const COPY = {
  single: ['Single','Jeden prvek','Solitérní osazení pro menší pobytovou zónu nebo samostatný ochlazovací bod.'],
  duo: ['Duo','Dva stejné prvky','Širší mlžná zóna při zachování přesné geometrie každého výrobku.'],
  'back-to-back': ['Back-to-Back','Dva prvky zády k sobě','360° městský prvek. Tato konfigurace je dostupná pouze pro BENDY a STÉBLO.'],
  alej: ['Alej','Více prvků v linii','Průchozí ochlazovací trasa pro promenády, pěší zóny a delší veřejné prostory.'],
  portal: ['Portálové mlžení','Průchod mlhou','Vstupní nebo průchozí mlžná zóna pro náměstí, mlžiště a veřejná prostranství.'],
};

const SPACE = {
  namesti: ['Náměstí', Building2, ['portal','duo','alej']],
  park: ['Park', Trees, ['single','duo','alej']],
  promenada: ['Promenáda', Footprints, ['alej','portal','duo']],
  mlziste: ['Mlžiště', Sparkles, ['portal','duo','back-to-back']],
};

function imageScore(url = '', config) {
  const value = url.toLowerCase();
  const tokens = {
    single:['single','solo'], duo:['duo','double','couple'],
    'back-to-back':['back','360'], alej:['alej','avenue'],
    portal:['gate','brana','brána','portal'],
  }[config] || [];
  let score = tokens.some((t) => value.includes(t)) ? 10 : 0;
  if (/realizace|img_|\.jpe?g/.test(value)) score += 4;
  if (/generated|render/.test(value)) score -= 2;
  return score;
}

export default function HomeSpatialConfigurations() {
  const [products, setProducts] = useState([]);
  const [adminMedia, setAdminMedia] = useState([]);
  const [slug, setSlug] = useState('mlzitko-bendy');
  const [space, setSpace] = useState('namesti');
  const [config, setConfig] = useState('portal');
  const rule = RULES[slug];

  useEffect(() => {
    Promise.all([
      base44.entities.Product.filter({ slug: { $in: Object.keys(RULES) } }).catch(() => []),
      base44.entities.VisualizationAsset?.list?.('-created_date', 250).catch(() => []),
    ]).then(([productItems, mediaItems]) => {
      setProducts(productItems || []);
      setAdminMedia((mediaItems || []).filter((item) => item?.image_url));
    });
  }, []);

  useEffect(() => {
    const preferred = SPACE[space][2];
    setConfig(preferred.find((c) => rule.configs.includes(c)) || rule.configs[0]);
  }, [space, slug]);

  const product = products.find((p) => p.slug === slug);
  const visual = useMemo(() => {
    if (!product) return '';

    const normalizedConfig = config === 'portal' ? 'gate' : config === 'back-to-back' ? 'custom' : config;
    const approvedAdmin = adminMedia
      .filter((item) => item.product_slug === slug)
      .filter((item) => !item.approval_status || item.approval_status === 'approved')
      .filter((item) => item.approved_for_presentation !== false)
      .filter((item) => !item.configuration || item.configuration === normalizedConfig || item.configuration === config)
      .sort((a, b) => Number(Boolean(b.is_primary_for_variant)) - Number(Boolean(a.is_primary_for_variant)));

    if (approvedAdmin[0]?.image_url) return approvedAdmin[0].thumbnail_url || approvedAdmin[0].image_url;

    return [product.image_url, ...(product.gallery_urls || [])]
      .filter(Boolean)
      .sort((a,b) => imageScore(b, config) - imageScore(a, config))[0] || '';
  }, [product, config, adminMedia, slug]);

  const [title, count, description] = COPY[config];

  return (
    <section className="bg-[#F3F8FA] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
          <div data-home-reveal>
            <p className="font-mono text-[10px] uppercase tracking-[.22em] text-[#0B5EA8]">// Prostorové konfigurace</p>
            <h2 className="mt-4 max-w-xl font-heading text-4xl font-semibold leading-[1] tracking-[-.04em] text-[#0A1628] sm:text-5xl">Produkt v reálném prostoru.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#506271]">
            Volte Single, Duo, Alej nebo Portál podle místa. Back-to-Back je omezený na BENDY a STÉBLO. LINEA, LINEA CE a brány lze využít jako průchozí portálové mlžení pro náměstí, mlžiště a veřejná prostranství.
          </p>
        </div>

        <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
          {Object.entries(RULES).map(([key, item]) => (
            <button key={key} onClick={() => setSlug(key)} type="button"
              className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-semibold transition ${slug === key ? 'border-[#0A1628] bg-[#0A1628] text-white' : 'border-[#D8E4E8] bg-white text-[#41515e]'}`}>
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[.7fr_1.3fr]">
          <div className="rounded-[26px] border border-[#DCE8EC] bg-white p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[.13em] text-[#768995]">Typ prostoru</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {Object.entries(SPACE).map(([key,[label,Icon]]) => (
                <button key={key} onClick={() => setSpace(key)} type="button"
                  className={`flex items-center gap-2 rounded-2xl border p-3 text-left text-sm transition ${space === key ? 'border-[#22A7C7] bg-[#EAF9FC] text-[#0A5064]' : 'border-[#E2ECEF] text-[#536672]'}`}>
                  <Icon size={16}/>{label}
                </button>
              ))}
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[.13em] text-[#768995]">Konfigurace</p>
            <div className="mt-3 space-y-2">
              {rule.configs.map((key) => (
                <button key={key} onClick={() => setConfig(key)} type="button"
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${config === key ? 'border-[#0B5EA8] bg-[#EEF7FD]' : 'border-[#E2ECEF] bg-white'}`}>
                  <span className="block text-sm font-semibold text-[#0A1628]">{COPY[key][0]}</span>
                  <span className="mt-0.5 block text-xs text-[#73838e]">{COPY[key][1]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[26px] border border-[#DCE8EC] bg-[#07131F]">
            <div className="relative aspect-[16/10] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div key={slug + config} initial={{opacity:0,scale:1.025}} animate={{opacity:1,scale:1}} exit={{opacity:0}} className="absolute inset-0">
                  {visual && <img src={visual} alt={rule.label + ' – ' + title} className="h-full w-full object-cover"/>}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07131F] via-transparent to-transparent"/>
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#72DCEE]">{rule.label} · {title}</p>
                <h3 className="mt-2 font-heading text-2xl font-semibold text-white sm:text-3xl">{count}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">{description}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <p className="text-xs leading-5 text-white/45">Primárním zdrojem je Galerie médií v administraci. Pokud pro variantu není schválený asset, použije se produktová galerie. Finální vizualizace musí zachovat přesnou geometrii výrobku.</p>
              <Link to={`/ai-vizualizace?produkt=${encodeURIComponent(rule.label)}&slug=${encodeURIComponent(slug)}&konfigurace=${encodeURIComponent(config)}`} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#22D3EE] px-5 py-3 text-xs font-bold text-[#07131F]">
                Vizualizovat můj prostor <ArrowRight size={14}/>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
