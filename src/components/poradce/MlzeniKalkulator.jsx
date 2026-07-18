import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Clock, ChevronDown, Sparkles, Info, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SMART_APP_SAVINGS = 0.5; // model chytrého řízení: aktivní cykly podle teploty, vlhkosti a harmonogramu

// Produkty, které nejsou samostatná mlžítka/brány (příslušenství), do kalkulačky nepatří
const ACCESSORY_NAMES = ['SMART řízení mlžítek', 'Filtrační a jiné Moduly', 'Trysky HT-LT', 'senzory', 'Zemní vrut – rychlá mobilní instalace'];

const WATER_PRICE_PER_M3 = 129.11; // Kč / m³, Trutnov 2026: vodné 75,86 Kč + stočné 53,25 Kč
const NOZZLE_PRICE_KC = 390; // Kč za 1 ks nerezové trysky AISI 316L

// ─── Parsování reálných dat produktu ───────────────────────────────────────
function parseFlowLH(str) {
  if (!str) return 10; // rozumný odhad, když produkt spotřebu neuvádí
  const nums = (str.match(/[\d.,]+/g) || []).map((n) => parseFloat(n.replace(',', '.'))).filter((n) => !isNaN(n));
  if (nums.length === 0) return 10;
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  return /l\/min/i.test(str) ? avg * 60 : avg;
}

function parseNozzles(str) {
  const m = str && str.match(/(\d+)\s*trys/i);
  return m ? parseInt(m[1], 10) : 1;
}

