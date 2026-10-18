import React from 'react';

const particles = [
  { x: 58, y: 27, delay: -2.2, duration: 7.8, size: 3 },
  { x: 73, y: 18, delay: -4.8, duration: 8.6, size: 2 },
  { x: 86, y: 37, delay: -1.5, duration: 6.9, size: 4 },
  { x: 64, y: 52, delay: -5.4, duration: 9.2, size: 2 },
  { x: 78, y: 68, delay: -3.1, duration: 7.1, size: 3 },
  { x: 92, y: 58, delay: -6.2, duration: 8.3, size: 2 },
  { x: 56, y: 75, delay: -.8, duration: 9.4, size: 3 },
  { x: 82, y: 84, delay: -4.1, duration: 7.6, size: 2 },
  { x: 69, y: 39, delay: -2.9, duration: 8.1, size: 2 },
  { x: 96, y: 23, delay: -5.8, duration: 7.3, size: 3 },
];

export default function HomeHeroMotion() {
  return (
    <div className="home-hero-motion" aria-hidden="true">
      <div className="home-hero-motion__glow" />
      <div className="home-hero-motion__ripple home-hero-motion__ripple--one" />
      <div className="home-hero-motion__ripple home-hero-motion__ripple--two" />
      <div className="home-hero-motion__ripple home-hero-motion__ripple--three" />
      <svg className="home-hero-motion__traces" viewBox="0 0 1440 820" preserveAspectRatio="xMidYMid slice">
        <path className="home-hero-motion__trace home-hero-motion__trace--one" d="M 830 -80 C 1110 65 875 198 1115 315 S 1450 505 1230 900" />
        <path className="home-hero-motion__trace home-hero-motion__trace--two" d="M 1070 -90 C 1325 115 1050 245 1265 375 S 1465 650 1390 900" />
        <path className="home-hero-motion__trace home-hero-motion__trace--three" d="M 710 80 C 945 140 835 345 1015 420 S 1260 625 1090 880" />
      </svg>
      {particles.map((particle, index) => (
        <i
          key={index}
          className="home-hero-motion__particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            '--particle-delay': `${particle.delay}s`,
            '--particle-duration': `${particle.duration}s`,
          }}
        />
      ))}
      <div className="home-hero-motion__edge-light" />
    </div>
  );
}
