import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Phone, Mail, MapPin, ArrowRight, Package, FileText, Box, Layers, Tag } from 'lucide-react';
import { trackCooperationFormSubmit, trackInquirySubmitted } from '@/lib/ga4';
import { Flame } from 'lucide-react';
import { setSEO, SEO_PAGES, GOOGLE_MAPS_URL, GOOGLE_MAPS_EMBED_URL } from '@/lib/seo';

const contactInfo = [
{ icon: Phone, label: 'Telefon', value: '+420 774 700 390', href: 'tel:+420774700390' },
{ icon: Mail, label: 'Email', value: 'obchod1@holmtec.cz', href: 'mailto:obchod1@holmtec.cz' },
{ icon: MapPin, label: 'Adresa', value: '541 02 Trutnov, Horní staré město 698, Česká republika', href: null }];


const REQUEST_TYPES = [
{ value: 'product_price', label: 'Cena produktu', icon: Package, desc: 'Jednotná cena vybraného mlžítka' },
{ value: 'volume_price', label: 'Množstevní nabídka', icon: Tag, desc: 'Kombinace mlžítek, množstevní sleva' },
{ value: 'cooperation', label: 'Projektová spolupráce', icon: Layers, desc: 'Návrh, realizace, servis projektu' },
{ value: 'documentation', label: 'Projektová dokumentace', icon: FileText, desc: 'Technické výkresy, certifikáty, podklady' },
{ value: '3d_model', label: '3D vizualizace & render', icon: Box, desc: 'Modely mlžítek a mlžných produktu pro architektonické rendery' }];


const PRODUCTS = [
'Mlžítko na mířu', 'Mlžiště - chladící zóna','Mlžítko - OSTEV', 'Mlžítko - MRAK', 'Mlžítko - AURA', 'Mlžítko - SPIRÁLA', 'Mlžná brána GATE70', 'Mlžítko - BENDY',
'Mlžná brána - LINEA EL70', 'Mlžítko - Y-ARMIST TR60', 'Mlžítko - Y-ARMIST J70', 'Mlžítko - Linea'];


export default function Kontakt() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    request_type: '', product_interest: '', qty: '', message: ''
  });
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSEO(SEO_PAGES.kontakt);
    const params = new URLSearchParams(window.location.search);
    const produkt = params.get('produkt');
    if (produkt) {
      setForm((f) => ({ ...f, product_interest: produkt, request_type: 'product_price' }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const reqLabel = REQUEST_TYPES.find((r) => r.value === form.request_type)?.label || '';
      const msg = [
      form.request_type ? `[Typ poptávky: ${reqLabel}]` : '',
      form.product_interest ? `[Produkt: ${form.product_interest}]` : '',
      form.qty ? `[Počet/kombinace: ${form.qty}]` : '',
      form.company ? `[Firma: ${form.company}]` : '',
      form.phone ? `[Tel: ${form.phone}]` : '',
      form.message].
      filter(Boolean).join(' ');

      await base44.entities.ContactInquiry.create({
        name: form.name,
        email: form.email,
        message: msg,
        status: 'NEW'
      });
      trackCooperationFormSubmit();
      trackInquirySubmitted(form.request_type, form.product_interest);
      navigate('/dekujeme?zdroj=kontakt');
    } finally {
      setSending(false);
    }
  };

  const inputCls = "w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none transition-all";

  return (
    <div className="min-h-screen bg-ink pt-28">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-4">KONTAKT</p>
          <h1 className="font-heading font-black text-4xl lg:text-6xl text-white tracking-tight mb-3">
            Jak vám<br /><span className="text-cyan">můžeme pomoci?</span>
          </h1>
          <p className="text-white/50 max-w-lg mx-auto">Mlžné prvky, mlžítka, Smart WiFi ovládání, podpora — vše na jednom místě.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-cyan/10 border border-cyan/25 text-cyan text-xs font-mono tracking-wide">
          <Flame size={14} /> Ještě to má cenu — poptávku do konce letošní sezóny stihneme zpracovat včas.
        </motion.div>
        {form.product_interest &&
        <p className="mt-4 text-sm text-white/60">Poptáváte: <span className="text-white font-medium">{form.product_interest}</span></p>
        }
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((item) =>
            <motion.div key={item.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl bg-card_bg border border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center flex-shrink-0 border border-cyan/20">
                  <item.icon size={20} className="text-cyan" />
                </div>
                <div>
                  <p className="text-xs font-mono text-white/40 tracking-widest uppercase mb-1">{item.label}</p>
                  {item.href ?
                <a href={item.href} className="text-white font-medium hover:text-cyan transition-colors">{item.value}</a> :

                <p className="text-white font-medium">{item.value}</p>
                }
                </div>
              </motion.div>
            )}

            {/* Google Maps */}
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <iframe title="Mapa — HolmTec Trutnov" src={GOOGLE_MAPS_EMBED_URL}
                width="100%" height="220" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-card_bg border border-white/10 text-sm text-white/70 hover:text-cyan hover:border-cyan/30 transition-all">
              <MapPin size={14} /> Najdete nás na Google
            </a>

            {/* Info box */}
            <div className="p-5 rounded-2xl bg-cyan/5 border border-cyan/20">
              <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-2">Co nabízíme</p>
              <ul className="space-y-1.5 text-xs text-white/50 leading-relaxed">
                <li>→ Zakázková výroba z nerezu 304 / 316L</li>
                <li>→ Projektová dokumentace na míru</li>
                <li>→ 3D modely pro architektonické rendery</li>
                <li>→ Množstevní slevy při kombinaci mlžítek</li>
                <li>→ Instalace, servis, záruční podpora - Mlžidla.cz</li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-card_bg border border-white/10 space-y-5">

                {/* Kontaktní údaje */}
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" required placeholder="Jméno a příjmení *"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls} />
                  <input type="email" required placeholder="Email *"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="tel" placeholder="Telefon"
                value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputCls} />
                  <input type="text" placeholder="Firma / organizace"
                value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                className={inputCls} />
                </div>

                {/* Typ poptávky */}
                

















              

                {/* Produkt + množství */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-white/40 tracking-widest uppercase block mb-1">Produkt / mlžný systém</label>
                    <input list="products-contact" type="text"
                  placeholder="Vyberte nebo napište produkt"
                  value={form.product_interest} onChange={(e) => setForm({ ...form, product_interest: e.target.value })}
                  className={inputCls} />
                    <datalist id="products-contact">
                      {PRODUCTS.map((p) => <option key={p} value={p} />)}
                    </datalist>
                  </div>
                  







                
                </div>

                {/* Zpráva */}
                <textarea required rows={4} placeholder="Popište váš mlžný projekt nebo dotaz... *"
              value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={inputCls + ' resize-none'} />

                <button type="submit" disabled={sending}
              className="w-full py-4 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan/25">
                  {sending ? 'Odesílám...' : <>Odeslat poptávku <ArrowRight size={16} /></>}
                </button>
              </form>
          </motion.div>
        </div>
      </div>
    </div>);

}