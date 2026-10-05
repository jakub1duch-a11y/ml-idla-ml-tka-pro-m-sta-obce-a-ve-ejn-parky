import React from 'react';
import { Droplets, Gauge, Ruler, ShieldCheck, Sparkles, Zap } from 'lucide-react';

function plainText(value = '') {
  return String(value).
  replace(/<[^>]*>/g, ' ').
  replace(/\s+/g, ' ').
  trim();
}

function SpecTable({ title, eyebrow, rows, icon: Icon }) {
  if (!rows.length) return null;
  return (
    <section className="overflow-hidden rounded-[28px] border border-[#D8E8F0] bg-white shadow-[0_18px_60px_rgba(10,35,66,.06)]">
      <div className="flex items-center gap-3 border-b border-[#E7F0F4] px-5 py-5 sm:px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EAF7FD] text-[#0B5EA8]">
          <Icon size={18} strokeWidth={1.7} />
        </div>
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-[#0B97E8]">{eyebrow}</p>
          <h3 className="mt-1 font-heading text-xl font-bold tracking-[-.025em] text-[#0A2342]">{title}</h3>
        </div>
      </div>

      <div className="divide-y divide-[#EDF3F6]">
        {rows.map((row) =>
        <div key={row.label} className="grid gap-1 px-5 py-4 sm:grid-cols-[minmax(150px,.72fr)_1.28fr] sm:items-start sm:gap-6 sm:px-6 sm:py-5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[.11em] text-[#0D2F4F]/42">{row.label}</span>
            <span className="text-sm font-semibold leading-6 text-[#0D2F4F] sm:text-right">{row.value}</span>
          </div>
        )}
      </div>
    </section>);

}

function MaterialQualityBadge({ material }) {
  const isStainless = /nerez|stainless|aisi/i.test(material || '');
  if (!isStainless) return null;

  return (
    <div
      className="relative overflow-hidden rounded-[28px] border border-[#B9DCE8] bg-[linear-gradient(145deg,#F9FEFF_0%,#EAF6F9_48%,#FFFFFF_100%)] p-5 shadow-[0_18px_55px_rgba(10,35,66,.08)] sm:p-6"
      title="Designové označení materiálového standardu MLŽIDLA®; nejde o externí certifikační značku."
      aria-label="MLŽIDLA material quality badge">
      
      <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full border border-[#9ED9F0]/40" />
      <div className="absolute -right-3 top-3 h-20 w-20 rounded-full border border-[#9ED9F0]/35" />

      <div className="relative flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#8BC8DA] shadow-[inset_0_0_0_5px_#EFF8FA]">
          <ShieldCheck size={25} strokeWidth={1.55} className="text-[#0B5EA8]" />
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[9px] font-black uppercase tracking-[.22em] text-[#0B97E8]">Best quality</p>
          <p className="mt-1 font-heading text-lg font-black uppercase leading-[.95] tracking-[-.025em] text-[#0A2342]">Stainless product material</p>
          <p className="mt-3 text-xs font-semibold leading-5 text-[#0D2F4F]/62">{material}</p>
          <p className="mt-3 font-mono text-[8px] font-bold uppercase tracking-[.18em] text-[#0D2F4F]/38">MLŽIDLA® material standard</p>
        </div>
      </div>
    </div>);

}

export default function PdSpecs({ product }) {
  const intro = plainText(product.short_description || product.description || '');
  const constructionRows = [
  product.material && { label: 'Materiál', value: product.material },
  product.coverage_area && { label: 'Rozměr / dosah', value: product.coverage_area }].
  filter(Boolean);

  const operationRows = [
  product.pressure && { label: 'Provozní tlak', value: product.pressure },
  product.water_consumption && { label: 'Spotřeba vody', value: product.water_consumption },
  product.micron_size && { label: 'Trysky / velikost kapek', value: product.micron_size },
  product.power_supply && { label: 'Napájení / řízení', value: product.power_supply }].
  filter(Boolean);

  const allRows = [...constructionRows, ...operationRows];

  return (
    <section className="bg-[#F7FBFD] py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
        <div className="grid gap-7 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#0B97E8] sm:text-[11px]">Produkt stručně</p>
            <h2 className="mt-3 max-w-3xl font-heading text-3xl font-bold leading-[1.02] tracking-[-.04em] text-[#0A2342] sm:text-4xl lg:text-5xl">
              Klíčové informace a technické parametry.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#0D2F4F]/62 sm:text-base">
              {intro || 'Technické údaje zobrazujeme pouze z ověřených polí konkrétního produktu. Chybějící hodnoty se nedoplňují odhadem.'}
            </p>
          </div>

          <MaterialQualityBadge material={product.material} />
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[24px] border border-[#D8E8F0] bg-white p-5">
            <Sparkles size={19} className="text-[#0B97E8]" />
            <p className="mt-3 text-sm font-bold text-[#0A2342]">Použití</p>
            <p className="mt-1 text-xs leading-5 text-[#0D2F4F]/55">Výběr konfigurace se vždy vztahuje ke konkrétnímu prostoru a způsobu provozu.</p>
          </div>
          <div className="rounded-[24px] border border-[#D8E8F0] bg-white p-5">
            <Droplets size={19} className="text-[#0B97E8]" />
            <p className="mt-3 text-sm font-bold text-[#0A2342]">Voda a mlžení</p>
            <p className="mt-1 text-xs leading-5 text-[#0D2F4F]/55">Tlak, trysky a spotřeba se zobrazují jen tehdy, pokud jsou u produktu uložené.</p>
          </div>
          <div className="rounded-[24px] border border-[#D8E8F0] bg-white p-5">
            <Zap size={19} className="text-[#0B97E8]" />
            <p className="mt-3 text-sm font-bold text-[#0A2342]">Řízení</p>
            <p className="mt-1 text-xs leading-5 text-[#0D2F4F]/55">Smart prvky, napájení a způsob ovládání se potvrzují podle skutečné konfigurace projektu.</p>
          </div>
        </div>

        {allRows.length > 0 ?
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <SpecTable title="Konstrukce a provedení" eyebrow="Specifikace produktu" rows={constructionRows} icon={Ruler} />
            <SpecTable title="Provozní parametry" eyebrow="Technická data" rows={operationRows} icon={Gauge} />
          </div> :

        <div className="mt-8 rounded-[28px] border border-[#D8E8F0] bg-white p-6 text-sm leading-7 text-[#0D2F4F]/62">
            Technické parametry tohoto produktu zatím nejsou v ověřených produktových datech kompletní. Do nabídky se doplní až po potvrzení konkrétní konfigurace.
          </div>
        }

        <div className="mt-6 rounded-[24px] border border-[#CBE4EE] bg-[#EAF7FD]/75 px-5 py-4 text-xs leading-6 text-[#0D2F4F]/60 sm:px-6">
          Přesné kotvení, počet a typ trysek, napojení vody, řízení a další projektové detaily se potvrzují podle místa instalace a schváleného technického návrhu.
        </div>
      </div>
    </section>);

}