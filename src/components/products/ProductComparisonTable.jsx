import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const COL_DEFS = [
  { key: 'micron_size', label: 'Kapky (µm)', hint: 'Menší = suší pocit' },
  { key: 'pressure', label: 'Tlak' },
  { key: 'water_consumption', label: 'Spotřeba vody' },
  { key: 'coverage_area', label: 'Dosah / pokrytí' },
  { key: 'power_supply', label: 'Řízení' },
  { key: 'material', label: 'Materiál' },
];

export default function ProductComparisonTable({ currentProductId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    base44.entities.Product.list().catch(() => []).then(all => {
      // Only products with at least some specs
      const withSpecs = (all || []).filter(p => p.micron_size || p.water_consumption || p.coverage_area);
      setProducts(withSpecs);
    });
  }, []);

  if (products.length < 2) return null;

  return (
    <div className="py-20 bg-ink">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Srovnání modelů</p>
          <h2 className="font-heading font-light text-3xl text-white">Který model je pro vás?</h2>
          <p className="text-white/40 text-sm mt-2">Všechny parametry na jednom místě — výkon, spotřeba a dosah.</p>
        </div>

        {/* Mobile: cards */}
        <div className="lg:hidden space-y-4">
          {products.map(p => (
            <div key={p.id} className={`rounded-2xl border p-5 ${p.id === currentProductId ? 'border-cyan/50 bg-cyan/5' : 'border-white/10 bg-card_bg'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium text-white">{p.name}</p>
                  <p className="text-xs text-white/40 mt-0.5">{p.short_description}</p>
                </div>
                {p.id === currentProductId && (
                  <span className="text-[10px] font-mono text-cyan bg-cyan/10 border border-cyan/30 px-2 py-1 rounded-full">Aktuální</span>
                )}
              </div>
              <div className="space-y-2">
                {COL_DEFS.map(col => p[col.key] ? (
                  <div key={col.key} className="flex justify-between gap-4 text-sm">
                    <span className="text-white/35 shrink-0">{col.label}</span>
                    <span className="text-white/80 text-right">{p[col.key]}</span>
                  </div>
                ) : null)}
              </div>
              {p.slug && p.id !== currentProductId && (
                <Link to={`/produkt/${p.slug}`} className="mt-4 flex items-center gap-1 text-xs text-cyan font-mono">
                  Zobrazit detail <ArrowRight size={11} />
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden lg:block overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-4 text-xs font-mono text-white/30 tracking-widest uppercase w-40">Model</th>
                {COL_DEFS.map(col => (
                  <th key={col.key} className="text-left px-4 py-4 text-xs font-mono text-white/30 tracking-widest uppercase">
                    {col.label}
                    {col.hint && <span className="block text-[10px] text-white/20 normal-case tracking-normal font-normal mt-0.5">{col.hint}</span>}
                  </th>
                ))}
                <th className="px-4 py-4 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => {
                const isCurrent = p.id === currentProductId;
                return (
                  <tr
                    key={p.id}
                    className={`border-b border-white/5 last:border-0 transition-colors ${isCurrent ? 'bg-cyan/5' : idx % 2 === 0 ? 'bg-card_bg' : 'bg-surface'}`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-cyan shrink-0" />}
                        <div>
                          <p className={`font-medium ${isCurrent ? 'text-cyan' : 'text-white'}`}>{p.name}</p>
                          <p className="text-[11px] text-white/35 leading-snug mt-0.5 max-w-[140px] line-clamp-2">{p.short_description}</p>
                        </div>
                      </div>
                    </td>
                    {COL_DEFS.map(col => (
                      <td key={col.key} className="px-4 py-4 text-white/70 align-top">
                        {p[col.key] ? (
                          <span className="leading-snug">{p[col.key]}</span>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-4 text-right">
                      {p.slug && !isCurrent ? (
                        <Link to={`/produkt/${p.slug}`} className="text-white/30 hover:text-cyan transition-colors">
                          <ArrowRight size={14} />
                        </Link>
                      ) : isCurrent ? (
                        <Check size={14} className="text-cyan ml-auto" />
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-white/25 mt-4 font-mono">* Parametry jsou orientační. Finální konfigurace dle zakázky.</p>
      </div>
    </div>
  );
}