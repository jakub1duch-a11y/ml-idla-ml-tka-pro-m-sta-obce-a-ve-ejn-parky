import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { resolveMediaUrl } from '@/lib/optimizedMedia';

const isDirectVideo = (url) => typeof url === 'string' && /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url);

function classifyVideo(file) {
  const group = String(file?.media_group || '').toUpperCase();
  const slug = String(file?.product_slug || '').toLowerCase();
  const name = String(file?.file_name || '').toLowerCase();

  if (group === 'GATE' || slug === 'mlzna-brana-gate' || name.includes('gate')) {
    if (name.includes('efekt-mlhy')) return { key: 'mist', label: 'Jemná vodní mlha', href: '/technologie' };
    return { key: 'gate', label: 'BRÁNA GATE', href: '/produkt/mlzna-brana-gate' };
  }
  if (group === 'OSTEV' || slug.includes('ostrev') || name.includes('ostev')) {
    return { key: 'ostrev', label: 'OSTREV', href: '/produkt/ostrev-mlzitko' };
  }
  if (group === 'ZOO_PRAHA' || name.includes('zoo')) {
    return { key: 'zoo', label: 'Realizace ZOO Praha', href: '/reference/mlzitka-pro-zoo-praha' };
  }
  if (group === 'STEBLO' || slug.includes('bendy') || name.includes('steblo')) {
    return { key: 'bendy', label: 'BENDY / STÉBLO®', href: '/produkt/bendy-alej' };
  }
  if (group === 'MESTSKE_MLZENI') return { key: 'urban', label: 'Městské chlazení', href: '/mlzidla-mlzitka' };
  if (group === 'AURA_COLLECTION') return { key: 'aura', label: 'AURA kolekce', href: '/kolekce' };
  return { key: 'general', label: 'MLŽIDLA® v pohybu', href: '/mlzidla-mlzitka' };
}

export default function HomepageVideoLoops() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    let active = true;
    base44.entities.MediaFile.list('-created_date')
      .then((items = []) => { if (active) setFiles(items); })
      .catch(() => { if (active) setFiles([]); });
    return () => { active = false; };
  }, []);

  const videos = useMemo(() => {
    const candidates = files
      .filter((file) => String(file?.file_type || '').startsWith('video/') && file?.file_url)
      .map((file) => ({
        ...file,
        resolvedUrl: resolveMediaUrl(file.file_url),
        classification: classifyVideo(file),
      }))
      .filter((file) => isDirectVideo(file.resolvedUrl));

    const preferredKeys = ['general', 'zoo', 'gate', 'ostrev', 'bendy', 'mist', 'urban', 'aura'];
    const selected = [];
    for (const key of preferredKeys) {
      const match = candidates.find((file) => file.classification.key === key && !selected.some((item) => item.resolvedUrl === file.resolvedUrl));
      if (match) selected.push(match);
      if (selected.length === 3) break;
    }
    return selected;
  }, [files]);

  if (!videos.length) return null;

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-7 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-teal-700">MLŽIDLA® · živé ukázky</p>
            <h2 className="mt-3 max-w-3xl font-heading text-3xl font-medium leading-tight tracking-[-.035em] text-slate-950 sm:text-4xl lg:text-5xl">
              Nové video: mlžítka v reálném provozu.
            </h2>
          </div>
          <Link to="/mlzidla-mlzitka" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-teal-700">
            Prohlédnout produkty <ArrowRight size={16} />
          </Link>
        </div>

        <div className={`grid gap-4 ${videos.length >= 2 ? 'md:grid-cols-2' : ''} ${videos.length === 3 ? 'xl:grid-cols-3' : ''}`}>
          {videos.map((video) => (
            <Link
              key={video.id || video.resolvedUrl}
              to={video.classification.href}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-950"
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                <video
                  src={video.resolvedUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent px-4 pb-4 pt-12 sm:px-5 sm:pb-5">
                  <p className="text-sm font-semibold text-white">{video.classification.label}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
