import React from 'react';
import { ArrowRight, Droplets, Gauge, MapPinned, PlugZap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackProductClick } from '@/lib/ga4';

const getSpecs = (product) => [
  { icon: Gauge, label: 'Tlak', value: product.pressure },
  { icon: Droplets, label: 'Spotřeba', value: product.water_consumption },
  { icon: MapPinned, label: 'Plocha', value: product.coverage_area },
  { icon: PlugZap, label: 'Napájení', value: product.power_supply },
].filter((spec) => spec.value).slice(0, 4);

export default function CatalogProductCard({ product }) {
  const specs = getSpecs(product);
  const isGate = /gate|brán/i.test(`${product.name} ${product.short_description || ''}`);
  return <Link to={product.slug ? `/produkt/${product.slug}` : '/kontakt'} onClick={() => trackProductClick(product.name, product.slug, 'chytra_mlzidla')} className="group block h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-900 hover:shadow-xl"><div className="relative aspect-[4/3] overflow-hidden bg-slate-100">{product.image_url && <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />}<span className="absolute left-3 top-3 bg-slate-950/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan backdrop-blur">{isGate ? 'Vstupní mlžná brána' : 'Architektonické mlžítko'}</span><span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-sm">Detail <ArrowRight size={13} /></span></div><div className="p-5"><h3 className="font-heading text-xl font-medium tracking-tight text-slate-900">{product.name}</h3><p className="mt-2 min-h-10 text-sm leading-relaxed text-slate-500">{product.short_description}</p>{specs.length > 0 && <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">{specs.map(({ icon: Icon, label, value }) => <div key={label} className="flex min-w-0 items-center gap-2"><Icon size={14} className="shrink-0 text-cyan-600" /><div className="min-w-0"><dt className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</dt><dd className="truncate text-xs font-semibold text-slate-800">{value}</dd></div></div>)}</dl>}</div></Link>;
}