import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ArrowRight } from 'lucide-react';

export default function ArticleQuickLinks() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 my-8">
      <Link to="/kalkulacka"
        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white/70 hover:text-white hover:border-cyan/30 transition-all">
        <Calculator size={15} /> Spočítat úsporu s kalkulačkou
      </Link>
      <Link to="/poptavka"
        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-cyan/10 border border-cyan/25 text-sm text-cyan hover:bg-cyan/15 transition-all">
        Nezávazná poptávka <ArrowRight size={14} />
      </Link>
    </div>);

}