function buildSystems(products, categories) {
  const catName = (id) => categories.find((c) => c.id === id)?.name || id || 'Mlžítko';
  return products.
  filter((p) => !ACCESSORY_NAMES.includes(p.name)).
  map((p) => {
    const totalFlowLH = parseFlowLH(p.water_consumption);
    const nozzles = parseNozzles(p.micron_size) || parseNozzles(p.water_consumption) || 1;
    return {
      id: p.id,
      name: p.name,
      type: catName(p.category_id),
      nozzles,
      flowPerNozzle: totalFlowLH / nozzles / 60, // l/min na trysku
      pressure: p.pressure || '2–7 bar',
      desc: p.short_description || ''
    };
  });
}

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
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [systemId, setSystemId] = useState(null);
  const [seasonHours, setSeasonHours] = useState(300);
  const [openSelect, setOpenSelect] = useState(false);

  useEffect(() => {
    Promise.all([
    base44.entities.Product.list().catch(() => []),
    base44.entities.ProductCategory.list().catch(() => [])]
    ).then(([products, categories]) => {
      const built = buildSystems(products || [], categories || []);
      setSystems(built);
      if (built.length > 0) setSystemId(built[0].id);
    }).finally(() => setLoading(false));
  }, []);

  const sys = systems.find((s) => s.id === systemId);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-card_bg flex items-center justify-center py-24">
        <Loader size={22} className="animate-spin text-cyan" />
      </div>);

  }

  if (!sys) {
    return (
      <div className="rounded-2xl border border-white/10 bg-card_bg flex items-center justify-center py-24 px-6 text-center">
        <p className="text-sm text-white/50">Zatím nejsou k dispozici žádné produkty pro výpočet.</p>
      </div>);

  }

  // Výpočty — pouze spotřeba a náklady na vodu
  const flowPerNozzleLH = sys.flowPerNozzle * 60; // l/h na 1 trysku
  const flowTotalLH = sys.nozzles * flowPerNozzleLH; // l/h celý systém

  const costPerNozzleHour = flowPerNozzleLH / 1000 * WATER_PRICE_PER_M3;
  const costTotalHour = flowTotalLH / 1000 * WATER_PRICE_PER_M3;

  const water8h = flowTotalLH * 8;
  const cost8h = water8h / 1000 * WATER_PRICE_PER_M3;

  const seasonWater = seasonHours * flowTotalLH;
  const seasonCost = seasonHours * costTotalHour;

  // Intensity pro animaci mlhy (0.3–1.5)
  const mistIntensity = Math.min(1.5, 0.3 + sys.nozzles / 20 * 1.2);

  return (
    <div className="rounded-2xl border border-white/10 bg-card_bg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3 bg-[hsl(var(--background))]">
        <div className="w-9 h-9 rounded-xl border flex items-center justify-center bg-black/10 border-balck/20">
          <Droplets size={18} className="text-cyan" />
        </div>
        <div>
          <p className="text-sm font-medium text-[hsl(var(--popover))]">Kalkulátor spotřeby vody</p>
          <p className="text-xs text-[hsl(var(--popover))]">Trutnov 2026 · vodné a stočné 129,11 Kč / m³ · osmihodinový model</p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ─── Levá strana: vstup ─── */}
        <div className="space-y-6">

          {/* Výběr systému */}
          <div>
            <label className="block text-[10px] font-mono text-white/40 tracking-widest uppercase mb-2">
              Mlžítko / mlžná brána
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
                  className="absolute z-20 top-full mt-1 w-full max-h-72 overflow-y-auto rounded-xl bg-surface border border-white/15 shadow-2xl shadow-black/50">
                  
                    {systems.map((s) =>
                  <button
                    key={s.id}
                    onClick={() => {setSystemId(s.id);setOpenSelect(false);}}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors ${s.id === systemId ? 'bg-cyan/10' : ''}`}>
                    
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${s.id === systemId ? 'text-cyan' : 'text-white'}`}>{s.name}</p>
                          <p className="text-xs text-white/35 truncate">{s.desc}</p>
                        </div>
                        <span className="text-[10px] font-mono text-white/30 shrink-0 mt-0.5">{s.type}</span>
                      </button>
                  )}
                  </motion.div>
                }
              </AnimatePresence>
            </div>
            <p className="text-xs mt-1.5 font-mono text-[hsl(var(--card-foreground))]">{sys.type} · {sys.nozzles} trysek · {sys.pressure}</p>
          </div>

          {/* Hodin za letní sezónu */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Provoz za letní sezónu</label>
              <span className="text-sm font-mono text-cyan">{seasonHours} h</span>
            </div>
            <input
              type="range" min={50} max={800} step={10} value={seasonHours}
              onChange={(e) => setSeasonHours(Number(e.target.value))}
              className="w-full accent-cyan h-1 rounded-full" />
            
            <div className="flex justify-between text-[10px] font-mono text-white/20 mt-1">
              <span>50 h</span><span>800 h</span>
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
            <MistCanvas intensity={mistIntensity} flowRate={flowTotalLH} />
            <div className="absolute bottom-3 left-0 right-0 text-center">
              <span className="font-mono tracking-widest uppercase text-base text-[hsl(var(--foreground))]">
                {sys.nozzles} trysek · {flowTotalLH.toFixed(1)} l/h
              </span>
            </div>
          </div>
        </div>

        {/* ─── Pravá strana: výsledky ─── */}
        <div className="space-y-4">

          {/* Spotřeba jedné trysky */}
          <div className="group relative rounded-xl bg-surface border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Droplets size={15} className="text-cyan" />
              <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Spotřeba jedné trysky</p>
              <Info size={11} className="text-white/25 group-hover:text-cyan transition-colors cursor-help" />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-light text-white tabular-nums">
                <AnimNum value={flowPerNozzleLH} decimals={1} />
                <span className="text-sm text-white/30 ml-1">l/h</span>
              </p>
              <p className="text-lg font-light text-cyan tabular-nums">
                = <AnimNum value={costPerNozzleHour} decimals={2} suffix=" Kč/h" />
              </p>
            </div>
            <div className="pointer-events-none absolute left-5 right-5 bottom-full mb-1.5 z-20 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
              <div className="bg-ink border border-white/20 rounded-lg px-3 py-2 shadow-xl">
                <p className="text-[10px] font-mono text-white/60 leading-relaxed">Výpočet: {flowPerNozzleLH.toFixed(1)} l/h × {WATER_PRICE_PER_M3} Kč/m³ ÷ 1000 = {costPerNozzleHour.toFixed(2)} Kč/h.</p>
              </div>
            </div>
          </div>

          {/* Spotřeba celého systému */}
          <div className="group relative rounded-xl bg-surface border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Droplets size={15} className="text-cyan" />
              <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Spotřeba systému ({sys.nozzles} trysek)</p>
              <Info size={11} className="text-white/25 group-hover:text-cyan transition-colors cursor-help" />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-light text-white tabular-nums">
                <AnimNum value={flowTotalLH} decimals={1} />
                <span className="text-sm text-white/30 ml-1">l/h</span>
              </p>
              <p className="text-lg font-light text-cyan tabular-nums">
                = <AnimNum value={costTotalHour} decimals={2} suffix=" Kč/h" />
              </p>
            </div>
            <div className="pointer-events-none absolute left-5 right-5 bottom-full mb-1.5 z-20 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
              <div className="bg-ink border border-white/20 rounded-lg px-3 py-2 shadow-xl">
                <p className="text-[10px] font-mono text-white/60 leading-relaxed">Výpočet: {sys.nozzles} trysek × {flowPerNozzleLH.toFixed(1)} l/h = {flowTotalLH.toFixed(1)} l/h. × {WATER_PRICE_PER_M3} Kč/m³ ÷ 1000 = {costTotalHour.toFixed(2)} Kč/h.</p>
              </div>
            </div>
          </div>

          {/* Za 8 hodin mlžení (den) */}
          <div className="group relative rounded-xl bg-surface border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={15} className="text-cyan" />
              <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Za den (8 hodin mlžení)</p>
              <Info size={11} className="text-white/25 group-hover:text-cyan transition-colors cursor-help" />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-light text-white tabular-nums">
                <AnimNum value={water8h} decimals={0} />
                <span className="text-sm text-white/30 ml-1">l</span>
              </p>
              <p className="text-lg font-light text-cyan tabular-nums">
                = <AnimNum value={cost8h} decimals={0} suffix=" Kč" />
              </p>
            </div>
            <div className="pointer-events-none absolute left-5 right-5 bottom-full mb-1.5 z-20 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
              <div className="bg-ink border border-white/20 rounded-lg px-3 py-2 shadow-xl">
                <p className="text-[10px] font-mono text-white/60 leading-relaxed">Výpočet: {flowTotalLH.toFixed(1)} l/h × 8 h = {water8h.toFixed(0)} l. × {WATER_PRICE_PER_M3} Kč/m³ ÷ 1000 = {cost8h.toFixed(0)} Kč/den.</p>
              </div>
            </div>
          </div>

          {/* Za letní sezónu — zvýrazněno */}
          <div className="group relative rounded-xl bg-gradient-to-br from-cyan/10 to-cyan/5 border border-cyan/25 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={15} className="text-cyan" />
              <p className="text-[10px] font-mono text-cyan/70 tracking-widest uppercase">Za letní sezónu ({seasonHours} h)</p>
              <Info size={11} className="text-white/30 group-hover:text-cyan transition-colors cursor-help" />
            </div>
            <div className="flex items-end gap-3">
              <div>
                <p className="text-xs text-white/30 font-mono mb-1">Spotřeba vody</p>
                <p className="text-2xl font-light text-white tabular-nums">
                  <AnimNum value={seasonWater / 1000} decimals={2} />
                  <span className="text-sm text-white/30 ml-1">m³</span>
                </p>
              </div>
              <div className="pb-1 pl-4 border-l border-white/10">
                <p className="text-xs text-white/30 font-mono mb-1">Náklad na vodu</p>
                <p className="text-3xl font-light text-cyan tabular-nums">
                  <AnimNum value={seasonCost} decimals={0} suffix=" Kč" />
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute left-5 right-5 bottom-full mb-1.5 z-20 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
              <div className="bg-ink border border-white/20 rounded-lg px-3 py-2 shadow-xl">
                <p className="text-[10px] font-mono text-white/60 leading-relaxed">Výpočet: {flowTotalLH.toFixed(1)} l/h × {seasonHours} h = {seasonWater.toFixed(0)} l ({(seasonWater / 1000).toFixed(2)} m³). × {WATER_PRICE_PER_M3} Kč/m³ = {seasonCost.toFixed(0)} Kč.</p>
              </div>
            </div>
          </div>

          {/* Smart APP úspora za sezónu */}
          <div className="group relative rounded-xl bg-emerald-500/5 border border-emerald-500/25 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={15} className="text-emerald-400" />
              <p className="text-[10px] font-mono text-emerald-400/80 tracking-widest uppercase">Se Smart APP (−{SMART_APP_SAVINGS * 100}%) za sezónu</p>
              <Info size={11} className="text-white/25 group-hover:text-emerald-400 transition-colors cursor-help" />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-light text-white tabular-nums">
                <AnimNum value={seasonWater * (1 - SMART_APP_SAVINGS) / 1000} decimals={2} />
                <span className="text-sm text-white/30 ml-1">m³</span>
              </p>
              <p className="text-lg font-light text-emerald-400 tabular-nums">
                ušetříte <AnimNum value={seasonCost * SMART_APP_SAVINGS} decimals={0} suffix=" Kč" />
              </p>
            </div>
            <div className="pointer-events-none absolute left-5 right-5 bottom-full mb-1.5 z-20 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
              <div className="bg-ink border border-white/20 rounded-lg px-3 py-2 shadow-xl">
                <p className="text-[10px] font-mono text-white/60 leading-relaxed">Smart APP automaticky tlumí/vypíná mlžení dle teploty, vlhkosti a větru — orientační úspora vody {SMART_APP_SAVINGS * 100}% ze sezónní spotřeby {seasonCost.toFixed(0)} Kč = {(seasonCost * SMART_APP_SAVINGS).toFixed(0)} Kč.</p>
              </div>
            </div>
          </div>

          {/* Cena trysky + tarif */}
          <div className="rounded-xl bg-surface border border-white/8 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Cena jedné trysky (AISI 316L)</span>
              <span className="text-sm font-medium text-white">{NOZZLE_PRICE_KC} Kč</span>
            </div>
            <div className="flex items-center justify-between text-xs text-white/30 font-mono">
              <span>Vodné a stočné Trutnov 2026: {WATER_PRICE_PER_M3} Kč/m³</span>
            </div>
            <p className="text-[10px] text-white/20 font-mono mt-2 leading-relaxed">
              * Výpočet zahrnuje vodné i stočné pro Trutnov v roce 2026. Náklady ovlivňuje průtok, počet trysek, délka provozu a úroveň chytrého řízení.
            </p>
          </div>
        </div>
      </div>
    </div>);

}