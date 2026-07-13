import React from 'react';

export default function ProductLeftPanel({ image, callouts }) {
  return (
    <div className="w-full h-[50vh] lg:h-screen lg:w-[42%] lg:sticky lg:top-0 relative overflow-hidden bg-brushed shrink-0">
      {image && <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

      {/* vertical ruler line */}
      <div className="hidden lg:block absolute right-8 top-10 bottom-10 w-px bg-black/30">
        <div className="absolute -top-0 -left-2 w-4 h-px bg-black/30" />
        <div className="absolute -bottom-0 -left-2 w-4 h-px bg-black/30" />
      </div>

      {/* callouts */}
      {callouts.map((c, i) => (
        <div key={i} style={{ top: c.top }} className="hidden lg:flex absolute left-0 right-0 items-center gap-3 px-6">
          <div className="flex-1 h-px bg-black/40" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-black/80 bg-white/70 px-2 py-1 whitespace-nowrap">
            [{c.label}]
          </span>
        </div>
      ))}
    </div>
  );
}