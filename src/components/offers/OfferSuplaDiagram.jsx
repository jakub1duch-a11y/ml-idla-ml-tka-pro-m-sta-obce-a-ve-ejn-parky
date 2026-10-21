import React from 'react';
export default function OfferSuplaDiagram({ shaft }) {
  return <svg className="op-supla-diagram" viewBox="0 0 680 160" role="img" aria-label={shaft ? 'Koncepční schéma SUPLA se šachtou' : 'Koncepční schéma SUPLA bez šachty'}>
    {shaft && <><rect x="175" y="12" width="320" height="135" fill="none" stroke="currentColor" strokeDasharray="6 4"/><text x="335" y="35" textAnchor="middle">Servisní šachta</text></>}
    {['Přívod vody', 'Filtr', 'SUPLA ventil', 'Mlžítko'].map((label, i) => <g key={label}><rect x={15 + i * 170} y="60" width="145" height="52" rx="5" fill="var(--op-soft)" stroke="currentColor"/><text x={87 + i * 170} y="91" textAnchor="middle">{label}</text>{i < 3 && <path d={`M ${160 + i * 170} 86 h25 m-6 -5 l6 5 -6 5`} fill="none" stroke="currentColor" strokeWidth="2"/>}</g>)}
  </svg>;
}