import React from 'react';
import { NOZZLE_TYPES } from '@/components/produkt/nozzles/nozzleData';

export default function NozzleControls({ count, setCount, type, setType, pressure, setPressure, tariff, setTariff }) {
  const nozzle = NOZZLE_TYPES.find(item => item.id === type);
  const changeType = (id) => {
    const next = NOZZLE_TYPES.find(item => item.id === id);
    setType(id);
    if (!next.flows[pressure]) setPressure(Number(Object.keys(next.flows)[0]));
  };
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <label className="text-sm font-semibold">Typ trysky
      <select value={type} onChange={e => changeType(e.target.value)}>{NOZZLE_TYPES.map(n => <option key={n.id} value={n.id}>{n.id}{n.id === 'M2' ? ' · standard' : ' · na posouzení'} · Ø {n.diameter} mm</option>)}</select>
    </label>
    <label className="text-sm font-semibold">Tlak na trysce
      <select value={pressure} onChange={e => setPressure(Number(e.target.value))}>{Object.keys(nozzle.flows).map(p => <option key={p} value={p}>{p} bar</option>)}</select>
    </label>
    <label className="text-sm font-semibold">Počet aktivních trysek
      <input type="number" inputMode="numeric" min="1" max="24" step="1" value={count} placeholder="Zadejte počet" onChange={e => setCount(e.target.value)} />
    </label>
    <label className="text-sm font-semibold">Cena vody (Kč/m³)
      <input type="number" inputMode="decimal" min="0" step="0.01" value={tariff} onChange={e => setTariff(e.target.value)} />
    </label>
    <p className="text-xs text-muted-foreground sm:col-span-2">Průtoky jsou převzaty z tabulky, nikoli dopočítány z fotografie. Alternativní trysky a tlak musí odpovídat konkrétnímu systému.</p>
  </div>;
}