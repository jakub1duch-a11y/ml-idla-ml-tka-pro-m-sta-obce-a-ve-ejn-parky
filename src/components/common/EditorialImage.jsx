import React from 'react';
import '@/styles/editorial-refresh.css';

export default function EditorialImage({ asset, priority = false, className = '', sizes = '100vw', ...props }) {
  return <img src={asset.src} srcSet={asset.srcSet} sizes={sizes} width={asset.width} height={asset.height}
    alt={asset.alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined}
    decoding="async" className={className} {...props} />;
}
