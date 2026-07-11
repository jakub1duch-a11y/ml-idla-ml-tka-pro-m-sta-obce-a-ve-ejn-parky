import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Loader, ChevronRight, Mail, BookOpen, Wrench, Shield, Info } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO } from '@/lib/seo';
import { Link } from 'react-router-dom';

const STATIC_DOCS = [
  { title: 'Produktový katalog 2026', desc: 'Kompletní přehled všech mlžítek, mlžných bran a mlhovišť HolmTec.', category: 'Katalog', icon: FileText },
  { title: 'Technický list — Mlžítka', desc: 'Rozměry, materiálové provedení, spotřeba vody a tlakové parametry.', category: 'Technický list', icon: FileText },
  { title: 'Technický list — Mlhoviště', desc: 'Parametry systémů PARK a ARENA pro veřejné prostory.', category: 'Technický list', icon: FileText },
  { title: 'Instalační manuál — Zemní vrut', desc: 'Postup kotvení pomocí zemního vrutu, hloubka a specifikace.', category: 'Manuál', icon: Wrench },
  { title: 'Instalační manuál — Betonový základ', desc: 'Postup montáže na betonový základ pro trvalé instalace.', category: 'Manuál', icon: Wrench },
  { title: 'Manuál zazimování', desc: 'Postup přípravy systému na zimní období a ochrany před mrazem.', category: 'Manuál', icon: Shield },
  { title: 'Manuál Smart ovládání (WiFi)', desc: 'Nastavení WiFi modulu, HomeKit a Google Home integrace.', category: 'Smart', icon: BookOpen },
  { title: 'Certifikát AISI 316L', desc: 'Materiálový certifikát pro potravinářský nerez AISI 316L.', category: 'Certifikát', icon: Shield },
];

const CATEGORY_COLORS = {
  'Katalog': 'text-cyan bg-cyan/10 border-cyan/20',
  'Technický list': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'Manuál': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'Smart': 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  'Certifikát': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
};

function downloadBlob(base64, filename) {
  const bytes = atob(base64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  const blob = new Blob([arr], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function Manualy() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [generatingId, setGeneratingId] = useState(null);
  const [filter, setFilter] = useState('vse');

  useEffect(() => {
    setSEO({
      title: 'Instalační manuály a technické listy — Ke stažení',
      description: 'Stáhněte si technické listy, instalační manuály, produktové PDF a certifikáty mlžných systémů HolmTec. Dokumentace pro architekty, instalatéry i koncové uživatele.',
      keywords: 'instalační manuál mlžítko, technický list mlhoviště PDF, ke stažení HolmTec dokumentace, certifikát mlžné sochy',
      canonicalPath: '/manualy',
    });
    base44.entities.Product.list().then((res) => setProducts(res || [])).finally(() => setLoadingProducts(false));
  }, []);

  const generatePDF = async (product) => {
    setGeneratingId(product.id);
    const response = await base44.functions.invoke('generateProductDatasheet', { product });
    const { pdf_base64, filename } = response.data;
    downloadBlob(pdf_base64, filename);
    setGeneratingId(null);
  };

  const filteredDocs = filter === 'vse' ? STATIC_DOCS : STATIC_DOCS.filter(d => d.category === filter);
  const categories = ['vse', ...new Set(STATIC_DOCS.map(d => d.category))];

  return (
    <div className="min-h-screen bg-ink pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
          <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-3">Dokumentace</p>
          <h1 className="font-heading font-light text-4xl lg:text-6xl text-white tracking-tight mb-4">
            Instalační manuály<br /><span className="text-white/40 font-extralight">a technická dokumentace</span>
          </h1>
          <p className="text-white/50 text-lg font-light max-w-2xl">
            Ke stažení: technické listy, instalační návody, manuály pro Smart ovládání a produktové datasheets generované přímo z databáze produktů.
          </p>
        </motion.div>

        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 mb-10 text-sm text-white/50 font-light">
          <Info size={16} className="text-cyan mt-0.5 shrink-0" />
          Stálé dokumenty jsou dostupné na vyžádání e-mailem. Produktové datasheets lze vygenerovat a stáhnout okamžitě ve formátu PDF.
        </div>

        {/* Static docs */}
        <div className="mb-14">
          <div className="flex items-center gap-3 flex-wrap mb-6">
            <h2 className="font-heading font-light text-xl text-white mr-2">Dokumenty ke stažení</h2>
            {categories.map((c) => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${filter === c ? 'bg-cyan text-ink' : 'text-white/40 border border-white/15 hover:border-white/30'}`}>
                {c === 'vse' ? 'Vše' : c}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {filteredDocs.map((doc, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between gap-4 bg-card_bg border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                    <doc.icon size={18} className="text-white/50" />
                  </div>
                  <div className="min-w-0">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest border mb-1 ${CATEGORY_COLORS[doc.category] || 'text-white/40 bg-white/5 border-white/10'}`}>
                      {doc.category}
                    </span>
                    <h3 className="text-white font-medium text-sm">{doc.title}</h3>
                    <p className="text-white/40 text-xs font-light truncate">{doc.desc}</p>
                  </div>
                </div>
                <a href={`mailto:obchod1@holmtec.cz?subject=Žádost o dokument: ${doc.title}`}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white/5 text-white/60 text-xs rounded-full hover:bg-white/10 hover:text-white transition-all border border-white/10">
                  <Download size={13} /> Vyžádat
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Product datasheets */}
        <div>
          <div className="mb-6">
            <h2 className="font-heading font-light text-xl text-white mb-1">Produktové datasheets (PDF)</h2>
            <p className="text-sm text-white/40 font-light">Generujte profesionální technické listy pro konkrétní produkt přímo z naší databáze.</p>
          </div>

          {loadingProducts ? (
            <div className="flex justify-center py-16"><Loader size={24} className="animate-spin text-cyan/40" /></div>
          ) : products.length === 0 ? (
            <p className="text-white/30 text-sm font-mono text-center py-10">Produkty se načítají…</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((product) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="flex items-center gap-4 bg-card_bg border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all">
                  {product.image_url && (
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{product.name}</p>
                    {product.short_description && (
                      <p className="text-white/40 text-xs font-light truncate">{product.short_description}</p>
                    )}
                  </div>
                  <button onClick={() => generatePDF(product)} disabled={generatingId === product.id}
                    className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-cyan/10 border border-cyan/25 text-cyan text-xs font-mono rounded-full hover:bg-cyan/15 transition-all disabled:opacity-50">
                    {generatingId === product.id ? (
                      <><Loader size={12} className="animate-spin" /> Generuji…</>
                    ) : (
                      <><Download size={12} /> PDF</>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Contact for custom docs */}
        <div className="mt-14 p-7 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="text-sm font-medium text-white mb-1">Potřebujete projektovou dokumentaci na míru?</p>
            <p className="text-xs text-white/40 font-light">Výkresy DWG, 3D modely, certifikáty, BIM podklady — připravíme dle vaší specifikace.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link to="/partnerstvi" className="flex items-center gap-2 px-5 py-2.5 bg-white/8 border border-white/15 text-white text-sm rounded-full hover:bg-white/12 transition-all">
              Partnerství <ChevronRight size={14} />
            </Link>
            <a href="mailto:obchod1@holmtec.cz" className="flex items-center gap-2 px-5 py-2.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all">
              <Mail size={14} /> E-mail
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}