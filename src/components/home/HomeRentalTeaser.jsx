import React from 'react';
import { ArrowRight, CalendarDays, Headphones, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomeRentalTeaser() {
  return <section className="border-y border-slate-200 bg-slate-50 py-10">
    <div className="site-container">
      <Link to="/katalog?sekce=pronajem" className="group grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-lg md:grid-cols-[auto_1fr_auto] md:items-center">
        <span className="flex items-center justify-center rounded-full text-cyan w-16 h-16 hidden"></span>
        <div><p className="content-eyebrow mb-2">Pronájem na letní akce</p><h2 className="m-0 font-heading text-2xl font-medium text-slate-950">Mlžné osvěžení pro festivaly, eventy i soukromé oslavy.</h2><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500"><span className="inline-flex items-center gap-2"><Sparkles size={14} /> Jedno mlžítko i celá zóna</span><span className="inline-flex items-center gap-2"><Headphones size={14} /> Technik a podpora na místě</span></div></div>
        <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 text-right">Více o pronájmu</span>
      </Link>
    </div>
  </section>;
}