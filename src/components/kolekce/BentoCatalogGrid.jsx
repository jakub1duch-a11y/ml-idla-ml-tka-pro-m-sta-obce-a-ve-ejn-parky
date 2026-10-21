import React from 'react';
import BentoProductCard from '@/components/kolekce/BentoProductCard';
import './bento.css';

// Opakující se asymetrický rytmus: velká · standardní ×2 · široká · vysoká · standardní ×2 ...
// Pořadí produktů se nemění, mění se jen velikost dlaždice.
const PATTERN = ['lg', 'std', 'std', 'wide', 'tall', 'std', 'std', 'std'];

export const sizeAt = (index, total) => {
  if (total <= 2) return 'std';
  return PATTERN[index % PATTERN.length];
};

export default function BentoCatalogGrid({ products = [], onProductClick, children }) {
  return (
    <div className="bento-grid">
      {products.map((product, index) => (
        <BentoProductCard key={product.id || product.slug} product={product} size={sizeAt(index, products.length)} onProductClick={onProductClick} />
      ))}
      {children}
    </div>
  );
}