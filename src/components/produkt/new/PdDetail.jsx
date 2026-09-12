import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const isVideo = (u) => /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(u || '');

/**
 * "Detail, na kterém záleží" — velký fotografický snímek výrobku (nejlépe realizace)
 * s tenkými grafickými odkazovými linkami a mono popisy, plus dva výřezy detailu.
 */
export default function PdDetail({ product }) {
  const photos = useMemo(
    () => [product.image_url, ...(product.gallery_urls || [])].filter(Boolean).filter((u) => !isVideo(u)),
    [product]
  );
  const main = photos[0];
  if (!main) return null;

  const crops = [
    { url: photos[1] || main, position: '30% 25%', label: 'Svar a povrch' },
    { url: photos[2] || photos[1] || main, position: '70% 75%', label: 'Kotvení a přívod' },
  ];

  const callouts = [
    { x: '26%', y: '22%', side: 'right', title: 'Mlžící hlava', text: product.micron_size || 'Mikro-trysky, jemná mlha 50–100 µm' },
    { x: '58%', y: '52%', side: 'left', title: 'Materiál konstrukce', text: product.material || 'Nerezová ocel AISI 316L, TIG svary' },
    { x: '40%', y: '84%', side: 'right', title: 'Kotvení', text: 'Patka do betonu / zemní vrut, přípojka vody' },
  ];

  return (
    <section className="bg-[#0A1628] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="flex items-center gap-3">
          <span className="h-px w-12 bg-[#22D3EE]" />
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-[#22D3EE]">// Detail výrobku</p>
        </div>
        <h2 className="mt-4 max-w-3xl font-heading text-3xl font-bold tracking-[-.03em] text-white lg:text-[2.75rem]">
          Detail, na kterém záleží.
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/55">
          Skutečná fotografie výrobku v provozu — bez retuše geometrie. Popisy odkazují na místa, která rozhodují
          o kvalitě mlhy a životnosti konstrukce.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.75fr_1fr]">
          {/* Hlavní snímek s grafickými odkazy */}
          <figure className="relative overflow-hidden border border-white/12 bg-black">
            <motion.img
              src={main}
              alt={`${product.name} — detail výrobku`}
              loading="lazy"
              initial={{ opacity: 0, scale: 1.03 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="aspect-[4/3] w-full object-cover object-center lg:aspect-[16/11]"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/70 via-transparent to-[#0A1628]/25" />

            {callouts.map((c, i) => (
              <motion.div
                key={c.title}
                className="absolute hidden sm:block"
                style={{ left: c.x, top: c.y }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.18 }}
              >
                <div className={`flex items-center gap-2 ${c.side === 'left' ? 'flex-row-reverse' : ''}`}>
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#22D3EE] shadow-[0_0_0_4px_rgba(34,211,238,.22)]" />
                  <span className="h-px w-10 bg-[#22D3EE]/80 sm:w-14" />
                  <div className={`border border-white/15 bg-[#0A1628]/80 px-3 py-2 backdrop-blur-sm ${c.side === 'left' ? 'text-right' : ''}`}>
                    <p className="font-heading text-[13px] font-semibold leading-tight text-white">{c.title}</p>
                    <p className="mt-0.5 font-mono text-[10px] leading-snug tracking-[.06em] text-white/55">{c.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <figcaption className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[.16em] text-white/60">
              {product.name} · reálná fotografie
            </figcaption>
          </figure>

          {/* Výřezy + parametry */}
          <div className="flex flex-col gap-4">
            {crops.map((crop) => (
              <div key={crop.label} className="relative overflow-hidden border border-white/12">
                <img
                  src={crop.url}
                  alt={`${product.name} — výřez: ${crop.label}`}
                  loading="lazy"
                  className="aspect-[16/9] w-full scale-[1.9] object-cover transition-transform duration-700 hover:scale-[2.1]"
                  style={{ objectPosition: crop.position }}
                />
                <span className="absolute left-3 top-3 border border-[#22D3EE]/40 bg-[#0A1628]/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[.14em] text-[#22D3EE] backdrop-blur-sm">
                  Výřez · {crop.label}
                </span>
              </div>
            ))}

            <dl className="divide-y divide-white/10 border border-white/12 bg-white/[.03]">
              {[
                ['Materiál', product.material || 'Nerez AISI 316L'],
                ['Trysky', product.micron_size || 'Jemná mlha 50–100 µm'],
                ['Povrch', 'Saténově broušený, svařovaný TIG'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 px-4 py-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[.12em] text-white/45">{k}</dt>
                  <dd className="text-right font-heading text-sm font-semibold text-white">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}