import React from 'react';

export default function ScrollDropLink({ href, label, variant = 'drop' }) {
  return (
    <a href={href} className={`mlz-scroll-wrapper mlz-scroll-${variant}`}>
      <span className="mlz-water-line"><span className="mlz-water-drop" /></span>
      <span className="mlz-scroll-text">{label}</span>
    </a>
  );
}