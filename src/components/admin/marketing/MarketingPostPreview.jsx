import React from 'react';
import { Instagram, Facebook, Search, FileText, ExternalLink, Play, MoreHorizontal } from 'lucide-react';

const META = {
  instagram: { label: 'Instagram', icon: Instagram, accent: 'text-fuchsia-300', aspect: 'aspect-square' },
  facebook: { label: 'Facebook', icon: Facebook, accent: 'text-blue-300', aspect: 'aspect-[1.91/1]' },
  google_ads: { label: 'Google Ads', icon: Search, accent: 'text-emerald-300', aspect: 'aspect-[1.91/1]' },
  blog: { label: 'Web / článek', icon: FileText, accent: 'text-cyan', aspect: 'aspect-[16/9]' },
};

const clean = (value='') => String(value).replace(/[*#_`]/g,'').trim();

export default function MarketingPostPreview({ post, compact = false }) {
  const meta = META[post.platform] || META.blog;
  const Icon = meta.icon;
  const caption = clean(post.caption_instagram || post.caption_facebook || post.caption || post.blog_content || 'Připravený obsah čeká na doplnění textu.');
  const media = post.video_url || post.image_url || post.gallery_urls?.[0];
  const isVideo = !!post.video_url;

  if (post.platform === 'google_ads') {
    return <div className="overflow-hidden rounded-2xl border border-white/10 bg-white text-slate-900 shadow-xl">
      {media && <div className={`${meta.aspect} bg-slate-100 overflow-hidden`}>{isVideo ? <video src={media} muted playsInline className="h-full w-full object-cover"/> : <img src={media} alt="" className="h-full w-full object-cover"/>}</div>}
      <div className="p-4">
        <div className="flex items-center gap-2 text-[11px] text-slate-500"><strong className="text-slate-700">Sponzorováno</strong><span>·</span><span>mlzidla.cz</span></div>
        <p className="mt-2 text-[17px] font-semibold leading-6 text-[#1a0dab]">{post.title}</p>
        <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-slate-600">{caption}</p>
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3"><span className="text-xs text-slate-500">{post.cta_url || 'mlzidla.cz/poptavka'}</span><span className="rounded-full bg-[#1a73e8] px-4 py-2 text-xs font-semibold text-white">{post.cta_label || 'Zjistit více'}</span></div>
      </div>
    </div>;
  }

  if (post.platform === 'blog') {
    return <article className="overflow-hidden rounded-2xl border border-white/10 bg-white text-slate-900 shadow-xl">
      {media && <div className={`${meta.aspect} overflow-hidden bg-slate-100`}>{isVideo ? <video src={media} muted playsInline className="h-full w-full object-cover"/> : <img src={media} alt="" className="h-full w-full object-cover"/>}</div>}
      <div className="p-5"><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-cyan-700">MLŽIDLA® · inspirace</p><h3 className="mt-2 text-xl font-semibold leading-tight">{post.title}</h3><p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">{caption}</p><div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-800">Číst článek <ExternalLink size={12}/></div></div>
    </article>;
  }

  return <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1117] shadow-xl">
    <div className="flex items-center justify-between px-4 py-3"><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan/20 bg-cyan/10"><span className="text-[10px] font-black text-cyan">MLŽ</span></div><div><p className="text-xs font-semibold text-white">mlzidla</p><p className="text-[10px] text-white/35">MLŽIDLA® / HolmTec</p></div></div><MoreHorizontal size={16} className="text-white/30"/></div>
    <div className={`${meta.aspect} relative overflow-hidden bg-white/5`}>
      {media ? (isVideo ? <><video src={media} muted playsInline className="h-full w-full object-cover"/><div className="absolute inset-0 flex items-center justify-center"><div className="rounded-full bg-black/45 p-3 text-white"><Play size={18} fill="currentColor"/></div></div></> : <img src={media} alt="" className="h-full w-full object-cover"/>) : <div className="flex h-full items-center justify-center bg-gradient-to-br from-white/5 to-cyan/5"><Icon size={28} className={meta.accent}/></div>}
    </div>
    <div className="p-4"><div className="flex items-center gap-3 text-white/70"><Icon size={17} className={meta.accent}/><span className="text-[11px] font-mono uppercase tracking-wider">{meta.label}</span></div><p className={`mt-3 text-sm leading-5 text-white/75 ${compact ? 'line-clamp-3' : 'line-clamp-5'}`}>{caption}</p>{post.hashtags?.length ? <p className="mt-2 line-clamp-2 text-xs text-cyan/70">{post.hashtags.slice(0,7).map(x=>`#${x}`).join(' ')}</p> : null}</div>
  </div>;
}