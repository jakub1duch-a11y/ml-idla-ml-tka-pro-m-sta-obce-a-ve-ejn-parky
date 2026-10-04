import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { splitDescriptionIntoSections } from '@/lib/productStory';

export default function PdStory({ product }) {
  const sections = useMemo(() => splitDescriptionIntoSections(product.description), [product.description]);
  if (sections.length === 0) return null;

  return (
    <section className="bg-[#F4FAFC] py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#153863]">// O produktu podrobně</p>
        <h2 className="mt-3 max-w-3xl font-heading text-2xl font-bold tracking-[-.02em] text-[#0A1628] sm:text-3xl lg:text-[2.35rem]">
          {product.name} od návrhu po provoz
        </h2>

        <div className="mt-10 grid gap-px bg-[#D3E2E8] sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, i) => (
            <motion.article
              key={`${section.title}-${i}`}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-white p-6 transition-colors hover:bg-[#F8FCFE] sm:p-7"
            >
              <div className="flex items-baseline justify-between gap-4 border-b border-[#EAF5FB] pb-4">
                <h3 className="font-heading text-[17px] font-bold leading-tight tracking-[-.01em] text-[#0A1628]">
                  {section.title}
                </h3>
                <span className="font-mono text-[10px] tracking-[.14em] text-[#5A6B78] transition-colors group-hover:text-[#153863]">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="mt-4 space-y-3 text-[14px] leading-[1.75] text-[#0A1628]/70">
                {section.paragraphs.map((text, pi) => <p key={pi}>{text}</p>)}
                {section.bullets.length > 0 && (
                  <ul className="space-y-2 pt-1">
                    {section.bullets.map((item, bi) => (
                      <li key={bi} className="flex gap-2.5">
                        <span className="mt-[9px] h-1 w-3 shrink-0 bg-[#22D3EE]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}