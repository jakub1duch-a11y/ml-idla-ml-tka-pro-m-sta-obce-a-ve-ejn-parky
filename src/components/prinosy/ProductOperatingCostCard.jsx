import React from 'react';
import { ArrowRight, Droplets, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';

const TOTAL_RATE = 129.11;
const WATER_RATE = 75.86;
const FLOW_AT_4_BAR = 7.2;
const money = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 });

export default function ProductOperatingCostCard({ product, nozzles }) {
  const hourly = nozzles * FLOW_AT_4_BAR;
  const dayLiters = hourly * 8;
  const seasonHours = 120 * 8;
  const sensorHours = 20 * 8 + 100 * 2;
  const fullLiters = hourly * seasonHours;
  const sensorLiters = hourly * sensorHours;
  const cost = (liters, rate) => liters / 1000 * rate;
  return <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <Link to={`/produkt/${product.slug}`} className="group block aspect-[16/10] overflow-hidden bg-slate-100"><img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></Link>
    <div className="p-5"><div className="flex items-start justify-between gap-4"><div><p className="content-eyebrow mb-1">{nozzles} trysek · 4 bar</p><h3 className="m-0 text-xl font-semibold text-slate-950">{product.name}</h3></div><Gauge size={18} className="text-techblue" /></div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-slate-50 p-3"><span className="text-xs text-slate-500">8 hodin denně</span><b className="mt-1 block text-slate-950">{money.format(dayLiters)} l · {money.format(cost(dayLiters, TOTAL_RATE))} Kč</b></div><div className="rounded-xl bg-slate-50 p-3"><span className="text-xs text-slate-500">Celá sezóna · 960 h</span><b className="mt-1 block text-slate-950">{money.format(fullLiters)} l · {money.format(cost(fullLiters, TOTAL_RATE))} Kč</b></div></div>
      <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Pohybový senzor · model 360 h</p><p className="mt-1 text-sm text-slate-700">{money.format(sensorLiters)} l · <b>{money.format(cost(sensorLiters, TOTAL_RATE))} Kč se stočným</b> · {money.format(cost(sensorLiters, WATER_RATE))} Kč bez stočného</p><p className="mt-2 text-xs text-emerald-700">Úspora proti celodenní sezóně: {money.format(cost(fullLiters - sensorLiters, TOTAL_RATE))} Kč</p></div>
      <div className="mt-5 flex flex-wrap gap-3"><Link to={`/produkt/${product.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">Detail <ArrowRight size={14} /></Link><Link to={`/poptavka?produkt=${encodeURIComponent(product.name)}`} className="inline-flex items-center gap-2 text-sm font-bold text-techblue"><Droplets size={14} /> Poptat řešení</Link></div>
    </div>
  </article>;
}