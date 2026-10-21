import { useEffect, useRef, useState } from 'react';

export default function useMotionPlayback() {
  const ref = useRef(null);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(query.matches);
    const visibility = () => setDocumentVisible(!document.hidden);
    change(); visibility();
    query.addEventListener('change', change);
    document.addEventListener('visibilitychange', visibility);
    return () => { query.removeEventListener('change', change); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setVisible(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.08 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, reduced, playing: visible && documentVisible && !reduced && !paused, paused, setPaused };
}
