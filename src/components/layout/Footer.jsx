import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ChevronDown, Instagram, Linkedin, Youtube, MapPin, Phone, Mail, ShieldCheck, Building2, Code2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import Logo from '@/components/layout/Logo';

const sections = [
  { title: 'Produkty', links: [
    ['Městská mlžítka', '/mestske-mlzitka'],
    ['Mlžiště a mlhoviště', '/mlhoviste'],
    ['Zahradní mlžítka', '/zahradni-mlzitka'],
    ['Zakázková výroba', '/zakazkova-mlzitka'],
    ['Katalog mlžítek', '/katalog-mlzitek'],
  ] },
  { title: 'Řešení', links: [
    ['Automatizace', '/smart-ovladani'],
    ['Jak funguje mlžení', '/jak-to-funguje'],
    ['Kalkulačka projektu', '/kalkulacka'],
    ['Poptat projekt', '/poptavka'],
  ] },
  { title: 'Inspirace', links: [
    ['Realizace', '/reference'],
    ['Města a obce', '/mlzitka-pro-mesta-obce'],
    ['Parky a hřiště', '/kategorie/parky-hriste'],
    ['Blog a novinky', '/blog'],
  ] },
  { title: 'Podpora a firma', links: [
    ['Ke stažení', '/ke-stazeni'],
    ['Servis a údržba', '/servis-udrzba'],
    ['Časté dotazy', '/faq'],
    ['O nás', '/o-nas'],
    ['Kontakt', '/kontakt'],
    ['Partnerství', '/partnerstvi'],
  ] },
];

const social = [
  { href: 'https://www.instagram.com/mlzidla/', label: 'Instagram MLŽIDLA', icon: Instagram },
  { href: 'https://www.linkedin.com/company/holmtec/', label: 'LinkedIn HolmTec', icon: Linkedin },
  { href: 'https://www.youtube.com/channel/UCeoTnyULIx5fW-71fhkG1uA', label: 'YouTube MLŽIDLA', icon: Youtube },
];

export default function Footer() {
  const [openColumn, setOpenColumn] = useState(null);
  const reducedMotion = useReducedMotion();

  return (
    <footer id="site-footer" className="relative isolate overflow-hidden bg-[#071A2F] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_20%,rgba(4,119,171,.14),transparent_47%)]" />
      <div className="relative mx-auto max-w-[1500px] px-5 pb-7 pt-14 sm:px-8 lg:px-12 lg:pt-16">
        <div className="grid gap-12 border-b border-white/15 pb-12 xl:grid-cols-[minmax(260px,.95fr)_minmax(0,1.75fr)] xl:gap-20">
          <div className="min-w-0">
            <Link to="/" className="inline-flex max-w-full" aria-label="MLŽIDLA.cz — úvodní stránka">
              <Logo size="lg" variant="full" className="max-w-full" />
            </Link>
            <p className="mt-5 max-w-[430px] text-sm leading-7 text-white/75">
              Nerezová mlžítka pro města, veřejná prostranství, sportoviště i zahrady.
              Návrh, výroba a automatizace pro konkrétní prostor.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/poptavka" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#04B9ED] px-5 py-3 text-sm font-bold text-[#07131D] transition hover:bg-[#62D6F4]">
                Poptat projekt <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link to="/reference" className="inline-flex min-h-11 items-center rounded-full border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Prohlédnout realizace
              </Link>
            </div>
            <div className="mt-7 flex gap-3">
              {social.map(({ href, label, icon: Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/[.04] text-white transition hover:border-[#30C8EE] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#30C8EE]">
                  <Icon size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Navigace v patičce" className="grid min-w-0 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
            {sections.map((section, index) => {
              const isOpen = openColumn === index;
              return (
                <motion.div key={section.title}
                  initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{ duration: 0.5, delay: reducedMotion ? 0 : index * 0.05 }}
                  className="min-w-0 border-t border-white/15 md:border-t-0">
                  <button type="button" onClick={() => setOpenColumn(isOpen ? null : index)}
                    aria-expanded={isOpen} aria-controls={`footer-links-${index}`}
                    className="flex min-h-12 w-full items-center justify-between py-3 text-left md:pointer-events-none md:min-h-0 md:py-1">
                    <span className="text-sm font-bold tracking-[.02em] text-white">{section.title}</span>
                    <ChevronDown size={17} aria-hidden="true" className={`text-white/70 transition-transform md:hidden ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div id={`footer-links-${index}`} className={`${isOpen ? 'block' : 'hidden'} pb-5 md:block md:pb-0 md:pt-4`}>
                    <ul className="space-y-3">
                      {section.links.map(([label, path]) => (
                        <li key={path}><Link to={path}
                          className="group inline-flex min-h-7 items-center gap-1.5 text-[13px] leading-6 text-white/75 transition-colors hover:text-[#67D7F4]">
                          {label}<ArrowUpRight size={13} aria-hidden="true" className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                        </Link></li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </nav>
        </div>

        <div className="grid gap-7 border-b border-white/15 py-8 text-sm md:grid-cols-[1.2fr_1fr_1fr] md:gap-8">
          <div className="flex min-w-0 items-start gap-3">
            <MapPin className="mt-1 shrink-0 text-[#61D7F0]" size={19} aria-hidden="true" />
            <address className="not-italic leading-6 text-white/78"><strong className="block text-white">HolmTec s.r.o.</strong>
              Horní Staré Město 698, 541 02 Trutnov<br />IČ 27486893 · DIČ CZ27486893
            </address>
          </div>
          <a href="mailto:obchod1@holmtec.cz" className="flex min-w-0 items-start gap-3 text-white/85 hover:text-white">
            <Mail className="mt-1 shrink-0 text-[#61D7F0]" size={19} aria-hidden="true" />
            <span className="min-w-0 break-all">obchod1@holmtec.cz</span>
          </a>
          <a href="tel:+420774700390" className="flex items-start gap-3 text-white/85 hover:text-white">
            <Phone className="mt-1 shrink-0 text-[#61D7F0]" size={19} aria-hidden="true" />
            <span>+420 774 700 390</span>
          </a>
        </div>

        <div className="flex flex-col gap-5 pt-6 text-xs text-white/75 lg:flex-row lg:items-center lg:justify-between">
          <p>© {new Date().getFullYear()} MLŽIDLA® / HolmTec s.r.o.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/obchodni-podminky" className="hover:text-white">Obchodní podmínky</Link>
            <Link to="/gdpr" className="hover:text-white">GDPR</Link>
            <span className="inline-flex items-center gap-1.5 text-white/75" title="Informace o připojení; nejedná se o certifikaci">
              <ShieldCheck size={15} className="text-[#66D8E8]" aria-hidden="true" /> Zabezpečené připojení
            </span>
          </div>
          <span className="inline-flex flex-wrap items-center gap-1.5 text-white/75">
            <Code2 size={14} className="text-[#50D2F0]" aria-hidden="true" />
            Created with <span role="img" aria-label="modré srdce">💙</span> powered by
            <a href="https://holmtec.cz" target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:text-[#67D7F4]">HolmTec s.r.o.</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
