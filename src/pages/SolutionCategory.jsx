import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Building2, Cable, Landmark, TentTree } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import SolutionInquiryForm from '@/components/solutions/SolutionInquiryForm';

const solutions = {
  designova: { icon: Landmark, eyebrow: 'Designové řešení', title: 'Designová architektonická mlžítka', lead: 'Přírodní motivy, které ochlazují prostor a stávají se jeho jasným orientačním bodem.', details: ['Mlžné stromy pro parky a náměstí', 'Stébla a monolity pro současnou architekturu', 'Materiály a povrchové provedení na míru projektu'] },
  brany: { icon: Building2, eyebrow: 'Vstupní prvek', title: 'Vstupní a uvítací mlžné brány', lead: 'Konstrukce, které definují vstup do areálu a okamžitě zlepšují tepelný komfort návštěvníků.', details: ['Koupaliště, festivaly a městská náměstí', 'Nerezová konstrukce pro veřejný provoz', 'Návrh rozměru, tryskání i kotvení na míru'] },
  'chytre-moduly': { icon: Cable, eyebrow: 'Řízení a příslušenství', title: 'Chytré moduly a příslušenství', lead: 'Řízení mlžení podle teploty, času a reálné návštěvnosti prostoru.', details: ['SMART APP a programovatelné ventily', 'Senzory teploty a vlhkosti', 'Filtrace, ventily a nerezové příslušenství'], models: ['Aura', 'Bendy', 'Lízátko', 'Spirála', 'TeePee'] },
  'mobilni-eventove': { icon: TentTree, eyebrow: 'Sezónní provoz', title: 'Mobilní eventová mlžítka', lead: 'Lehčí konstrukce určené pro krátkodobé letní akce a snadné uskladnění po sezóně.', details: ['Maratony, koncerty a festivaly', 'Rychlé napojení na standardní vodovodní řád', 'Demontáž bez poškození plochy'] },
};

export default function SolutionCategory() {
  const { solution } = useParams();
  const item = solutions[solution] || solutions.designova;
  const Icon = item.icon;
  useEffect(() => { setSEO({ title: `${item.title} | Mlžidla.cz`, description: item.lead, canonicalPath: `/reseni/${solution}` }); }, [item, solution]);
  return <main className="min-h-screen bg-white"><section className="bg-slate-950 px-6 pb-20 pt-32 text-white lg:pb-28 lg:pt-40"><div className="site-container max-w-5xl"><Icon size={28} className="text-[#0070F3]" /><p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-[#0070F3]">{item.eyebrow}</p><h1 className="mt-4 max-w-4xl">{item.title}</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">{item.lead}</p></div></section><section className="site-container grid gap-10 py-16 lg:grid-cols-[1.1fr_.9fr] lg:py-24"><div><h2 className="m-0 text-slate-950">Řešení pro konkrétní prostor.</h2><ul className="mt-7 space-y-4 pl-0 text-slate-700">{item.details.map((detail) => <li key={detail} className="list-none border-l-2 border-[#0070F3] pl-4">{detail}</li>)}</ul>{item.models && <div className="mt-12"><h2 className="m-0 text-slate-950">Doporučené modely mlžítek.</h2><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">{item.models.map((model) => <Link to={`/poptavka?produkt=${encodeURIComponent(model)}`} key={model} className="border border-slate-200 p-4 text-sm font-semibold text-slate-900 transition hover:border-[#0070F3] hover:text-[#0070F3]">{model}<ArrowRight className="mt-3" size={16} /></Link>)}</div></div>}</div><aside className="bg-slate-50 p-6 lg:p-8"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#0070F3]">Nezávazná poptávka</p><h2 className="mt-3 text-2xl text-slate-950">Připravíme návrh řešení.</h2><p className="mt-3 text-sm leading-relaxed text-slate-600">Popište nám prostor, požadovaný provoz a termín instalace.</p><div className="mt-6"><SolutionInquiryForm product={item.title} /></div></aside></section></main>;
}