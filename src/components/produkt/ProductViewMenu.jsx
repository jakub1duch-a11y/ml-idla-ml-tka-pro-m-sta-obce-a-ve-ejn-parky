import React from 'react';
import { Eye, Image as ImageIcon, Sparkles, Video, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const OPTIONS = [
  { id: 'photo', label: 'Fotografie', icon: ImageIcon },
  { id: 'visualization', label: 'Vizualizace', icon: Sparkles },
  { id: 'video', label: 'Video', icon: Video },
];

export default function ProductViewMenu({ product, dark = false, align = 'right' }) {
  if (!product?.slug) return null;

  const panelAlign = align === 'left' ? 'left-0' : 'right-0';
  const surface = dark
    ? 'border-white/15 bg-[#07131D]/94 text-white shadow-[0_18px_48px_rgba(0,0,0,.35)]'
    : 'border-[#D8E7EC] bg-white/96 text-[#07131D] shadow-[0_18px_48px_rgba(7,19,29,.16)]';
  const itemBase = dark
    ? 'text-white/82 hover:bg-white/10 hover:text-white'
    : 'text-[#284050] hover:bg-[#EEF8FB] hover:text-[#07131D]';

  return (
    <details className="group/view relative z-40">
      <summary
        aria-label={`Vybrat způsob zobrazení produktu ${product.name || ''}`}
        className={`flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border backdrop-blur-md transition [&::-webkit-details-marker]:hidden ${dark ? 'border-white/18 bg-black/34 text-white hover:bg-black/52' : 'border-white/75 bg-white/90 text-[#07131D] shadow-md hover:bg-white'}`}
      >
        <Eye size={17} strokeWidth={1.8} />
      </summary>

      <div className={`absolute ${panelAlign} mt-2 w-52 overflow-hidden rounded-2xl border p-2 backdrop-blur-xl ${surface}`}>
        <p className={`px-3 pb-2 pt-1 font-mono text-[9px] font-semibold uppercase tracking-[.16em] ${dark ? 'text-white/42' : 'text-[#5A6B78]'}`}>
          Zobrazit produkt
        </p>

        {OPTIONS.map(({ id, label, icon: Icon }) => (
          <Link
            key={id}
            to={`/produkt/${product.slug}?view=${id}`}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${itemBase}`}
          >
            <Icon size={16} strokeWidth={1.7} />
            <span>{label}</span>
          </Link>
        ))}

        <div className={`my-1 border-t ${dark ? 'border-white/10' : 'border-[#E0EBEF]'}`} />

        <Link
          to={`/produkt/${product.slug}`}
          className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${itemBase}`}
        >
          <span>Detail produktu</span>
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </details>
  );
}
