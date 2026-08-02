import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Heart, ShoppingBag, UsersRound, Wind } from 'lucide-react';
import WindMistOverlay from '@/components/home/premium/WindMistOverlay';

const BENEFITS = [
{ Icon: Heart, text: 'Vraťte život na náměstí i zahrádky' },
{ Icon: UsersRound, text: 'Zábava pro děti, rodiče i návštěvníky' },
{ Icon: Wind, text: 'Čistší a příjemnější vzduch v úmorných vedrech' },
{ Icon: Building2, text: 'Vyšší komfort pro obyvatele i zvířata' },
{ Icon: ShoppingBag, text: 'Delší návštěvy a větší podpora prodeje' }];


export default function UrbanCoolingImpact() {
  const [temperature, setTemperature] = useState(34);
  useEffect(() => {const timer = setInterval(() => setTemperature((value) => value > 24 ? value - 1 : value), 480);return () => clearInterval(timer);}, []);
  return <section className="overflow-hidden bg-primary py-20 lg:py-28"><div className="mx-auto max-w-7xl px-6 lg:px-8"><div className="mb-10 max-w-2xl"><p className="font-mono text-[11px] tracking-[.18em] uppercase text-accent">Řešení pro města</p><h2 className="mt-4 font-heading text-4xl text-primary-foreground lg:text-5xl">Veřejný prostor, který funguje i v horku.</h2><p className="mt-4 text-primary-foreground/70">Navrhneme mlžný systém podle pohybu lidí, charakteru místa i provozních podmínek — od návrhu po instalaci.</p></div><div className="grid overflow-hidden rounded-3xl border border-white/15 lg:grid-cols-[1.35fr_.65fr]"><div className="relative min-h-[440px] overflow-hidden"><img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/da0942c09_mlzidla-mlzitka-pro-mesta-obce.png" alt="Mlžná brána na městském náměstí" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/10 to-transparent" /><WindMistOverlay /><div className="absolute bottom-6 left-6 right-6 flex items-end justify-between"><div><p className="font-mono text-[10px] tracking-[.16em] text-accent">LIVE SIMULACE · MLŽNÁ BRÁNA</p><p className="mt-2 text-lg font-semibold text-white">Tepelný ostrov se ochlazuje</p></div><div className="text-right"><motion.p key={temperature} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-heading text-5xl text-white">{temperature}°C</motion.p><p className="text-xs text-white/65">cílově 24 °C</p></div></div></div><div className="bg-white/5 p-7 lg:p-9"><div className="flex h-20 items-end gap-1.5">{[36, 52, 73, 58, 87, 68, 45, 30].map((height, index) => <motion.span key={index} animate={{ height: [`${height}%`, `${Math.max(18, height - 24)}%`, `${height}%`] }} transition={{ duration: 1.2 + index * .08, repeat: Infinity, ease: 'easeInOut' }} className="w-full rounded-full bg-accent/80" />)}</div><p className="mt-5 text-xs text-primary-foreground/55 hidden">Zvuková a světelná atmosféra · mlha v pohybu</p><div className="mt-8 space-y-4">{BENEFITS.map(({ Icon, text }) => <div key={text} className="flex gap-3 text-sm leading-relaxed text-primary-foreground/85"><Icon size={19} className="shrink-0 text-accent" />{text}</div>)}</div><Link to="/poptavka" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-accent">Navrhnout ochlazení náměstí <ArrowRight size={16} /></Link></div></div></div></section>;
}