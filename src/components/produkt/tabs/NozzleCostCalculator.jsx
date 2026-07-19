import React from 'react';
import { Calculator, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';

const TOTAL_RATE = 129.11;
const WATER_RATE = 75.86;
const FLOW_AT_4_BAR = 7.2;
const COUNTS = { 'bendy-60': 2, 'gate-60-76': 5, 'ostrev-mlzitko': 7 };
const money = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 });

export default function NozzleCostCalculator({ product }) {
  const parsed = Number((product.micron_size || '').match(/(\d+)\s*trysk/i)?.[1]);
  const nozzles = COUNTS[product.slug] || parsed || 1;
  const hourly = nozzles * FLOW_AT_4_BAR;
  const dayLiters = hourly * 8;
  const seasonLiters = hourly * 960;
  const sensorLiters = hourly * 360;
  const totalCost = (liters) => liters / 1000 * TOTAL_RATE;
  const waterCost = (liters) => liters / 1000 * WATER_RATE;
  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white"><div className="grid md:grid-cols-[180px_1fr]">
    <img src={product.image_url} alt={product.name} className="h-full min-h-44 w-full object-cover" /><div className="p-6"><div className="flex items-center gap-2 text-cyan"><Calculator size={16} /><p className="text-xs font-bold uppercase tracking-widest">Provoz při 4 bar · {nozzles} trysek</p></div><h3 className="mt-3 text-xl font-semibold text-white">{product.name}</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-white/5 p-3"><span className="text-xs text-white/45">8 hodin denně</span><b className="mt-1 block">{money.format(dayLiters)} l · {money.format(totalCost(dayLiters))} Kč</b></div><div className="rounded-xl bg-white/5 p-3"><span className="text-xs text-white/45">Sezóna · 960 h</span><b className="mt-1 block">{money.format(seasonLiters)} l · {money.format(totalCost(seasonLiters))} Kč</b></div><div className="rounded-xl bg-emerald-500/10 p-3"><span className="text-xs text-emerald-300">Se senzorem · 360 h</span><b className="mt-1 block">{money.format(sensorLiters)} l · {money.format(totalCost(sensorLiters))} Kč</b></div></div>
      <p className="mt-4 text-xs leading-relaxed text-white/55">Cena se senzorem bez stočného: {money.format(waterCost(sensorLiters))} Kč. Úspora oproti celodenní sezóně: {money.format(totalCost(seasonLiters - sensorLiters))} Kč.</p><Link to={`/poptavka?produkt=${encodeURIComponent(product.name)}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-cyan"><Droplets size={14} /> Poptat toto řešení</Link>
    </div></div></div>;
}