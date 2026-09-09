import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Gauge, Hammer, Ruler, MapPin, Mail, Phone } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const IMAGES = {
  workshop: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ee5759df9_foto-instalace-vyroba.png',
  detail: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/87830d99f_detail.PNG',
  logo: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/881a6dd25_aplikaceloganaproduktu.PNG',
  fair: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/47ca0affa_veletrh.PNG',
  brand: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/046393468_brandmarch.PNG',
  laser: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/55ad64b81_laserstitky.PNG',
};

const KNOW_HOW = [
  { icon: Gauge, title: 'Bez vysokotlakého čerpadla', text: 'Nízkotlaký provoz využívá běžný tlak vodovodního řadu 2–8 bar bez samostatné vysokotlaké technologie.' },
  { icon: Droplets, title: 'Evaporace, ne déšť', text: 'Jemná mlha se za slunečného počasí odpaří dříve, než dopadne na zem.' },
  { icon: Hammer, title: 'Precizní nerez', text: 'Každá konstrukce je svařovaná v naší dílně, nikoli montovaná z katalogových dílů.' },
  { icon: Ruler, title: 'Výroba na míru', text: 'Rozměr, tvar, kotvení i design přizpůsobíme vašemu prostoru.' },
];

const COMPANY = {
  name: 'HolmTec s.r.o.',
  address: 'Horní Staré Město 698, 541 02 Trutnov',
  ico: '27486893',
  dic: 'CZ27486893',
  email: 'obchod1@holmtec.cz',
  phone: '+420 774 700 390',
};

export default function ONas() {
  useEffect(() => {
    setSEO({
      title: 'O nás — HolmTec s.r.o. | MLŽIDLA.cz',
      description: 'Česká výroba nerezových mlžících soch v Trutnově. Ohýbání trubek, TIG svařování a saténový brus — od návrhu po realizaci.',
      robots: 'index, follow',
    });
  }, []);

  return (
    <main className="min-h-screen bg-white pt-20 text-[#0D2F4F]">
      {/* Hero */}
      <section className="relative min-h-[600px] overflow-hidden bg-[#0D2F4F]">
        <img src="/media/optimized/518c8c2a3_mlzitka-pro-mesta.webp" alt="Mlžítko v provozu ve veřejném prostoru" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D2F4F] via-[#0D2F4F]/90 to-[#0D2F4F]/30" />
        <div className="relative mx-auto flex min-h-[600px] max-w-7xl items-end px-6 pb-20 lg:px-10 lg:pb-24">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#7FC4E8]">O značce MLŽIDLA</p>
            <h1 className="mt-5 font-heading text-5xl text-white lg:text-7xl">
              Průmyslová přesnost.<br /><span className="text-[#7FC4E8]">Osvěžení na míru.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/72">
              Přinášíme 20 let zkušeností s nerezí do městských prostranství, veřejných budov a veřejného prostoru. Každý systém navrhneme, vyrobíme, nainstalujeme a dlouhodobě servisujeme.
            </p>
            <Link to="/poptavka" className="mt-9 inline-flex items-center gap-2 bg-[#0B5EA8] px-7 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#094d8a]">
              Popsat projekt <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Výroba */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
        <div>
          <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Naše výroba</p>
          <h2 className="mt-4 font-heading text-4xl text-[#0D2F4F] lg:text-5xl">Nevznikli jsme v marketingu. Vznikli jsme v dílně.</h2>
          <div className="mt-7 space-y-5 text-base leading-relaxed text-[#0D2F4F]/65">
            <p>Firma HolmTec s.r.o. začínala výrobou chladicích systémů a jejich prototypů. Roky zakázkové výroby nás naučily jedno řemeslo dokonale: precizní ohýbání trubek a tyčí.</p>
            <p>Tuto dovednost jsme rozšířili o TIG svařování nerezové ocel a saténový brus povrchu. Když jsme spojili obě zkušenosti, vznikl přirozený krok k vlastnímu produktu: česká mlžítka postavená na vlastním know-how, ne na přeprodeji hotové technologie.</p>
            <p>Každý produkt ohýbáme, svařujeme a brousíme v naší dílně v Trutnově. Od surové trubky po finální saténový povrch — vše pod jednou střechou.</p>
          </div>
        </div>
        <img src={IMAGES.detail} alt="Detail nerezového zpracování" className="h-full min-h-[420px] w-full object-cover" />
      </section>

      {/* Know-how */}
      <section className="bg-[#0D2F4F] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#7FC4E8]">Naše know-how</p>
          <h2 className="mt-4 max-w-3xl font-heading text-4xl lg:text-5xl">Rozumíme materiálu i technologii do posledního detailu.</h2>
          <div className="mt-12 grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-4">
            {KNOW_HOW.map((item) => (
              <div key={item.title} className="bg-[#0D2F4F] p-7">
                <item.icon className="text-[#7FC4E8]" size={22} />
                <h3 className="mt-6 font-heading text-xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Firma */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Identifikace firmy</p>
            <h2 className="mt-4 font-heading text-4xl text-[#0D2F4F]">HolmTec s.r.o.</h2>
            <div className="mt-8 space-y-4 text-sm leading-relaxed text-[#0D2F4F]/70">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-[#0B5EA8]" />
                <span>{COMPANY.address}</span>
              </div>
              <div className="flex gap-6 pl-7 text-xs text-[#0D2F4F]/50">
                <span>IČ: {COMPANY.ico}</span>
                <span>DIČ: {COMPANY.dic}</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-[#0B5EA8]" />
                <a href={`mailto:${COMPANY.email}`} className="hover:text-[#0B5EA8]">{COMPANY.email}</a>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-[#0B5EA8]" />
                <a href={`tel:${COMPANY.phone.replace(/\s/g, '')}`} className="hover:text-[#0B5EA8]">{COMPANY.phone}</a>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={IMAGES.logo} alt="Logo na nerezovém produktu" className="aspect-square w-full object-cover" />
            <img src={IMAGES.laser} alt="Laserové označení produktu" className="aspect-square w-full object-cover" />
            <img src={IMAGES.fair} alt="Prezentace značky MLŽIDLA" className="aspect-square w-full object-cover" />
            <img src={IMAGES.brand} alt="Tým MLŽIDLA" className="aspect-square w-full object-cover" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-y border-[#EAF5FB] bg-[#EAF5FB] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
          <div>
            <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Od návrhu po realizaci</p>
            <h2 className="mt-4 max-w-3xl font-heading text-3xl text-[#0D2F4F] lg:text-4xl">Proberme technické řešení vašeho prostoru.</h2>
          </div>
          <Link to="/poptavka" className="inline-flex h-fit items-center gap-2 bg-[#0B5EA8] px-7 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#094d8a]">
            Popsat projekt <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}