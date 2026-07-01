import React from 'react';
import { Star } from 'lucide-react';

export default function StarRow({ rating = 0, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? 'text-cyan fill-cyan' : 'text-white/15'}
        />
      ))}
    </div>
  );
}