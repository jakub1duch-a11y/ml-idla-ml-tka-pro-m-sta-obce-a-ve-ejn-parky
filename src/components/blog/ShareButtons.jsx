import React, { useState } from 'react';
import { Share2, Link2, Check, Mail } from 'lucide-react';

export default function ShareButtons({ title, compact = false }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const handleNativeShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch {}
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    if (!navigator.clipboard?.writeText) { window.prompt('Zkopírujte odkaz na článek:', url); return; }
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => window.prompt('Zkopírujte odkaz:', url));
  };

  const emailSubject = encodeURIComponent(`Doporučuji článek: ${title}`);
  const emailBody = encodeURIComponent(`Tohle by tě mohlo zajímat:\n\n${title}\n${url}`);
  const links = [
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(title + ' — ' + url)}` },
  ];

  return (
    <div className={`flex flex-wrap items-center gap-2 ${compact ? 'py-2' : 'py-6'}`}>
      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 tracking-widest uppercase mr-1">
        <Share2 size={13} /> Sdílet
      </span>
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
          className="px-4 py-2 rounded-full border border-slate-200 text-xs text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all">
          {l.label}
        </a>
      ))}
      <a href={`mailto:?subject=${emailSubject}&body=${emailBody}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#C8DDE8] bg-white px-4 py-2 text-xs font-semibold text-[#294E65] transition hover:border-[#53B8E0]"><Mail size={13} aria-hidden="true" /> Doporučit známému</a>
      <button onClick={handleNativeShare} type="button"
        className="px-4 py-2 rounded-full border border-slate-200 text-xs text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all inline-flex items-center gap-1.5">
        {copied ? <><Check size={12} /> Zkopírováno</> : <><Link2 size={12} /> Sdílet / kopírovat</>}
      </button>
    </div>
  );
}