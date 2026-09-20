import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Layers3, MousePointer2, Smartphone, Workflow } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import SmartUseCasesExperience from '@/components/home/new/SmartUseCasesExperience';
import Logo from '@/components/layout/Logo';

const MODULES = [
  {
    icon: Layers3,
    title: 'Prezentační vrstvy',
    text: 'Fotografie skutečného produktu, jemná mlha, datové body, benefit a CTA se skládají do jedné srozumitelné scény.',
  },
  {
    icon: MousePointer2,
    title: 'Interaktivní sekce',
    text: 'Přepínání použití, provozních scénářů a technických vrstev bez dlouhého hledání v textu.',
  },
  {
    icon: Workflow,
    title: 'Product flow',
    text: 'Teplota → čas → smart řízení → mlžení → přehled provozu. Jednoduchá animace vysvětluje systém během několika sekund.',
  },
  {
    icon: Smartphone,
    title: 'Mobilní prezentace',
    text: 'Stejný obsah je čitelný na telefonu, tabletu i desktopu. Animace respektují výkon zařízení a reduced-motion.',
  },
];

const OFFER_BLOCKS = [
  ['Města a obce', 'Náměstí, parky, promenády, školy a veřejné budovy.'],
  ['Obchodní centra a retail', 'Pěší zóny, gastro terasy, vstupy a odpočinkové body.'],
  ['Rezidenční architektura', 'Zahrady, terasy, pergoly a okolí bazénu.'],
  ['Mlhoviště a pobytové zóny', 'Sezení, stín a mlha jako lehčí alternativa další vodní ploše.'],
];

export default function ChytreReseniProProstor() {
  useEffect(() => {
    setSEO({
      title: 'Chytré mlžení pro města, retail a zahrady | MLŽIDLA®',
      description: 'Interaktivní přehled chytrých mlžných řešení pro města, obce, obchodní zóny, zahrady, bazény a pobytová mlhoviště.',
      keywords: 'chytré mlžení, mlžítka pro města, mlžítka obchodní centrum, zahradní mlžítka, smart řízení mlžení, mlhoviště',
      canonicalPath: '/chytre-reseni-pro-prostor',
      robots: 'index, follow',
    });
  }, []);

  return (
    <main className="bg-[#F5FAFD] text-[#071A2F]">
      <section className="relative overflow-hidden bg-[#071A2F] px-5 pb-16 pt-28 text-white sm:px-8 lg:px-12 lg:pb-24 lg:pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(0,183,255,.2),transparent_34%),radial-gradient(circle_at_25%_82%,rgba(125,211,252,.12),transparent_30%)]" />
        <div className="relative z-10 mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1fr_.72fr] lg:items-end">
          <div>
            <div className="inline-flex border border-white/10 bg-white/[.04] p-4"><Logo size="lg" variant="full" /></div>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[.24em] text-[#00B7FF]">prezentační a interaktivní systém</p>
            <h1 className="mt-5 max-w-[12ch] font-heading text-5xl font-bold leading-[.98] tracking-[-.05em] sm:text-6xl lg:text-7xl">Chytré mlžení jako součást architektury prostoru.</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">Stránka propojuje reálné produktové fotografie, vrstvenou animaci, smart řízení a konkrétní scénáře použití. Návštěvník rychle pochopí, co systém dělá, kde funguje a jak se ovládá.</p>
          </div>
          <div className="border border-white/10 bg-white/[.045] p-6 backdrop-blur-xl sm:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#7DD3FC]">Co uživatel pochopí</p>
            <div className="mt-5 space-y-4">
              {['Kde má mlžení největší smysl', 'Jak funguje automatické řízení', 'Jaké jsou provozní vrstvy systému', 'Jak může řešení vypadat v jeho prostoru'].map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-6 text-white/72"><CheckCircle2 size={17} className="mt-1 shrink-0 text-[#00B7FF]"/><span>{item}</span></div>
              ))}
            </div>
            <Link to="/poptavka" className="btn-brand-primary-dark mt-7 justify-center">Připravit návrh řešení <ArrowRight size={16}/></Link>
          </div>
        </div>
      </section>

      <SmartUseCasesExperience />

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.22em] text-[#0878E8]">Vizuální systém stránky</p>
            <h2 className="mt-4 max-w-[11ch] font-heading text-4xl font-bold leading-tight tracking-[-.04em] sm:text-5xl">Méně textu. Více pochopení v pohybu.</h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">Animace nejsou dekorace. Každá vrstva vysvětluje funkci produktu, provoz nebo přínos řešení.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {MODULES.map(({ icon: Icon, title, text }) => (
              <article key={title} className="border border-[#D6EAF3] bg-white p-6 shadow-[0_12px_45px_rgba(7,26,47,.05)]">
                <span className="flex h-11 w-11 items-center justify-center bg-[#EAF6FC] text-[#0878E8]"><Icon size={20}/></span>
                <h3 className="mt-5 font-heading text-xl font-bold tracking-[-.02em]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#D6EAF3] bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.22em] text-[#0878E8]">Nabídkové scénáře</p>
              <h2 className="mt-4 font-heading text-4xl font-bold tracking-[-.04em] sm:text-5xl">Jedna technologie. Čtyři typy prostoru.</h2>
            </div>
            <Link to="/mlzidla-mlzitka" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0878E8]">Prohlédnout produkty <ArrowRight size={15}/></Link>
          </div>

          <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {OFFER_BLOCKS.map(([title, text], index) => (
              <article key={title} className="group border border-[#D6EAF3] bg-[#F5FAFD] p-6 transition-all hover:-translate-y-1 hover:border-[#00B7FF]/50 hover:bg-white hover:shadow-[0_18px_55px_rgba(8,120,232,.08)]">
                <p className="font-mono text-[10px] tracking-[.2em] text-[#00B7FF]">0{index + 1}</p>
                <h3 className="mt-5 font-heading text-2xl font-bold tracking-[-.03em]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#071A2F] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-brand-script text-4xl text-[#16BFFF]">Architektura, která dýchá.</p>
            <h2 className="mt-5 max-w-[13ch] font-heading text-4xl font-bold tracking-[-.04em] sm:text-5xl">Připravíme variantu pro konkrétní prostor.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/62">Z fotografie, plánku nebo zadání připravíme vhodný produkt, rozmístění, smart scénář a vizuální náhled.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/ai-vizualizace" className="btn-brand-outline-dark justify-center">Vizualizovat prostor</Link>
            <Link to="/poptavka" className="btn-brand-primary-dark justify-center">Nezávazná poptávka <ArrowRight size={16}/></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
