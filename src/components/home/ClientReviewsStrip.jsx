import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import StarRow from '@/components/reviews/StarRow';
import ReviewMiniCard from '@/components/reviews/ReviewMiniCard';

export default function ClientReviewsStrip() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { base44.entities.Review.filter({ published: true }, '-created_date', 6).then((items) => setReviews(items || [])).catch(() => {}).finally(() => setLoading(false)); }, []);
  if (loading || !reviews.length) return null;
  const avg = reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length;
  return <section className="border-y border-slate-200 bg-slate-50 py-10"><div className="site-container grid gap-6 lg:grid-cols-[240px_1fr] lg:items-center">
    <div><p className="content-eyebrow mb-2">Ověřené recenze</p><h2 className="m-0 font-heading text-xl font-medium text-slate-950">Zkušenosti klientů</h2><div className="mt-3 flex items-center gap-2"><strong className="text-lg text-slate-950">{avg.toFixed(1)}</strong><StarRow rating={avg} size={13} /><span className="text-xs text-slate-400">{reviews.length} recenzí</span></div></div>
    <div className="grid gap-4 md:grid-cols-3">{reviews.slice(0, 3).map((review) => <ReviewMiniCard key={review.id} review={review} />)}</div>
  </div></section>;
}