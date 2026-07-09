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
    <div className="min-h-screen bg-ink pt-28 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full text-center py-16"
      >
        <div className="w-16 h-16 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-6 border border-cyan/20">
          <CheckCircle2 size={30} className="text-cyan" />
        </div>
        <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Odesláno</p>
        <h1 className="font-heading font-black text-3xl lg:text-4xl text-white tracking-tight mb-4">
          Děkujeme za vaši {SOURCE_LABELS[zdroj] || 'poptávku'}!
        </h1>
        <p className="text-white/50 leading-relaxed mb-10">
          Ozveme se vám do 24 hodin s konzultací a nabídkou na míru. V naléhavém případě nám mezitím zavolejte.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <a href="tel:+420774700390"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-card_bg border border-white/10 text-white text-sm font-medium hover:border-cyan/30 transition-all">
            <Phone size={15} /> +420 774 700 390
          </a>
          <a href="mailto:obchod1@holmtec.cz"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-card_bg border border-white/10 text-white text-sm font-medium hover:border-cyan/30 transition-all">
            <Mail size={15} /> obchod1@holmtec.cz
          </a>
        </div>

        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-cyan transition-colors text-sm font-mono">
          Zpět na web <ArrowRight size={14} />
        </Link>
      </motion.div>
    </div>
  );
}