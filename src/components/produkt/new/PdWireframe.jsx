import React from 'react';
import { motion } from 'framer-motion';

/**
 * Technický wireframe detailu produktu.
 * Geometrie NENÍ kreslená ani generovaná — používá se skutečná produktová fotografie
 * (ověřený studiový náhled), přes kterou jsou vedeny kóty a popisové odkazy.
 */
export default function PdWireframe({ product }) {
  const photo = product.hero_product_image_url || product.image_url;
  if (!photo) return null;

  const rows = [
    ['Materiál', product.material],
    ['Trysky / kapička', product.micron_size],
    ['Provozní tlak', product.pressure],
    ['Spotřeba vody', product.water_consumption],
    ['Účinný rozsah mlhy', product.coverage_area],
    ['Napájení', product.power_supply],
  ].filter(([, v]) => v);

  const callouts = [
    { top: '14%', label: 'A', title: 'Mlžící hlava', text: product.micron_size || 'Mikro-trysky v horní části ohybu' },
    { top: '46%', label: 'B', title: 'Nosná trubka', text: product.material || 'Nerezová trubka, svařovaný ohyb' },
    { top: '78%', label: 'C', title: 'Kotvení a přívod', text: 'Patka do betonu / zemní vrut, přípojka vody' },
  ];

  return (
    <section className="border-y border-[#D3E2E8] bg-[#F4FAFC] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[.2em] text-[#153863]">// Technický wireframe</p>
        <h2 className="mt-4 font-heading text-3xl font-semibold tracking-[-.03em] text-[#0A1628] lg:text-4xl">Detail {product.name} v řezu prostorem</h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#5A6B78]">
          Schéma vychází ze skutečné produktové fotografie — tvar výrobku se nikdy nepřekresluje. Kóty a popisy odpovídají výrobní dokumentaci.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Blueprint plocha */}
          <div className="relative overflow-hidden border border-[#D3E2E8] bg-white">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage: 'linear-gradient(to right, rgba(21,56,99,.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(21,56,99,.09) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            <div className="relative aspect-[4/5] p-8 sm:p-10">
              <motion.img
                src={photo}
                alt={`${product.name} – technický náhled výrobku`}
                loading="lazy"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="absolute inset-8 h-[calc(100%-4rem)] w-[calc(100%-4rem)] object-contain [filter:grayscale(1)_contrast(1.05)] mix-blend-multiply"
              />

              {/* Vertikální kóta */}
              <div className="absolute left-3 top-8 bottom-8 flex flex-col items-center">
                <span className="h-px w-3 bg-[#153863]" />
                <span className="flex-1 w-px bg-[#153863]/50" />
                <span className="h-px w-3 bg-[#153863]" />
              </div>
              <span className="absolute left-0 top-1/2 origin-left -rotate-90 font-mono text-[10px] tracking-[.14em] text-[#153863]">CELKOVÁ VÝŠKA</span>

              {/* Horizontální kóta */}
              <div className="absolute bottom-3 left-8 right-8 flex items-center">
                <span className="w-px h-3 bg-[#153863]" />
                <span className="flex-1 h-px bg-[#153863]/50" />
                <span className="w-px h-3 bg-[#153863]" />
              </div>
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-2 font-mono text-[10px] tracking-[.14em] text-[#153863]">
                ROZSAH MLHY {product.coverage_area || '—'}
              </span>

              {/* Popisové odkazy */}
              {callouts.map(({ top, label }) => (
                <div key={label} className="absolute right-4 flex items-center gap-2" style={{ top }}>
                  <span className="h-px w-10 bg-[#22D3EE]" />
                  <span className="flex h-6 w-6 items-center justify-center border border-[#153863] bg-white font-mono text-[10px] font-bold text-[#153863]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legenda + parametry */}
          <div className="flex flex-col gap-4">
            {callouts.map(({ label, title, text }) => (
              <div key={label} className="flex gap-4 border border-[#D3E2E8] bg-white p-5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#0A1628] font-mono text-[11px] font-bold text-[#22D3EE]">{label}</span>
                <div>
                  <p className="font-heading text-base font-semibold text-[#0A1628]">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#5A6B78]">{text}</p>
                </div>
              </div>
            ))}

            {rows.length > 0 && (
              <dl className="divide-y divide-[#D3E2E8] border border-[#D3E2E8] bg-white">
                {rows.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 px-5 py-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[.12em] text-[#5A6B78]">{k}</dt>
                    <dd className="text-right font-heading text-sm font-semibold text-[#0A1628]">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}