import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Loader, ChevronRight, Mail, BookOpen, Wrench, Shield, Info } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO } from '@/lib/seo';
import { Link } from 'react-router-dom';
import MistVideoShowcase from '@/components/common/MistVideoShowcase';

const STATIC_DOCS = [
  { title: 'Produktový katalog 2026', desc: 'Kompletní přehled všech mlžítek, mlžných bran a mlhovišť HolmTec.', category: 'Katalog', icon: FileText, url: null },
  { title: 'Přípravné práce pro instalaci mlžítka', desc: 'Stavební příprava, výkopy, betonáž, rozvod vody a elektroinstalace pro chytrý ventil.', category: 'Instalace', icon: Wrench, url: null },
  { title: 'Detaily ocelového mlžítka', desc: 'Technické výkresy pat, průřezy a šachta nášlapného ventilu pro konkrétní projekt.', category: 'Výkres', icon: FileText, url: null },
  { title: 'Manuál údržby mlžící trysky typ M', desc: 'Servisní postup demontáže a čištění trysky připravíme podle použité konfigurace.', category: 'Manuál', icon: Wrench, url: null },
  { title: 'Chytré ovládání — produktový prospekt', desc: 'Funkce Smart App, Supla Cloud, senzory, automatizace a plánování cyklů mlžení.', category: 'Smart', icon: BookOpen, url: null },
  { title: 'Technický list — Mlžítka', desc: 'Rozměry, materiálové provedení, spotřeba vody a tlakové parametry.', category: 'Technický list', icon: FileText, url: null },
  { title: 'Manuál zazimování', desc: 'Postup přípravy systému na zimní období a ochrany před mrazem.', category: 'Manuál', icon: Shield, url: null },
  { title: 'Certifikát AISI 316L', desc: 'Materiálový certifikát pro potravinářský nerez AISI 316L.', category: 'Certifikát', icon: Shield, url: null },
];

const CATEGORY_COLORS = {
  'Katalog': 'text-slate-600 bg-slate-100 border-slate-200',
  'Technický list': 'text-blue-600 bg-blue-50 border-blue-200',
  'Manuál': 'text-amber-600 bg-amber-50 border-amber-200',
  'Smart': 'text-violet-600 bg-violet-50 border-violet-200',
  'Certifikát': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  'Instalace': 'text-orange-600 bg-orange-50 border-orange-200',
  'Výkres': 'text-sky-600 bg-sky-50 border-sky-200',
};

