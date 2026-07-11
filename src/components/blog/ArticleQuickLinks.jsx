import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ArrowRight } from 'lucide-react';

export default function ArticleQuickLinks() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 my-8">
      <Link to="/kalkulacka"
        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all">
        <Calculator size={15} /> Spočítat úsporu s kalkulačkou
      </Link>
      <Link to="/poptavka" className="flex-1 btn-metallic-mist py-3.5 justify-center text-sm font-bold">
        Nezávazná poptávka <ArrowRight size={14} />
      </Link>
    </div>);

}