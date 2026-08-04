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
  return <section className="overflow-hidden bg-primary py-20 lg:py-28"><div className="mx-auto max-w-7xl px-6 lg:px-8"><div className="mb-10 max-w-2xl"><p className="font-mono tracking-[.18em] uppercase text-accent text-xs">ŘEŠENÍ PRO MĚSTA</p><h2 className="font-heading text-primary-foreground text-left mt-4 text-4xl lg:text-xl">Veřejný prostor, který funguje i v horku.</h2><p className="mt-4 [font-family:'Inter',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-normal text-lg text-left text-[hsl(var(--background))]">Navrhneme mlžný systém podle pohybu lidí, charakteru místa i provozních podmínek — od návrhu po instalaci.</p></div><div className="grid overflow-hidden rounded-3xl border border-white/15 lg:grid-cols-[1.35fr_.65fr]"><div className="relative min-h-[440px] overflow-hidden"><img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/da0942c09_mlzidla-mlzitka-pro-mesta-obce.png" alt="Mlžná brána na městském náměstí" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/10 to-transparent" /><WindMistOverlay /><div className="absolute bottom-6 left-6 right-6 flex items-end justify-between"><div><p className="font-mono text-[10px] tracking-[.16em] text-accent">LIVE SIMULACE · MLŽNÁ BRÁNA</p><p className="mt-2 text-lg font-semibold text-white">Tepelný ostrov se ochlazuje</p></div><div className="text-right"><motion.p key={temperature} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-heading text-5xl text-white">{temperature}°C</motion.p><p className="text-xs text-white/65">cílově 24 °C</p></div></div></div></div></div></section>;
}