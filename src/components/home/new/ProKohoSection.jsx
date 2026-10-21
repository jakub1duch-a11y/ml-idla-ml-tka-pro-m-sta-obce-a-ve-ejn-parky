import { ArrowRight, Building2, Check, Compass, Landmark } from 'lucide-react';

const AUDIENCES = [
{
  icon: Building2,
  problem: 'Horké dny mění náměstí, parky a okolí veřejných budov na místa, kde lidé hledají stín a rychlé osvěžení.',
  benefits: [
  'Vodní mlha na veřejná prostranství pro příjemnější pobyt v tropických dnech',
  'Napojení na běžný vodovodní řád a standardní tlak v potrubí podle konkrétní instalace',
  'Nerezová konstrukce navržená pro dlouhodobý venkovní provoz'],

  cta: 'Připravit podklady pro radu města',
  link: '/poptavka'
},
{
  icon: Landmark,
  problem: 'Sportoviště, koupaliště, ZOO a technické služby potřebují spolehlivé ochlazení pro návštěvníky i personál.',
  benefits: [
  'Modulární řešení pro areály s různými zónami využití',
  'Smart řízení podle teploty, času a provozního režimu',
  'Servis, zazimování a dlouhodobá podpora od výrobce'],

  cta: 'Technická konzultace provozu',
  link: '/poptavka'
},
{
  icon: Compass,
  problem: 'Architekti a projektanti hledají ověřené technické řešení, které se začlení do návrhu veřejného prostoru.',
  benefits: [
  'Technické listy, kotvení a podklady pro projektovou dokumentaci na vyžádání',
  'Zakázkové tvary a geometrie v ověřitelných produktových pravidlech',
  'Vizualizace produktu v konkrétním prostoru jako podklad pro poptávku'],

  cta: 'Vyžádat podklady pro projekt',
  link: '/ke-stazeni'
}];


export default function ProKohoSection() {
  return (
    <section id="pro-koho" className="bg-[#F4F8FB] py-20 lg:py-28" aria-labelledby="pro-koho-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[.18em] text-[#0B83BC]">Řešení podle typu místa</p>
          <h2 id="pro-koho-title" className="mt-3 font-heading text-3xl font-semibold tracking-[-.035em] text-[#0A2342] sm:text-4xl lg:text-5xl">Od městského náměstí po projektovou dokumentaci.</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#0D2F4F]/65">Vyberte si cestu podle toho, co právě potřebujete vyřešit. Společně upřesníme prostor, technické možnosti i další krok.</p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {AUDIENCES.map((audience, index) => {
            const Icon = audience.icon;
            return (
              <article key={audience.cta} className="flex h-full flex-col rounded-[24px] border border-[#D9E6ED] bg-white p-6 shadow-[0_10px_34px_rgba(10,35,66,.045)] sm:p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F6FB] text-[#0B5EA8]"><Icon size={22} aria-hidden="true" /></div>
                <p className="mt-5 font-mono font-semibold uppercase tracking-[.15em] text-[#0B83BC] text-base">{['Města a obce', 'Areály a provozy', 'Architekti a projektanti'][index]}</p>
                <p className="mt-3 text-base leading-7 text-[#0D2F4F]/80">{audience.problem}</p>
                <ul className="mt-5 space-y-3">
                  {audience.benefits.map((benefit) => <li key={benefit} className="flex gap-2.5 text-sm leading-6 text-[#0D2F4F]/65"><Check size={16} className="mt-1 shrink-0 text-[#0B8CBA]" aria-hidden="true" /><span>{benefit}</span></li>)}
                </ul>
                <a href={audience.link} className="mt-7 inline-flex min-h-11 items-center justify-between gap-3 border-t border-[#E7EEF2] pt-5 text-sm font-semibold text-[#0A5E91] transition hover:text-[#063C63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B97E8] focus-visible:ring-offset-4">
                  <span>{audience.cta}</span><ArrowRight size={17} aria-hidden="true" />
                </a>
              </article>);

          })}
        </div>
      </div>
    </section>);

































}