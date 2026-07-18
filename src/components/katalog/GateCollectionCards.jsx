import React from 'react';
import { Link } from 'react-router-dom';

const GATES = [
  { name: 'GATE 60', text: 'Kompaktní mlžná brána pro vstupy, menší náměstí a koupaliště.' },
  { name: 'GATE 76', text: 'Robustní brána pro frekventované veřejné prostory.' },
  { name: 'LINEA CE60', text: 'Lineární mlžný prvek pro pěší trasy a terasy.' },
  { name: 'LINEA CE70', text: 'Výrazný architektonický prvek pro reprezentativní vstupy.' },
];
const image = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f21631baf_generated_image.png';

export default function GateCollectionCards() {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{GATES.map((gate) => <Link to={`/poptavka?produkt=${encodeURIComponent(gate.name)}`} key={gate.name} className="group overflow-hidden border border-slate-200 bg-white transition hover:border-[#0070F3]"><img src={image} alt={`${gate.name} mlžná brána`} className="h-40 w-full object-cover transition duration-500 group-hover:scale-105" /><div className="p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#0070F3]">Mlžná brána</p><h3 className="mt-2 text-lg text-slate-950">{gate.name}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{gate.text}</p></div></Link>)}</div>;
}