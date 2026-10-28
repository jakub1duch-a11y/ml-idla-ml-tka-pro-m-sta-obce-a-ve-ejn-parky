import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ITEMS = [
  ['prehled', 'Přehled'],
  ['popis', 'Popis produktu'],
  ['parametry', 'Technické parametry'],
  ['varianty', 'Varianty'],
  ['galerie', 'Galerie'],
  ['vyhody', 'Výhody'],
  ['instalace', 'Instalace'],
  ['reference', 'Reference'],
];

export default function PdSectionNav({ product }) {
  const [active, setActive] = useState('prehled');
  const items = ITEMS.filter(([id]) => id !== 'varianty' || product.variants?.length);

  useEffect(() => {
    const sections = ITEMS.map(([id]) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0.05, 0.2, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [product.slug]);

  const scrollTo = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    const header = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--site-header-height')) || 68;
    const navigation = document.querySelector('[data-product-section-nav]')?.offsetHeight || 54;
    window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - header - navigation - 16, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  return (
    <div data-product-section-nav className="sticky top-[var(--site-header-height)] z-40 border-y border-[#D8E8ED] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-10">
        <div className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <nav className="flex min-w-max items-center" aria-label="Navigace detailu produktu">
            {items.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => { setActive(id); scrollTo(id); }}
                aria-current={active === id ? 'location' : undefined}
                className={`relative min-h-[54px] px-3 text-xs font-semibold transition-colors sm:px-4 ${active === id ? 'text-[#0A1628]' : 'text-[#5A6B78] hover:text-[#0A1628]'}`}
              >
                {label}
                {active === id && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-[#22D3EE] sm:inset-x-4" />}
              </button>
            ))}
          </nav>
        </div>
        <Link
          to={`/poptavka?produkt=${encodeURIComponent(product.slug)}`}
          className="hidden min-h-[40px] shrink-0 items-center gap-2 bg-[#0A1628] px-4 text-xs font-semibold text-white transition hover:bg-[#153863] sm:inline-flex"
        >
          Poptat <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}