import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getLine, getFamily } from '@/lib/productFamilies';

export default function PdFamilyNav({ product }) {
  const line = getLine(product);
  const family = getFamily(product);
  return (
    <nav aria-label="Drobečková navigace" className="border-b border-[#D3E2E8] bg-[#F4FAFC]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-1 px-5 py-3 text-[13px] text-[#5A6B78] sm:px-7 lg:px-10">
        <Link to="/mlzidla-mlzitka" className="hover:text-[#153863]">Katalog</Link>
        <ChevronRight size={14} className="opacity-50" />
        <Link to="/mlzidla-mlzitka#catalog" className="hover:text-[#153863]">{family.label}</Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="font-mono text-[12px] tracking-[.08em] text-[#153863]">{line.label}</span>
        <ChevronRight size={14} className="opacity-50" />
        <span className="font-semibold text-[#0A1628]">{product.name}</span>
        {line.tagline && <span className="ml-auto hidden text-[#5A6B78] lg:inline">{line.tagline}</span>}
      </div>
    </nav>
  );
}