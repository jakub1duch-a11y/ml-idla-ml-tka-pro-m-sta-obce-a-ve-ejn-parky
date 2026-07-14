import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function BoldInstagram() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    base44.entities.InstagramPost.list('-posted_at', 8).then(setPosts).catch(() => setPosts([]));
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="bg-white py-20 lg:py-28 border-t-2 border-black">
      <div className="mx-auto px-6 lg:px-10 max-w-6xl">
        <div className="flex items-center gap-3 mb-10">
          <Instagram size={22} className="text-red-600" strokeWidth={2} />
          <h2 className="tracking-tight font-heading font-black uppercase text-slate-900 text-3xl">
            Sledujte nás na Instagramu
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-t border-l border-black">
          {posts.map((post, i) => (
            <motion.a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="group relative aspect-square overflow-hidden border-r border-b border-black"
            >
              <img
                src={post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url}
                alt={post.caption?.slice(0, 60) || 'Instagram příspěvek'}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}