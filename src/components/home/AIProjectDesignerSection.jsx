import React, { useState } from 'react';
import {
  ArrowRight,
  Building2,
  Trees,
  School,
  Dumbbell,
  House,
  ShieldCheck,
  Ruler,
  Droplets,
  FileCheck2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const examples = [
  { icon: Building2, label: 'Náměstí', text: 'Náměstí 20 × 30 m, vysoká návštěvnost, chceme atraktivní mlžiště pro děti i dospělé.' },
  { icon: Trees, label: 'Park', text: 'Městský park, klidová zóna podél pěší trasy, trvalá nízkotlaká instalace bez vysokotlakého čerpadla.' },
  { icon: School, label: 'Škola / školka', text: 'Areál mateřské školy, bezpečné ochlazení dětí v letních měsících, plocha přibližně 120 m².' },
  { icon: Dumbbell, label: 'Sportoviště', text: 'Venkovní sportoviště s vysokou návštěvností, potřebujeme odolné mlžení pro větší počet lidí.' },
  { icon: House, label: 'Rezidence', text: 'Rezidenční zahrada nebo společná odpočinková zóna, elegantní mlžení s důrazem na čistou architekturu.' },
];

const outputs = [
  { icon: Ruler, title: 'Návrh rozsahu', text: 'Doporučená velikost a počet prvků podle prostoru.' },
  { icon: Droplets, title: 'Vhodná kolekce', text: 'Výběr řešení podle provozu, využití a charakteru místa.' },
  { icon: FileCheck2, title: 'Podklad pro nabídku', text: 'Strukturované zadání pro další technické ověření a nacenění.' },
];

export default function AIProjectDesignerSection() {
  const navigate = useNavigate();
  const [value, setValue] = useState(() => sessionStorage.getItem('mlzidla-ai-zadani') || '');
  const [selectedType, setSelectedType] = useState(() => sessionStorage.getItem('mlzidla-ai-typ') || '');

  const updateValue = (nextValue) => {
    setValue(nextValue);
    sessionStorage.setItem('mlzidla-ai-zadani', nextValue);
  };

  const selectType = (label) => {
    setSelectedType(label);
    sessionStorage.setItem('mlzidla-ai-typ', label);
  };

  const start = () => {
    const zadani = value.trim();
    if (!zadani && !selectedType) return;
    const params = new URLSearchParams();
    if (zadani) params.set('zadani', zadani);
    if (selectedType) params.set('typ', selectedType);
    navigate(`/poradce?${params.toString()}`);
  };

  const visualize = () => {
    const params = new URLSearchParams();
    if (value.trim()) params.set('zadani', value.trim());
    if (selectedType) params.set('typ', selectedType);
    navigate(`/ai-vizualizace${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="border-y border-slate-200 bg-[#f5f6f3] py-20 text-slate-950 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-20">
          <div className="lg:sticky lg:top-28">
            <div className="mb-6 inline-flex items-center gap-2 border border-slate-300 bg-white px-3 py-1.5">
              <ShieldCheck size={14} className="text-slate-700" />
              <span className="font-mono text-[10px] uppercase tracking-[.18em] text-slate-600">Projektová podpora MLŽIDLA®</span>
            </div>

            <h2 className="max-w-2xl font-heading text-4xl font-medium leading-[1.02] tracking-[-.03em] text-slate-950 sm:text-5xl lg:text-6xl">
              Navrhněte základ projektu.
              <span className="mt-1 block text-slate-500">Technické řešení ověří náš tým.</span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 lg:text-lg lg:leading-8">
              Zadejte typ prostoru, přibližnou velikost a způsob využití. Projektant připraví orientační sestavu, vhodnou kolekci a podklad pro další konzultaci.
            </p>

            <div className="mt-9 grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {outputs.map(({ icon: Icon, title, text }) => (
                <div key={title} className="border-t border-slate-300 pt-4">
                  <Icon size={18} className="text-slate-700" />
                  <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1.5 text-xs leading-5 text-slate-500">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-start gap-3 border-l-2 border-slate-900 pl-4">
              <ShieldCheck size={17} className="mt-0.5 shrink-0 text-slate-700" />
              <p className="max-w-lg text-xs leading-5 text-slate-500">
                Výstup je orientační návrh. Finální počet prvků, tlak, průtok, kotvení a napojení vždy kontrolujeme podle skutečných podmínek projektu.
              </p>
            </div>
          </div>

          <div className="border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,.08)]">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-7 lg:px-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[.16em] text-slate-500">Návrh projektu</p>
                  <h3 className="mt-1 font-heading text-2xl font-medium tracking-tight text-slate-950 sm:text-3xl">Základní zadání</h3>
                </div>
                <p className="text-xs text-slate-400">Stačí přibližné údaje.</p>
              </div>
            </div>

            <div className="p-5 sm:p-7 lg:p-8">
              <fieldset>
                <legend className="mb-3 flex items-center gap-3 text-xs font-semibold text-slate-700">
                  <span className="flex h-6 w-6 items-center justify-center bg-slate-950 font-mono text-[10px] text-white">01</span>
                  Typ prostoru
                </legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                  {examples.map(({ icon: Icon, label }) => {
                    const active = selectedType === label;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => selectType(label)}
                        aria-pressed={active}
                        className={`min-h-[88px] border px-3 py-3 text-left transition-colors ${
                          active
                            ? 'border-slate-950 bg-slate-950 text-white'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        <Icon size={17} className={active ? 'text-white' : 'text-slate-500'} />
                        <span className="mt-3 block text-xs font-medium leading-4">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-7">
                <label htmlFor="project-description" className="mb-3 flex items-center gap-3 text-xs font-semibold text-slate-700">
                  <span className="flex h-6 w-6 items-center justify-center bg-slate-950 font-mono text-[10px] text-white">02</span>
                  Popis projektu
                </label>
                <textarea
                  id="project-description"
                  value={value}
                  onChange={(e) => updateValue(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') start();
                  }}
                  rows={6}
                  placeholder="Např. městský park, pěší promenáda cca 35 m, vysoká návštěvnost v létě, potřebujeme ochladit odpočinkovou zónu bez vysokotlakého čerpadla."
                  className="w-full resize-none border border-slate-300 bg-white px-4 py-4 text-[15px] leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                />
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
                  <span>Rozměr prostoru</span>
                  <span>Počet návštěvníků</span>
                  <span>Typ provozu</span>
                  <span>Požadovaný efekt</span>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
                <button
                  type="button"
                  onClick={start}
                  disabled={!value.trim() && !selectedType}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Připravit návrh projektu <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={visualize}
                  className="inline-flex min-h-[52px] items-center justify-center border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:bg-slate-50"
                >
                  Vizualizace z fotografie
                </button>
              </div>

              <div className="mt-6 grid gap-2 border-t border-slate-200 pt-5 text-[11px] text-slate-500 sm:grid-cols-3">
                <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-900" /> Doporučení kolekce</span>
                <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-900" /> Orientační sestava</span>
                <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-900" /> Kontrola týmem HolmTec</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
