import React from 'react';

import { BRAND_LOGO_SRC } from '@/lib/brandLogo';

const LOGO_URL = BRAND_LOGO_SRC;

export default function Logo({ size = 'md' }) {
  const compact = size === 'sm';
  return (
    <span className="group/mlz-logo inline-flex items-center select-none" aria-label="MLŽIDLA.cz — chytré mlžení by HolmTec">
      <img
        src={LOGO_URL}
        alt="MLŽIDLA.cz"
        className={`${compact ? 'h-9 max-w-[155px]' : 'h-12 max-w-[205px]'} w-auto object-contain transition-transform duration-300 ease-out motion-safe:group-hover/mlz-logo:-translate-y-0.5`}
      />
    </span>
  );
}
