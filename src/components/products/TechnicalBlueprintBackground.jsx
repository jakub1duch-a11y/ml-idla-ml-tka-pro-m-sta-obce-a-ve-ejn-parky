import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

function hashSlug(value = '') {
  return [...value].reduce((acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0, 0);
}

function motifForSlug(slug = '') {
  const s = slug.toLowerCase();
  if (s.includes('spir')) return 'spiral';
  if (s.includes('mrak')) return 'cloud';
  if (s.includes('mrkev')) return 'carrot';
  if (s.includes('teepee')) return 'teepee';
  if (s.includes('kruh')) return 'circle';
  if (s.includes('slunce')) return 'sun';
  if (s.includes('kvet')) return 'flower';
  if (s.includes('kapr')) return 'fish';
  if (s.includes('pav')) return 'peacock';
  if (s.includes('volavka')) return 'heron';
  if (s.includes('y-armist') || s.includes('ostrev')) return 'y';
  if (s.includes('gate') || s.includes('brana')) return 'gate';
  if (s.includes('linea')) return 'linea';
  if (s.includes('steblo') || s.includes('bendy')) return 'stem';
  if (s.includes('aura')) return 'aura';
  if (s.includes('tryska')) return 'nozzle';
  return 'stem';
}

function ProductMotif({ type }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.15, vectorEffect: 'non-scaling-stroke' };
  switch (type) {
    case 'spiral':
      return <path {...common} d="M92 14c-41 3-70 28-70 58 0 27 24 48 54 48 27 0 46-16 46-37 0-19-16-32-36-32-17 0-29 10-29 23 0 11 10 19 22 19 10 0 18-6 18-14" />;
    case 'cloud':
      return <path {...common} d="M21 88c-11 0-19-8-19-18s8-18 19-18c3-15 16-25 31-25 13 0 24 7 29 18 4-3 9-4 14-4 14 0 25 10 25 23 0 13-11 24-25 24z" />;
    case 'carrot':
      return <><path {...common} d="M49 26c7 10 12 22 15 37l-16 50-17-50c3-15 9-27 18-37z"/><path {...common} d="M49 28c-7-9-7-18-5-27M49 28c5-9 13-15 23-18M49 28c-1-11 3-20 10-28"/></>;
    case 'teepee':
      return <><path {...common} d="M18 111 49 15l31 96M7 111h85M31 111l18-55 18 55"/><circle {...common} cx="49" cy="15" r="3"/></>;
    case 'circle':
      return <><circle {...common} cx="50" cy="62" r="34"/><circle {...common} cx="50" cy="62" r="25"/><line {...common} x1="50" y1="28" x2="50" y2="96"/></>;
    case 'sun':
      return <><circle {...common} cx="50" cy="61" r="22"/>{[0,45,90,135].map((r)=><line key={r} {...common} x1="50" y1="15" x2="50" y2="30" transform={`rotate(${r} 50 61)`}/>)}</>;
    case 'flower':
      return <><circle {...common} cx="50" cy="60" r="8"/>{[0,72,144,216,288].map((r)=><ellipse key={r} {...common} cx="50" cy="38" rx="10" ry="18" transform={`rotate(${r} 50 60)`}/>)}</>;
    case 'fish':
      return <><path {...common} d="M16 62c17-22 42-26 61-10l17-14-4 24 4 24-17-14c-19 16-44 12-61-10z"/><circle {...common} cx="35" cy="57" r="2"/></>;
    case 'peacock':
      return <><path {...common} d="M49 103V55c0-17 12-30 27-30"/><path {...common} d="M49 55C38 32 21 23 6 27M49 55c0-27-8-44-20-52M49 55c10-25 27-39 44-38"/></>;
    case 'heron':
      return <><path {...common} d="M45 108V69c0-11 6-20 17-26l22-13-25 7c-11 3-18 12-18 23"/><path {...common} d="M45 108h-12M45 108h13"/></>;
    case 'y':
      return <><path {...common} d="M50 110V55M50 56C44 42 33 29 18 21M50 56c7-14 18-27 33-35"/><path {...common} d="M46 110h8"/></>;
    case 'gate':
      return <><path {...common} d="M16 109V46c0-15 12-27 27-27h14c15 0 27 12 27 27v63"/><line {...common} x1="16" y1="109" x2="84" y2="109"/></>;
    case 'linea':
      return <><path {...common} d="M50 111V20c0-4 3-7 7-7h12"/><circle {...common} cx="68" cy="13" r="2.5"/><circle {...common} cx="58" cy="20" r="2"/><circle {...common} cx="55" cy="29" r="2"/></>;
    case 'aura':
      return <><path {...common} d="M50 112V54c0-19 15-34 34-34"/><path {...common} d="M50 54c0-19-15-34-34-34"/></>;
    case 'nozzle':
      return <><rect {...common} x="24" y="48" width="42" height="23" rx="4"/><path {...common} d="M66 53h14l10 7-10 7H66"/><path {...common} strokeDasharray="3 5" d="M90 58l28-12M90 60l31 0M90 62l28 12"/></>;
    case 'stem':
    default:
      return <><path {...common} d="M49 111V62c0-18 10-32 28-43"/><circle {...common} cx="78" cy="18" r="2.5"/><path {...common} d="M45 111h8"/></>;
  }
}

