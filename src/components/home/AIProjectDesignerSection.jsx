import React, { useState } from 'react';
import { ArrowRight, Sparkles, Building2, Trees, School, Dumbbell, House } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const examples = [
  { icon: Building2, label: 'Náměstí', text: 'Náměstí 20 × 30 m, vysoká návštěvnost, chceme atraktivní mlžiště pro děti i dospělé.' },
  { icon: Trees, label: 'Park', text: 'Městský park, klidová zóna podél pěší trasy, trvalá instalace bez čerpadla.' },
  { icon: School, label: 'Škola / školka', text: 'Areál mateřské školy, bezpečné ochlazení dětí v letních měsících, plocha přibližně 120 m².' },
  { icon: Dumbbell, label: 'Sportoviště', text: 'Venkovní sportoviště s vysokou návštěvností, potřebujeme odolné mlžení pro větší počet lidí.' },
  { icon: House, label: 'Rezidenční zahrada', text: 'Rezidenční zahrada u rodinného domu, chceme elegantní mlžení pro terasu a odpočinkovou zónu s důrazem na design a jednoduchou instalaci.' },
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

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white py-20 lg:py-28">
      <div className="absolute inset-0 pointer-events-none opacity-40" style={{background:'radial-gradient(circle at 78% 18%, rgba(13,148,136,.28), transparent 34%), radial-gradient(circle at 18% 82%, rgba(56,189,248,.12), transparent 30%)'}} />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[.82fr_1.18fr] gap-12 lg:gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 mb-6">
              <Sparkles size={14} className="text-teal-300" />
              <span className="font-mono text-[10px] tracking-[.18em] uppercase text-white/70">AI Projektant MLŽIDLA®</span>
            </div>
            <h2 className="font-heading font-light text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.04]">
              Popište prostor.<br/><span className="text-white/55">Navrhneme mlžení.</span>
            </h2>
            <p className="mt-6 text-base lg:text-lg leading-relaxed text-white/60 max-w-xl">
              AI projektant vyhodnotí typ prostoru, velikost a způsob využití. Doporučí vhodnou kolekci, počet prvků a připraví zadání pro přesnou cenovou nabídku.
            </p>
            <p className="mt-5 text-xs text-white/35 max-w-lg leading-relaxed">
              Návrh je orientační. Finální technické řešení vždy ověří náš tým podle přívodu vody, dispozice a požadavků projektu.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/12 bg-white/[.06] backdrop-blur-sm p-4 sm:p-6 lg:p-7 shadow-2xl shadow-black/20">
            <label className="block font-mono text-[10px] tracking-[.16em] uppercase text-white/45 mb-3">Co potřebujete ochladit?</label>
            <textarea
              value={value}
              onChange={(e) => updateValue(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') start();
              }}
              rows={5}
              placeholder="Např. náměstí 20 × 30 m, vysoká návštěvnost, chceme vytvořit atraktivní mlžiště pro děti i dospělé…"
              className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-[15px] leading-relaxed text-white placeholder:text-white/25 focus:outline-none focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/10"
            />
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {examples.map(({icon: Icon, label, text}) => (
                <button key={label} type="button" onClick={() => applyExample(text)} className="group rounded-xl border border-white/10 bg-white/[.04] px-3 py-3 text-left hover:bg-white/[.08] hover:border-white/20 transition-colors">
                  <Icon size={15} className="text-white/45 group-hover:text-teal-300 mb-2" />
                  <span className="block text-xs text-white/65">{label}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={() => start()} disabled={!value.trim()} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 hover:bg-teal-50 disabled:opacity-35 disabled:cursor-not-allowed transition-colors">
                Navrhnout řešení pomocí AI <ArrowRight size={16}/>
              </button>
              <button type="button" onClick={() => navigate(`/ai-vizualizace${value.trim() ? `?zadani=${encodeURIComponent(value.trim())}` : ''}`)} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[.04] px-6 py-3.5 text-sm font-semibold text-white/80 hover:bg-white/[.08] transition-colors">
                Vizualizovat z fotografie
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
