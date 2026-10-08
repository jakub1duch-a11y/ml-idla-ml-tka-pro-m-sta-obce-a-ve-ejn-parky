import React, { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { buildGateCatalog } from '@/lib/gateCatalog';
import GateProductOverview from '@/components/produkt/GateProductOverview';
import useMotionPlayback from '@/components/motion/useMotionPlayback';
import '@/styles/gate-overview.css';
import '@/styles/content-motion.css';

export default function GatesSlider() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const { ref, playing } = useMotionPlayback();
  const products = useMemo(() => buildGateCatalog(records), [records]);
  useEffect(() => {
    let active = true;
    setLoading(true); setError(false);
    base44.entities.Product.list('name', 200).then(items => { if (active) setRecords(items || []); }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);
  return <div ref={ref} className="catalog-gate-overview" data-motion={playing ? 'playing' : 'paused'}><div className="catalog-gate-mist" aria-hidden="true" /><GateProductOverview id="catalog-gate-products" products={products} loading={loading} error={error} onRetry={() => setAttempt(value => value + 1)} /></div>;
}
