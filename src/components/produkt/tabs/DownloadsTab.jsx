import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Ruler, Layers3, Wrench, Mail, ArrowUpRight } from 'lucide-react';

const SHARED_DOCS = [
  { icon: Wrench, title: 'Přípravné práce pro instalaci', desc: 'Obecný podklad: stavební příprava, výkopy, betonáž a rozvod vody.', url: 'https://media.base44.com/files/public/6a3ee88c10959cd3588c4d68/b704ccfab_Ppravnprceproinstalacimltka.pdf' },
  { icon: Ruler, title: 'Detaily ocelového mlžítka', desc: 'Obecný technický podklad k patám a průřezům. Měřítko 1:10.', url: 'https://media.base44.com/files/public/6a3ee88c10959cd3588c4d68/f23bec143_DETAILY_OCELOVEHO_MLZITKA.pdf' },
  { icon: Layers3, title: 'Manuál údržby trysky typ M', desc: 'Obecný servisní postup demontáže a čištění mlžicí trysky.', url: 'https://media.base44.com/files/public/6a3ee88c10959cd3588c4d68/6fcaf7525_tryska.pdf' },
  { icon: FileText, title: 'Chytré ovládání — prospekt', desc: 'Obecný přehled smart řízení, automatizace a provozních scénářů.', url: 'https://media.base44.com/files/public/6a3ee88c10959cd3588c4d68/681f0619c_Chytreovladani.pdf' },
];

export default function DownloadsTab({ product }) {
  const productDocs = (product.documents_urls || []).filter(Boolean).map((url, index) => ({
    title: `Dokument produktu ${index + 1}`,
    desc: `Podklad přiřazený přímo k produktu ${product.name}.`,
    url,
  }));

  const emailFiles = [
    { title: `Technický list — ${product.name}`, desc: 'Produktový technický podklad na vyžádání.', subject: `Technický list — ${product.name}` },
    { title: 'Podklady pro architekta / projektanta', desc: 'Vyžádejte si dostupné projektové podklady ke konkrétnímu produktu a instalaci.', subject: `Podklady pro architekta — ${product.name}` },
    { title: 'Individuální cenová nabídka', desc: 'Nabídka podle počtu kusů, instalace a rozsahu projektu.', subject: `Cenová nabídka — ${product.name}` },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 max-w-3xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-slate-400">Dokumentace · architekti · projektanti</p>
          <h2 className="font-heading text-4xl font-light tracking-tight text-slate-900 lg:text-5xl">Podklady, které lze<br/><span className="text-slate-400">použít při návrhu projektu.</span></h2>
          <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-slate-500">Dokumenty rozdělujeme na podklady přiřazené přímo k produktu a obecnou technickou dokumentaci. Tím je vždy jasné, co je závazné pro konkrétní výrobek a co pouze vysvětluje princip instalace nebo údržby.</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1.06fr_.94fr] lg:items-start">
          <div className="space-y-8">
            {productDocs.length > 0 && (
              <div>
                <div className="mb-4 flex items-center justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#0b4860]/60">Přímo k produktu</p><h3 className="mt-1 text-xl font-semibold text-slate-950">Dokumentace {product.name}</h3></div><span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-semibold text-emerald-700">Produktové podklady</span></div>
                <div className="space-y-3">
                  {productDocs.map((f, i) => (
                    <motion.a key={f.url} href={f.url} target="_blank" rel="noopener noreferrer" whileHover={{ y: -2 }} className="group flex items-center justify-between gap-5 rounded-[22px] border border-[#0b4860]/15 bg-[#f5fafb] p-5 transition-all hover:border-[#0b4860]/30 hover:bg-white hover:shadow-[0_14px_34px_rgba(11,72,96,.07)]">
                      <div className="flex min-w-0 items-center gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0b4860] text-white"><FileText size={19}/></span><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-950">{f.title}</p><p className="mt-1 text-xs leading-relaxed text-slate-500">{f.desc}</p></div></div>
                      <Download size={17} className="shrink-0 text-[#0b4860] transition-transform group-hover:translate-y-0.5"/>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="mb-4"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-slate-400">Sdílená dokumentace</p><h3 className="mt-1 text-xl font-semibold text-slate-950">Obecné technické podklady</h3><p className="mt-2 text-xs leading-relaxed text-slate-500">Tyto dokumenty popisují obecné principy a nemusí přesně odpovídat geometrii, rozměrům nebo konfiguraci tohoto produktu.</p></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {SHARED_DOCS.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <motion.a key={f.title} href={f.url} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .04 }} whileHover={{ y: -3 }} className="group rounded-[22px] border border-slate-200 bg-white p-5 transition-all hover:border-[#0b4860]/20 hover:shadow-[0_14px_34px_rgba(11,72,96,.06)]">
                      <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#0b4860]"><Icon size={18}/></span><ArrowUpRight size={15} className="text-slate-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/></div>
                      <h4 className="mt-4 text-sm font-semibold text-slate-950">{f.title}</h4><p className="mt-1.5 text-xs leading-relaxed text-slate-500">{f.desc}</p>
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 text-white shadow-[0_18px_50px_rgba(15,23,42,.12)] lg:sticky lg:top-44">
            <div className="border-b border-white/10 p-6 sm:p-7"><p className="font-mono text-[9px] uppercase tracking-[.2em] text-cyan-300">Projektové podklady na vyžádání</p><h3 className="mt-3 font-heading text-2xl font-light">Potřebujete podklady pro konkrétní projekt?</h3><p className="mt-3 text-sm leading-6 text-white/55">Napište nám produkt, lokalitu a fázi projektu. Pošleme pouze podklady, které máme pro daný produkt a instalaci skutečně k dispozici.</p></div>
            <div className="space-y-2 p-4 sm:p-5">
              {emailFiles.map((f) => (
                <a key={f.title} href={`mailto:obchod1@holmtec.cz?subject=${encodeURIComponent(f.subject)}`} className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[.04] p-4 transition-all hover:border-cyan-300/25 hover:bg-white/[.07]">
                  <div className="flex min-w-0 items-start gap-3"><Mail size={17} className="mt-0.5 shrink-0 text-cyan-300"/><div><p className="text-sm font-semibold text-white">{f.title}</p><p className="mt-1 text-[11px] leading-relaxed text-white/45">{f.desc}</p></div></div>
                  <ArrowUpRight size={15} className="shrink-0 text-white/25 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-300"/>
                </a>
              ))}
            </div>
            <div className="border-t border-white/10 px-6 py-5 text-[11px] leading-relaxed text-white/40">Přesné výrobní výkresy, rozměry a kotvení nelze nahrazovat obecnými schématy z webu. Pro realizaci se vždy používá schválený podklad konkrétního projektu.</div>
          </aside>
        </div>
      </div>
    </section>
  );
}