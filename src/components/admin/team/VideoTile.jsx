import React, { useEffect, useRef } from 'react';

export default function VideoTile({ stream, label, muted = false, mirrored = false }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream || null;
  }, [stream]);
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
      <video ref={ref} autoPlay playsInline muted={muted} className={`h-full w-full object-cover ${mirrored ? 'scale-x-[-1]' : ''}`} />
      <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white/80">{label}</span>
    </div>
  );
}