import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import StarRow from '@/components/reviews/StarRow';

export default function ProductReviews({ productId, onStatsLoaded }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {setLoading(false);return;}
    base44.entities.Review.filter({ product_id: productId, published: true }, '-created_date').
    then((items) => {
      const list = items || [];
      setReviews(list);
      if (list.length > 0 && onStatsLoaded) {
        const avg = list.reduce((s, r) => s + (r.rating || 0), 0) / list.length;
        onStatsLoaded({ average: avg, count: list.length });
      }
    }).
    catch(() => {}).
    finally(() => setLoading(false));
  }, [productId]);

  if (loading || reviews.length === 0) return null;

  const avg = reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length;

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 border-t border-slate-200">
      <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
        <div>
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Hodnocení zákazníků</p>
          <h2 style={{ fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.04em' }} className="text-[hsl(var(--ring))] [font-family:'Inter',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-light">
            Co říkají naši klienti
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl text-slate-900" style={{ fontWeight: 800 }}>{avg.toFixed(1)}</span>
          <div>
            <StarRow rating={avg} size={16} />
            <p className="text-xs text-slate-400 font-mono mt-1">{reviews.length} {reviews.length === 1 ? 'recenze' : 'recenzí'}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reviews.slice(0, 6).map((r, i) =>
        <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
        className="p-6 rounded-2xl bg-white border border-slate-200">
            <StarRow rating={r.rating} />
            <p className="text-sm text-slate-600 leading-relaxed font-light mt-4 mb-5">"{r.comment}"</p>
            <div>
              <p className="text-sm text-slate-900 font-medium">{r.customer_name}</p>
              {(r.company || r.location) &&
            <p className="text-xs text-slate-400 mt-0.5">{[r.company, r.location].filter(Boolean).join(' · ')}</p>
            }
            </div>
          </motion.div>
        )}
      </div>
    </section>);

}