import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Images, Play } from 'lucide-react';
import AutoPlayVideoPreview from '@/components/ui/AutoPlayVideoPreview';
import { getStudioMedia } from '@/lib/studioMedia';

const VIDEO_RE = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;
const isDirectVideo = (url) => typeof url === 'string' && VIDEO_RE.test(url);
const isBrokenLocalPath = (url) => typeof url === 'string' && (url.startsWith('/media/products/') || url.startsWith('/media/optimized/'));

const VIEW_STYLES = {
  studio: 'object-contain p-2.5 sm:p-3',
  real: 'object-cover',
  viz: 'object-cover',
  video: '',
};

const VIEW_LABELS = {
  studio: 'Studio',
  real: 'Realizace',
  viz: 'Vizualizace',
  video: 'Video',
};

export default function ProductHoverImage({ product, alt = '', className = '', overlay = false, fallback = '' }) {
  const [activeView, setActiveView] = useState(0);
  const [hovered, setHovered] = useState(false);

  const views = useMemo(() => {
    const studioMedia = getStudioMedia(product);
    const primary = studioMedia || product?.image_url || fallback;
    const gallery = Array.isArray(product?.gallery_urls) ? product.gallery_urls : [];
    const videoUrl = isDirectVideo(product?.video_url)
      ? product.video_url
      : gallery.find((url) => isDirectVideo(url));

    const list = [];

    // 1. Studio / product render
    if (primary) {
      list.push({ type: 'studio', url: primary, label: VIEW_LABELS.studio });
    }

    // 2. Real photos from gallery (distinct from primary, non-video, non-broken)
    const realPhotos = gallery.filter(
      (url) => url && url !== primary && !isBrokenLocalPath(url) && !isDirectVideo(url)
    );
    realPhotos.slice(0, 2).forEach((url) => {
      list.push({ type: 'real', url, label: VIEW_LABELS.real });
    });

    // 3. Visualization (AI hero environment)
    if (product?.hero_background_url && product.hero_background_url !== primary && !isBrokenLocalPath(product.hero_background_url)) {
      list.push({ type: 'viz', url: product.hero_background_url, label: VIEW_LABELS.viz });
    }

    // 4. Video
    if (videoUrl) {
      list.push({ type: 'video', url: videoUrl, label: VIEW_LABELS.video });
    }

    return list;
  }, [product, fallback]);

  // Auto-advance on hover (desktop): go to first non-studio view
  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    if (views.length > 1 && activeView === 0) {
      const nextIdx = views.findIndex((v, i) => i > 0 && v.type !== 'video');
      if (nextIdx !== -1) setActiveView(nextIdx);
    }
  }, [views, activeView]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setActiveView(0);
  }, []);

  const selectView = useCallback((e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveView(idx);
  }, []);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0 && activeView < views.length - 1) setActiveView((v) => v + 1);
      else if (dx > 0 && activeView > 0) setActiveView((v) => v - 1);
    }
  }, [views.length, activeView]);

  const containerRef = useRef(null);

  // On touch devices, auto-advance preview when card scrolls into view
  useEffect(() => {
    if (views.length <= 1) return;
    // Only on mobile viewport or touch devices — skip desktop with hover
    if (window.matchMedia('(hover: hover)').matches && window.innerWidth >= 768) return;
    const el = containerRef.current;
    if (!el) return;
    let triggered = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.65) {
          if (!triggered) {
            triggered = true;
            const nextIdx = views.findIndex((v, i) => i > 0 && v.type !== 'video');
            if (nextIdx !== -1) setActiveView(nextIdx);
          }
        } else if (!entry.isIntersecting || entry.intersectionRatio < 0.25) {
          if (triggered) {
            triggered = false;
            setActiveView(0);
          }
        }
      },
      { threshold: [0, 0.25, 0.65, 1.0] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [views]);

  if (views.length === 0) return <div className={`bg-muted ${className}`} />;

  const current = views[activeView] || views[0];
  const hasMultiple = views.length > 1;
  const showDots = hasMultiple;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-slate-200 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Render all views stacked, toggle opacity for crossfade */}
      {views.map((view, idx) => {
        const isActive = idx === activeView;
        const styleClass = VIEW_STYLES[view.type] || 'object-cover';

        if (view.type === 'video') {
          return (
            <div key={`view-${idx}`} className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
              {isActive && (
                <AutoPlayVideoPreview
                  src={view.url}
                  label={`${product?.name || 'Produkt'} – video náhled`}
                  className="absolute inset-0"
                  videoClassName="object-cover"
                  threshold={0.58}
                  showBadge={false}
                  showLoadingBackground={false}
                />
              )}
            </div>
          );
        }

        return (
          <img
            key={`view-${idx}`}
            src={view.url}
            alt={isActive ? (alt || product?.name || '') : ''}
            loading={idx === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className={`absolute inset-0 h-full w-full transition-all duration-500 ${styleClass} ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.01]'}`}
          />
        );
      })}

      {/* View type badge */}
      {hasMultiple && (
        <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md transition-opacity duration-300">
          {current.type === 'video' ? <Play size={10} fill="currentColor" /> : <Images size={10} />}
          {current.label}
        </span>
      )}

      {/* Interactive view switcher dots */}
      {showDots && (
        <div className="absolute bottom-1.5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-0.5">
          {views.map((view, idx) => (
            <button
              key={`dot-${idx}`}
              type="button"
              aria-label={`Zobrazit: ${view.label}`}
              onClick={(e) => selectView(e, idx)}
              className="flex h-8 items-center justify-center px-1.5 sm:h-5"
            >
              <span className={`block h-1.5 rounded-full transition-all duration-300 ${idx === activeView ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'}`} />
            </button>
          ))}
        </div>
      )}

      {overlay && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/45 via-transparent to-transparent" />}
    </div>
  );
}