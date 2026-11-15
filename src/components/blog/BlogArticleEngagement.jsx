import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Send, Share2, Check, MapPinned } from 'lucide-react';
import { Link } from 'react-router-dom';
import ShareButtons from './ShareButtons';

/**
 * One blue mist heart per browser and article. This is an explicit local
 * favourite, NOT a fabricated public reaction count or a server-side vote.
 */
export default function BlogArticleEngagement({ postId, title, compact = false }) {
  const key = `mlzidla_mist_heart_${postId}`;
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    try { setLiked(localStorage.getItem(key) === '1'); } catch { setLiked(false); }
  }, [key]);
  const toggle = () => {
    const next = !liked;
    setLiked(next);
    try {
      if (next) localStorage.setItem(key, '1');
      else localStorage.removeItem(key);
    } catch { /* Works until page refresh when storage is unavailable. */ }
  };
  return (
    <section aria-label="Reakce a sdílení článku" className={compact ? '' : 'my-7 rounded-3xl border border-[#CFE4EB] bg-[#F5FAFC] p-4 sm:p-6'}>
      <div className="flex flex-wrap items-center gap-2.5">
        <button type="button" onClick={toggle} aria-pressed={liked}
          aria-label={liked ? 'Odebrat mlžné srdce' : 'Dát článku modré mlžné srdce'}
          className={`group inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008CC6] ${liked ? 'border-[#58BFE7] bg-[#DBF3FF] text-[#075D92]' : 'border-[#C8DDE8] bg-white text-[#234E65] hover:border-[#6FC9EC]'}`}>
          <Heart aria-hidden="true" size={19} fill={liked ? '#09AEEB' : 'none'} className={liked ? 'text-[#008FCD]' : 'text-[#0C7AA9] transition-transform group-hover:scale-110'}/>
          {liked ? '💙 Oblíbený článek' : '💙 Mlžné srdce'}
        </button>
        <a href="#blog-comments" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#C8DDE8] bg-white px-4 py-2 text-sm font-semibold text-[#234E65] transition hover:border-[#6FC9EC]">
          <MessageCircle size={16} aria-hidden="true" /> Komentovat
        </a>
        <Link to="/poptavka" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#082D45] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#09638B]">
          <MapPinned size={16} aria-hidden="true" /> Navrhnout do prostoru
        </Link>
      </div>
      <div className="mt-3"><ShareButtons title={title} compact /></div>
      {!compact && <p className="mt-2 text-xs leading-5 text-[#668297]">Mlžné srdce se ukládá pouze v tomto prohlížeči. Nezobrazuje veřejný počet reakcí.</p>}
    </section>
  );
}
