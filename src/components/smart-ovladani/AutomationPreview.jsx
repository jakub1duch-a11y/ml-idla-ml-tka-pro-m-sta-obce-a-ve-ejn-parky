import React from 'react';
import { motion } from 'framer-motion';
import { CloudSun, Thermometer, Timer, Users } from 'lucide-react';

const STATUS = [
{ Icon: Thermometer, label: 'Teplota', value: '28 °C' },
{ Icon: CloudSun, label: 'Počasí', value: 'Sucho' },
{ Icon: Users, label: 'Prostor', value: 'Aktivní' }];


export default function AutomationPreview() {
  return <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.65 }} className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-sm">
    <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/25 blur-3xl" />
    <div className="relative flex items-center justify-between border-b border-white/15 pb-4"><div><p className="font-mono tracking-[.18em] text-accent text-sm">SMART CONTROL</p><p className="mt-1 font-semibold text-[hsl(var(--foreground))] text-base">Terasa · zóna 01</p></div><span className="flex items-center gap-1.5 text-xs text-accent"><span className="h-2 w-2 rounded-full bg-accent animate-pulse" /> Aktivní</span></div>
    <div className="relative mt-4 grid grid-cols-3 gap-2">{STATUS.map(({ Icon, label, value }) => <div key={label} className="rounded-xl bg-white/10 p-3"><Icon size={17} className="text-accent" /><p className="mt-3 text-sm text-[hsl(var(--background))]">{label}</p><p className="font-semibold text-sm text-[hsl(var(--background))]">{value}</p></div>)}</div>
    <div className="relative mt-4 flex items-center gap-3 rounded-xl bg-accent p-3 text-primary"><Timer size={20} /><div><p className="text-xs font-bold">Mlžení spuštěno</p><p className="opacity-70 text-sm">Scénář: komfort při vedru</p></div><motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.8 }} className="ml-auto font-mono text-sm">00:18</motion.span></div>
  </motion.div>;
}