import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import { MRAK_MODELS, MRAK_DETAILS } from '@/components/produkt/nozzles/nozzleData';
import MrakVariantSpecs from '@/components/produkt/mrak/MrakVariantSpecs';
import MrakOtherVariants from '@/components/produkt/mrak/MrakOtherVariants';

export default function MrakVariantDetail() {
  const { variantId } = useParams();
  const model = MRAK_MODELS.find((m) => m.id === variantId);

  useEffect(() => {
    if (!model) return;
    setSEO({
      title: `${model.name} · mlžítko MRAK | MLŽIDLA.cz`,
      description: `${model.name}: ${model.description} ${model.dimensions}, ${model.count} trysek.`,
      image: model.image,
      canonicalPath: `/produkt/mlzitko-mrak/varianta/${model.id}`,
    });
  }, [model]);

  if (!model) return (
    <div className="flex min-h-screen items-center justify-center pt-28 text-center">
      <div><p className="text-muted-foreground">Varianta nenalezena.</p><Link to="/produkt/mlzitko-mrak" className="mt-4 inline-block underline">Zpět na MRAK</Link></div>
    </div>
  );

  const visuals = [...(model.scene ? [{ image: model.scene, label: 'Návrh v prostoru' }] : []), ...MRAK_DETAILS];

  return (
    <div className="bg-background pt-24">
      <section className="px-5 py-10 sm:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <img src={model.image} alt={`${model.name} · produktový náhled`} className="aspect-square w-full border border-border bg-card object-contain" />
          <div>
            <Link to="/produkt/mlzitko-mrak" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft size={14} /> Mlžítko MRAK</Link>
            <p className="mt-6 font-mono text-xs text-muted-foreground">{model.concept ? 'DESIGNOVÝ NÁVRH' : 'KATALOGOVÁ VARIANTA'}</p>
            <h1 className="mt-3 font-heading">{model.name}</h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">{model.description}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="border border-border px-3 py-2">{model.dimensions}</span>
              <span className="border border-border px-3 py-2">{model.count} trysek</span>
            </div>
            <Link to={`/poptavka?produkt=mlzitko-mrak&varianta=${model.id}`} className="mt-8 inline-flex items-center gap-2 bg-primary px-6 py-3 font-heading text-sm font-semibold text-primary-foreground hover:bg-secondary">
              Poptat tuto variantu <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <MrakVariantSpecs model={model} />
      <section className="px-5 py-14 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-heading">Vizualizace a detaily</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {visuals.map((v) => (
              <figure key={v.image} className="border border-border bg-card">
                <img src={v.image} alt={`${model.name} · ${v.label}`} loading="lazy" className="aspect-[3/2] w-full object-cover" />
                <figcaption className="p-4 text-sm">{v.label} · AI vizualizace</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Vizualizace nejsou výrobní výkresy. Rozměry a kotvení potvrdí technický návrh.</p>
        </div>
      </section>
      <MrakOtherVariants currentId={model.id} />
    </div>
  );
}