export default function KeStazeni() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [filter, setFilter] = useState('vse');

  useEffect(() => {
    setSEO({
      title: 'Technické podklady k mlžítkům — dokumentace na vyžádání',
      description: 'Vyžádejte si technické podklady pro mlžítka, chytré mlžné brány, vodní mlhu na veřejná prostranství a rezidenční instalace se SUPLA řízením.',
      keywords: 'technické podklady mlžítka, mlžítka pro města, chytré mlžné brány, vodní mlha na veřejná prostranství, SUPLA ovládání mlžení',
      canonicalPath: '/ke-stazeni',
    });
    base44.entities.Product.list().then((res) => setProducts(res || [])).finally(() => setLoadingProducts(false));
  }, []);

  const filteredDocs = filter === 'vse' ? STATIC_DOCS : STATIC_DOCS.filter(d => d.category === filter);
  const categories = ['vse', ...new Set(STATIC_DOCS.map(d => d.category))];

  return (
    <div className="min-h-screen bg-white pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
          <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-3">Dokumentace</p>
          <h1 className="font-heading font-light text-4xl lg:text-6xl text-slate-900 tracking-tight mb-4">
Technické podklady<br /><span className="text-slate-400 font-extralight">na vyžádání podle projektu</span>
          </h1>
          <p className="text-slate-500 text-lg font-light max-w-2xl">
Podklady pro mlžítka, chytré mlžné brány, vodní mlhu na veřejná prostranství a SUPLA řízení připravujeme podle konkrétního produktu, místa instalace a účelu použití.
          </p>
        </motion.div>

        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-10 text-sm text-slate-500 font-light">
          <Info size={16} className="text-slate-400 mt-0.5 shrink-0" />
          Projektové dokumenty, technické výkresy, ceníky a interní podklady neposkytujeme jako veřejně indexovatelné soubory. Pošleme je na vyžádání podle konkrétního produktu a účelu použití.
        </div>

        {/* Static docs */}
        <div className="mb-14">
          <div className="flex items-center gap-3 flex-wrap mb-6">
            <h2 className="font-heading font-light text-xl text-slate-900 mr-2">Dostupné typy podkladů</h2>
            {categories.map((c) => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${filter === c ? 'bg-slate-900 text-white' : 'text-slate-500 border border-slate-200 hover:border-slate-300'}`}>
                {c === 'vse' ? 'Vše' : c}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {filteredDocs.map((doc, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-sm transition-all group">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-200">
                    <doc.icon size={18} className="text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest border mb-1 ${CATEGORY_COLORS[doc.category] || 'text-slate-400 bg-slate-50 border-slate-200'}`}>
                      {doc.category}
                    </span>
                    <h3 className="text-slate-900 font-medium text-sm">{doc.title}</h3>
                    <p className="text-slate-400 text-xs font-light truncate">{doc.desc}</p>
                  </div>
                </div>
                {doc.url ? (
                  <a href={doc.url} target="_blank" rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs rounded-full hover:bg-slate-800 transition-all">
                    <Download size={13} /> Stáhnout
                  </a>
                ) : (
                  <a href={`mailto:obchod1@holmtec.cz?subject=Žádost o dokument: ${doc.title}`}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 text-xs rounded-full hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-200">
                    <Download size={13} /> Vyžádat
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Product datasheets */}
        <div>
          <div className="mb-6">
            <h2 className="font-heading font-light text-xl text-slate-900 mb-1">Produktové podklady na vyžádání</h2>
            <p className="text-sm text-slate-400 font-light">Produktové datasheets a cenové podklady připravujeme na vyžádání, aby se nezveřejňovaly neaktuální ceny ani interní technické dokumenty.</p>
          </div>

          {loadingProducts ? (
            <div className="flex justify-center py-16"><Loader size={24} className="animate-spin text-slate-300" /></div>
          ) : products.length === 0 ? (
            <p className="text-slate-400 text-sm font-mono text-center py-10">Produkty se načítají…</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((product) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 hover:border-slate-300 hover:shadow-sm transition-all">
                  {product.image_url && (
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 font-medium text-sm truncate">{product.name}</p>
                    {product.short_description && (
                      <p className="text-slate-400 text-xs font-light truncate">{product.short_description}</p>
                    )}
                  </div>
                  <a href={`mailto:obchod1@holmtec.cz?subject=${encodeURIComponent(`Žádost o produktový datasheet — ${product.name}`)}`}
                    className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono rounded-full hover:bg-slate-100 transition-all">
                    <Download size={12} /> Vyžádat
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Contact for custom docs */}
        <div className="mt-14 p-7 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="text-sm font-medium text-slate-900 mb-1">Potřebujete projektovou dokumentaci na míru?</p>
            <p className="text-xs text-slate-400 font-light">Výkresy DWG, 3D modely, certifikáty, BIM podklady — připravíme dle vaší specifikace.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link to="/partnerstvi" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-full hover:bg-slate-100 transition-all">
              Partnerství <ChevronRight size={14} />
            </Link>
            <a href="mailto:obchod1@holmtec.cz" className="btn-metallic-mist px-5 py-2.5 text-sm font-bold">
              <Mail size={14} /> E-mail
            </a>
          </div>
        </div>
      </div>
      <MistVideoShowcase />
    </div>
  );
}