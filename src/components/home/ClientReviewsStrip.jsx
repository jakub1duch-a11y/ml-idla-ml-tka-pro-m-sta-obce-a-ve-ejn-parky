import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import StarRow from '@/components/reviews/StarRow';

export default function ClientReviewsStrip() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Review.filter({ published: true }, '-created_date', 6)
      .then((items) => setReviews(items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || reviews.length === 0) return null;

  const avg = reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length;

  return (
    <div className="border-t border-slate-200 pt-14 mt-14">
      <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
        <div>
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Hodnocení klientů</p>
          <h3 className="font-heading font-light text-2xl lg:text-3xl text-slate-900 tracking-tight">Co říkají naši zákazníci</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-heading font-light text-3xl text-slate-900">{avg.toFixed(1)}</span>
          <div>
            <StarRow rating={avg} size={14} />
            <p className="text-xs text-slate-400 font-mono mt-1">{reviews.length} {reviews.length === 1 ? 'recenze' : 'recenzí'}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reviews.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
            <Quote size={18} className="text-slate-300 mb-3" />
            <StarRow rating={r.rating} size={13} />
            <p className="text-sm text-slate-600 leading-relaxed font-light mt-3 mb-5">"{r.comment}"</p>
            <div>
              <p className="text-sm text-slate-900 font-medium">{r.customer_name}</p>
              {(r.company || r.location) && (
                <p className="text-xs text-slate-400 mt-0.5">{[r.company, r.location].filter(Boolean).join(' · ')}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}