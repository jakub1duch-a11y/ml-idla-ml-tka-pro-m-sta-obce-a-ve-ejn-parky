import React from 'react';
import MrakTypeSelector from '@/components/produkt/new/MrakTypeSelector';
import PdLineProducts from '@/components/produkt/new/PdLineProducts';
import PdMrakSizeSelector from '@/components/produkt/new/PdMrakSizeSelector';

export default function PdProductSuggestions({ product }) {
  const isMrak = product.slug === 'mlzitko-mrak' || product.slug.startsWith('mlzny-mrak-');
  return (
    <div id={product.variants?.length ? undefined : 'varianty'} className="min-w-0 scroll-mt-36 border-t border-border bg-background">
      {product.slug === 'mlzitko-mrak' && <PdMrakSizeSelector />}
      {isMrak && <MrakTypeSelector slug={product.slug} />}
      <PdLineProducts product={product} />
    </div>
  );
}