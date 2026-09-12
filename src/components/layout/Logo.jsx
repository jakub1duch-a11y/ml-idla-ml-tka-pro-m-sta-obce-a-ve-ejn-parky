import React from 'react';

const LOGO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/be5670d83_generated_9a2cc224.png';

export default function Logo({ size = 'md' }) {
  const compact = size === 'sm';
  return (
    <span className="group/mlz-logo inline-flex items-center" aria-label="MLŽIDLA by HolmTec">
      <img
        src={LOGO_URL}
        alt="MLŽIDLA — mlžné oblouky a mlžítka"
        className={`${compact ? 'h-10' : 'h-14'} w-auto shrink-0 bg-[#F4FAFC] px-2.5 py-1 object-contain transition-transform duration-700 ease-out motion-safe:group-hover/mlz-logo:scale-[1.03]`}
      />
    </span>
  );
}