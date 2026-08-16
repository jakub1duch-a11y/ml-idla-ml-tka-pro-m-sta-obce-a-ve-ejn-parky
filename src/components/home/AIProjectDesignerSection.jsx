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
  Shapes,
  Landmark,
  HeartPulse,
  Sparkles,
  Flower2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const examples = [
  { icon: Building2, label: 'Náměstí', text: 'Náměstí 20 × 30 m, vysoká návštěvnost, chceme atraktivní mlžiště pro děti i dospělé.' },
  { icon: Trees, label: 'Park', text: 'Městský park, klidová zóna podél pěší trasy, trvalá nízkotlaká instalace bez vysokotlakého čerpadla.' },
  { icon: Landmark, label: 'Promenáda', text: 'Pěší promenáda nebo nábřeží, průchozí ochlazovací zóna s více prvky v pravidelném rytmu.' },
  { icon: Flower2, label: 'Záhony / chodník', text: 'Okraj pěší trasy, náměstí nebo parku se záhony; nízké designové mlžné zábradlí přibližně 0,9–1,05 m.' },
  { icon: School, label: 'Škola / školka', text: 'Areál mateřské školy, bezpečné ochlazení dětí v letních měsících, plocha přibližně 120 m².' },
  { icon: HeartPulse, label: 'Domov seniorů', text: 'Pobytová zahrada nebo terasa zařízení pro seniory, klidné ochlazení u sezení a pěších tras.' },
  { icon: Dumbbell, label: 'Sportoviště', text: 'Venkovní sportoviště s vysokou návštěvností, potřebujeme odolné mlžení pro větší počet lidí.' },
  { icon: House, label: 'Rezidence', text: 'Rezidenční zahrada nebo společná odpočinková zóna, elegantní mlžení s důrazem na čistou architekturu.' },
];

const outputs = [
  { icon: Ruler, title: 'Návrh rozsahu', text: 'Doporučená velikost a počet prvků podle prostoru.' },
  { icon: Droplets, title: 'Tvar nebo produkt', text: 'Výchozí směr od vlastního symbolu po existující kolekci.' },
  { icon: FileCheck2, title: 'Podklad pro nabídku', text: 'Strukturované zadání pro technické ověření a nacenění.' },
];

const shapeOptions = [
  { key: 'koruna', label: 'Koruna', type: 'canopy', note: 'oblý strom' },
  { key: 'cypres', label: 'Cypřiš', type: 'cypress', note: 'vysoká smyčka' },
  { key: 'vetev', label: 'Větev', type: 'branch', note: 'větvený strom' },
  { key: 'list', label: 'List', type: 'leaf', note: 'jedna smyčka' },
  { key: 'dvojlist', label: 'Dvojlist', type: 'doubleLeaf', note: '2 listy' },
  { key: 'spirala', label: 'Spirála', type: 'spiral', note: 'plynulý ohyb' },
  { key: 'kruh', label: 'Kruh', type: 'ring', note: 'čistý symbol' },
  { key: 'mrak', label: 'Mrak', type: 'cloud', note: 'měkký obrys' },
  { key: 'kvet', label: 'Květ', type: 'flower', note: '3 okruhy' },
  { key: 'srdce', label: 'Srdce', type: 'heart', note: 'uzavřený motiv' },
  { key: 'vlna', label: 'Vlna', type: 'wave', note: '1 linie' },
  { key: 'ramecek', label: 'Rám', type: 'frame', note: 'oblý čtverec' },
  { key: 'zabradli', label: 'Zábradlí', type: 'railing', note: 'nízká linie' },
];

