import React from 'react';
import MrakTypeSelector from '@/components/produkt/new/MrakTypeSelector';
import PdVariantsTable from '@/components/produkt/new/PdVariantsTable';
import PdLineProducts from '@/components/produkt/new/PdLineProducts';
import PdMrakSizeSelector from '@/components/produkt/new/PdMrakSizeSelector';

export default function PdProductSuggestions({ product }) {
  const isMrak = product.slug === 'mlzitko-mrak' || product.slug.startsWith('mlzny-mrak-');
  return (
    <div id={product.variants?.length ? undefined : 'varianty'} className="min-w-0 scroll-mt-36 border-t border-border bg-background">
      {product.slug === 'mlzitko-mrak' && <PdMrakSizeSelector />}
      {product.variants?.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-7 lg:px-10">
          <PdVariantsTable variants={product.variants} productSlug={product.slug} fallbackImage={product.image_url} />
        </div>
      )}
      {isMrak && <MrakTypeSelector slug={product.slug} />}
      <PdLineProducts product={product} />
    </div>
  );
}