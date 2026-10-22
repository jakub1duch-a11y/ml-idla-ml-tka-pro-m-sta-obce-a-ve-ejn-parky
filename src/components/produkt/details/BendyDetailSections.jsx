import React from 'react';
import { BENDY_DETAIL_SECTIONS } from '@/components/produkt/details/bendyDetailContent';
import DetailPhotoSection from '@/components/produkt/details/DetailPhotoSection';
import BendyAutomationData from '@/components/produkt/details/BendyAutomationData';
import BendyNozzleStory from '@/components/produkt/details/BendyNozzleStory';

export default function BendyDetailSections({ product }) {
  if (product.slug !== 'mlzitko-bendy') return null;
  return <div aria-label="BENDY zblízka: konstrukce, osazení a komfort">
    {BENDY_DETAIL_SECTIONS.slice(0, 4).map(item => <DetailPhotoSection key={item.id} item={item}>{item.automation && <BendyAutomationData />}</DetailPhotoSection>)}
    <BendyNozzleStory />
    {BENDY_DETAIL_SECTIONS.slice(4).map(item => <DetailPhotoSection key={item.id} item={item} />)}
  </div>;
}