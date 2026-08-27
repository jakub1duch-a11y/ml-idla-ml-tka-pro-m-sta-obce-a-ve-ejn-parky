import React from 'react';
import { Images } from 'lucide-react';

export default function ProductHoverImage({ product, alt = '', className = '', overlay = false, fallback = '' }) {
  const primary = product?.image_url || fallback;
  const isBrokenLocalPath = (url) => typeof url === 'string' && (url.startsWith('/media/products/') || url.startsWith('/media/optimized/'));
  const secondary = product?.gallery_urls?.find((url) => url && url !== primary && !isBrokenLocalPath(url));
  if (!primary) return <div className={`bg-muted ${className}`} />;
  return <div className={`relative overflow-hidden bg-white ${className}`}>
    <img src={primary} alt={alt || product?.name || ''} loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full object-contain p-2.5 transition-all duration-700 sm:p-3 ${secondary ? 'opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-[1.02]' : 'group-hover:scale-[1.03]'}`} />
    {secondary && <img src={secondary} alt={`${alt || product?.name || 'Produkt'} – další pohled`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full scale-[1.02] object-contain p-2.5 opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100 sm:p-3" />}
    {secondary && <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md transition-opacity duration-300 group-hover:opacity-0"><Images size={11} /> V realizaci</span>}
    {overlay && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/45 via-transparent to-transparent" />}
  </div>;
}