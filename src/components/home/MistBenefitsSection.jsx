import React from 'react';
import { motion } from 'framer-motion';

const BENEFITS = [
  { video: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/55dfe1348_ochlazovani-icon.mp4', value: '−4 až −7 °C', label: 'Přirozené ochlazení', text: 'Úleva pro lidi i rozpálené městské prostředí.' },
  { video: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/7785bfd59_mist-animatedicon02.mp4', value: '100–300 μm', label: 'Viditelná jemná mlha', text: 'Mikrokapky pro příjemné osvěžení bez kaluží.' },
  { video: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/371a74a68_smartappicons-aniamted.mp4', value: 'SMART APP', label: 'Řízení podle provozu', text: 'Mlha přesně tehdy, kdy ji prostor potřebuje.' },
  { video: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/4a060ca58_spojkojenost-misticon.mp4', value: '4 bar', label: 'Pohoda v prostoru', text: 'Tiché nízkotlaké řešení pro každodenní použití.' },
];

export default function MistBenefitsSection() {
  return <section id="vyhody" className="bg-white py-20 lg:py-28"><div className="mx-auto max-w-7xl px-6 lg:px-10"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan">Výhody mlžítek</p><h2 className="mt-4 font-heading text-4xl font-medium tracking-tight text-slate-900 lg:text-5xl">Technologie, kterou člověk opravdu cítí.</h2></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{BENEFITS.map((benefit, index) => <motion.article key={benefit.label} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="rounded-3xl border border-slate-200 bg-slate-50 p-6"><video src={benefit.video} autoPlay muted loop playsInline preload="metadata" className="h-20 w-20 object-contain" /><p className="mt-5 text-2xl font-bold text-slate-900">{benefit.value}</p><h3 className="mt-2 font-heading text-xl font-semibold text-slate-900">{benefit.label}</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">{benefit.text}</p></motion.article>)}</div></div></section>;
}