function BlueprintSvg({ product, variant, theme }) {
  const seed = Math.abs(hashSlug(product?.slug || product?.name || 'mlzidla'));
  const motif = motifForSlug(product?.slug || product?.name || '');
  const dx = seed % 17;
  const dy = (seed >> 2) % 13;
  const isB = variant === 1;
  const lineClass = theme === 'light' ? 'text-[#2AAFC1]' : 'text-[#4ED5E7]';
  const opacity = theme === 'light' ? 0.24 : 0.16;
  const softOpacity = theme === 'light' ? 0.12 : 0.09;

  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className={`h-full w-full ${lineClass}`} aria-hidden="true">
      <g opacity={opacity}>
        <g transform={`translate(${65 + dx} ${90 + dy}) scale(2.2)`}><ProductMotif type={motif} /></g>
        <g transform={`translate(${isB ? 1240 : 1320} ${isB ? 410 : 120}) scale(${isB ? 2.45 : 2}) rotate(${isB ? -8 : 0})`}><ProductMotif type={motif} /></g>
      </g>

      <g fill="none" stroke="currentColor" strokeWidth="1" opacity={softOpacity} vectorEffect="non-scaling-stroke">
        <path d={isB ? 'M86 730H620M980 130h470M1030 760h390' : 'M75 188h550M980 720h500M1010 190h390'} />
        <path strokeDasharray="7 10" d={isB ? 'M120 660c145-240 410-260 580-105M980 680c120-210 270-250 470-180' : 'M110 760c120-190 350-240 520-115M1010 610c120-190 285-225 430-150'} />
        <circle cx={isB ? 760 : 740} cy={isB ? 190 : 725} r="115" strokeDasharray="8 9" />
        <circle cx={isB ? 1110 : 460} cy={isB ? 720 : 165} r="62" strokeDasharray="6 8" />
        <path d={isB ? 'M650 108v330M1410 490v285M121 150v160' : 'M720 92v330M1430 140v280M105 555v220'} />
        <path d={isB ? 'M635 108h30M635 438h30M1395 490h30M1395 775h30' : 'M705 92h30M705 422h30M1415 140h30M1415 420h30'} />
        <path d={isB ? 'M650 108l-7 12m7-12 7 12M650 438l-7-12m7 12 7-12' : 'M720 92l-7 12m7-12 7 12M720 422l-7-12m7 12 7-12'} />
        <path strokeDasharray="2 5" d={isB ? 'M1200 170l170 80M1200 180l190 15M1200 190l175-52' : 'M1120 540l220 80M1120 550l240 15M1120 560l215-60'} />
        <g transform={isB ? 'translate(1110 660)' : 'translate(120 680)'}>
          <circle cx="80" cy="80" r="66" />
          <circle cx="80" cy="80" r="45" />
          <circle cx="80" cy="80" r="13" />
          {[0,45,90,135].map((r)=><line key={r} x1="80" y1="18" x2="80" y2="30" transform={`rotate(${r} 80 80)`}/>) }
        </g>
      </g>
    </svg>
  );
}

export default function TechnicalBlueprintBackground({ product, theme = 'dark', className = '', autoRotate = true }) {
  const [variant, setVariant] = useState(0);
  const reduceMotion = useReducedMotion();
  const key = useMemo(() => `${product?.slug || product?.name || 'product'}-${variant}`, [product, variant]);

  useEffect(() => {
    setVariant(0);
  }, [product?.slug]);

  useEffect(() => {
    if (!autoRotate || reduceMotion) return undefined;
    const timer = window.setInterval(() => setVariant((v) => (v + 1) % 2), 8500);
    return () => window.clearInterval(timer);
  }, [autoRotate, reduceMotion]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className={theme === 'light' ? 'absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,.98),rgba(244,249,250,.94)_58%,rgba(236,246,248,.9))]' : 'absolute inset-0 bg-[radial-gradient(circle_at_45%_42%,rgba(11,55,73,.42),rgba(10,22,40,.94)_68%)]'} />
      <AnimatePresence mode="sync">
        <motion.div
          key={key}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 1.2, ease: 'easeOut' }}
        >
          <BlueprintSvg product={product} variant={variant} theme={theme} />
        </motion.div>
      </AnimatePresence>
      <div className={theme === 'light' ? 'absolute inset-0 bg-gradient-to-r from-white/35 via-transparent to-white/20' : 'absolute inset-0 bg-gradient-to-r from-[#0A1628]/55 via-transparent to-[#0A1628]/30'} />
    </div>
  );
}
