import React from 'react';

const LOGO_URL = '/media/optimized/be5670d83_generated_9a2cc224.webp';

export default function Logo({ size = 'md' }) {
  const compact = size === 'sm';
  return (
    <span className="group/mlz-logo inline-flex items-center" aria-label="MLŽIDLA by HolmTec">
      <img
        src={LOGO_URL}
        alt="MLŽIDLA — mlžné oblouky a mlžítka"
        className={`${compact ? 'h-12' : 'h-16'} w-auto shrink-0 bg-[#F4FAFC] px-1.5 py-0.5 object-contain transition-transform duration-700 ease-out motion-safe:group-hover/mlz-logo:scale-[1.03]`}
      />
    </span>
  );
}