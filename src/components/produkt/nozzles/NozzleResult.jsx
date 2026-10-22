import React from 'react';
import { Link } from 'react-router-dom';
import { calculateWaterCost, formatNumber } from '@/components/produkt/nozzles/nozzleData';

export default function NozzleResult({ product, model, count, flow, tariff, type, pressure, direction }) {
  const validCount = Number(count) <= 24;
  const result = validCount ? calculateWaterCost(count, flow, tariff) : null;
  const message = `Mám zájem o ${product.name}${model ? `, ${model.name}` : ''}${direction ? `, mlžení ${direction.name.toLowerCase()}` : ''}. Návrhové osazení ${count}× ${type}, tlak ${pressure} bar. Prosím o potvrzení proveditelnosti a nabídku.`;
  const params = new URLSearchParams({ produkt: product.slug, zprava: message });
  if (product.slug === 'mlzitko-mrak' && model) params.set('varianta', model.id);
  return <div className="mt-6 border border-border bg-muted p-5 sm:p-6">
    <p className="text-sm font-semibold">Voda za 8 hodin nepřetržitého mlžení</p>
    <div aria-live="polite" className="mt-3">
      {result ? <><p className="font-heading text-4xl font-bold text-primary">{formatNumber(result.cost)} Kč</p><p className="mt-2 text-lg">{formatNumber(result.liters)} litrů · {formatNumber(Number(count) * flow)} l/h</p></> : <p>Zadejte celý počet 1–24 trysek a nezápornou cenu vody.</p>}
    </div>
    <p className="mt-3 text-xs text-muted-foreground">Výpočet: {count || 'počet'} × {formatNumber(flow)} l/h × 8 h ÷ 1 000 × {tariff || 'cena vody'} Kč/m³. Pouze voda, bez elektřiny, údržby a pořízení. Přerušovaný provoz má kratší skutečnou dobu mlžení.</p>
    <p className="mt-3 text-xs text-muted-foreground">Výchozí sazba 126,52 Kč/m³ zahrnuje vodné a stočné. Zdroj ji označuje Trutnov 2024; nejde o aktuální celostátní tarif. Upravte ji podle své faktury.</p>
    {result && <Link to={`/poptavka?${params}`} className="nozzle-cta mt-5 w-full sm:w-auto">Poptat toto osazení</Link>}
  </div>;
}