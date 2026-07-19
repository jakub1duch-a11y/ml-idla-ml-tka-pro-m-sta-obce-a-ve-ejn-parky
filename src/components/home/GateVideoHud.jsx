import React from 'react';
import { ArrowDown, Cloud, Construction, Droplets, Smartphone, Thermometer, Wifi, Wind } from 'lucide-react';

const hud = [
  { icon: Smartphone, value: 'ZÓNA 01', label: 'Aplikace připojena' },
  { icon: Thermometer, value: '31° → 24°', label: 'Pokles pocitové teploty' },
  { icon: Wind, value: '2,4 m/s', label: 'Směr proudění ↗' },
  { icon: Cloud, value: '18 m²', label: 'Rozloha mlžného závoje' },
  { icon: Construction, value: 'AISI 316L', label: 'Trubka Ø 60–76 mm' },
  { icon: Wifi, value: 'VENTIL ON', label: 'Průtok aktivní' },
];

export default function GateVideoHud({ active }) {
  const item = hud[active]; const Icon = item.icon;
  return <div className="pointer-events-none absolute inset-0 p-4">
    <div key={active} className="ml-auto w-44 border border-cyan/35 bg-slate-950/75 p-3 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-500"><div className="flex items-center gap-2 text-cyan"><Icon size={17} className="animate-pulse" /><span className="text-[9px] font-bold uppercase tracking-[.16em]">Live HUD</span></div><p className="mt-2 font-mono text-lg font-bold text-white">{item.value}</p><p className="mt-1 text-[10px] text-white/55">{item.label}</p></div>
    {active === 1 && <div className="absolute bottom-12 right-5 flex items-end gap-2"><div className="h-24 w-3 overflow-hidden rounded-full border border-white/30 bg-slate-950/60"><span className="block h-2/3 translate-y-8 bg-gradient-to-t from-cyan to-sky-200 animate-pulse" /></div><ArrowDown size={18} className="mb-1 animate-bounce text-cyan" /></div>}
    {active === 2 && <div className="absolute left-5 top-1/2 flex gap-2 text-cyan/75"><Wind size={22} className="animate-pulse" /><span className="h-px w-20 bg-gradient-to-r from-cyan to-transparent" /></div>}
    {active === 3 && <div className="absolute inset-x-[18%] bottom-[18%] h-[34%] rounded-[50%] border border-dashed border-cyan/70 bg-cyan/10 shadow-[0_0_40px_rgba(34,211,238,.22)]"><Droplets size={18} className="absolute right-3 top-3 animate-bounce text-cyan" /></div>}
  </div>;
}