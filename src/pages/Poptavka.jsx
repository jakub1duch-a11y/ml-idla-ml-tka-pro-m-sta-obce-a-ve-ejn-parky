import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader, Phone, Mail, MapPin, Info, Paperclip, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackContactFormSubmit, trackInquirySubmitted } from '@/lib/ga4';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import { playSoundEffect } from '@/lib/soundEffects';

const OVLADANI_OPTIONS = [
  { value: '', label: 'Vyberte ovládání...', hint: '' },
  { value: 'wifi_smart_app', label: 'Wi-Fi Smart APP', hint: 'Ovládání a plánování mlžení z mobilní aplikace, senzory teploty a vlhkosti.' },
  { value: 'manualni_ventil', label: 'Manuální ventil', hint: 'Zapínání a vypínání přímo na ventilu, bez elektroniky.' },
  { value: 'casovy_spinac', label: 'Časový spínač', hint: 'Automatické spínání dle nastaveného denního plánu.' },
  { value: 'doporucit', label: 'Doporučit vhodné ovládání', hint: 'Necháte výběr na nás — do cenové nabídky navrhneme optimální řízení mlžítka dle vašeho projektu.' },
];

const PRODUKTY = [
  'OSTEV (mlžný strom)',
  'MRAK',
  'AURA (kruh)',
  'VOLAVKA',
  'KIDS (hřiště)',
  'GATE 60 (brána)',
  'LINEA EL70',
  'START (terasa)',
  'PARK',
  'ARENA',
  'Jiný / nevím',
];

const inputCls =
  'w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:border-slate-400 focus:outline-none transition-all';

export default function Poptavka() {
  const [form, setForm] = useState({
    jmeno: '',
    email: '',
    telefon: '',
    firma: '',
    produkt: '',
    ovladani: 'doporucit',
    zprava: 'Dobrý den. ',
  });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSEO(SEO_PAGES.poptavka);
    const urlParams = new URLSearchParams(window.location.search);
    const produkt = urlParams.get('produkt');
    const ovladani = urlParams.get('ovladani');
    setForm((f) => ({
      ...f,
      produkt: produkt && PRODUKTY.includes(produkt) ? produkt : f.produkt,
      ovladani: ovladani && OVLADANI_OPTIONS.some((o) => o.value === ovladani) ? ovladani : f.ovladani,
    }));
  }, []);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleFiles = async (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;
    setUploading(true);
    for (const file of selected) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file }).catch(() => ({ file_url: null }));
      if (file_url) setFiles((f) => [...f, { name: file.name, url: file_url }]);
    }
    setUploading(false);
  };

  const removeFile = (url) => setFiles((f) => f.filter((x) => x.url !== url));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const attribution = { landing_page: window.location.pathname, referrer: document.referrer || 'direct', utm_source: params.get('utm_source') || '', utm_medium: params.get('utm_medium') || '', utm_campaign: params.get('utm_campaign') || '' };
      await base44.entities.Poptavka.create({ ...form, ...attribution, soubory_urls: files.map((f) => f.url), status: 'nova' });
      trackContactFormSubmit('poptavka', form.produkt);
      trackInquirySubmitted('poptavka', form.produkt, attribution.utm_source || attribution.referrer);
      playSoundEffect('success');
      navigate('/dekujeme?zdroj=poptavka');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-28">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Nezávazná poptávka</p>
          <h1 className="font-heading font-light text-4xl lg:text-6xl text-slate-900 tracking-tight mb-3">
            Kontaktujte nás
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
            Vyplňte formulář a ozveme se vám do 24 hodin s nabídkou na míru.
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Sidebar info */}
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: Phone, label: 'Telefon', value: '+420 774 700 390', href: 'tel:+420774700390' },
              { icon: Mail, label: 'Email', value: 'obchod1@holmtec.cz', href: 'mailto:obchod1@holmtec.cz' },
              { icon: MapPin, label: 'Adresa', value: '541 02 Trutnov, Horní staré město 698, Česká republika', href: null },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 border border-slate-200">
                  <item.icon size={20} className="text-slate-700" />
                </div>
                <div>
                  <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-1">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-slate-900 font-medium hover:text-slate-600 transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-slate-900 font-medium">{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-mono text-slate-500 tracking-widest uppercase mb-2">Proč HolmTec</p>
              <ul className="space-y-1.5 text-xs text-slate-500 leading-relaxed">
                <li>→ Zakázková výroba mlžítek z nerezové oceli 304 / 316L</li>
                <li>→ Konzultace a 3D vizualizace mlžítka zdarma</li>
                <li>→ Odpovídáme do 24 hodin</li>
                <li>→ Záruka na konstrukci</li>
                <li>→ Mlžítka vyráběné v ČR</li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-1.5">Jméno a příjmení *</label>
                    <input
                      required
                      type="text"
                      placeholder="Jan Novák"
                      value={form.jmeno}
                      onChange={set('jmeno')}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-1.5">Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="jan@firma.cz"
                      value={form.email}
                      onChange={set('email')}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-1.5">Telefon</label>
                    <input
                      type="tel"
                      placeholder="+420 000 000 000"
                      value={form.telefon}
                      onChange={set('telefon')}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-1.5">Firma / organizace</label>
                    <input
                      type="text"
                      placeholder="Název firmy"
                      value={form.firma}
                      onChange={set('firma')}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-1.5">Zájem o produkt</label>
                  <select
                    value={form.produkt}
                    onChange={set('produkt')}
                    className={inputCls + ' cursor-pointer'}
                  >
                    <option value="">Vyberte produkt (mlžítko)...</option>
                    {PRODUKTY.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="group relative">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase">Ovládání / řízení mlžítka</label>
                    <Info size={12} className="text-slate-300 group-hover:text-slate-600 transition-colors cursor-help" />
                  </div>
                  <select
                    value={form.ovladani}
                    onChange={set('ovladani')}
                    className={inputCls + ' cursor-pointer'}
                  >
                    {OVLADANI_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  {form.ovladani && (
                    <div className="pointer-events-none absolute left-0 right-0 top-full mt-1.5 z-20 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                      <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
                        <p className="text-[11px] text-white/70 leading-relaxed">
                          {OVLADANI_OPTIONS.find((o) => o.value === form.ovladani)?.hint}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-1.5">Zpráva / poptávka *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Popište váš mlžný projekt — místo instalace, rozměry prostoru, přibližný počet kusů mlžítek..."
                    value={form.zprava}
                    onChange={set('zprava')}
                    className={inputCls + ' resize-none'}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-1.5">Soubory, obrázky nebo projekt (pro přesnou cenu)</label>
                  <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-slate-200 rounded-xl px-4 py-4 text-sm text-slate-500 cursor-pointer hover:border-slate-400 transition-colors">
                    <Paperclip size={15} />
                    {uploading ? 'Nahrávám...' : 'Přidat soubory / fotky / projekt'}
                    <input type="file" multiple accept="image/*,.pdf,.dwg" onChange={handleFiles} className="hidden" disabled={uploading} />
                  </label>
                  {files.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {files.map((f) => (
                        <span key={f.url} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 text-xs px-2.5 py-1.5 rounded-full">
                          {f.name}
                          <button type="button" onClick={() => removeFile(f.url)} className="text-slate-400 hover:text-slate-900"><X size={11} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-metallic-mist w-full py-4 text-sm font-bold justify-center disabled:opacity-50"
                >
                  {sending ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <>Odeslat poptávku <ArrowRight size={16} /></>
                  )}
                </button>

                <p className="text-xs text-slate-400 text-center font-mono">
                  Odesláním souhlasíte se zpracováním osobních údajů.
                </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}