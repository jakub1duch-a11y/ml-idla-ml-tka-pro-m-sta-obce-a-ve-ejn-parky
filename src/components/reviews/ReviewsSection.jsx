import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import StarRow from '@/components/reviews/StarRow';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Review.filter({ published: true }, '-created_date', 9)
      .then((items) => setReviews(items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || reviews.length === 0) return null;

  const avg = reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length;

  return (
    <section id="recenze" className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
      <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
        <div>
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Recenze</p>
          <h2 className="text-white text-xl lg:text-2xl" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>
            Co o nás říkají zákazníci
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl text-white" style={{ fontWeight: 800 }}>{avg.toFixed(1)}</span>
          <div>
            <StarRow rating={avg} size={16} />
            <p className="text-xs text-white/35 font-mono mt-1">{reviews.length} {reviews.length === 1 ? 'recenze' : 'recenzí'}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reviews.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="p-6 rounded-2xl bg-card_bg border border-white/10">
            <StarRow rating={r.rating} />
            <p className="text-sm text-white/65 leading-relaxed font-light mt-4 mb-5">"{r.comment}"</p>
            <div>
              <p className="text-sm text-white font-medium">{r.customer_name}</p>
              {(r.company || r.location) && (
                <p className="text-xs text-white/30 mt-0.5">{[r.company, r.location].filter(Boolean).join(' · ')}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}