import React from 'react';

export default function ProductHoverImage({ product, alt = '', className = '', overlay = false, fallback = '' }) {
  const primary = product?.image_url || fallback;
  const secondary = product?.gallery_urls?.find((url) => url && url !== primary);
  if (!primary) return <div className={`bg-muted ${className}`} />;
  return <div className={`relative overflow-hidden ${className}`}>
    <img src={primary} alt={alt || product?.name || ''} loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${secondary ? 'opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-[1.03]' : 'group-hover:scale-105'}`} />
    {secondary && <img src={secondary} alt={`${alt || product?.name || 'Produkt'} – další pohled`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full scale-[1.03] object-cover opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100" />}
    {overlay && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/45 via-transparent to-transparent" />}
  </div>;
}
