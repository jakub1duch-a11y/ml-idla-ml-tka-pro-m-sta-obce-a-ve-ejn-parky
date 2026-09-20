import React from 'react';

const LOGO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4b2ec32a3_mlzidla_logo_bez_pozadi.png';

export default function Logo({ size = 'md' }) {
  const compact = size === 'sm';
  return (
    <span className="group/mlz-logo inline-flex items-center select-none" aria-label="MLŽIDLA.cz — chytré mlžení by HolmTec">
      <img
        src={LOGO_URL}
        alt="MLŽIDLA.cz"
        className={`${compact ? 'h-9 max-w-[150px]' : 'h-11 max-w-[190px]'} w-auto object-contain transition-transform duration-300 ease-out motion-safe:group-hover/mlz-logo:-translate-y-0.5`}
      />
    </span>
  );
}
