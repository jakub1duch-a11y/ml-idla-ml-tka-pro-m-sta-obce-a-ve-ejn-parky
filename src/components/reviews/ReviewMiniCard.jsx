import React from 'react';
import { BadgeCheck } from 'lucide-react';
import StarRow from '@/components/reviews/StarRow';

export default function ReviewMiniCard({ review }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between gap-3"><StarRow rating={review.rating} size={12} /><BadgeCheck size={16} className="text-cyan-600" aria-label="Ověřená recenze" /></div>
    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">„{review.comment}“</p>
    <div className="mt-4 border-t border-slate-100 pt-3"><p className="text-sm font-semibold text-slate-900">{review.customer_name}</p>{(review.company || review.location) && <p className="mt-0.5 text-xs text-slate-400">{[review.company, review.location].filter(Boolean).join(' · ')}</p>}</div>
  </article>;
}