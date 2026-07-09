import React from 'react';
import HeroBlock from './HeroBlock';
import TextBlock from './TextBlock';
import ImageGridBlock from './ImageGridBlock';
import CtaBlock from './CtaBlock';

const MAP = {
  hero: HeroBlock,
  text: TextBlock,
  image_grid: ImageGridBlock,
  cta: CtaBlock,
};

export default function BlockRenderer({ block }) {
  const Comp = MAP[block?.type];
  if (!Comp) return null;
  return <Comp data={block.data} />;
}