import React from 'react';
import { Gauge, Ruler } from 'lucide-react';
import PdVariantsTable from '@/components/produkt/new/PdVariantsTable';
import PdSpecTable from '@/components/produkt/new/PdSpecTable';
import PdDocuments from '@/components/produkt/new/PdDocuments';

export default function PdSpecs({ product }) {
  const construction = [
    product.material && { label: 'Materiál', value: product.material },
    product.coverage_area && { label: 'Plocha pokrytí / dosah', value: product.coverage_area },
  ].filter(Boolean);
  const operation = [
    product.pressure && { label: 'Provozní tlak', value: product.pressure },
    product.water_consumption && { label: 'Spotřeba vody', value: product.water_consumption },
    product.micron_size && { label: 'Velikost kapek', value: product.micron_size },
    product.power_supply && { label: 'Napájení / řízení', value: product.power_supply },
  ].filter(Boolean);
  return (
    <section className="bg-background py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold text-primary">Technická specifikace</p>
          <h2 className="mt-3 font-heading text-3xl text-foreground sm:text-4xl">Parametry pro váš projekt</h2>
          <p className="mt-4 text-base text-muted-foreground">Konstrukce a provozní údaje produktu {product.name}. Rozměry a počty trysek jednotlivých provedení najdete ve variantách.</p>
        </div>
        {construction.length + operation.length > 0 ? (
          <div className="grid items-start gap-5 lg:grid-cols-2">
            <PdSpecTable title="Konstrukce a provedení" rows={construction} icon={Ruler} />
            <PdSpecTable title="Voda, mlžení a napájení" rows={operation} icon={Gauge} />
          </div>
        ) : <p className="rounded-lg border border-border bg-card p-6 text-muted-foreground">Technické parametry připravujeme. Konkrétní hodnoty potvrdíme při návrhu řešení.</p>}
        <PdVariantsTable variants={product.variants} productSlug={product.slug} />
        <PdDocuments urls={product.documents_urls} />
        <p className="mt-7 border-l-2 border-primary pl-4 text-sm text-muted-foreground">Kotvení, přívod vody, filtrace a případné řízení se upřesňují podle konkrétního místa a zvolené konfigurace. Chybějící údaje potvrdíme v technickém návrhu.</p>
      </div>
    </section>
  );
}