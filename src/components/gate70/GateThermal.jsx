import React, { useState } from 'react';

/**
 * Termální vizualizace — ukazuje, jak mlžení ochlazuje prostor.
 * Interaktivní: uživatel může zapnout/vypnout názorné mlžení.
 * SVG animace tepelných paprsků + částic odpařování.
 */
export default function GateThermal() {
  const [active, setActive] = useState(false);

  return (
    <section className="gate-section gate-thermal" id="gate-princip">
      <div className="gate-section-head">
        <span className="gate-kicker">02 / TERMODYNAMIKA</span>
        <h2>Voda přijímá teplo.<br /><em>Prostor získává úlevu.</em></h2>
        <p>Při odpařování voda odebírá energii ze svého okolí. Účinek vždy závisí na teplotě, relativní vlhkosti, proudění vzduchu a provozním režimu.</p>
      </div>

      <div className="gate-thermal-art" data-active={active} data-testid="gate-thermal">
        <div className="gate-thermal-grid" />

        {/* Tepelné paprsky — animace přenosu tepla do odpařující se mlhy */}
        <svg viewBox="0 0 900 340" role="img" aria-label="Ilustrace přenosu tepla do odpařující se vodní mlhy">
          <defs>
            <linearGradient id="gate-heat" x1="0" y1="0" x2="1" y2="0">
              <stop stopColor="#e98054" />
              <stop offset="1" stopColor={active ? '#46edda' : '#e98054'} />
            </linearGradient>
            <radialGradient id="gate-glow" cx="50%" cy="50%" r="50%">
              <stop stopColor={active ? '#46edda' : '#e98054'} stopOpacity="0.3" />
              <stop offset="1" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Tepelné paprsky */}
          {[80, 140, 200, 260].map((y, i) => (
            <path
              key={y}
              className="gate-energy-ray"
              d={`M20 ${y} Q 220 ${y - 35} 420 ${y} T 880 ${y}`}
              stroke="url(#gate-heat)"
              fill="none"
              strokeWidth="2"
              style={{ animationDelay: `${i * 0.25}s` }}
            />
          ))}

          {/* Brána — silueta */}
          <path
            d="M360 295 V100 Q360 55 405 55 H495 Q540 55 540 100 V295"
            fill="none"
            stroke="#d2e4e8"
            strokeWidth="9"
          />

          {/* Aura — záře od chlazení */}
          {active && <circle cx="450" cy="170" r="120" fill="url(#gate-glow)" />}

          {/* Částice odpařování */}
          {active && Array.from({ length: 80 }, (_, i) => (
            <circle
              key={i}
              cx={365 + (i * 47) % 170}
              cy={70 + (i * 31) % 210}
              r="2"
              fill="#d2ffff"
              opacity="0.6"
            />
          ))}

          {/* Teplotní škála */}
          <g transform="translate(820, 60)">
            <rect width="40" height="220" rx="4" fill="url(#gate-heat)" opacity="0.6" />
            <text x="50" y="20" fill="#e98054" fontSize="11" fontFamily="monospace">HORKO</text>
            <text x="50" y="220" fill={active ? '#46edda' : '#e98054'} fontSize="11" fontFamily="monospace">
              {active ? 'CHLAD' : 'TEPLO'}
            </text>
          </g>
        </svg>

        <div className="gate-thermal-legend">
          <span>Tepelná zátěž prostoru</span>
          <span>{active ? 'Odpařování / odběr tepla' : 'Mlžení vypnuto'}</span>
        </div>
      </div>

      <div className="gate-thermal-controls">
        <button className="gate-brand-button" onClick={() => setActive(!active)} aria-pressed={active}>
          {active ? 'Vypnout názorné mlžení' : 'Zapnout názorné mlžení'}
        </button>
        <p>Názorný princip, nikoli měření teploty, výpočet dosahu nebo ray-tracing simulace.</p>
      </div>
    </section>
  );
}