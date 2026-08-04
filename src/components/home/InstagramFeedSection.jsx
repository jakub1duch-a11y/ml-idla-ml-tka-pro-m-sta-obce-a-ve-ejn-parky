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
    <section className="py-20 bg-[hsl(var(--card-foreground))]">
      <div className="mx-auto px-6 lg:px-10 max-w-6xl">
        <div className="flex items-center gap-3 mb-10">
          <Instagram size={22} className="text-slate-900" strokeWidth={1.5} />
          <h2 className="tracking-tight [font-family:'Inter',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-bold text-[#111827] text-3xl">
            Sledujte nás na Instagramu
          </h2>
        </div>
        <div className="grid sm:grid-cols-5 grid-cols-6 gap-5">
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
            className="group relative aspect-square overflow-hidden rounded-2xl bg-white border border-slate-200">
            
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