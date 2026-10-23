import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { setSEO } from '@/lib/seo';
import { MRAK_MODELS } from '@/components/produkt/nozzles/nozzleData';
import { MRAK_VARIANT_CONTENT } from '@/components/produkt/mrak/mrakVariantContent';
import MrakVariantHero from '@/components/produkt/mrak/MrakVariantHero';
import MrakVariantBento from '@/components/produkt/mrak/MrakVariantBento';
import MrakVariantSpecs from '@/components/produkt/mrak/MrakVariantSpecs';
import MrakOtherVariants from '@/components/produkt/mrak/MrakOtherVariants';

export default function MrakVariantDetail() {
  const { variantId } = useParams();
  const model = MRAK_MODELS.find((m) => m.id === variantId);
  const content = MRAK_VARIANT_CONTENT[variantId];

  useEffect(() => {
    if (!model) return;
    setSEO({
      title: `${model.name} · mlžítko MRAK | MLŽIDLA.cz`,
      description: `${model.name}: ${content.tagline}. ${model.dimensions}, ${model.count} trysek.`,
      image: model.image,
      canonicalPath: `/produkt/mlzitko-mrak/varianta/${model.id}`,
    });
    window.scrollTo(0, 0);
  }, [model, content]);

  if (!model || !content) return (
    <div className="flex min-h-screen items-center justify-center pt-28 text-center">
      <div><p className="text-muted-foreground">Varianta nenalezena.</p><Link to="/produkt/mlzitko-mrak" className="mt-4 inline-block underline">Zpět na MRAK</Link></div>
    </div>
  );

  return (
    <div className="bg-background">
      <MrakVariantHero model={model} content={content} />
      <MrakVariantBento model={model} content={content} />
      <div id="parametry"><MrakVariantSpecs model={model} /></div>
      <MrakOtherVariants currentId={model.id} />
    </div>
  );
}