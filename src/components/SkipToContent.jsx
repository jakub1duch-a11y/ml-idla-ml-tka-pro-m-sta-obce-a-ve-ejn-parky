import React from 'react';

/**
 * Accessibility: Skip-to-content link
 * Hidden by default, visible on tab focus
 * Allows keyboard users to skip navigation
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground focus:font-bold"
    >
      Přejít na hlavní obsah
    </a>
  );
}

export default SkipToContent;
