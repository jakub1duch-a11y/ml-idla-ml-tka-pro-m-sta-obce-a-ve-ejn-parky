import React, { useState } from 'react';
import { Droplets, Minus, Plus, Info, Sparkles } from 'lucide-react';

const FLOW_PER_NOZZLE_LH = 12; // l/h na trysku při referenčním tlaku 4 bar
const WATER_PRICE_PER_M3 = 85; // Kč / m³ (ČR průměr 2025)
const NOZZLE_PRICE_KC = 390; // Kč za 1 ks nerezové trysky AISI 316L
const SEASON_HOURS = 300; // orientační provoz za letní sezónu
const SMART_APP_SAVINGS = 0.25; // úspora vody při řízení Smart APP (senzory větru/teploty/vlhkosti)

const costFor = (liters) => (liters / 1000 * WATER_PRICE_PER_M3).toFixed(liters < 100 ? 2 : 0);

function Row({ label, value, formula, highlight }) {
  return (
    <div className="group relative flex items-center justify-between px-4 py-3 border-b border-white/10 last:border-b-0">
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-xs uppercase tracking-wider text-white/50">{label}</span>
        <Info size={11} className="text-white/25 group-hover:text-techblue transition-colors cursor-help" />
      </div>
      <span className={`font-mono text-sm ${highlight ? 'text-techblue font-bold' : 'text-white'}`}>{value}</span>

      {/* Hover nápověda s výpočtem */}
      <div className="pointer-events-none absolute left-4 right-4 bottom-full mb-1.5 z-20 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
        <div className="bg-ink border border-white/20 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-[10px] font-mono text-white/60 leading-relaxed">{formula}</p>
        </div>
      </div>
    </div>
  );
}

export default function WaterConsumptionCalculator({ defaultNozzles = 6 }) {
  const [nozzles, setNozzles] = useState(defaultNozzles);

  const nozzleLH = FLOW_PER_NOZZLE_LH;
  const totalLH = nozzles * FLOW_PER_NOZZLE_LH;
  const totalDay = totalLH * 8; // 8 h mlžení / den
  const seasonWater = totalLH * SEASON_HOURS;
  const seasonCost = Number(costFor(seasonWater));
  const smartSeasonWater = seasonWater * (1 - SMART_APP_SAVINGS);
  const smartSeasonSavingLiters = seasonWater - smartSeasonWater;
  const smartSeasonSavingKc = seasonCost - Number(costFor(smartSeasonWater));

  return (
    <div className="border border-white/15">
      <div className="px-4 py-2.5 border-b border-white/15 flex items-center gap-2">
        <Droplets size={13} className="text-techblue" />
        <span className="font-mono text-[11px] uppercase tracking-widest text-white/50">Kalkulačka spotřeby vody @ 4 bar</span>
      </div>

      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <span className="font-mono text-xs uppercase tracking-wider text-white/50">Počet trysek</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setNozzles((n) => Math.max(1, n - 1))} className="w-7 h-7 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:border-white/50 transition-all"><Minus size={12} /></button>
          <span className="font-mono text-sm text-white w-6 text-center">{nozzles}</span>
          <button onClick={() => setNozzles((n) => Math.min(16, n + 1))} className="w-7 h-7 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:border-white/50 transition-all"><Plus size={12} /></button>
        </div>
      </div>

      <Row
        label="Spotřeba 1 trysky"
        value={`${nozzleLH} l/h = ${costFor(nozzleLH)} Kč/h`}
        formula={`Výpočet: ${nozzleLH} l/h × ${WATER_PRICE_PER_M3} Kč/m³ ÷ 1000 = ${costFor(nozzleLH)} Kč/h při 4 bar.`} />

      <Row
        label={`Spotřeba mlžítka (${nozzles} trysek)`}
        value={`${totalLH} l/h = ${costFor(totalLH)} Kč/h`}
        formula={`Výpočet: ${nozzles} trysek × ${nozzleLH} l/h = ${totalLH} l/h. ${totalLH} l/h × ${WATER_PRICE_PER_M3} Kč/m³ ÷ 1000 = ${costFor(totalLH)} Kč/h.`}
        highlight />

      <Row
        label="Za den (8 h mlžení)"
        value={`${totalDay} l = ${costFor(totalDay)} Kč`}
        formula={`Výpočet: ${totalLH} l/h × 8 h = ${totalDay} l. ${totalDay} l × ${WATER_PRICE_PER_M3} Kč/m³ ÷ 1000 = ${costFor(totalDay)} Kč/den.`} />

      <Row
        label={`Za letní sezónu (${SEASON_HOURS} h)`}
        value={`${(seasonWater / 1000).toFixed(1)} m³ = ${seasonCost.toLocaleString('cs-CZ')} Kč`}
        formula={`Výpočet: ${totalLH} l/h × ${SEASON_HOURS} h = ${seasonWater.toLocaleString('cs-CZ')} l. ${(seasonWater / 1000).toFixed(1)} m³ × ${WATER_PRICE_PER_M3} Kč/m³ = ${seasonCost.toLocaleString('cs-CZ')} Kč.`}
        highlight />

      {/* Smart APP úspora */}
      <div className="group relative flex items-center justify-between px-4 py-4 border-b border-white/10 bg-white/[0.03]">
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-techblue" />
          <span className="font-mono text-xs uppercase tracking-wider text-white/50">Se Smart APP (−{SMART_APP_SAVINGS * 100}% senzory)</span>
          <Info size={11} className="text-white/25 group-hover:text-techblue transition-colors cursor-help" />
        </div>
        <span className="font-mono text-sm text-emerald-400 font-bold">
          ušetříte ≈ {smartSeasonSavingKc.toLocaleString('cs-CZ')} Kč
        </span>
        <div className="pointer-events-none absolute left-4 right-4 bottom-full mb-1.5 z-20 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
          <div className="bg-ink border border-white/20 rounded-lg px-3 py-2 shadow-xl">
            <p className="text-[10px] font-mono text-white/60 leading-relaxed">
              Smart APP automaticky vypíná/tlumí mlžení dle teploty, vlhkosti a větru — orientační úspora vody {SMART_APP_SAVINGS * 100}% za sezónu = {smartSeasonSavingLiters.toLocaleString('cs-CZ')} l ({smartSeasonSavingKc.toLocaleString('cs-CZ')} Kč) ze sezónní spotřeby {seasonCost.toLocaleString('cs-CZ')} Kč.
            </p>
          </div>
        </div>
      </div>

      <Row
        label="Cena 1 trysky (AISI 316L)"
        value={`${NOZZLE_PRICE_KC} Kč`}
        formula={`Fixní cena nerezové trysky AISI 316L, nezávislá na spotřebě vody.`} />

      <p className="px-4 py-3 text-[11px] text-white/30 font-mono leading-relaxed border-t border-white/10">
        * Orientační výpočet: {FLOW_PER_NOZZLE_LH} l/h na trysku při referenčním tlaku 4 bar, voda {WATER_PRICE_PER_M3} Kč/m³. Skutečná spotřeba se liší dle typu trysky a provozního tlaku.
      </p>
    </div>
  );
}