import React, { useMemo, useState } from 'react';
import { Droplets, ChevronDown, Clock3, Gauge, WalletCards, Sparkles } from 'lucide-react';

const PRODUCTS = [
{ id: 'volavka', name: 'MLŽÍTKO VOLAVKA', flow: 40.5, range: '27–54 l/h', pressure: '2–8 bar' },
{ id: 'brana-bendy', name: 'BRÁNA BENDY', flow: 35, range: '30–40 l/h', pressure: '2–8 bar' },
{ id: 'aura', name: 'MLŽNÁ AURA', flow: 3, range: '2–4 l/h', pressure: '2–8 bar' },
{ id: 'gate', name: 'BRÁNA GATE', flow: 20, range: '15–25 l/h', pressure: '2–8 bar' },
{ id: 'bendy', name: 'MLŽÍTKO BENDY', flow: 210, range: '3,5 l/min', pressure: '2–8 bar' },
{ id: 'y-armist', name: 'Y-ARMIST – TUBE', flow: 24, range: '0,3–0,5 l/min', pressure: '2–8 bar' },
{ id: 'iris', name: 'BRÁNA IRIS', flow: 30, range: '0,5 l/min', pressure: '2–8 bar' },
{ id: 'mrak', name: 'MLŽNÝ MRAK', flow: 8.5, range: '7–10 l/h', pressure: '2–8 bar' },
{ id: 'linea', name: 'MLŽÍTKO LINEA', flow: 6, range: '4–8 l/h', pressure: '2–8 bar' },
{ id: 'spirala', name: 'MLŽNÁ SPIRÁLA', flow: 6.5, range: '5–8 l/h', pressure: '2–8 bar' },
{ id: 'ostrev', name: 'MLŽÍTKO OSTREV', flow: 18.5, range: '18,5 l/h', pressure: '2–8 bar' }];


const WATER_PRICE = 129.11; // orientační voda + stočné Kč/m³
const SMART_SAVING = 0.25;
const money = (v) => new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(v);
const number = (v, d = 1) => new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: d }).format(v);

