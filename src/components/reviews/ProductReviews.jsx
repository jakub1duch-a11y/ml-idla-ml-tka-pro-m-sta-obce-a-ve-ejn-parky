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
      <div className="flex items-start justify-between flex-wrap gap-6 mb-3">
        <div>
          <p className="text-sm text-slate-400 mb-2">Hodnocení zákazníků</p>
          <h2 style={{ fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em' }} className="text-slate-900 [font-family:'Inter',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif]">
            Co říkají naši klienti
          </h2>
        </div>
        <div className="flex items-center gap-2.5 bg-slate-500 rounded-xl px-5 py-3">
          <span className="text-2xl text-white" style={{ fontWeight: 800 }}>{avg.toFixed(1)}</span>
          <StarRow rating={avg} size={18} />
        </div>
      </div>
      <p className="text-sm text-slate-500 mb-10">
        Průměrné hodnocení: {avg.toFixed(1)} <span className="inline-flex align-middle mx-1"><StarRow rating={avg} size={14} /></span> ({reviews.length} {reviews.length === 1 ? 'recenze' : 'recenzí'})
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.slice(0, 6).map((r, i) =>
        <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
        className="p-6 rounded-xl bg-white border border-slate-300">
            <StarRow rating={r.rating} />
            <p className="text-base text-slate-800 leading-relaxed mt-4 mb-8">{r.comment}</p>
            <div>
              <p className="text-base text-slate-900 font-bold">{r.customer_name}</p>
              {(r.company || r.location) &&
            <p className="text-sm text-slate-500 mt-0.5">{[r.company, r.location].filter(Boolean).join(' · ')}</p>
            }
            </div>
          </motion.div>
        )}
      </div>
    </section>);

}