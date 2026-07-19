import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import StarRow from '@/components/reviews/StarRow';
import ReviewMiniCard from '@/components/reviews/ReviewMiniCard';

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
    <section className="border-t border-slate-200 bg-white py-12"><div className="site-container">
      <div className="flex items-start justify-between flex-wrap gap-6 mb-3">
        <div>
          <p className="text-sm text-slate-400 mb-2">Hodnocení zákazníků</p>
          <h2 className="m-0 font-heading text-2xl font-medium text-slate-900">Ověřené zkušenosti s produktem</h2>
        </div>
        <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
          <span className="text-lg font-bold text-slate-900">{avg.toFixed(1)}</span>
          <StarRow rating={avg} size={18} />
        </div>
      </div>
      <p className="mb-6 text-xs text-slate-500">
        Průměrné hodnocení: {avg.toFixed(1)} <span className="inline-flex align-middle mx-1"><StarRow rating={avg} size={14} /></span> ({reviews.length} {reviews.length === 1 ? 'recenze' : 'recenzí'})
      </p>
      <div className="grid gap-4 md:grid-cols-3">{reviews.slice(0, 3).map((review) => <ReviewMiniCard key={review.id} review={review} />)}</div>
    </div></section>);

}