import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import BlockRenderer from '@/components/pages/blocks/BlockRenderer';
import { setSEO } from '@/lib/seo';

export default function CustomPageView() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    base44.entities.CustomPage.filter({ slug, published: true })
      .then((results) => {
        if (!results || results.length === 0) { setNotFound(true); return; }
        const foundPage = results[0];
        setPage(foundPage);
        setSEO({
          title: foundPage.seo_title || foundPage.title || foundPage.name || slug,
          description: foundPage.seo_description || foundPage.description || '',
          canonicalPath: `/p/${slug}`,
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader size={28} className="animate-spin text-slate-300" />
    </div>
  );

  if (notFound || !page) return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-28">
      <p className="text-slate-400 text-lg">Stránka nenalezena.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {(page.blocks || []).map((block, i) => <BlockRenderer key={i} block={block} />)}
    </div>
  );
}