function BendableShapeIcon({ type, className = '' }) {
  const common = /** @type {React.SVGProps<SVGPathElement>} */ ({
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 3.2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    vectorEffect: 'non-scaling-stroke',
  });

  const paths = {
    canopy: <><path {...common} d="M32 55V34"/><path {...common} d="M32 36c-10 0-16-6-16-14 0-7 5-12 12-12 2-6 7-9 13-9 8 0 14 6 14 14 6 1 10 6 10 12 0 7-6 12-14 12H32"/></>,
    cypress: <><path {...common} d="M32 57V48"/><path {...common} d="M32 48c-10 0-16-10-16-22C16 13 23 4 32 4s16 9 16 22c0 12-6 22-16 22Z"/></>,
    branch: <><path {...common} d="M32 58V16"/><path {...common} d="M32 28 20 17"/><path {...common} d="M32 22 43 11"/><path {...common} d="M32 38 17 29"/><path {...common} d="M32 34 47 25"/></>,
    leaf: <><path {...common} d="M32 58V42"/><path {...common} d="M32 43C15 39 12 21 30 8c17 7 24 24 2 35Z"/><path {...common} d="M32 42 41 24"/></>,
    doubleLeaf: <><path {...common} d="M32 58V31"/><path {...common} d="M32 35C20 34 14 27 15 17c11-1 19 4 20 15"/><path {...common} d="M32 30c2-12 10-18 21-17 1 11-6 19-19 20"/></>,
    spiral: <><path {...common} d="M32 58V45"/><path {...common} d="M32 45c-13-3-19-12-17-23 2-11 13-18 25-15 11 2 18 12 16 22-2 9-10 14-18 12-7-1-11-7-10-13 1-5 6-8 11-7 4 1 7 5 6 9"/></>,
    ring: <><path {...common} d="M32 58V45"/><circle {...common} cx="32" cy="25" r="18"/></>,
    cloud: <><path {...common} d="M32 58V43"/><path {...common} d="M17 42c-7 0-12-5-12-12 0-6 4-11 10-12 2-8 8-13 16-13 9 0 16 7 17 16 6 1 11 6 11 12 0 7-6 12-13 12H17Z"/></>,
    flower: <><path {...common} d="M32 58V35"/><circle {...common} cx="32" cy="20" r="9"/><circle {...common} cx="18" cy="29" r="8"/><circle {...common} cx="46" cy="29" r="8"/></>,
    heart: <><path {...common} d="M32 58V43"/><path {...common} d="M32 42 14 25C4 15 10 5 19 6c6 0 10 4 13 9 3-5 7-9 13-9 9-1 15 9 5 19L32 42Z"/></>,
    wave: <path {...common} d="M30 58c-8-9-7-18 2-26 10-9 10-18 1-28"/>,
    frame: <><path {...common} d="M32 58V44"/><path {...common} d="M18 44V18c0-7 5-12 12-12h4c7 0 12 5 12 12v26H18Z"/></>,
    railing: <><path {...common} d="M8 48V27c0-4 3-7 7-7h34c4 0 7 3 7 7v21"/><path {...common} d="M8 30h48"/></>,
  };

  return <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>{paths[type]}</svg>;
}

const productOptions = [
  {
    key: 'product-bendy',
    label: 'BENDY®',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/b94c771e1_a982a794f_mlzitkosteblo.jpg',
  },
  {
    key: 'product-aura',
    label: 'AURA®',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.jpg',
  },
  {
    key: 'product-gate',
    label: 'GATE',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f47023cbe_MlnbrnaGATE70V.png',
  },
  {
    key: 'product-y-armist',
    label: 'Y-ARMIST',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/080a7e429_MlzitkoY-ARMISTTR60_2.png',
  },
  {
    key: 'product-ostrev',
    label: 'OSTREV',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/84af07a7b_0d4b710a-7605-463b-835a-71e89991f12d.jpg',
  },
  {
    key: 'product-linea',
    label: 'LINEA',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ca9abbd12_08a91a06-3433-4e35-b4b2-f0e8e464f473.jpg',
  },
];

const shapeVariants = [
  { key: 'solo', label: 'Solo', note: '1 prvek · nejjednodušší' },
  { key: 'duo', label: 'Duo', note: '2 prvky vedle sebe' },
  { key: 'gate', label: 'Brána', note: 'průchozí dvojice' },
];

const POLNA_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6a220ebf9_Reference-mstoPolna03.png';

