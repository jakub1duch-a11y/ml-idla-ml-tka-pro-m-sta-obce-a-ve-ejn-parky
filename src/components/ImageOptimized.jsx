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
  sizes,
  width,
  height,
  className = '',
  loading = 'lazy',
  placeholder = true,
  onLoad,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) setHasError(true);
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
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <span className="text-xs text-muted-foreground">Obrázek není dostupný</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden" style={{ width, height }}>
      {/* Loading placeholder */}
      {placeholder && !isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10 animate-pulse" />
      )}

      {/* Picture element for WebP support */}
      <picture className={className}>
        {webpSrcSet && <source srcSet={webpSrcSet} type="image/webp" />}
        {srcSet && <source srcSet={srcSet} />}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={loading}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
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
