import React, { useEffect, useState } from 'react';
import { Calculator, Droplets, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import OperatingCostResults from '@/components/produkt/OperatingCostResults';
import { getNozzleCount, isMistingProduct, WATER_RATE_WITH_SEWER } from '@/lib/operatingCosts';

export default function MlzeniKalkulator() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [nozzles, setNozzles] = useState(1);
  const [seasonDays, setSeasonDays] = useState(120);
  const [loading, setLoading] = useState(true);
  useEffect(() => { base44.entities.Product.list().then((items) => { const physical = (items || []).filter(isMistingProduct).sort((a, b) => a.name.localeCompare(b.name, 'cs')); setProducts(physical); if (physical[0]) { setSelectedId(physical[0].id); setNozzles(getNozzleCount(physical[0])); } }).finally(() => setLoading(false)); }, []);
  const product = products.find((item) => item.id === selectedId);
  const selectProduct = (id) => { const next = products.find((item) => item.id === id); setSelectedId(id); if (next) setNozzles(getNozzleCount(next)); };
  if (loading) return <div className="flex justify-center py-24"><Loader className="animate-spin text-slate-300" /></div>;
  if (!product) return <p className="py-16 text-center text-slate-500">Pro výpočet nejsou dostupné žádné modely mlžítek.</p>;
  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"><div className="flex items-center gap-3 bg-slate-950 px-6 py-5 text-white"><Calculator className="text-cyan" size={22} /><div><p className="font-semibold">Spočítat provozní náklady</p><p className="text-xs text-white/55">4 bar · {WATER_RATE_WITH_SEWER} Kč/m³ včetně stočného</p></div></div><div className="space-y-8 p-6 lg:p-8"><div className="grid gap-5 md:grid-cols-3"><label className="text-sm font-semibold text-slate-800">Model mlžítka<select value={selectedId} onChange={(event) => selectProduct(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 font-normal">{products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="text-sm font-semibold text-slate-800">Počet trysek<input type="number" min="1" max="40" value={nozzles} onChange={(event) => setNozzles(Math.max(1, Number(event.target.value)))} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 font-normal" /></label><label className="text-sm font-semibold text-slate-800">Letní sezóna: {seasonDays} dní<input type="range" min="30" max="150" step="5" value={seasonDays} onChange={(event) => setSeasonDays(Number(event.target.value))} className="mt-4 w-full accent-slate-950" /><span className="mt-1 block text-xs font-normal text-slate-400">{seasonDays} dní · {seasonDays * 8} hodin mlžení</span></label></div><OperatingCostResults nozzles={nozzles} seasonDays={seasonDays} /><Link to={`/poptavka?produkt=${encodeURIComponent(product.name)}&trysky=${nozzles}`} className="btn-metallic-mist px-6 py-3 text-sm font-bold"><Droplets size={15} /> Poptat {product.name} s {nozzles} tryskami</Link></div></div>;
}