import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Zap, Euro, Clock, TrendingDown, ChevronDown } from 'lucide-react';

// ─── Systémy ────────────────────────────────────────────────────────────────
const SYSTEMS = [
{
  id: 'bench',
  name: 'BENDY 60 — Lavička',
  type: 'Mlžná lavička',
  nozzles: 4,
  flowPerNozzle: 0.06, // l/min na trysku při 70 bar
  pressure: 70,
  powerW: 350,
  desc: 'Kompaktní mlžná lavička pro terasy a veřejné prostory.'
},
{
  id: 'ostev',
  name: 'OSTEV — Mlžný strom',
  type: 'Mlžná socha',
  nozzles: 8,
  flowPerNozzle: 0.06,
  pressure: 70,
  powerW: 550,
  desc: 'Skulpturální mlžný strom pro náměstí a parky.'
},
{
  id: 'gate60',
  name: 'GATE 60 — Mlžná brána',
  type: 'Mlžný portál',
  nozzles: 12,
  flowPerNozzle: 0.06,
  pressure: 70,
  powerW: 700,
  desc: 'Vstupní mlžná brána pro eventy a veřejné prostory.'
},
{
  id: 'arena',
  name: 'ARENA — Mlžná zóna',
  type: 'Chladicí zóna',
  nozzles: 20,
  flowPerNozzle: 0.06,
  pressure: 70,
  powerW: 1100,
  desc: 'Plošné ochlazení pro velké venkovní prostory a tribuny.'
},
{
  id: 'aura',
  name: 'AURA — Mlžná socha',
  type: 'Designová socha',
  nozzles: 8,
  flowPerNozzle: 0.06,
  pressure: 70,
  powerW: 550,
  desc: 'Kruhová mlžná socha — dominanta veřejného prostoru.'
}];


const WATER_PRICE_PER_M3 = 85; // Kč / m³ (ČR průměr 2025)
const ELECTRICITY_PRICE_PER_KWH = 5.5; // Kč / kWh

