import React from 'react';
import { Images } from 'lucide-react';
import AutoPlayVideoPreview from '@/components/ui/AutoPlayVideoPreview';
import { getStudioMedia } from '@/lib/studioMedia';

const VIDEO_RE = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;
const isDirectVideo = (url) => typeof url === 'string' && VIDEO_RE.test(url);

export default function ProductHoverImage({ product, alt = '', className = '', overlay = false, fallback = '' }) {
  const studioMedia = getStudioMedia(product);
  const primary = studioMedia || product?.image_url || fallback;
  const isBrokenLocalPath = (url) => typeof url === 'string' && (url.startsWith('/media/products/') || url.startsWith('/media/optimized/'));
  const gallery = Array.isArray(product?.gallery_urls) ? product.gallery_urls : [];
  const videoUrl = isDirectVideo(product?.video_url)
    ? product.video_url
    : gallery.find((url) => isDirectVideo(url));

  // Konvence produktových karet: image_url = hlavní studiový náhled.
  // Pokud existuje video, karta ho po vstupu do viewportu spustí automaticky bez zvuku.
  // Bez videa se první odlišná fotografie galerie použije jako hover náhled realizace.
  const secondary = gallery.find((url) => url && url !== primary && !isBrokenLocalPath(url) && !isDirectVideo(url));
  if (!primary && !videoUrl) return <div className={`bg-muted ${className}`} />;

  return <div className={`relative overflow-hidden bg-slate-200 ${className}`}>
    {primary && <img
      src={primary}
      alt={alt || product?.name || ''}
      loading="lazy"
      decoding="async"
      className={`absolute inset-0 h-full w-full object-contain p-2.5 transition-all duration-700 sm:p-3 ${videoUrl ? 'opacity-100' : secondary ? 'opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-[1.02]' : 'group-hover:scale-[1.03]'}`}
    />}

    {videoUrl ? (
      <AutoPlayVideoPreview
        src={videoUrl}
        label={`${product?.name || 'Produkt'} – video náhled`}
        className="absolute inset-0"
        videoClassName="object-cover"
        threshold={0.58}
        showBadge
        showLoadingBackground={false}
      />
    ) : secondary ? (
      <>
        <img src={secondary} alt={`${alt || product?.name || 'Produkt'} – reálná fotografie realizace`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full scale-[1.02] object-cover opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100" />
        <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md transition-opacity duration-300 group-hover:opacity-0"><Images size={11} /> V realizaci</span>
      </>
    ) : null}

    {overlay && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/45 via-transparent to-transparent" />}
  </div>;
}
