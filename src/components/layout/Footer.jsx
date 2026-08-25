import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Youtube, ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import Logo from '@/components/layout/Logo';
import { trackNewsletterSignup } from '@/lib/ga4';

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
      ['Města a obce', '/kategorie/mesta-obce'],
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
      ['Vývoj systému', '/vyvoj-systemu'],
      ['Kontakt', '/kontakt'],
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
    <footer className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 pt-16 lg:px-8 lg:pt-20">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.15fr_2fr] lg:gap-16">
          <div className="max-w-md">
            <Link to="/" className="inline-flex" aria-label="MLŽIDLA.cz — domů">
              <Logo size="sm" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/62">
              Česká mlžítka a mlžné systémy pro města, architekturu a zahrady. Od návrhu a výroby po instalaci, řízení a servis.
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

            <div className="mt-7 flex items-center gap-4">
              <a href="https://www.instagram.com/mlzidla/" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-white/55 transition-colors hover:text-cyan"><Instagram size={18} /></a>
              <a href="#linkedin" aria-label="LinkedIn" className="text-white/55 transition-colors hover:text-cyan"><Linkedin size={18} /></a>
              <a href="#youtube" aria-label="YouTube" className="text-white/55 transition-colors hover:text-cyan"><Youtube size={18} /></a>
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
                      className="group flex w-fit items-center gap-1.5 text-sm leading-5 text-white/62 transition-colors hover:text-white"
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
            <p className="mt-2 text-sm text-white/52">Nové realizace, produktové novinky a technologie bez zbytečného spamu.</p>
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

        <div className="flex flex-col gap-4 py-7 text-xs text-white/42 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MLŽIDLA® / HolmTec s.r.o.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/gdpr" className="transition-colors hover:text-white/75">GDPR</Link>
            <Link to="/gdpr" className="transition-colors hover:text-white/75">Cookies</Link>
            <Link to="/obchodni-podminky" className="transition-colors hover:text-white/75">Obchodní podmínky</Link>
            <Link to="/udrzitelnost" className="transition-colors hover:text-white/75">Udržitelnost</Link>
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
