import React, { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Calculator } from 'lucide-react';

const FLOW_PER_NOZZLE_LH = 12;   // l/h na trysku při 4 bar
const WATER_PRICE_CZK_M3 = 33;   // Kč/m³ — průměr ČR
const SEASON_DAYS = 90;

const fmt = (n) => new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(Math.round(n));

/**
 * Jeden přehledný interaktivní prvek: dva tahy prstem → okamžitý odhad nákladů na vodu.
 */
export default function PdCostCalculator({ product }) {
  const defaultNozzles = useMemo(() => {
    const m = product?.water_consumption && String(product.water_consumption).match(/(\d+)\s*trys/i);
    return m ? Math.min(24, parseInt(m[1], 10)) : 6;
  }, [product]);

  const [nozzles, setNozzles] = useState(defaultNozzles);
  const [hours, setHours] = useState(8);

  const litersDay = nozzles * FLOW_PER_NOZZLE_LH * hours;
  const costDay = (litersDay / 1000) * WATER_PRICE_CZK_M3;
  const costSeason = costDay * SEASON_DAYS;

  return (
    <div className="overflow-hidden border-2 border-[#22D3EE] bg-[#0A1628]">
      <div className="grid lg:grid-cols-[1fr_.95fr]">
        {/* Ovládání */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2.5">
            <Calculator size={17} className="text-[#22D3EE]" />
            <p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#22D3EE]">Odhad nákladů na vodu</p>
          </div>

          <div className="mt-8 space-y-8">
            <Control label="Počet trysek" value={`${nozzles} ks`}>
              <Slider value={[nozzles]} min={1} max={24} step={1} onValueChange={([v]) => setNozzles(v)} aria-label="Počet trysek" />
            </Control>
            <Control label="Provoz denně" value={`${hours} h`}>
              <Slider value={[hours]} min={1} max={16} step={1} onValueChange={([v]) => setHours(v)} aria-label="Provoz denně" />
            </Control>
          </div>

          <p className="mt-8 font-mono text-[10px] leading-relaxed tracking-[.1em] text-white/40">
            {FLOW_PER_NOZZLE_LH} L/H NA TRYSKU · {SEASON_DAYS} DNÍ SEZÓNA · {WATER_PRICE_CZK_M3} KČ/M³
          </p>
        </div>

        {/* Výsledek */}
        <div className="border-t border-white/12 bg-white/[.04] p-6 text-center sm:p-8 lg:border-l lg:border-t-0">
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-white/50">Voda za sezónu</p>
          <p className="mt-3 font-heading text-[clamp(2.5rem,8vw,4rem)] font-bold leading-none text-[#22D3EE]">
            {fmt(costSeason)} <span className="text-xl">Kč</span>
          </p>
          <div className="mt-6 grid grid-cols-2 divide-x divide-white/12 border-t border-white/12 pt-5">
            <div>
              <p className="font-heading text-lg font-bold text-white">{fmt(costDay)} Kč</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[.12em] text-white/45">za den</p>
            </div>
            <div>
              <p className="font-heading text-lg font-bold text-white">{fmt(litersDay * SEASON_DAYS / 1000)} m³</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[.12em] text-white/45">vody za sezónu</p>
            </div>
          </div>
          <p className="mt-5 text-[11px] leading-relaxed text-white/40">
            Orientační odhad pouze pro spotřebu vody — bez elektřiny, údržby a investice.
          </p>
        </div>
      </div>
    </div>
  );
}

function Control({ label, value, children }) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[.14em] text-white/50">{label}</p>
        <p className="font-heading text-2xl font-bold text-white">{value}</p>
      </div>
      {children}
    </div>
  );
}