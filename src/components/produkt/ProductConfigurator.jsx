import React, { useMemo, useState } from 'react';
import { Check, ChevronRight, Cpu, Droplets, Layers3, Ruler, ShieldCheck, Sparkles, Waves } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OPTIONS = {
  height: [
    { value: '180', label: '180 cm', meta: 'Kompaktní' },
    { value: '220', label: '220 cm', meta: 'Signature' },
    { value: '250', label: '250 cm', meta: 'Dominantní' },
  ],
  mounting: [
    { value: 'ground', label: 'Do země', meta: 'Integrované kotvení' },
    { value: 'paving', label: 'Na dlažbu', meta: 'Kotvicí základna' },
  ],
  finish: [
    { value: 'steel', label: 'Kartáčovaný 316L', color: '#b9c0c5', meta: 'Architectural' },
    { value: 'black', label: 'Matná černá', color: '#171a1d', meta: 'Minimalist' },
    { value: 'bronze', label: 'Bronz', color: '#8b5e3c', meta: 'Signature' },
  ],
  nozzle: [
    { value: '60', label: '60°', meta: 'Koncentrovaná mlha', reach: 2.5 },
    { value: '90', label: '90°', meta: 'Vyvážený kužel', reach: 4 },
    { value: '120', label: '120°', meta: 'Široké pokrytí', reach: 6 },
  ],
};

