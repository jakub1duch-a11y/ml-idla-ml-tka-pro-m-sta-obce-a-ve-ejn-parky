import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Newspaper } from 'lucide-react';
import { setSEO } from '@/lib/seo';

export default function Novinky() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSEO({
      title: 'Novinky',
      description: 'Aktuality o firmě HolmTec, účast na veletrzích a nové trendy v ochlazování měst a veřejných prostor.',
      keywords: 'novinky HolmTec, aktuality mlžení, veletrhy mlžné systémy, trendy chlazení měst',
      canonicalPath: '/novinky',
    });

    base44.entities.BlogPost.filter({ category: 'novinky', published: true }, '-published_date')
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-ink pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-2">Aktuality</p>
        <h1 className="text-4xl lg:text-5xl font-light text-white mb-4">Novinky</h1>
        <p className="text-white/50 mb-10">Co se u nás děje — novinky o firmě, veletrzích a trendech v ochlazování měst.</p>

        {loading && <p className="text-white/40">Načítám...</p>}

        {!loading && posts.length === 0 && (
          <div className="text-center py-16">
            <Newspaper size={48} className="mx-auto mb-4 text-white/20" />
            <p className="text-white/50">Zatím žádné novinky</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug || post.id}`} className="bg-card_bg border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
              {post.image_url && <img src={post.image_url} alt={post.title} className="w-full h-44 object-cover" />}
              <div className="p-5">
                {post.published_date && (
                  <p className="text-xs text-cyan font-mono mb-2">{new Date(post.published_date).toLocaleDateString('cs-CZ')}</p>
                )}
                <h3 className="text-white font-medium text-lg mb-2">{post.title}</h3>
                {post.perex && <p className="text-white/50 text-sm line-clamp-3">{post.perex}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}