import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HeaderNav() {
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState('mlžení');
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!open || finished) return undefined;
    const first = setTimeout(() => setWord('ochlazování'), 1000);
    const second = setTimeout(() => { setWord('osvěžování'); setFinished(true); }, 4300);
    return () => { clearTimeout(first); clearTimeout(second); };
  }, [open, finished]);

  return <nav className="hidden lg:block flex-1 min-w-0"><ul className="flex items-center gap-0.5 text-[13px] text-white/85 whitespace-nowrap">
    <li className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link to="/jak-funguje-mlzeni" className="inline-flex px-3 py-3 font-medium hover:text-white transition-colors">Jak <span className="ml-1 font-bold text-cyan transition-all duration-300">{word}</span><span className="ml-1">funguje?</span></Link>
      {open && <div className="absolute left-0 top-full w-[450px] p-5 bg-white border border-slate-200 shadow-2xl shadow-slate-950/20 text-slate-900"><Link to="/jak-funguje-mlzeni" className="block group"><h3 className="font-heading text-xl font-medium mb-2">Jak <span className="text-sky-600">{word}</span> funguje? →</h3><p className="text-sm leading-relaxed text-slate-500">Trysky HolmTec pracují s vysokým tlakem 70 barů. Voda se okamžitě atomizuje na příjemnou mikro-mlhu — bez louží.</p></Link><div className="mt-4 pt-4 border-t border-slate-200 flex gap-5"><Link to="/smart-ovladani" className="text-xs font-semibold text-slate-600 hover:text-sky-600">SMART APP řízení</Link><Link to="/prinosy-mlzitek/zabezpeceni-a-shoda" className="text-xs font-semibold text-slate-600 hover:text-sky-600">UV-C filtrace a hygiena</Link></div></div>}
    </li>
    <li><Link to="/katalog" className="inline-flex px-3 py-3 hover:text-white transition-colors">Produkty</Link></li>
    <li><Link to="/vyuziti" className="inline-flex px-3 py-3 hover:text-white transition-colors">Využití <small className="ml-1 text-[9px] text-white/55">B2B</small></Link></li>
    <li><Link to="/reference" className="inline-flex px-3 py-3 hover:text-white transition-colors">Realizace</Link></li>
    <li><Link to="/blog" className="inline-flex px-3 py-3 hover:text-white transition-colors">Novinky</Link></li>
    <li><Link to="/podpora" className="inline-flex items-center px-3 py-3 hover:text-emerald-300 transition-colors"><span className="relative flex w-2.5 h-2.5 mr-2"><span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping"/><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"/></span>Podpora</Link></li>
    <li className="ml-auto"><Link to="/partnerstvi" className="inline-flex px-3 py-3 text-xs text-white/70 hover:text-white">B2B Partnerství</Link></li>
    <li><Link to="/poptavka" className="inline-flex px-3 py-2 border border-sky-400 text-sky-300 font-bold uppercase tracking-wide text-[11px] hover:bg-sky-400/10 transition-colors">Rychlá poptávka</Link></li>
    <li><Link to="/kontakt" className="inline-flex px-3 py-2 bg-sky-500 text-white font-bold uppercase tracking-wide text-[11px] shadow-[0_4px_14px_rgba(14,165,233,.45)] hover:bg-sky-600 transition-colors">Kontakt</Link></li>
  </ul></nav>;
}