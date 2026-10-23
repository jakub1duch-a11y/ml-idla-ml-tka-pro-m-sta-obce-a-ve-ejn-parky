import React from 'react';
import aura from '@/components/produkt/details/auraDetailContent';
import spirala from '@/components/produkt/details/spiralaDetailContent';
import ostrev from '@/components/produkt/details/ostrevDetailContent';
import DetailPhotoSection from '@/components/produkt/details/DetailPhotoSection';
import DetailAutomationData from '@/components/produkt/details/DetailAutomationData';
import DetailNozzleData from '@/components/produkt/details/DetailNozzleData';

const SERIES = { 'aura-mlzitko': aura, 'mlzna-spirála': spirala, 'ostrev-city': ostrev };
export default function ProductDetailSections({ product }) {
  const sections = SERIES[product.slug];
  if (!sections) return null;
  return <div aria-label={`${product.name} zblízka: konstrukce, osazení a komfort`}>
    {sections.map(item => <DetailPhotoSection key={item.id} item={item}>
      {item.id === 'automaticke-rizeni' && <DetailAutomationData slug={product.slug} />}
      {item.id === 'osazeni' && <DetailNozzleData product={product} />}
    </DetailPhotoSection>)}
  </div>;
}