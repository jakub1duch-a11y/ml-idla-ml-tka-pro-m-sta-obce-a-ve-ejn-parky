import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, FileText, Headphones, Mail, MessageCircle, Phone, Send, Sparkles } from 'lucide-react';

const menuItems = [
  ['#article-content', 'Obsah článku', FileText],
  ['#article-gallery-heading', 'Obrazový kontext', Sparkles],
  ['#related-products-heading', 'Související produkty', ArrowRight],
  ['#faq', 'Časté otázky', Headphones],
];

const recommendedLinks = [
  ['/katalog-mlzitek', 'Kompletní katalog'],
  ['/smart-ovladani', 'Chytré řízení mlžení'],
  ['/poptavka', 'Nezávazná poptávka'],
  ['/podpora', 'Podpora a návody'],
];

export default function BlogArticleSidebar({ related = [] }) {
  return (
    <aside className="lg:col-span-3 lg:col-start-1 lg:row-start-1 lg:self-start">
      <div className="space-y-4 lg:sticky lg:top-24">
        <section className="rounded-[1.5rem] border border-[#D8E7EC] bg-white/90 p-5 shadow-[0_18px_60px_rgba(7,19,29,.08)] backdrop-blur-xl" aria-label="Navigace článkem">
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#0B6B7A]">Rychlá navigace</p>
          <nav className="mt-4 space-y-1">
            {menuItems.map(([href, label, Icon]) => (
              <a key={href} href={href} className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-[#EFFAFC] hover:text-[#075D70]">
                <span className="flex items-center gap-2"><Icon size={15} className="text-[#0B8EC5]" />{label}</span>
                <ArrowRight size={14} className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
              </a>
            ))}
          </nav>
        </section>

        <section className="rounded-[1.5rem] border border-[#CDEAF0] bg-[#F1FBFD] p-5" aria-label="Doporučené odkazy">
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#0B6B7A]">Doporučené odkazy</p>
          <div className="mt-3 space-y-2">
            {recommendedLinks.map(([href, label]) => (
              <Link key={href} to={href} className="flex items-center justify-between rounded-xl border border-white/80 bg-white/75 px-3 py-2.5 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-[#7CCBD8]">
                {label}<ArrowRight size={14} className="text-[#0B8EC5]" />
              </Link>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="rounded-[1.5rem] border border-[#D8E7EC] bg-white/90 p-5 shadow-sm" aria-label="Související články">
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#0B6B7A]">Související čtení</p>
            <div className="mt-3 space-y-3">
              {related.slice(0, 3).map((item) => (
                <Link key={item.id} to={`/blog/${item.slug || item.id}`} className="group block">
                  <span className="text-sm font-semibold leading-snug text-slate-800 transition group-hover:text-[#0B6B7A]">{item.title}</span>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs text-[#0B8EC5]">Číst dále <ArrowRight size={12} /></span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="overflow-hidden rounded-[1.5rem] bg-[#07131D] p-5 text-white shadow-[0_18px_60px_rgba(7,19,29,.16)]" aria-label="Rychlý kontakt">
          <div className="flex items-center gap-3">
            <img
              src="/media/avatars/radek-meduna-support.svg"
              alt="Ing. Radek Meduna"
              className="h-14 w-14 shrink-0 rounded-full border-2 border-cyan-200/40 bg-white object-cover"
              width="56"
              height="56"
              loading="lazy"
            />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-200">Rychlý kontakt</p>
              <p className="mt-1 font-heading text-lg font-semibold">Ing. Radek Meduna</p>
              <p className="text-xs text-slate-300">Výroba a technické řešení</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <a href="tel:+420774700390" className="flex items-center gap-2 text-slate-100 hover:text-cyan-200"><Phone size={15} className="text-cyan-200" /> +420 774 700 390</a>
            <a href="mailto:meduna@holmtec.cz" className="flex items-center gap-2 text-slate-100 hover:text-cyan-200"><Mail size={15} className="text-cyan-200" /> meduna@holmtec.cz</a>
          </div>
          <div className="mt-5 grid gap-2">
            <Link to="/poptavka" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-cyan-200 px-4 text-sm font-bold text-[#07131D] transition hover:bg-white"><Send size={15} /> Nezávazná poptávka</Link>
            <a href="https://wa.me/420774700390?text=Dobr%C3%BD%20den%2C%20m%C3%A1m%20dotaz%20k%20ml%C5%BEen%C3%AD." target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 px-4 text-sm font-bold text-white transition hover:border-cyan-200 hover:text-cyan-200"><MessageCircle size={15} /> WhatsApp chat</a>
          </div>
        </section>

        <Link to="/poradce" className="flex items-center gap-3 rounded-[1.5rem] border border-[#BFE9EF] bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#DDF7FA] text-[#075D70]"><Bot size={19} /></span>
          <span className="min-w-0"><span className="block text-sm font-bold text-slate-900">Webový agent</span><span className="block text-xs leading-5 text-slate-500">Pomůže s výběrem řešení</span></span>
          <ArrowRight size={15} className="ml-auto shrink-0 text-[#0B8EC5]" />
        </Link>
      </div>
    </aside>
  );
}