export default function AIProjectDesignerSection() {
  const navigate = useNavigate();
  const [value, setValue] = useState(() => sessionStorage.getItem('mlzidla-ai-zadani') || '');
  const [selectedType, setSelectedType] = useState(() => sessionStorage.getItem('mlzidla-ai-typ') || '');
  const [selectedConcept, setSelectedConcept] = useState(() => sessionStorage.getItem('mlzidla-project-concept') || '');
  const [selectedVariant, setSelectedVariant] = useState(() => sessionStorage.getItem('mlzidla-project-variant') || 'solo');
  const [customShape, setCustomShape] = useState(() => sessionStorage.getItem('mlzidla-project-custom-shape') || '');

  const updateValue = (nextValue) => {
    setValue(nextValue);
    sessionStorage.setItem('mlzidla-ai-zadani', nextValue);
  };

  const selectType = (label) => {
    setSelectedType(label);
    sessionStorage.setItem('mlzidla-ai-typ', label);
  };

  const selectConcept = (key) => {
    setSelectedConcept(key);
    sessionStorage.setItem('mlzidla-project-concept', key);
    if (shapeOptions.some((item) => item.key === key)) {
      setSelectedVariant('solo');
      sessionStorage.setItem('mlzidla-project-variant', 'solo');
    }
  };

  const selectVariant = (key) => {
    setSelectedVariant(key);
    sessionStorage.setItem('mlzidla-project-variant', key);
  }; 

  const updateCustomShape = (nextValue) => {
    const limited = nextValue.trimStart().split(/\s+/).slice(0, 2).join(' ');
    setCustomShape(limited);
    setSelectedConcept('custom');
    sessionStorage.setItem('mlzidla-project-custom-shape', limited);
    sessionStorage.setItem('mlzidla-project-concept', 'custom');
  };

  const conceptLabel = () => {
    if (selectedConcept === 'custom') return customShape.trim() ? `Vlastní motiv: ${customShape.trim()}` : 'Vlastní motiv';
    const shape = shapeOptions.find((item) => item.key === selectedConcept);
    if (shape) {
      const variant = shapeVariants.find((item) => item.key === selectedVariant) || shapeVariants[0];
      return `Symbol: ${shape.label} · varianta ${variant.label}`;
    }
    const product = productOptions.find((item) => item.key === selectedConcept);
    if (product) return `Produkt: ${product.label}`;
    return '';
  };

  const start = () => {
    const zadani = value.trim();
    if (!zadani && !selectedType && !selectedConcept) return;
    const params = new URLSearchParams();
    if (zadani) params.set('zadani', zadani);
    if (selectedType) params.set('typ', selectedType);
    if (conceptLabel()) params.set('tvar', conceptLabel());
    params.set('profil', 'nerezová trubka: umíme ohýbat vnější průměr až Ø 74 mm; vždy zvol nejjednodušší reálně vyrobitelnou geometrii; bez viditelného spodního kroužku nebo límce; kotevní patka má být skrytá pod úrovní dlažby nebo terénu; větvení řešit výrobně vhodnými napojeními');
    navigate(`/poradce?${params.toString()}`);
  };

  const visualize = () => {
    const params = new URLSearchParams();
    if (value.trim()) params.set('zadani', value.trim());
    if (selectedType) params.set('typ', selectedType);
    if (conceptLabel()) params.set('tvar', conceptLabel());
    params.set('profil', 'nerezová trubka: maximální ohýbaný vnější průměr Ø 74 mm; použij nejjednodušší výrobně uvěřitelnou variantu; bez viditelného spodního kroužku nebo límce; kotevní patka skrytá pod úrovní dlažby nebo terénu; zachovej realistickou tloušťku trubky a výrobně možné oblouky');
    navigate(`/ai-vizualizace${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="border-y border-slate-200 bg-[#f5f6f3] py-16 text-slate-950 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 sm:gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-20">
          <div className="lg:sticky lg:top-28">
            <div className="mb-6 inline-flex items-center gap-2 border border-slate-300 bg-white px-3 py-1.5">
              <ShieldCheck size={14} className="text-slate-700" />
              <span className="font-mono text-[10px] uppercase tracking-[.18em] text-slate-600">Projektová podpora MLŽIDLA®</span>
            </div>

            <h2 className="max-w-2xl font-heading text-[clamp(2rem,9vw,2.7rem)] font-medium leading-[1.04] tracking-[-.035em] text-slate-950 sm:text-5xl lg:text-6xl">
              Od místa nebo symbolu
              <span className="mt-1 block text-slate-500">k reálně vyrobitelnému mlžítku.</span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 lg:text-lg lg:leading-8">
              Vyberte prostor, jednoduchý motiv nebo některý z našich produktů. Můžete také zadat vlastní symbol — například znak obce, rostlinu nebo lokální motiv. Návrh následně technicky ověříme pro skutečnou výrobu.
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

            <div className="mt-8 overflow-hidden border border-slate-200 bg-white">
              <div className="grid sm:grid-cols-[150px_1fr]">
                <div className="relative min-h-[130px] bg-slate-100">
                  <img src={POLNA_IMAGE} alt="Zakázkové mlžítko MRKEV pro město Polná" className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <p className="font-mono text-[9px] uppercase tracking-[.16em] text-slate-500">Příklad zakázkového motivu</p>
                  <h3 className="mt-2 text-base font-semibold text-slate-950">MRKEV · město Polná</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500">Lokální symbol jsme převedli do nerezového mlžítka. Stejný princip může začít stromem, listem, srdcem nebo vaším vlastním motivem.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 border-l-2 border-slate-900 pl-4">
              <ShieldCheck size={17} className="mt-0.5 shrink-0 text-slate-700" />
              <p className="max-w-lg text-xs leading-5 text-slate-500">
                Motiv není libovolná tenká grafická ikona. Převádíme jej do skutečné výrobní geometrie z nerezové trubky. Umíme ohýbat trubky až do vnějšího průměru Ø 74 mm. Konkrétní minimální rádius ohybu, napojení větví, stabilitu, trysky a kotvení vždy potvrzuje technický návrh HolmTec.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,.08)] sm:rounded-[2rem]">
            <div className="border-b border-slate-200 px-4 py-5 sm:px-7 lg:px-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[.16em] text-slate-500">Návrh projektu</p>
                  <h3 className="mt-1 font-heading text-2xl font-medium tracking-tight text-slate-950 sm:text-3xl">Vyberte směr návrhu</h3>
                </div>
                <p className="text-xs text-slate-400">Stačí přibližné zadání.</p>
              </div>
            </div>

            <div className="p-4 sm:p-7 lg:p-8">
              <fieldset>
                <legend className="mb-3 flex items-center gap-3 text-xs font-semibold text-slate-700">
                  <span className="flex h-6 w-6 items-center justify-center bg-slate-950 font-mono text-[10px] text-white">01</span>
                  Kde bude mlžítko
                </legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
                  {examples.map(({ icon: Icon, label }) => {
                    const active = selectedType === label;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => selectType(label)}
                        aria-pressed={active}
                        className={`min-h-[82px] rounded-xl border px-3 py-3 text-left transition-colors sm:min-h-[86px] ${
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

              <fieldset className="mt-8">
                <legend className="mb-2 flex items-center gap-3 text-xs font-semibold text-slate-700">
                  <span className="flex h-6 w-6 items-center justify-center bg-slate-950 font-mono text-[10px] text-white">02</span>
                  Jak má návrh začít
                </legend>
                <p className="mb-5 max-w-2xl text-xs leading-5 text-slate-500">Máte tři možnosti: zvolit jednoduchý symbol, vyjít z našeho hotového produktu, nebo napsat vlastní motiv.</p>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 sm:p-5">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">A · Přednastavené symboly</p>
                      <p className="mt-1 text-[11px] leading-4 text-slate-500">Originální směry navržené jako reálně ohýbatelné trubkové geometrie — ne jako běžné UI ikony.</p>
                    </div>
                    <Sparkles size={17} className="shrink-0 text-slate-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {shapeOptions.map(({ key, label, type, note }) => {
                      const active = selectedConcept === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => selectConcept(key)}
                          aria-pressed={active}
                          className={`flex min-h-[96px] flex-col items-center justify-center rounded-xl border px-2 py-3 text-center transition sm:min-h-[104px] ${active ? 'border-slate-950 bg-slate-950 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50'}`}
                        >
                          <BendableShapeIcon type={type} className="h-11 w-11" />
                          <span className="mt-2 text-[11px] font-semibold">{label}</span>
                          <span className={`mt-0.5 text-[9px] ${active ? 'text-white/60' : 'text-slate-400'}`}>{note}</span>
                        </button>
                      );
                    })}
                  </div>
                  {shapeOptions.some((item) => item.key === selectedConcept) && (
                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-800">Možná varianta symbolu</p>
                          <p className="mt-1 text-[10px] leading-4 text-slate-500">Výchozí je vždy nejjednodušší Solo. Další varianty jen skládají stejnou jednoduchou geometrii.</p>
                        </div>
                        <span className="font-mono text-[9px] uppercase tracking-[.12em] text-slate-400">skryté kotvení</span>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {shapeVariants.map((variant) => {
                          const active = selectedVariant === variant.key;
                          return (
                            <button key={variant.key} type="button" onClick={() => selectVariant(variant.key)} aria-pressed={active} className={`rounded-xl border px-3 py-3 text-left transition ${active ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50'}`}>
                              <span className="block text-xs font-semibold">{variant.label}</span>
                              <span className={`mt-1 block text-[9px] leading-4 ${active ? 'text-white/60' : 'text-slate-400'}`}>{variant.note}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 sm:p-5">
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-slate-900">B · Naše produkty</p>
                    <p className="mt-1 text-[11px] leading-4 text-slate-500">Vyberte známou geometrii a projektant ji přizpůsobí měřítku a využití prostoru.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {productOptions.map((item) => {
                      const active = selectedConcept === item.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => selectConcept(item.key)}
                          aria-pressed={active}
                          className={`group overflow-hidden rounded-xl border bg-white text-left transition ${active ? 'border-slate-950 ring-1 ring-slate-950' : 'border-slate-200 hover:border-slate-400 hover:shadow-sm'}`}
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                            <img src={item.image} alt={item.label} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                            <span className="absolute left-2 top-2 bg-white/90 px-2 py-1 font-mono text-[8px] uppercase tracking-[.12em] text-slate-700 backdrop-blur">MLŽIDLA®</span>
                          </div>
                          <div className={`px-3 py-2.5 text-xs font-semibold ${active ? 'bg-slate-950 text-white' : 'text-slate-800'}`}>{item.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={`mt-4 rounded-2xl border p-4 sm:p-5 ${selectedConcept === 'custom' ? 'border-slate-950 bg-slate-50 ring-1 ring-slate-950' : 'border-slate-200 bg-white'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center ${selectedConcept === 'custom' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <Shapes size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <label htmlFor="custom-shape" className="text-sm font-semibold text-slate-900">C · Vlastní symbol nebo tvar</label>
                      <p className="mt-1 text-[11px] leading-4 text-slate-500">Napište maximálně 1–2 slova. Např. Mrkev, Dubový list, Hvězda, Ryba.</p>
                      <input
                        id="custom-shape"
                        value={customShape}
                        onFocus={() => selectConcept('custom')}
                        onChange={(e) => updateCustomShape(e.target.value)}
                        placeholder="Zadejte motiv…"
                        className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                      />
                      <p className="mt-2 text-[11px] leading-5 text-slate-500">Projektant motiv nejprve zjednoduší na jednu nebo několik plynulých trubkových linií. Ostré zlomy a nereálné křížení se převedou na oblouky nebo výrobní spoje; maximální ohýbaný vnější průměr trubky je Ø 74 mm.</p>
                    </div>
                  </div>
                </div>
              </fieldset>

              <div className="mt-8">
                <label htmlFor="project-description" className="mb-3 flex items-center gap-3 text-xs font-semibold text-slate-700">
                  <span className="flex h-6 w-6 items-center justify-center bg-slate-950 font-mono text-[10px] text-white">03</span>
                  Doplňte projekt
                </label>
                <textarea
                  id="project-description"
                  value={value}
                  onChange={(e) => updateValue(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') start();
                  }}
                  rows={5}
                  placeholder="Např. promenáda u náměstí, délka cca 35 m, horké odpoledne, hodně pěších, chceme vytvořit dvě klidové ochlazovací zóny u laviček."
                  className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-4 text-[15px] leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                />
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
                  <span>Rozměr prostoru</span>
                  <span>Počet návštěvníků</span>
                  <span>Sezení / pěší trasa</span>
                  <span>Požadovaný efekt</span>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
                <button
                  type="button"
                  onClick={start}
                  disabled={!value.trim() && !selectedType && !selectedConcept}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Připravit návrh projektu <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={visualize}
                  className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:bg-slate-50"
                >
                  Vyzkoušet ve fotografii
                </button>
              </div>

              <div className="mt-6 grid gap-2 border-t border-slate-200 pt-5 text-[11px] text-slate-500 sm:grid-cols-3">
                <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-900" /> Motiv nebo produkt</span>
                <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-900" /> Reálné výrobní proporce</span>
                <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-900" /> Kontrola týmem HolmTec</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
