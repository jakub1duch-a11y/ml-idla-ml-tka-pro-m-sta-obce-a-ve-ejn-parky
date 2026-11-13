import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, Droplets, FileText, MoveUpRight, Ruler, ScanLine, Settings2 } from 'lucide-react';

// The entire product family is read from the Base44 Product.variants record.
// Do not replace verified product photos with unrelated illustrations or infer dimensions/prices.
const gateVariants = (product) => Array.isArray(product?.variants)
  ? product.variants.filter((item) => item && typeof item.name === 'string' && item.name.trim())
  : [];

const toVariantId = (name = '') => String(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function useGateSelection(product) {
  const [params, setParams] = useSearchParams();
  const options = gateVariants(product);
  const raw = params.get('varianta') || params.get('variant');
  const selected = options.find((item) => toVariantId(item.name) === raw || item.name === raw) || options[0] || null;
  const choose = (name) => {
    const next = new URLSearchParams(params);
    next.set('varianta', toVariantId(name));
    next.delete('variant');
    setParams(next, { replace: true, preventScrollReset: true });
  };
  return { options, selected, choose };
}

function GatePhoto({ src, fallback, alt, className = '', eager = false }) {
  const [failed, setFailed] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  useEffect(() => { setFailed(false); setFallbackFailed(false); }, [src, fallback]);
  const actual = failed ? (fallbackFailed ? '' : fallback) : src;
  if (!actual) return <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#E6EBEF] px-6 text-center text-[#44616F]">
    <Droplets size={32} aria-hidden="true" />
    <span className="text-sm font-semibold">Náhled varianty nyní není dostupný</span>
  </div>;
  return <img src={actual} alt={alt} className={className} loading={eager ? 'eager' : 'lazy'} decoding="async"
    fetchPriority={eager ? 'high' : 'auto'}
    onError={() => { if (!failed) setFailed(true); else setFallbackFailed(true); }} />;
}

const inquiryLink = (product, name) => `/poptavka?${new URLSearchParams({
  produkt: product.slug,
  ...(name ? { varianta: name } : {})
})}`;

function Spec({ icon: Icon, label, value }) {
  return <div className="min-w-0 rounded-2xl border border-white/20 bg-white/[.07] px-4 py-4 backdrop-blur-sm">
    <Icon size={17} className="text-[#8CE5F3]" aria-hidden="true" />
    <p className="mt-3 text-[10px] font-bold uppercase tracking-[.16em] text-white/60">{label}</p>
    <p className="mt-1 break-words font-heading text-sm font-semibold text-white sm:text-base">{value || 'Dle varianty'}</p>
  </div>;
}

export function GateHero({ product }) {
  const { options, selected } = useGateSelection(product);
  const mainImage = selected?.image_url || product.image_url;
  return (
    <section id="prehled" className="relative isolate scroll-mt-28 overflow-hidden bg-[#081B33] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse at 82% 26%, rgba(0,180,216,.38), transparent 54%)' }} />
      <div className="relative mx-auto grid max-w-[1500px] items-center gap-9 px-5 pb-16 pt-12 sm:px-8 lg:min-h-[680px] lg:grid-cols-[.85fr_1.15fr] lg:gap-12 lg:px-12 lg:py-20">
        <div className="max-w-xl">
          <div className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.18em] text-[#8CE5F3]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#8CE5F3]/25 bg-white/10"><Droplets size={19} aria-hidden="true" /></span>
            MLŽIDLA.cz / Nerezové mlžné brány
          </div>
          <h1 className="font-heading text-[clamp(2.7rem,5vw,5.6rem)] font-black leading-[1.03] tracking-[-.045em]">
            BRÁNA <span className="text-[#8CE5F3]">GATE</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-8 text-white/80 sm:text-lg">
            Designová průchozí mlžná brána pro veřejná prostranství, parky a vstupní zóny. Vyberte tvar a profil podle prostoru, potom společně ověříme instalaci a technické řešení.
          </p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[.16em] text-[#8CE5F3]">
            {options.length} katalogových provedení · Výběr podle geometrie
          </p>
          <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-3">
            <Spec icon={Settings2} label="Profil" value={selected?.profile} />
            <Spec icon={Ruler} label="Šířka × výška" value={selected?.dimensions ? `${selected.dimensions} mm` : ''} />
            <Spec icon={Droplets} label="Trysky" value={selected?.nozzles ? `${selected.nozzles} ks` : ''} />
          </div>
          <p className="mt-4 text-xs leading-5 text-white/55">Údaje se vztahují k vybranému provedení. Kotvení, přívod vody a konečné parametry potvrdíme pro danou instalaci.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to={inquiryLink(product, selected?.name)} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#00B4D8] px-6 py-3.5 text-sm font-bold text-[#081B33] transition hover:bg-[#8CE5F3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              Poptat vybranou variantu <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <a href="#varianty" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
              Porovnat provedení
            </a>
          </div>
        </div>
        <figure className="min-w-0 overflow-hidden rounded-[1.8rem] border border-white/20 bg-[#F8F9FA] shadow-[0_35px_85px_rgba(0,0,0,.24)]">
          <div className="aspect-[4/3] min-h-[300px] w-full sm:aspect-[5/4] lg:aspect-[4/5]">
            <GatePhoto key={selected?.name || 'gate'} src={mainImage} fallback={product.image_url}
              alt={`Katalogový náhled provedení ${selected?.name || product.name}`}
              className="h-full w-full object-contain object-center" eager />
          </div>
          <figcaption className="border-t border-[#E6EBEF] bg-white px-5 py-4 text-sm text-[#2B3A42]">
            <strong className="font-heading font-semibold">{selected?.name || product.name}</strong>
            <span className="mt-1 block text-xs leading-5 text-slate-500">Katalogový náhled konkrétní varianty. Fotografie prostředí v galerii jsou ilustrační.</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export function GateVariants({ product }) {
  const { options, selected, choose } = useGateSelection(product);
  if (!options.length) return null;
  return (
    <section id="varianty" aria-labelledby="gate-variants-title" className="scroll-mt-36 border-b border-[#E6EBEF] bg-[#F8F9FA] py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-9 grid gap-5 lg:grid-cols-[1fr_.75fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#008AA6]">Varianty produktu</p>
            <h2 id="gate-variants-title" className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#2B3A42] sm:text-4xl lg:text-5xl">
              Pět tvarů. Jedno řešení pro váš prostor.
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
            Porovnejte katalogové fotografie, rozměry, materiálový profil a počet trysek. Výběr varianty se přenese do formuláře poptávky.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="group" aria-label="Zvolit provedení mlžné brány">
          {options.map((item, index) => {
            const active = item.name === selected?.name;
            return (
              <button key={item.name} type="button" aria-pressed={active} onClick={() => choose(item.name)}
                className={`group flex h-full flex-col overflow-hidden rounded-[1.5rem] border-2 bg-white text-left transition duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008AA6] ${active ? 'border-[#00B4D8] shadow-[0_16px_45px_rgba(0,180,216,.14)]' : 'border-[#E6EBEF]'}`}>
                <div className="relative aspect-[4/3] w-full bg-[#EEF4F6] p-3">
                  <GatePhoto src={item.image_url} fallback={product.image_url}
                    alt={`Náhled ${item.name}`} className="h-full w-full rounded-xl object-contain" />
                  <span className="absolute left-5 top-5 rounded-full bg-[#081B33] px-3 py-1.5 text-[10px] font-bold tracking-widest text-white">0{index + 1}</span>
                  {active && <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-[#00B4D8] px-3 py-1.5 text-xs font-bold text-[#081B33]"><Check size={13} /> Vybráno</span>}
                </div>
                <div className="flex w-full flex-1 flex-col p-5 sm:p-6">
                  <h3 className="font-heading text-lg font-bold leading-snug text-[#2B3A42]">{item.name}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{item.description || 'Konfigurace brány podle katalogových údajů.'}</p>
                  <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-[#E6EBEF] pt-4">
                    <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Profil</dt><dd className="mt-1 break-words text-xs font-semibold text-[#2B3A42]">{item.profile || '—'}</dd></div>
                    <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Rozměr / mm</dt><dd className="mt-1 break-words text-xs font-semibold text-[#2B3A42]">{item.dimensions || '—'}</dd></div>
                    <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Trysky</dt><dd className="mt-1 text-xs font-semibold text-[#2B3A42]">{item.nozzles || '—'}</dd></div>
                  </dl>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#008AA6]">{active ? 'Aktuálně zvolené provedení' : 'Zvolit provedení'} <MoveUpRight size={16} aria-hidden="true" /></span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-3xl bg-[#081B33] p-6 text-white sm:p-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#8CE5F3]">Vybráno pro poptávku</p>
            <h3 className="mt-2 font-heading text-xl font-bold sm:text-2xl">{selected?.name}</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">Pošlete fotografii nebo plán prostoru. Parametry, technické řešení a výslednou cenu potvrdíme podle požadovaného provedení.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link to={inquiryLink(product, selected?.name)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#00B4D8] px-5 py-3 text-sm font-bold text-[#081B33] transition hover:bg-[#8CE5F3]">
              Zjistit cenu varianty <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to="/ke-stazeni" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Technické podklady <FileText size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-slate-500">
          <ScanLine size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          Názvy, rozměry a počty trysek jsou převzaty z aktuálního produktového katalogu Base44. Zobrazené snímky jsou produktové náhledy; stavební připravenost a finální specifikace jsou předmětem nabídky.
        </p>
      </div>
    </section>
  );
}
