import React from 'react';

const DOTS = [
  { left: '18%', top: '22%', delay: '0s', size: 4 },
  { left: '9%', top: '58%', delay: '1.4s', size: 3 },
  { left: '41%', top: '14%', delay: '2.6s', size: 5 },
  { left: '57%', top: '72%', delay: '0.8s', size: 3 },
  { left: '76%', top: '34%', delay: '3.4s', size: 4 },
  { left: '88%', top: '66%', delay: '2s', size: 3 },
  { left: '30%', top: '84%', delay: '4.2s', size: 4 },
];

export default function HeroMistDots() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
      {DOTS.map((d, i) => (
        <span
          key={i}
          className="hero-mist-dot"
          style={{ left: d.left, top: d.top, width: d.size, height: d.size, animationDelay: d.delay }}
        />
      ))}
    </div>
  );
}