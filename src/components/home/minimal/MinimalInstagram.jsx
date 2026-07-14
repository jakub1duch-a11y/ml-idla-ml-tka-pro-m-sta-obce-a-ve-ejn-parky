import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function MinimalInstagram() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    base44.entities.InstagramPost.list('-posted_at', 8).then(setPosts).catch(() => setPosts([]));
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto px-6 lg:px-10 max-w-6xl">
        <div className="flex items-center gap-3 mb-12">
          <Instagram size={20} className="text-teal-600" strokeWidth={1.5} />
          <h2 className="tracking-tight font-heading font-extralight text-slate-900 text-3xl">
            Sledujte nás na Instagramu
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {posts.map((post, i) => (
            <motion.a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="group relative aspect-square overflow-hidden rounded-3xl bg-slate-50"
            >
              <img
                src={post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url}
                alt={post.caption?.slice(0, 60) || 'Instagram příspěvek'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}