import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, TreePine, Users, Trophy } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { VIDEO_ASSETS } from '@/lib/newMedia';

const ZOO_ID = '6a42491409abbf575447aaeb';
const JICIN_ID = '6a71d1ff57598752eed27bfb';

const CATEGORIES = [
  { label: 'Města', Icon: Building2 },
  { label: 'Parky', Icon: TreePine },
  { label: 'Promenády', Icon: Users },
  { label: 'Sportoviště', Icon: Trophy },
];

export default function HomeHero() {
  const [bgImage, setBgImage] = useState(VIDEO_ASSETS.heroJicin.poster);

  useEffect(() => {
    let mounted = true;
    base44.entities.Realizace.get(ZOO_ID)
      .then((ref) => { if (mounted && ref?.image_url) setBgImage(ref.image_url); })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Full-bleed photography */}
      <img
        src={bgImage}
        alt="Mlžítka pro veřejný prostor — reálná instalace"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Light gradient wash for text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-white/10" />

      {/* Organic teal blob — top-right */}
      <div className="brand-hero-blob brand-hero-blob-tr hidden md:block">
        <span className="brand-hero-blob-text">MLHA, KTERÁ<br />SPOJUJE LIDI</span>
      </div>

      {/* Organic teal blob — bottom-left */}
      <div className="brand-hero-blob brand-hero-blob-bl hidden md:block">
        <span className="brand-hero-blob-text">LEPŠÍ KLIMA</span>
        <div className="brand-hero-blob-divider" />
        <span className="brand-hero-blob-text">PRO LEPŠÍ ZÍTŘKY</span>
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-6 py-24 lg:px-10">
        {/* Logo mark — triple wave */}
        <div className="flex items-center gap-2.5">
          <svg width="36" height="36" viewBox="0 0 100 100" fill="none" className="text-[#28A7A0]">
            <path d="M18 82 C18 45, 45 18, 74 18" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
            <path d="M18 72 C18 35, 45 8, 74 8" stroke="currentColor" strokeWidth="9" strokeLinecap="round" opacity="0.45" />
            <path d="M18 92 C18 55, 45 28, 74 28" stroke="currentColor" strokeWidth="9" strokeLinecap="round" opacity="0.22" />
            <circle cx="76" cy="20" r="9" fill="currentColor" />
          </svg>
          <span className="font-heading text-sm font-bold tracking-wide text-[#0A1628]">MLŽIDLA.CZ</span>
        </div>

        {/* Headline */}
        <h1 className="mt-7 max-w-3xl font-heading text-[2.25rem] font-bold leading-[1.04] tracking-[-0.02em] text-[#0A1628] sm:text-6xl lg:text-7xl">
          Ochlazujeme <span className="text-[#28A7A0]">vzduch</span><br className="hidden sm:block" /> kolem vás
        </h1>

        {/* Category subhead */}
        <p className="mt-5 text-base text-[#0A1628]/65 sm:text-lg">
          Města <span className="text-[#28A7A0]">•</span> parky <span className="text-[#28A7A0]">•</span> promenády <span className="text-[#28A7A0]">•</span> sportoviště
        </p>

        {/* Thin-line circular category icons */}
        <div className="mt-8 flex gap-3 sm:gap-5">
          {CATEGORIES.map(({ label, Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="grid h-12 w-12 place-items-center rounded-full border border-[#0A1628]/15 text-[#0A1628]/70 transition-colors hover:border-[#28A7A0] hover:text-[#28A7A0] sm:h-14 sm:w-14">
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <span className="text-[11px] text-[#0A1628]/55 sm:text-xs">{label}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link to="/poptavka" className="btn-brand-primary">
            Poptat řešení <ArrowRight size={16} />
          </Link>
          <Link to="/mlzidla-mlzitka" className="btn-brand-outline">
            Prohlédnout produkty
          </Link>
        </div>
      </div>
    </section>
  );
}