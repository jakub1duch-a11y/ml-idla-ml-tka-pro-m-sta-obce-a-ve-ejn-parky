import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MRAK_MODELS, MRAK_DETAILS, calculateWaterCost, formatNumber, WATER_TARIFF } from '@/components/produkt/nozzles/nozzleData';
import '@/components/produkt/nozzles/nozzleConfigurator.css';

export default function MrakVariantGallery() {
  const [params, setParams] = useSearchParams();
  const selected = MRAK_MODELS.find(m => m.id === params.get('variant')) || MRAK_MODELS[0];
  const choose = (id) => { const next = new URLSearchParams(params); next.set('variant', id); setParams(next, { replace: true, preventScrollReset: true }); };
  const details = [...(selected.scene ? [{ image: selected.scene, label: 'Návrh v prostoru' }] : []), ...MRAK_DETAILS];
  return <section id="mrak-varianty-vizualizace" className="bg-card px-5 py-14 sm:px-10">
    <div className="mx-auto max-w-7xl">
      <p className="font-mono text-xs text-muted-foreground">MRAK · VÝBĚR PROVEDENÍ</p>
      <h2 className="mt-3 font-heading">Dvě katalogové velikosti. Dva další návrhy.</h2>
      <p className="mt-4 max-w-3xl text-muted-foreground">Zvolte tvar pro svůj prostor. Výběr se přenese do kalkulace níže i do poptávky; náhledy nejsou výrobní výkresy.</p>
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{MRAK_MODELS.map(m => <Link key={m.id} to={`/produkt/mlzitko-mrak/varianta/${m.id}`} onMouseEnter={() => choose(m.id)} className="nozzle-selection block overflow-hidden text-left">
        <img src={m.image} alt={`${m.name} · ilustrační produktový náhled`} width="1024" height="1024" loading="lazy" className="aspect-square w-full object-contain" />
        <div className="p-4"><p className="text-xs text-muted-foreground">{selected.id === m.id ? 'Vybráno · ' : ''}{m.concept ? 'Designový návrh' : 'Katalogová varianta'}</p><h3 className="mt-2 font-heading text-xl">{m.name}</h3><p className="mt-2 text-sm">{m.dimensions}</p><p className="mt-2 text-sm font-semibold">{m.count} trysek · {formatNumber(calculateWaterCost(m.count, 6.4, WATER_TARIFF).cost)} Kč / 8 h*</p><p className="mt-3 text-sm text-muted-foreground">{m.description}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Otevřít produkt <ArrowRight size={14} /></span></div>
      </Link>)}</div>
      <p className="mt-4 text-xs text-muted-foreground">* Pouze voda, M2 při 2 bar, nepřetržitých 8 hodin. Historická sazba Trutnov 2024: 126,52 Kč/m³. V kalkulaci níže ji lze upravit. U MRAK 2424 je mezi textem a číselným sloupcem zdroje rozpor 8/9 trysek.</p>
      <div className="mt-6 border border-border bg-muted p-5"><h3 className="font-heading text-xl">{selected.name}</h3><p className="mt-2 text-sm">{selected.note}</p><Link to={`/produkt/mlzitko-mrak/varianta/${selected.id}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Detail varianty <ArrowRight size={14} /></Link></div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2">{details.map(d => <Dialog key={d.image}><DialogTrigger asChild><button type="button" className="border border-border bg-background text-left" aria-label={`Zvětšit: ${d.label}`}><img src={d.image} alt={`MRAK · ${d.label} · AI vizualizace`} loading="lazy" width="1536" height="1024" className="aspect-[3/2] w-full object-cover" /><span className="block p-4 text-sm">{d.label} · AI vizualizace</span></button></DialogTrigger><DialogContent className="max-w-4xl"><DialogTitle>{d.label}</DialogTitle><img src={d.image} alt={d.label} className="max-h-[75vh] w-full object-contain" /></DialogContent></Dialog>)}</div>
      <p className="mt-3 text-xs text-muted-foreground">Detailové vizualizace ilustrují materiál, mlhu a princip patky řady MRAK, nikoli přesnou konstrukci každé varianty. Rozměry, typ kotvy a bezpečnost instalace musí potvrdit technický návrh.</p>
    </div>
  </section>;
}