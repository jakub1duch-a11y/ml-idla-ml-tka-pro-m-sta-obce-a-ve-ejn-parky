import React from 'react';
import { MapPin, Sparkles, ShieldCheck } from 'lucide-react';

const PROOF = [
{ icon: Sparkles, title: 'Návrh mlžné zóny', text: 'Produkt, rozmístění a provozní scénář navrhujeme podle konkrétního prostoru.' },
{ icon: ShieldCheck, title: 'Nerez pro veřejný prostor', text: 'Čistá konstrukce, skryté kotvení a odolné provedení pro města, parky i sportoviště.' },
{ icon: MapPin, title: 'Od vizualizace k poptávce', text: 'Pomůžeme připravit vizualizaci, technické zadání a jasné podklady pro další krok.' }];


export default function V3EditorialBridge() {
  return (
    <section className="relative overflow-hidden bg-[hsl(var(--background))] text-[hsl(var(--card-foreground))]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-cyan-400/10 blur-[110px]" />
        <div className="absolute right-[-8rem] top-[-4rem] h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />
      </div>

      





























      
    </section>);

}