import React from 'react';

export default function SpecsTable({ variant }) {
  const rows = [['Materiál', 'Nerezová ocel AISI 304 / 316'], ['Počet trysek', `${variant.nozzles} nerezové trysky`], ['Výška konstrukce', variant.height], ['Šířka oblouku', variant.width], ['Provozní tlak', '2–8 bar'], ['Spotřeba vody', `${variant.nozzles * 0.12}–${variant.nozzles * 0.24} l/min`], ['Napájení', 'Bez čerpadla · volitelně 24 V SMART']];
  return <section className="mt-9"><p className="text-sm font-semibold text-slate-950">Technické parametry</p><dl className="mt-4 divide-y divide-[#e5e5e5] border-y border-[#e5e5e5]">{rows.map(([label, value]) => <div key={label} className="grid grid-cols-2 gap-4 py-3 text-sm"><dt className="text-slate-500">{label}</dt><dd className="font-medium text-slate-950">{value}</dd></div>)}</dl></section>;
}