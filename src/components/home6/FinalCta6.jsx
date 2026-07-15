import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function FinalCta6() {
  return (
    <section className="bg-black py-24 px-6 lg:px-16 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-heading font-light text-white tracking-tight mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>
          Připraveni proměnit horké dny v chlad?
        </h2>
        <p className="text-white/50 mb-8">Konzultace zdarma, 3D vizualizace do 48 h, montáž na klíč.</p>
        <Link to="/poptavka" className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-full transition-colors">
          Nezávazná poptávka <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}