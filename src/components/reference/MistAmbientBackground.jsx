import React from 'react';

const BLOBS = [
  { className: 'w-[420px] h-[420px] -top-32 -left-24 bg-sky-200/40', delay: '0s', duration: '16s' },
  { className: 'w-[360px] h-[360px] top-10 right-0 bg-slate-200/50', delay: '3s', duration: '20s' },
  { className: 'w-[300px] h-[300px] bottom-0 left-1/3 bg-cyan-100/40', delay: '6s', duration: '18s' },
];

export default function MistAmbientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {BLOBS.map((b, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-3xl animate-mist-drift ${b.className}`}
          style={{ animationDelay: b.delay, animationDuration: b.duration }}
        />
      ))}
    </div>
  );
}