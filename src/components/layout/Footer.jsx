import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Youtube, ArrowRight, ArrowUpRight, ShieldCheck, LockKeyhole, Mail, Phone, MapPin, Droplets, Gauge, ThermometerSun } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import Logo from '@/components/layout/Logo';
import { trackNewsletterSignup } from '@/lib/ga4';

const trustItems = [
  { icon: Droplets, label: 'Vodní mlha pro veřejný prostor', text: 'Mlžítka pro města, parky, sportoviště i rezidenční zahrady.' },
  { icon: Gauge, label: 'Chytré řízení SUPLA', text: 'Scénáře podle času, teploty, počasí a provozního režimu.' },
  { icon: ThermometerSun, label: 'Návrh podle místa', text: 'Vizualizace, doporučení produktu a technické podklady na vyžádání.' },
];

const columns = [
  {
    title: 'Produkty',
    links: [
      ['Městská mlžítka', '/mestske-mlzitka'],
      ['Zahradní mlžítka', '/zahradni-mlzitka'],
      ['Zakázková výroba', '/zakazkova-mlzitka'],
      ['Kompletní katalog', '/mlzidla-mlzitka'],
    ],
  },
  {
    title: 'Řešení',
    links: [
      ['Smart Cooling', '/smart-ovladani'],
      ['Jak funguje mlžení', '/jak-to-funguje'],
      ['AI vizualizace', '/ai-vizualizace'],
      ['Kalkulačka projektu', '/kalkulacka'],
    ],
  },
  {
    title: 'Inspirace',
    links: [
      ['Reference', '/reference'],
      ['Města a obce', '/mlzitka-pro-mesta-obce'],
      ['Parky a hřiště', '/kategorie/parky-hriste'],
      ['Blog & novinky', '/blog'],
    ],
  },
  {
    title: 'Podpora & firma',
    links: [
      ['Ke stažení', '/ke-stazeni'],
      ['Servis a údržba', '/servis-udrzba'],
      ['Časté dotazy', '/faq'],
      ['O nás', '/o-nas'],
      ['Kontakt', '/kontakt'],
      ['Připojit AI asistenta', '/connect'],
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = async (event) => {
    event.preventDefault();
    await base44.entities.NewsletterLead.create({ email, source: 'footer' });
    trackNewsletterSignup('footer');
    setSubscribed(true);
  };

  return (
    <footer className="relative overflow-hidden bg-[#071A2F] text-primary-foreground">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-hydro/10 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1500px] px-6 pt-16 lg:px-8 lg:pt-20">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.15fr_2fr] lg:gap-16">
          <div className="max-w-md">
            <Link to="/" className="inline-flex" aria-label="MLŽIDLA.cz — domů">
              <Logo size="lg" variant="full" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/72">
              Nízkotlaká mlžítka pro města, veřejná prostranství, sportoviště i zahrady. Propojujeme nerezový design, vodní mlhu a chytré řízení SUPLA do řešení navrženého pro konkrétní prostor.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/poptavka"
                className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-cyan px-5 py-3 text-sm font-semibold text-slate-950 transition-transform duration-300 hover:-translate-y-0.5"
              >
                Poptat projekt
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/reference"
                className="inline-flex min-h-11 items-center rounded-full border border-white/18 px-5 py-3 text-sm font-semibold text-white/85 transition-colors hover:border-white/35 hover:text-white"
              >
                Prohlédnout realizace
              </Link>
            </div>

            <div className="mt-7 grid gap-3 text-sm text-white/72 sm:grid-cols-3 lg:grid-cols-1">
              <a href="tel:+420774700390" className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.035] px-4 py-3 transition hover:border-cyan/35 hover:bg-white/[.06]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan/12 text-cyan"><Phone size={15} /></span>
                <span><span className="block text-[10px] uppercase tracking-[.16em] text-white/42">Telefon</span><span className="font-semibold text-white/86">+420 774 700 390</span></span>
              </a>
              <a href="mailto:obchod1@holmtec.cz" className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.035] px-4 py-3 transition hover:border-cyan/35 hover:bg-white/[.06]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan/12 text-cyan"><Mail size={15} /></span>
                <span><span className="block text-[10px] uppercase tracking-[.16em] text-white/42">E-mail</span><span className="font-semibold text-white/86">obchod1@holmtec.cz</span></span>
              </a>
              <Link to="/kontakt" className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.035] px-4 py-3 transition hover:border-cyan/35 hover:bg-white/[.06]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan/12 text-cyan"><MapPin size={15} /></span>
                <span><span className="block text-[10px] uppercase tracking-[.16em] text-white/42">Zázemí</span><span className="font-semibold text-white/86">Trutnov · HolmTec</span></span>
              </Link>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <a
                href="https://mlzidla-vizualizator-prostoru.duchjakubghost.chatgpt.site"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-20 items-center gap-4 rounded-2xl border border-cyan/25 bg-white/[.045] p-4 transition-colors hover:border-cyan/60 hover:bg-white/[.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                aria-label="Aplikace Vizualizátor prostoru — soukromý náhled, otevře se v novém okně"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan/15 text-cyan">
                  <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><path d="m7 15 3-4 3 3 2-2 3 4M15 7h.01" /></svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[10px] uppercase tracking-[.16em] text-cyan">Aplikace</span>
                  <span className="mt-1 block text-sm font-semibold text-white">Vizualizátor prostoru</span>
                  <span className="mt-1 block text-xs leading-5 text-white/68">Soukromý náhled · fotografie vašeho prostoru</span>
                </span>
                <ArrowUpRight size={18} className="shrink-0 text-cyan transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>

              <a
                href="https://www.holmtec.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-20 items-center gap-4 rounded-2xl border border-white/12 bg-white/[.035] p-4 transition-colors hover:border-white/28 hover:bg-white/[.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                aria-label="HolmTec.cz — česká výroba a kovovýroba, otevře se v novém okně"
              >
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/14 bg-white/[.06] text-[10px] font-black tracking-[-.04em] text-white">
                  HT
                  <motion.span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-cyan shadow-[0_0_18px_rgba(38,198,233,.85)]" animate={{ scale: [1, 1.28, 1], opacity: [0.78, 1, 0.78] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[10px] uppercase tracking-[.16em] text-white/45">Výroba a zázemí</span>
                  <span className="mt-1 block text-sm font-semibold text-white">HolmTec.cz</span>
                  <span className="mt-1 block text-xs leading-5 text-white/62">Česká výroba, ohýbání nerezu a technické zázemí MLŽIDLA®</span>
                </span>
                <ArrowUpRight size={18} className="shrink-0 text-cyan transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>

            <div className="mt-7 flex items-center gap-3">
              <a href="https://www.instagram.com/mlzidla/" target="_blank" rel="noreferrer" aria-label="Instagram MLŽIDLA" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[.035] text-white/62 transition hover:-translate-y-0.5 hover:border-cyan/45 hover:text-cyan"><Instagram size={18} /></a>
              <a href="https://www.linkedin.com/company/holmtec/" target="_blank" rel="noreferrer" aria-label="LinkedIn HolmTec" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[.035] text-white/62 transition hover:-translate-y-0.5 hover:border-cyan/45 hover:text-cyan"><Linkedin size={18} /></a>
              <a href="https://studio.youtube.com/channel/UCeoTnyULIx5fW-71fhkG1uA" target="_blank" rel="noreferrer" aria-label="YouTube MLŽIDLA" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[.035] text-white/62 transition hover:-translate-y-0.5 hover:border-cyan/45 hover:text-cyan"><Youtube size={18} /></a>
            </div>
          </div>

          <nav aria-label="Navigace v patičce" className="grid grid-cols-2 gap-x-7 gap-y-10 md:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title} className="border-t border-white/10 pt-4">
                <p className="mb-5 font-mono text-[10px] uppercase tracking-[.18em] text-cyan">{column.title}</p>
                <div className="space-y-3.5">
                  {column.links.map(([label, to]) => (
                    <Link
                      key={label}
                      to={to}
                      className="group flex w-fit items-center gap-1.5 text-sm leading-5 text-white/72 transition-colors hover:text-white"
                    >
                      <span>{label}</span>
                      <ArrowUpRight size={12} className="translate-y-0.5 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-60" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="grid gap-7 border-b border-white/10 py-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="max-w-2xl font-heading text-2xl leading-tight text-white sm:text-3xl">
              20 let zkušeností. Jedno promyšlené klima pro váš prostor.
            </p>
            <p className="mt-2 text-sm text-white/66">Nové realizace, produktové novinky a technologie bez zbytečného spamu.</p>
          </div>

          <form onSubmit={subscribe} className="flex w-full max-w-md md:w-[360px]">
            {subscribed ? (
              <p className="py-3 text-sm font-medium text-cyan">Děkujeme za váš zájem.</p>
            ) : (
              <>
                <input
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-label="E-mail pro newsletter"
                  type="email"
                  placeholder="Váš e-mail"
                  className="min-w-0 flex-1 rounded-l-xl border border-r-0 border-white/12 bg-white/[.07] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-white/25"
                />
                <button className="rounded-r-xl bg-cyan px-4 text-slate-950 transition-colors hover:bg-cyan/90" aria-label="Přihlásit k odběru">
                  <ArrowRight size={18} />
                </button>
              </>
            )}
          </form>
        </div>

        <div className="flex flex-col gap-5 py-7 text-xs text-white/58 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <p>© {new Date().getFullYear()} MLŽIDLA® / HolmTec s.r.o.</p>
            <p className="mt-1 text-white/58"><strong className="font-medium text-white/78">Provozovatel webu:</strong> HolmTec s.r.o. · MLŽIDLA.cz</p>
            <p className="mt-1 text-white/52">Horní Staré Město 698, 541 02 Trutnov · IČ 27486893 · DIČ CZ27486893</p>
            <p className="mt-1 text-white/58"><a href="mailto:obchod1@holmtec.cz" className="transition-colors hover:text-white">obchod1@holmtec.cz</a> · <a href="tel:+420774700390" className="transition-colors hover:text-white">+420 774 700 390</a></p>
            <p className="mt-3 max-w-2xl border-l border-cyan/35 pl-3 text-[11px] leading-5 text-white/52">
              <strong className="font-medium text-white/72">Tvůrce / autor designu: Jakub Duch</strong> — web design, webové prezentace, e-shopy, terminály pro firemní správu a OpenAI agents.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <div
              className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[.05] px-3 py-1.5 text-left"
              aria-label="Zabezpečené připojení a kontrola odkazu"
              title="Kontrola odkazu pomocí Bitdefender Link Checker. Nejde o certifikaci ani partnerství."
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-300/10 text-emerald-200">
                <ShieldCheck size={13} strokeWidth={1.9} />
              </span>
              <span className="flex min-w-0 items-center gap-1.5">
                <LockKeyhole size={11} className="shrink-0 text-white/62" aria-hidden="true" />
                <span className="text-[10px] font-semibold tracking-[.02em] text-white/82">Zabezpečené připojení</span>
                <span className="hidden text-[10px] text-white/52 sm:inline">· kontrola odkazu</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link to="/obchodni-podminky" className="transition-colors hover:text-white/75">Obchodní podmínky</Link>
              <Link to="/gdpr" className="transition-colors hover:text-white/75">GDPR</Link>
              <Link to="/ke-stazeni" className="transition-colors hover:text-white/75">Ke stažení</Link>
              <Link to="/podpora" className="transition-colors hover:text-white/75">Podpora</Link>
              <Link to="/partnerstvi" className="transition-colors hover:text-white/75">Partnerství</Link>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 72, filter: 'blur(12px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none relative border-t border-white/[.06] px-3 pb-2 pt-6 sm:px-6 lg:px-8"
        aria-hidden="true"
      >
        <div className="mx-auto max-w-[1600px] overflow-hidden">
          <div className="flex select-none items-end justify-center whitespace-nowrap font-heading text-[18vw] font-extrabold leading-[0.72] tracking-[-0.075em] text-white/[.055] sm:text-[15vw] lg:text-[12vw]">
            <span className="text-cyan/[.12]">MLŽ</span><span>IDLA</span><sup className="ml-1 self-start pt-[1.8vw] text-[2.2vw] tracking-normal text-white/[.09]">®</sup>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}