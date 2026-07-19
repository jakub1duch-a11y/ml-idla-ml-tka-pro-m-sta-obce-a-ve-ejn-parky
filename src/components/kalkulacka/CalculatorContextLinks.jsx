import React from 'react';
import { ArrowRight, Building2, Gauge, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

const links = [
  { icon: Building2, title: 'Řešení pro města a obce', text: 'Jak navrhnout veřejnou mlžnou zónu a zvolit vhodný model.', to: '/vyuziti/mesta-obce' },
  { icon: Gauge, title: 'Snižování provozních nákladů', text: 'Jak Smart řízení omezuje provoz na dobu, kdy má mlžení skutečný přínos.', to: '/prinosy-mlzitek/snizovani-provoznich-nakladu' },
  { icon: Lightbulb, title: 'Vybrat vhodné řešení', text: 'Porovnejte designová mlžítka, mlžné brány a chytré moduly.', to: '/katalog' },
];
export default function CalculatorContextLinks() { return <section className="mt-14 border-t border-slate-200 pt-10"><p className="content-eyebrow">Co dál s výsledkem</p><h2 className="mt-3 text-slate-950">Převeďte výpočet do konkrétního návrhu.</h2><div className="mt-7 grid gap-4 md:grid-cols-3">{links.map(({ icon: Icon, title, text, to }) => <Link key={to} to={to} className="group border border-slate-200 p-6 transition hover:border-techblue"><Icon className="text-techblue" /><h3 className="mt-4 text-lg text-slate-950">{title}</h3><p className="mt-2 text-sm text-slate-600">{text}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-950">Zjistit více <ArrowRight size={14} /></span></Link>)}</div></section>; }