// ─── Mist Canvas Animace ────────────────────────────────────────────────────
// intensity: 0.3–1.5 (počet trysek / max)
// flowRate: l/h — ovlivňuje rychlost stoupání a průměr kapek
function MistCanvas({ intensity = 1, flowRate = 28.8 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particles = useRef([]);
  const intensityRef = useRef(intensity);
  const flowRef = useRef(flowRate);

  // Aktualizace refs bez restartu animace
  useEffect(() => {intensityRef.current = intensity;}, [intensity]);
  useEffect(() => {flowRef.current = flowRate;}, [flowRate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    const makeParticle = () => {
      const int = intensityRef.current;
      const flow = flowRef.current;
      // Větší flow → rychlejší stoupání, větší kapky
      const speedMult = Math.min(2.2, 0.7 + flow / 80);
      const sizeMult = Math.min(1.8, 0.8 + flow / 120);
      return {
        x: W * 0.2 + Math.random() * W * 0.6,
        y: H * 0.62 + Math.random() * H * 0.38,
        r: (1.5 + Math.random() * 3.5) * sizeMult,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(0.25 + Math.random() * 0.65) * speedMult,
        alpha: (0.04 + Math.random() * 0.22) * Math.min(1, int),
        life: 0,
        maxLife: 55 + Math.random() * 90
      };
    };

    const COUNT = Math.round(55 * intensity);
    particles.current = Array.from({ length: COUNT }, makeParticle);

    let frame = 0;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // Jemný tmavý gradient jako podklad pro hloubku
      const bg = ctx.createLinearGradient(0, H, 0, 0);
      bg.addColorStop(0, 'rgba(13,17,23,0.18)');
      bg.addColorStop(1, 'rgba(13,17,23,0)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const int = intensityRef.current;
      const flow = flowRef.current;
      const speedMult = Math.min(2.2, 0.7 + flow / 80);
      const sizeMult = Math.min(1.8, 0.8 + flow / 120);

      particles.current.forEach((p) => {
        p.life++;
        // Jemný horizontální drift jako vzdušný proud
        p.x += p.vx + Math.sin(p.life * 0.04 + p.y * 0.01) * 0.12;
        p.y += p.vy;

        const progress = p.life / p.maxLife;
        // Plynulý fade-in / fade-out
        const fade = progress < 0.15 ?
        progress / 0.15 :
        progress > 0.65 ?
        1 - (progress - 0.65) / 0.35 :
        1;

        // Kapky se zvětšují jak stoupají (odpařování)
        const rNow = p.r * (1 + progress * 1.4);

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rNow * 2.8);
        grd.addColorStop(0, `rgba(180,240,255,${p.alpha * fade * 0.55})`);
        grd.addColorStop(0.4, `rgba(34,211,238,${p.alpha * fade})`);
        grd.addColorStop(1, `rgba(34,211,238,0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rNow * 2.8, 0, Math.PI * 2);
        ctx.fill();

        if (p.life >= p.maxLife) {
          // Dynamicky respawn s aktuálními hodnotami
          const np = makeParticle();
          Object.assign(p, np);
        }
      });

      // Dynamicky přidej/odeber částice při změně intensity
      const targetCount = Math.round(55 * intensityRef.current);
      if (particles.current.length < targetCount && frame % 4 === 0) {
        particles.current.push(makeParticle());
      } else if (particles.current.length > targetCount + 5 && frame % 8 === 0) {
        particles.current.splice(0, 1);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []); // Animace běží jednou, hodnoty čte z refs

  return (
    <canvas
      ref={canvasRef}
      width={340}
      height={180}
      className="w-full h-full"
      style={{ display: 'block' }} />);


}

// ─── Animated Number ────────────────────────────────────────────────────────
function AnimNum({ value, decimals = 0, suffix = '' }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const start = prev.current;
    const end = value;
    const duration = 600;
    const startTime = performance.now();

    const step = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setDisplay(start + (end - start) * ease);
      if (t < 1) requestAnimationFrame(step);else
      prev.current = end;
    };
    requestAnimationFrame(step);
  }, [value]);

  return (
    <span>
      {display.toFixed(decimals).replace('.', ',')}
      {suffix}
    </span>);

}

// ─── Hlavní komponent ────────────────────────────────────────────────────────
export default function MlzeniKalkulator() {
  const [systemId, setSystemId] = useState('ostev');
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [daysPerMonth, setDaysPerMonth] = useState(20);
  const [openSelect, setOpenSelect] = useState(false);

  const sys = SYSTEMS.find((s) => s.id === systemId);

  // Výpočty
  const flowPerHour = sys.nozzles * sys.flowPerNozzle * 60; // l/h
  const waterPerDay = flowPerHour * hoursPerDay; // l/day
  const waterPerMonth = waterPerDay * daysPerMonth; // l/month
  const waterCostMonth = waterPerMonth / 1000 * WATER_PRICE_PER_M3;

  const electricityPerDay = sys.powerW / 1000 * hoursPerDay; // kWh/day
  const electricityPerMonth = electricityPerDay * daysPerMonth;
  const electricityCostMonth = electricityPerMonth * ELECTRICITY_PRICE_PER_KWH;

  const totalCostMonth = waterCostMonth + electricityCostMonth;
  const costPerHour = totalCostMonth / (hoursPerDay * daysPerMonth);

  // Intensity pro animaci mlhy (0.3–1.5)
  const mistIntensity = Math.min(1.5, 0.3 + sys.nozzles / 20 * 1.2);

  return (
    <div className="rounded-2xl border border-white/10 bg-card_bg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3 bg-[hsl(var(--background))]">
        <div className="w-9 h-9 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
          <Droplets size={18} className="text-cyan" />
        </div>
        <div>
          <p className="text-sm font-medium text-[hsl(var(--popover))]">Kalkulátor spotřeby a nákladů</p>
          <p className="text-white/40 text-xs">Orientační výpočet pro vybraný systém</p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ─── Levá strana: vstup ─── */}
        <div className="space-y-6">

          {/* Výběr systému */}
          <div>
            <label className="block text-[10px] font-mono text-white/40 tracking-widest uppercase mb-2">
              Mlžný systém
            </label>
            <div className="relative">
              <button
                onClick={() => setOpenSelect(!openSelect)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm hover:border-cyan/40 focus:border-cyan/50 transition-colors text-left">
                
                <span>{sys.name}</span>
                <ChevronDown size={14} className={`text-white/40 transition-transform ${openSelect ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openSelect &&
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute z-20 top-full mt-1 w-full rounded-xl bg-surface border border-white/15 overflow-hidden shadow-2xl shadow-black/50">
                  
                    {SYSTEMS.map((s) =>
                  <button
                    key={s.id}
                    onClick={() => {setSystemId(s.id);setOpenSelect(false);}}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors ${s.id === systemId ? 'bg-cyan/10' : ''}`}>
                    
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${s.id === systemId ? 'text-cyan' : 'text-white'}`}>{s.name}</p>
                          <p className="text-xs text-white/35 truncate">{s.desc}</p>
                        </div>
                        <span className="text-[10px] font-mono text-white/30 shrink-0 mt-0.5">{s.nozzles} trysek</span>
                      </button>
                  )}
                  </motion.div>
                }
              </AnimatePresence>
            </div>
            <p className="text-xs text-white/30 mt-1.5 font-mono">{sys.type} · {sys.nozzles} trysek · {sys.powerW} W</p>
          </div>

          {/* Hodiny denně */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Provoz hodin denně</label>
              <span className="text-sm font-mono text-cyan">{hoursPerDay} h</span>
            </div>
            <input
              type="range" min={1} max={16} step={1} value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full accent-cyan h-1 rounded-full" />
            
            <div className="flex justify-between text-[10px] font-mono text-white/20 mt-1">
              <span>1 h</span><span>16 h</span>
            </div>
          </div>

          {/* Dny v měsíci */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Dní provozu za měsíc</label>
              <span className="text-sm font-mono text-cyan">{daysPerMonth} dní</span>
            </div>
            <input
              type="range" min={1} max={31} step={1} value={daysPerMonth}
              onChange={(e) => setDaysPerMonth(Number(e.target.value))}
              className="w-full accent-cyan h-1 rounded-full" />
            
            <div className="flex justify-between text-[10px] font-mono text-white/20 mt-1">
              <span>1 den</span><span>31 dní</span>
            </div>
          </div>

          {/* Mist vizualizace */}
          <div className="rounded-xl overflow-hidden bg-ink border border-white/8 relative" style={{ height: 180 }}>
            {/* Silhouette systému */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
              <div className="w-1 bg-gradient-to-t from-steel/60 to-steel/20 rounded-full" style={{ height: 60 }} />
              <div className="w-8 h-1 bg-steel/40 rounded-full" />
            </div>
            {/* Trysky */}
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-5 z-10 pointer-events-none">
              {Array.from({ length: Math.min(sys.nozzles, 6) }).map((_, i) =>
              <div key={i} className="w-0.5 h-0.5 rounded-full bg-cyan/80 shadow-[0_0_6px_2px_rgba(34,211,238,0.6)]" />
              )}
            </div>
            <MistCanvas intensity={mistIntensity} flowRate={flowPerHour} />
            <div className="absolute bottom-3 left-0 right-0 text-center">
              <span className="text-[9px] font-mono text-white/20 tracking-widest uppercase">
                {sys.nozzles} trysek · {flowPerHour.toFixed(1)} l/h
              </span>
            </div>
          </div>
        </div>

        {/* ─── Pravá strana: výsledky ─── */}
        <div className="space-y-4">

          {/* Spotřeba vody */}
          <div className="rounded-xl bg-surface border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Droplets size={15} className="text-cyan" />
              <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Spotřeba vody</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-2xl font-light text-white tabular-nums">
                  <AnimNum value={waterPerDay} decimals={1} />
                  <span className="text-sm text-white/30 ml-1">l/den</span>
                </p>
              </div>
              <div>
                <p className="text-2xl font-light text-white tabular-nums">
                  <AnimNum value={waterPerMonth / 1000} decimals={2} />
                  <span className="text-sm text-white/30 ml-1">m³/měs</span>
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/8 flex items-center justify-between">
              <span className="text-xs text-white/30 font-mono">Náklad za vodu / měsíc</span>
              <span className="text-sm text-white font-medium">
                <AnimNum value={waterCostMonth} decimals={0} suffix=" Kč" />
              </span>
            </div>
          </div>

          {/* Elektřina */}
          <div className="rounded-xl bg-surface border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={15} className="text-cyan" />
              <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Spotřeba elektřiny</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-2xl font-light text-white tabular-nums">
                  <AnimNum value={electricityPerDay} decimals={2} />
                  <span className="text-sm text-white/30 ml-1">kWh/den</span>
                </p>
              </div>
              <div>
                <p className="text-2xl font-light text-white tabular-nums">
                  <AnimNum value={electricityPerMonth} decimals={1} />
                  <span className="text-sm text-white/30 ml-1">kWh/měs</span>
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/8 flex items-center justify-between">
              <span className="text-xs text-white/30 font-mono">Náklad za elektřinu / měsíc</span>
              <span className="text-sm text-white font-medium">
                <AnimNum value={electricityCostMonth} decimals={0} suffix=" Kč" />
              </span>
            </div>
          </div>

          {/* Celkové provozní náklady */}
          <div className="rounded-xl bg-gradient-to-br from-cyan/10 to-cyan/5 border border-cyan/25 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown size={15} className="text-cyan" />
              <p className="text-[10px] font-mono text-cyan/70 tracking-widest uppercase">Celkové provozní náklady</p>
            </div>
            <div className="flex items-end gap-3 mb-4">
              <div>
                <p className="text-xs text-white/30 font-mono mb-1">Za měsíc</p>
                <p className="text-4xl font-light text-white tabular-nums">
                  <AnimNum value={totalCostMonth} decimals={0} />
                  <span className="text-lg text-white/50 ml-1">Kč</span>
                </p>
              </div>
              <div className="pb-1 pl-4 border-l border-white/10">
                <p className="text-xs text-white/30 font-mono mb-1">Za hodinu provozu</p>
                <p className="text-xl font-light text-cyan tabular-nums">
                  <AnimNum value={costPerHour} decimals={2} />
                  <span className="text-sm text-cyan/60 ml-1">Kč/h</span>
                </p>
              </div>
            </div>

            {/* Progress bar voda vs elektřina */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-white/30">
                <span className="w-2 h-2 rounded-full bg-cyan inline-block" />
                <span>Voda {totalCostMonth > 0 ? Math.round(waterCostMonth / totalCostMonth * 100) : 0}%</span>
                <span className="w-2 h-2 rounded-full bg-white/20 inline-block ml-2" />
                <span>Elektřina {totalCostMonth > 0 ? Math.round(electricityCostMonth / totalCostMonth * 100) : 0}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan to-cyan/50"
                  animate={{ width: `${totalCostMonth > 0 ? waterCostMonth / totalCostMonth * 100 : 0}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
                
              </div>
            </div>
          </div>

          {/* Srovnání — ceník vody */}
          <div className="rounded-xl bg-surface border border-white/8 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} className="text-white/30" />
              <p className="text-[10px] font-mono text-white/25 tracking-widest uppercase">Orientační tarify</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-white/30 font-mono">
              <span>Voda: {WATER_PRICE_PER_M3} Kč/m³</span>
              <span>Elektřina: {ELECTRICITY_PRICE_PER_KWH} Kč/kWh</span>
            </div>
            <p className="text-[10px] text-white/20 font-mono mt-2 leading-relaxed">
              * Průměrné ceny ČR 2025. Skutečné náklady závisí na tarifu poskytovatele.
            </p>
          </div>
        </div>
      </div>
    </div>);

}