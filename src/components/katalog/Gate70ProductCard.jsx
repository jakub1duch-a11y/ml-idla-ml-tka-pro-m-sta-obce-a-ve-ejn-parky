import React from 'react';
import { ArrowRight, ThermometerSnowflake } from 'lucide-react';
import { Link } from 'react-router-dom';

const imageUrl = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f21631baf_generated_image.png';

export default function Gate70ProductCard() {
  return <Link to="/gate70" className="group block h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-900 hover:shadow-xl">
    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
      <img src={imageUrl} alt="Mlžná brána GATE 70" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-sm">Detail <ArrowRight size={13} /></span>
    </div>
    <div className="p-5">
      <p className="content-eyebrow mb-2">Mlžná brána</p>
      <h3 className="font-heading text-xl font-medium tracking-tight text-slate-900">GATE 70</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">Výrazný chladivý vstupní prvek pro náměstí, hřiště i frekventovaný veřejný prostor.</p>
      <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-700"><ThermometerSnowflake size={14} className="text-cyan-600" /> Ochlazení aktivní zóny</p>
    </div>
  </Link>;
}