export default function MlzeniKalkulator() {
  const [productId, setProductId] = useState('mrak');
  const [hours, setHours] = useState(8);
  const [days, setDays] = useState(20);
  const [smart, setSmart] = useState(true);
  const [open, setOpen] = useState(false);
  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];

  const calc = useMemo(() => {
    const factor = smart ? 1 - SMART_SAVING : 1;
    const litersDay = product.flow * hours * factor;
    const litersMonth = litersDay * days;
    const cost = litersMonth / 1000 * WATER_PRICE;
    const standardLiters = product.flow * hours * days;
    const standardCost = standardLiters / 1000 * WATER_PRICE;
    return { litersDay, litersMonth, cost, standardCost, saving: standardCost - cost, hourly: cost / Math.max(hours * days, 1) };
  }, [product, hours, days, smart]);

  return <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#071b25] text-white shadow-2xl shadow-black/10">
    <div className="border-b border-white/10 px-6 py-6 sm:px-8 lg:flex lg:items-end lg:justify-between">
      <div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-cyan-300">Provozní kalkulace</p><h3 className="mt-2 font-heading text-2xl sm:text-3xl">Kolik vody spotřebuje vaše mlžítko?</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">Výpočet vychází z parametrů aktivních produktů MLŽIDLA.cz. Naše systémy pracují přímo s tlakem vodovodního řadu, proto zde nepočítáme spotřebu elektrického čerpadla.</p></div>
      <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/5 px-4 py-2 text-xs text-cyan-100 lg:mt-0"><Gauge size={14} /> Bez vysokotlakého čerpadla</div>
    </div>

    <div className="grid lg:grid-cols-[.92fr_1.08fr]">
      <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
        <label className="font-mono text-[10px] uppercase tracking-[.18em] text-[hsl(var(--card))]">Mlžný systém</label>
        <div className="relative mt-2">
          <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/[.04] px-5 py-4 text-left transition hover:border-cyan-300/40"><span><strong className="block text-sm">{product.name}</strong><small className="mt-1 block text-[hsl(var(--background))]">{product.range} · {product.pressure}</small></span><ChevronDown size={17} className={`text-white/50 transition ${open ? 'rotate-180' : ''}`} /></button>
          {open && <div className="absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-2xl border border-white/15 bg-[#0b2632] p-2 shadow-2xl">{PRODUCTS.map((p) => <button key={p.id} onClick={() => {setProductId(p.id);setOpen(false);}} className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition hover:bg-white/10 ${p.id === product.id ? 'bg-white/10 text-cyan-200' : ''}`}><span>{p.name}</span><span className="ml-3 text-xs text-white/40">{p.range}</span></button>)}</div>}
        </div>

        {[['Provoz denně', hours, setHours, 1, 16, 'h'], ['Dní provozu za měsíc', days, setDays, 1, 31, 'dní']].map(([label, val, set, min, max, suffix]) => <div className="mt-7" key={label}><div className="mb-3 flex items-center justify-between"><span className="text-sm text-white/65">{label}</span><strong className="font-mono text-sm text-cyan-200">{val} {suffix}</strong></div><input type="range" min={min} max={max} value={val} onChange={(e) => set(Number(e.target.value))} className="h-1.5 w-full accent-cyan-400" /></div>)}

        <button onClick={() => setSmart(!smart)} className={`mt-8 flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition ${smart ? 'border-cyan-300/30 bg-cyan-300/10' : 'border-white/15 bg-white/[.03]'}`}><span className="flex items-center gap-3"><Sparkles size={18} className="text-cyan-300" /><span><strong className="block text-sm">Chytré řízení provozu</strong><small className="mt-1 block text-sm">Modeluje omezení zbytečného mlžení podle provozu a podmínek.</small></span></span><span className={`h-6 w-11 rounded-full p-1 transition ${smart ? 'bg-cyan-400' : 'bg-white/15'}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${smart ? 'translate-x-5' : ''}`} /></span></button>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid gap-3 sm:grid-cols-2">
          <Metric icon={Droplets} label="Spotřeba za den" value={`${number(calc.litersDay)} l`} />
          <Metric icon={Clock3} label="Spotřeba za měsíc" value={`${number(calc.litersMonth / 1000, 2)} m³`} />
        </div>
        <div className="mt-3 rounded-2xl border border-cyan-300/25 bg-gradient-to-br from-cyan-300/10 to-transparent p-6">
          <div className="flex items-center gap-2 text-cyan-200"><WalletCards size={17} /><span className="font-mono text-[10px] uppercase tracking-[.18em]">Orientační provozní náklad</span></div>
          <div className="mt-4 flex items-end gap-2"><strong className="font-heading text-5xl font-light tabular-nums">{money(calc.cost)}</strong><span className="pb-1">Kč / měsíc</span></div>
          <p className="mt-3 leading-relaxed text-sm text-[hsl(var(--card))]">Počítáno orientačně s vodným a stočným {number(WATER_PRICE, 2)} Kč/m³. Skutečná sazba se liší podle lokality a provozovatele.</p>
        </div>
        {smart && <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[.035] p-5"><div><p className="text-[hsl(var(--background))] text-sm">Modelovaná úspora díky chytrému řízení</p><p className="mt-1 text-sm text-[hsl(var(--card))]">oproti nepřetržitému provozu v nastaveném čase</p></div><strong className="ml-4 whitespace-nowrap text-xl text-cyan-200">≈ {money(calc.saving)} Kč/měs.</strong></div>}
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 text-sm"><div><span className="block text-sm text-[hsl(var(--card))]">Průtok produktu</span><strong className="mt-1 block">{product.range}</strong></div><div><span className="block text-sm text-[hsl(var(--card))]">Provozní tlak</span><strong className="mt-1 block">{product.pressure}</strong></div></div>
      </div>
    </div>
  </div>;
}

function Metric({ icon: Icon, label, value }) {return <div className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><Icon size={16} className="text-cyan-300" /><span className="mt-4 block text-sm">{label}</span><strong className="mt-1 block text-2xl font-light tabular-nums">{value}</strong></div>;}