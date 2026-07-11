import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Phone, Mail, ArrowRight } from 'lucide-react';
import { trackThankYouPageView } from '@/lib/ga4';
import { setSEO } from '@/lib/seo';

const SOURCE_LABELS = {
  poptavka: 'poptávku',
  kontakt: 'poptávku',
  produkt: 'poptávku produktu',
};

export default function Dekujeme() {
  const urlParams = new URLSearchParams(window.location.search);
  const zdroj = urlParams.get('zdroj') || 'kontakt';

  useEffect(() => {
    setSEO({ title: 'Děkujeme za poptávku | Mlžidla.cz', description: 'Vaše poptávka byla úspěšně odeslána.' });
    trackThankYouPageView(zdroj);
  }, [zdroj]);

  return (
    <div className="min-h-screen bg-white pt-28 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full text-center py-16"
      >
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 border border-slate-200">
          <CheckCircle2 size={30} className="text-slate-900" />
        </div>
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Odesláno</p>
        <h1 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-4">
          Děkujeme za vaši {SOURCE_LABELS[zdroj] || 'poptávku'}!
        </h1>
        <p className="text-slate-500 leading-relaxed mb-10">
          Ozveme se vám do 24 hodin s konzultací a nabídkou na míru. V naléhavém případě nám mezitím zavolejte.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <a href="tel:+420774700390"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium hover:border-slate-300 transition-all">
            <Phone size={15} /> +420 774 700 390
          </a>
          <a href="mailto:obchod1@holmtec.cz"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium hover:border-slate-300 transition-all">
            <Mail size={15} /> obchod1@holmtec.cz
          </a>
        </div>

        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-sm font-mono">
          Zpět na web <ArrowRight size={14} />
        </Link>
      </motion.div>
    </div>
  );
}