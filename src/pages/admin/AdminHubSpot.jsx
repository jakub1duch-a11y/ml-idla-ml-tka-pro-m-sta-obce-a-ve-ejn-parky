import React from 'react';
import { ExternalLink, ShieldCheck, RefreshCw, Users, Building2, Handshake, Sparkles } from 'lucide-react';

const modules = [
  { title: 'Kontakty', icon: Users, description: 'Kontakty HubSpot a vazby na poptávky.' },
  { title: 'Firmy a obce', icon: Building2, description: 'Organizace, jejich kontaktní osoby a projekty.' },
  { title: 'Obchodní případy', icon: Handshake, description: 'Pipeline, nabídky a stavy obchodů.' },
  { title: 'AI asistent / MCP', icon: Sparkles, description: 'Vyhledávání a analýza CRM po bezpečném propojení.' },
];

export default function AdminHubSpot() {
  return (
    <section className="max-w-6xl mx-auto p-4 md:p-8 text-white" aria-labelledby="hubspot-title">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan mb-2">Obchodní centrum / Integrace</p>
          <h1 id="hubspot-title" className="text-2xl md:text-3xl font-semibold">HubSpot CRM</h1>
          <p className="text-white/60 mt-2 max-w-2xl">Společné místo pro obchodní data MLŽIDLA.cz. Propojení s HubSpot API zatím není aktivováno.</p>
        </div>
        <a href="https://app.hubspot.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white/10">Otevřít HubSpot <ExternalLink size={15}/></a>
      </div>
      <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 mb-6" role="status">
        <div className="flex items-center gap-2 text-amber-200 font-medium"><ShieldCheck size={18}/> Připojení čeká na autorizaci</div>
        <p className="text-sm text-white/65 mt-2">Pro zobrazení skutečných údajů je nutné vybrat správný HubSpot účet a nastavit zabezpečené serverové připojení. Žádná data se nyní nepřenášejí ani nepřepisují.</p>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {modules.map(({title,icon:Icon,description}) => <div key={title} className="rounded-2xl border border-white/10 bg-white/[.035] p-5">
          <Icon className="text-cyan mb-4" size={22}/><h2 className="font-medium mb-2">{title}</h2><p className="text-sm text-white/50">{description}</p><p className="mt-5 text-xs text-white/40">Čeká na připojení API</p>
        </div>)}
      </div>
      <div className="rounded-2xl border border-white/10 p-5 md:p-6">
        <div className="flex items-center gap-2 mb-3"><RefreshCw size={18} className="text-cyan"/><h2 className="font-semibold">Synchronizace s Base44</h2></div>
        <p className="text-sm text-white/60 mb-4">Poptávky, nabídky a interní CRM zůstávají beze změny. Před aktivací zápisu se nastaví mapování polí, pravidla deduplikace a schválení synchronizace.</p>
        <div className="flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-white/10 px-3 py-1">Režim: nepřipojeno</span><span className="rounded-full bg-white/10 px-3 py-1">Zápis: vypnutý</span><span className="rounded-full bg-white/10 px-3 py-1">Přístup: pouze administrátor</span></div>
      </div>
    </section>
  );
}
