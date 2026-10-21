import React from 'react';
import CatalogProductCard from '@/components/kolekce/CatalogProductCard';

// Category pages intentionally share the same card shell as the main catalog.
// The image stage is therefore identical on every route and only the products vary.
export default function CategoryProductCard({ product }) {
  return <CatalogProductCard product={product} />;
}
