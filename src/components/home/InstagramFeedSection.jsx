import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function InstagramFeedSection() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    base44.entities.InstagramPost.list('-posted_at', 8).then(setPosts).catch(() => setPosts([]));
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="bg-[#f2f3f5] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <div className="mb-8 flex items-center gap-3 sm:mb-10">
          <Instagram size={22} className="text-slate-900" strokeWidth={1.5} />
          <h2 className="text-[clamp(1.8rem,7vw,2.25rem)] font-normal leading-tight tracking-[-0.03em] text-[#111827] [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] sm:text-3xl">Sledujte nás na Instagramu

          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {posts.map((post, i) =>
          <motion.a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl">
            
              <img
              src={post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url}
              alt={post.caption?.slice(0, 60) || 'Instagram příspěvek'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            
            </motion.a>
          )}
        </div>
      </div>
    </section>);

}