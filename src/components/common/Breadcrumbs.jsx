import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items, light = false }) {
  const color = light ? 'text-white/65' : 'text-slate-500';
  return <nav aria-label="Drobečková navigace" className={`flex flex-wrap items-center gap-2 text-xs ${color}`}><Link to="/" className="font-semibold hover:underline">Domů</Link>{items.map((item, index) => <React.Fragment key={item.label}><ChevronRight size={13} /><span>{item.to && index < items.length - 1 ? <Link to={item.to} className="font-semibold hover:underline">{item.label}</Link> : item.label}</span></React.Fragment>)}</nav>;
}