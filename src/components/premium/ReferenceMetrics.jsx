import React from 'react';

const metrics = [['27+', 'instalací ve veřejném prostoru'], ['5+', 'měst'], ['20+', 'let zkušeností']];

export default function ReferenceMetrics() {
  return <section className="bg-[#062d3b] py-14"><div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-3 gap-5">{metrics.map(([number, label]) => <div key={label} className="text-center border-r border-white/15 last:border-0"><p className="font-heading text-4xl lg:text-6xl text-white">{number}</p><p className="font-mono text-[10px] tracking-[0.16em] uppercase text-cyan mt-2">{label}</p></div>)}</div></section>;
}