export default function ProductConfigurator({ product, onRequestQuote }) {
  const [config, setConfig] = useState({ height: '220', mounting: 'ground', finish: 'steel', nozzle: '90', smart: true });
  const [active, setActive] = useState('height');

  const set = (key, value) => setConfig((current) => ({ ...current, [key]: value }));
  const selected = useMemo(() => ({
    height: OPTIONS.height.find((x) => x.value === config.height),
    mounting: OPTIONS.mounting.find((x) => x.value === config.mounting),
    finish: OPTIONS.finish.find((x) => x.value === config.finish),
    nozzle: OPTIONS.nozzle.find((x) => x.value === config.nozzle),
  }), [config]);

  const mistScale = selected.nozzle.reach / 4;
  const heightScale = Number(config.height) / 220;

  return (
    <section className="bg-[#080b0e] text-white py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <p className="text-[10px] font-mono tracking-[0.28em] text-cyan-300 uppercase mb-4">Product configurator / 01</p>
            <h2 className="text-4xl lg:text-6xl font-light tracking-tight">Navrhni si <span className="text-cyan-300">vlastní {product.name}.</span></h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-white/45">Vyberte rozměr, způsob kotvení, povrch a charakter mlhy. Konfigurace se přenese přímo do vaší poptávky.</p>
        </div>

        <div className="grid lg:grid-cols-[1.25fr_.75fr] gap-5 items-stretch">
          <div className="relative min-h-[520px] rounded-[28px] overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,.10),transparent_35%),linear-gradient(145deg,#11161b,#06080a)]">
            <div className="absolute top-5 left-5 flex gap-2">
              <span className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[9px] font-mono tracking-widest text-white/50">LIVE CONFIGURATION</span>
              {config.smart && <span className="px-3 py-1.5 rounded-full border border-cyan-300/20 bg-cyan-300/10 text-[9px] font-mono tracking-widest text-cyan-200">SMART</span>}
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div animate={{ height: `${240 * heightScale}px` }} transition={{ duration: .7, ease: [0.22,1,.36,1] }} className="relative w-[42px] rounded-full bg-gradient-to-r from-[#555] via-[#e5e7e9] to-[#454a4e] shadow-[0_0_70px_rgba(255,255,255,.10)]" style={selected.finish?.value === 'black' ? { background: 'linear-gradient(90deg,#08090a,#272b2e,#070808)' } : selected.finish?.value === 'bronze' ? { background: 'linear-gradient(90deg,#4e3021,#b17b50,#543421)' } : {}}>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-200 shadow-[0_0_18px_#67e8f9]" />
                <AnimatePresence>
                  {[...Array(9)].map((_, i) => <motion.i key={i} initial={{ opacity: 0 }} animate={{ opacity: .12 + i * .015, x: (i % 2 ? 1 : -1) * (18 + i * 5), y: -(60 + i * 12), scale: mistScale * (0.75 + i / 20) }} transition={{ duration: 1.4, repeat: Infinity, delay: i * .12 }} className="absolute left-1/2 bottom-[96%] w-24 h-24 rounded-full bg-cyan-100 blur-2xl pointer-events-none" />)}
                </AnimatePresence>
                <motion.div animate={{ scaleX: mistScale }} transition={{ duration: .6 }} className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-24 h-2 bg-cyan-200/30 blur-md rounded-full" />
              </motion.div>
            </div>

            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div>
                <p className="text-[9px] font-mono tracking-widest text-white/30 uppercase">Coverage simulation</p>
                <p className="text-xl font-light">~ {selected.nozzle.reach.toFixed(1)} m <span className="text-xs text-white/30">radius</span></p>
              </div>
              <div className="text-right"><p className="text-[9px] font-mono tracking-widest text-white/30 uppercase">Finish</p><p className="text-sm text-white/70">{selected.finish.label}</p></div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[.025] p-5 lg:p-7">
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 mb-7">
              {[
                ['height','Výška',Ruler], ['mounting','Kotvení',Layers3], ['finish','Povrch',Sparkles], ['nozzle','Mlha',Waves]
              ].map(([key, label, Icon]) => <button key={key} onClick={() => setActive(key)} className={`flex-1 py-2.5 rounded-lg text-[10px] font-mono uppercase tracking-widest flex flex-col items-center gap-1.5 transition-all ${active === key ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}><Icon size={14}/>{label}</button>)}
            </div>

            <div className="min-h-[230px]">
              {active === 'height' && <OptionList options={OPTIONS.height} value={config.height} onChange={(v) => set('height', v)} />}
              {active === 'mounting' && <OptionList options={OPTIONS.mounting} value={config.mounting} onChange={(v) => set('mounting', v)} />}
              {active === 'finish' && <OptionList options={OPTIONS.finish} value={config.finish} onChange={(v) => set('finish', v)} swatches />}
              {active === 'nozzle' && <OptionList options={OPTIONS.nozzle} value={config.nozzle} onChange={(v) => set('nozzle', v)} />}
            </div>

            <button onClick={() => set('smart', !config.smart)} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${config.smart ? 'border-cyan-300/30 bg-cyan-300/10' : 'border-white/10 bg-white/[.02]'}`}>
              <div className="flex items-center gap-3"><Cpu size={18} className={config.smart ? 'text-cyan-300' : 'text-white/30'} /><div className="text-left"><p className="text-sm">Smart Sensor</p><p className="text-[10px] text-white/30 mt-1">Automatické řízení podle teploty a pohybu</p></div></div>
              <span className={`w-10 h-6 rounded-full p-1 transition-colors ${config.smart ? 'bg-cyan-300' : 'bg-white/10'}`}><span className={`block w-4 h-4 rounded-full bg-white transition-transform ${config.smart ? 'translate-x-4' : ''}`} /></span>
            </button>

            <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-[9px] font-mono tracking-widest text-white/25 uppercase mb-3">Your configuration</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
                <span>{selected.height.label}</span><span>{selected.mounting.label}</span><span>{selected.finish.label}</span><span>{selected.nozzle.label} mist</span>
              </div>
            </div>

            <button onClick={() => onRequestQuote?.(config)} className="mt-4 w-full group flex items-center justify-between px-5 py-4 rounded-full bg-cyan-300 text-[#071014] font-semibold text-sm hover:bg-white transition-colors">
              <span>Navrhnout tuto konfiguraci</span><ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {[[ShieldCheck,'316L','Nerezová konstrukce'],[Droplets,'8 μm','Mikrokapky mlhy'],[Sparkles,'CZ','Zakázková výroba'],[Check,'6–8 týdnů','Výrobní termín']].map(([Icon,value,label]) => <div key={value} className="rounded-2xl border border-white/10 bg-white/[.02] p-4"><Icon size={15} className="text-cyan-300 mb-5"/><p className="text-lg font-light">{value}</p><p className="text-[10px] text-white/30 mt-1">{label}</p></div>)}
        </div>
      </div>
    </section>
  );
}

function OptionList({ options, value, onChange, swatches = false }) {
  return <div className="space-y-2">{options.map((option) => <button key={option.value} onClick={() => onChange(option.value)} className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${value === option.value ? 'border-cyan-300/40 bg-cyan-300/10' : 'border-white/10 hover:border-white/20 bg-white/[.015]'}`}>
    {swatches ? <span className="w-9 h-9 rounded-full border border-white/10 shrink-0" style={{ background: option.color }} /> : <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${value === option.value ? 'border-cyan-300' : 'border-white/20'}`}>{value === option.value && <span className="w-2 h-2 rounded-full bg-cyan-300" />}</span>}
    <span className="flex-1"><span className="block text-sm text-white/85">{option.label}</span><span className="block text-[10px] text-white/30 mt-1">{option.meta}</span></span>
    {value === option.value && <Check size={16} className="text-cyan-300" />}
  </button>)}</div>;
}
