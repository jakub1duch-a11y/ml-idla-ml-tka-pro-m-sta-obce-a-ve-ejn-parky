import React, { useState, useEffect } from 'react';

/**
 * Optimized Image Component with:
 * - Lazy loading (native + fallback)
 * - Responsive images with srcset
 * - WebP support with fallback
 * - Loading placeholder
 * - Accessibility (alt text required)
 */
export function ImageOptimized({
  src,
  alt,
  srcSet,
  webpSrcSet,
  avifSrcSet,
  sizes,
  width,
  height,
  className = '',
  loading = 'lazy',
  placeholder = true,
  fit = 'cover',
  position = 'center',
  aspectRatio,
  fetchPriority,
  onLoad,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const objectFit = fit === 'contain' ? 'contain' : 'cover';
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset image state when a card reuses this component for another product.
    // Otherwise a previous load/error can leave the new source hidden or stuck.
    setIsLoaded(false);
    setHasError(!src);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  if (hasError) {
    return (
      <div
        className={`bg-muted flex items-center justify-center ${className}`}
        style={{ width, height, aspectRatio }}
        role="img"
        aria-label={alt}
      >
        <span className="text-xs text-muted-foreground">Obrázek není dostupný</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden" style={{ width, height, aspectRatio }}>
      {/* Loading placeholder */}
      {placeholder && !isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10 animate-pulse" />
      )}

      {/* Picture element for WebP support */}
      <picture className="block w-full h-full">
        {avifSrcSet && <source srcSet={avifSrcSet} type="image/avif" sizes={sizes} />}
        {webpSrcSet && <source srcSet={webpSrcSet} type="image/webp" sizes={sizes} />}
        {srcSet && <source srcSet={srcSet} />}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={loading}
          fetchPriority={fetchPriority}
          style={{ objectFit, objectPosition: position }}
          className={`w-full h-full transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          decoding="async"
        />
      </picture>
    </div>
  );
}

export default ImageOptimized;
