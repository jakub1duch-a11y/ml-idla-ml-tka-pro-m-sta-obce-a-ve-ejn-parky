import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Ruler, SlidersHorizontal } from 'lucide-react';

const CONFIGS = {
  'linea-avenue': { name: 'LINEA AVENUE', nozzles: 4, singular: 'LINEA' },
  'bendy-alej': { name: 'BENDY ALEJ', nozzles: null, singular: 'BENDY' },
};
const LAYOUTS = [
  { id: 'single', label: 'Jednostranná řada' },
  { id: 'double', label: 'Dvě protilehlé řady' },
  { id: 'alternate', label: 'Střídavě po stranách' },
];
const integer = (v, min, max) => Math.min(max, Math.max(min, Number(v) || min));
const format = (v) => new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 2 }).format(v);

export default function AvenueConfigurator({ product }) {
  const config = CONFIGS[product?.slug];
  const [count, setCount] = useState(5);
  const [spacing, setSpacing] = useState(3);
  const [layout, setLayout] = useState('single');
  const [space, setSpace] = useState('Park nebo promenáda');
  const [flow, setFlow] = useState('');
  const [waterPrice, setWaterPrice] = useState('');
  const [supla, setSupla] = useState(true);
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [place, setPlace] = useState('');
  const [customNozzles, setCustomNozzles] = useState('');
  const nozzlesPerUnit = config?.nozzles ?? (customNozzles ? integer(customNozzles, 1, 30) : null);
  const totalNozzles = nozzlesPerUnit === null ? null : count * nozzlesPerUnit;
  const span = layout === 'double' ? (Math.ceil(count / 2) - 1) * spacing : (count - 1) * spacing;
  const flowNumber = flow === '' ? null : Number(flow);
  const priceNumber = waterPrice === '' ? null : Number(waterPrice);
  const hourlyLitres = totalNozzles !== null && flowNumber > 0 ? totalNozzles * flowNumber : null;
  const cost = hourlyLitres !== null && priceNumber >= 0 && priceNumber !== null ? hourlyLitres * 8 / 1000 * priceNumber : null;
  const positions = useMemo(() => Array.from({ length: count }, (_, index) => {
    if (layout === 'double') return { x: Math.floor(index / 2), y: index % 2 ? 1 : 0 };
    return { x: index, y: layout === 'alternate' ? index % 2 : 0 };
  }), [count, layout]);
  if (!config) return null;
  const maxX = Math.max(...positions.map(p => p.x), 1);
  const query = new URLSearchParams({
    produkt: product.slug,
    sestava: '1',
    pocet: String(count),
    roztec: String(spacing),
    rozmisteni: LAYOUTS.find(item => item.id === layout)?.label || layout,
    prostor: space,
    delka: length,
    sirka: width,
    lokalita: place,
    supla: supla ? 'ano' : 'ne',
    trysky_na_kus: nozzlesPerUnit === null ? '' : String(nozzlesPerUnit),
    prutok_l_h_tryska: flowNumber > 0 ? String(flowNumber) : '',
    cena_vody_m3: priceNumber !== null && priceNumber >= 0 ? String(priceNumber) : '',
  });
  return (
    <section id="konfigurator-aleje" className="scroll-mt-36 bg-[#EDF8FA] px-4 py-16 sm:px-8" aria-labelledby="avenue-title">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#087A9B]">Navrhněte sestavu pro svůj prostor</p>
        <h2 id="avenue-title" className="mt-3 text-3xl font-bold text-[#0D2F4F] sm:text-5xl">{config.name} · konfigurátor aleje</h2>
        <p className="mt-4 max-w-3xl text-[#35546B]">Jeden typ mlžítka, libovolný rytmus rozmístění. Zvolte počet kusů a rozteč; půdorys a orientační parametry se přepočítají. Konečné osazení a hydraulický návrh potvrdíme v nabídce.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.1fr)]">
          <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-5 flex items-center gap-2 font-bold text-[#0D2F4F]"><SlidersHorizontal size={20} /> Parametry sestavy</div>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 10].map(n => <button key={n} type="button" onClick={() => setCount(n)} className={`rounded-xl border px-2 py-3 text-sm font-semibold ${count === n ? 'border-[#0B5EA8] bg-[#E6F5FC] text-[#0B5EA8]' : 'border-slate-200 text-slate-600'}`}>{n} ks · {n === 3 ? 'MINI' : n === 5 ? 'CITY' : 'PARK'}</button>)}
            </div>
            <label className="mt-6 block text-sm font-semibold text-[#0D2F4F]">Počet mlžítek: {count}
              <input className="mt-3 w-full accent-[#0B5EA8]" type="range" min="2" max="20" value={count} onChange={e => setCount(integer(e.target.value, 2, 20))} />
            </label>
            <label className="mt-5 block text-sm font-semibold text-[#0D2F4F]">Rozteč: {format(spacing)} m
              <input className="mt-3 w-full accent-[#0B5EA8]" type="range" min="1" max="8" step="0.5" value={spacing} onChange={e => setSpacing(Number(e.target.value))} />
            </label>
            <label className="mt-5 block text-sm font-semibold text-[#0D2F4F]">Rozmístění
              <select className="mt-2 w-full rounded-xl border border-slate-200 p-3" value={layout} onChange={e => setLayout(e.target.value)}>{LAYOUTS.map(x => <option key={x.id} value={x.id}>{x.label}</option>)}</select>
            </label>
            <label className="mt-5 block text-sm font-semibold text-[#0D2F4F]">Typ prostoru
              <select className="mt-2 w-full rounded-xl border border-slate-200 p-3" value={space} onChange={e => setSpace(e.target.value)}>{['Park nebo promenáda', 'Náměstí', 'Pěší zóna', 'Školní areál', 'Cyklostezka', 'Jiné místo'].map(x => <option key={x}>{x}</option>)}</select>
            </label>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <label className="text-sm font-semibold text-[#0D2F4F]">Délka místa (m)<input className="mt-2 w-full rounded-xl border border-slate-200 p-3" type="number" min="0" step="0.5" value={length} onChange={e => setLength(e.target.value)} placeholder="Nepovinné" /></label>
              <label className="text-sm font-semibold text-[#0D2F4F]">Šířka místa (m)<input className="mt-2 w-full rounded-xl border border-slate-200 p-3" type="number" min="0" step="0.5" value={width} onChange={e => setWidth(e.target.value)} placeholder="Nepovinné" /></label>
            </div>
            <label className="mt-5 block text-sm font-semibold text-[#0D2F4F]">Lokalita instalace
              <input className="mt-2 w-full rounded-xl border border-slate-200 p-3" value={place} onChange={e => setPlace(e.target.value)} placeholder="Město, ulice nebo odkaz na mapu (nepovinné)" />
            </label>
            {nozzlesPerUnit === null && <label className="mt-5 block text-sm font-semibold text-[#0D2F4F]">Trysky na jeden prvek (dle potvrzené dokumentace)
              <input className="mt-2 w-full rounded-xl border border-slate-200 p-3" type="number" min="1" max="30" value={customNozzles} onChange={e => setCustomNozzles(e.target.value)} placeholder="Zatím neurčeno" />
            </label>}
            <label className="mt-5 flex items-center gap-3 text-sm font-semibold text-[#0D2F4F]"><input type="checkbox" checked={supla} onChange={e => setSupla(e.target.checked)} className="h-5 w-5 accent-[#0B5EA8]" /> Chci doporučit řízení SUPLA</label>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-8">
            <div className="flex items-center gap-2 font-bold text-[#0D2F4F]"><Ruler size={20} /> Orientační půdorys</div>
            <div className="mt-5 rounded-2xl bg-[#F0F7F9] p-3 sm:p-5">
              <svg viewBox="0 0 600 210" className="h-auto w-full" role="img" aria-label={`Půdorys ${count} mlžítek v sestavě ${layout}`}>
                <rect x="15" y="45" width="570" height="125" rx="18" fill="#D8E7E8" />
                <path d="M 20 107 H 580" stroke="white" strokeWidth="3" strokeDasharray="10 10" />
                {positions.map((p, i) => <g key={i}><circle cx={36 + p.x / maxX * 528} cy={layout === 'single' ? 78 : p.y ? 148 : 68} r={count > 14 ? 7 : 10} fill="#0B5EA8" stroke="white" strokeWidth="2" /><circle cx={36 + p.x / maxX * 528} cy={layout === 'single' ? 78 : p.y ? 148 : 68} r={count > 14 ? 12 : 17} fill="none" stroke="#2AC9E3" opacity=".6" /></g>)}
              </svg>
              <p className="text-center text-xs text-slate-500">Schematické rozmístění, není to stavební ani hydraulický projekt.</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#E8F8FC] p-4"><p className="text-xs text-[#35546B]">Počet prvků</p><p className="mt-1 text-3xl font-bold text-[#0D2F4F]">{count}</p></div>
              <div className="rounded-2xl bg-[#E8F8FC] p-4"><p className="text-xs text-[#35546B]">Celkem trysek</p><p className="mt-1 text-3xl font-bold text-[#0D2F4F]">{totalNozzles ?? '—'}</p></div>
              <div className="rounded-2xl bg-[#E8F8FC] p-4"><p className="text-xs text-[#35546B]">Rozpětí sestavy</p><p className="mt-1 text-2xl font-bold text-[#0D2F4F]">{format(span)} m</p></div>
              <div className="rounded-2xl bg-[#E8F8FC] p-4"><p className="text-xs text-[#35546B]">Automatizace</p><p className="mt-1 text-xl font-bold text-[#0D2F4F]">{supla ? 'SUPLA' : 'Dle návrhu'}</p></div>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2 font-bold text-[#0D2F4F]"><Droplets size={19} /> Spotřeba a provoz</div>
              <p className="mt-2 text-xs leading-5 text-slate-500">Pro výpočet zadejte skutečný průtok trysky při pracovním tlaku. Bez tohoto údaje neuvádíme smyšlenou spotřebu ani cenu.</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="text-xs font-semibold text-[#35546B]">Průtok jedné trysky (l/h)<input type="number" min="0" step="0.01" className="mt-2 w-full rounded-xl border border-slate-200 p-3" value={flow} onChange={e => setFlow(e.target.value)} placeholder="Dle výrobce" /></label>
                <label className="text-xs font-semibold text-[#35546B]">Cena vody (Kč/m³)<input type="number" min="0" step="0.01" className="mt-2 w-full rounded-xl border border-slate-200 p-3" value={waterPrice} onChange={e => setWaterPrice(e.target.value)} placeholder="Dle lokality" /></label>
              </div>
              <p className="mt-4 text-sm text-[#0D2F4F]">Spotřeba: <strong>{hourlyLitres === null ? 'čeká na průtok trysky' : `${format(hourlyLitres)} l/h`}</strong></p>
              <p className="mt-1 text-sm text-[#0D2F4F]">Voda za 8 hodin: <strong>{hourlyLitres === null ? '—' : `${format(hourlyLitres * 8)} l`}</strong></p>
              <p className="mt-1 text-sm text-[#0D2F4F]">Cena vody za 8 hodin: <strong>{cost === null ? '—' : `${format(cost)} Kč`}</strong></p>
            </div>
            <Link to={`/poptavka?${query.toString()}`} className="mt-7 inline-flex w-full min-h-14 items-center justify-center gap-3 rounded-xl bg-[#0B5EA8] px-5 py-4 text-center font-bold text-white transition hover:bg-[#084A86]">Poptat tuto sestavu <ArrowRight size={19} /></Link>
            <p className="mt-3 text-xs text-slate-500">Nezávazná poptávka. Cenu výrobků a technologie připravíme podle aktuální kalkulace.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
