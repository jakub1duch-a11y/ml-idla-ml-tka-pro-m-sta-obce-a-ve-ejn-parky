import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Lightweight route-entry motion. Keeps routing/history native and degrades cleanly. */
export default function RouteMotion() {
  const { pathname } = useLocation();

  useEffect(() => {
    const root = document.getElementById('root');
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const target = root.querySelector('main') || root.querySelector('[role="main"]') || root;
    target.classList.remove('route-motion-enter');
    // Force a style boundary so repeated visits to the same route replay the entry animation.
    void target.offsetWidth;
    target.classList.add('route-motion-enter');

    const cleanup = window.setTimeout(() => target.classList.remove('route-motion-enter'), 320);
    return () => window.clearTimeout(cleanup);
  }, [pathname]);

  return null;
}
