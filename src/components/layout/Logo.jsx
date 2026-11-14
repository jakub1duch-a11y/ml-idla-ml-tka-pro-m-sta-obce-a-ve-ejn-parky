import React from 'react';
import MlzidlaLogoSvg, { MlzidlaIcon } from '@/components/brand/MlzidlaLogoSvg';

export function MistZMark({ size = 'md', className = '' }) {
  const sizes = { xs: 'h-7 w-[31px]', sm: 'h-9 w-[39px]', md: 'h-11 w-[48px]', lg: 'h-14 w-[61px]' };
  return <MlzidlaIcon className={`${sizes[size] || sizes.md} ${className}`} />;
}

// Jeden oficiální logotyp pro hlavičku, patičku, mobilní navigaci a brand manuál.
export default function Logo({ size = 'md', variant = 'simple', tone = 'dark', className = '' }) {
  const heights = { xs: 'h-6', sm: 'h-7', md: 'h-8', lg: 'h-11' };
  return (
    <span className={`inline-flex flex-col ${tone === 'light' ? 'text-[#053949]' : 'text-white'} ${className}`}>
      <MlzidlaLogoSvg className={`${heights[size] || heights.md} w-auto shrink-0`} />
      {variant === 'full' && (
        <span className="mlz-wordmark__caption" aria-hidden="true">Architektura vodní mlhy</span>
      )}
    </span>
  );
}
